require('dotenv').config()
const express = require('express')
const cors = require('cors')
const axios = require('axios')
const cheerio = require('cheerio')
const SpotifyWebApi = require('spotify-web-api-node')

const app = express()
const PORT = process.env.PORT || 3001

// ── MIDDLEWARE ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST'],
}))
app.use(express.json())

// ── SPOTIFY CLIENT ───────────────────────────────────────────────────────────
const spotify = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
})

let spotifyTokenExpiry = 0

async function getSpotifyToken() {
  if (Date.now() < spotifyTokenExpiry) return
  const data = await spotify.clientCredentialsGrant()
  spotify.setAccessToken(data.body.access_token)
  spotifyTokenExpiry = Date.now() + (data.body.expires_in - 60) * 1000
  console.log('Spotify token refreshed')
}

// ── YOUTUBE SEARCH ───────────────────────────────────────────────────────────
const YT_API_KEY = process.env.YOUTUBE_API_KEY
const YT_BASE = 'https://www.googleapis.com/youtube/v3'

async function searchYouTube(query) {
  if (!YT_API_KEY) return null
  try {
    const res = await axios.get(`${YT_BASE}/search`, {
      params: {
        part: 'snippet',
        type: 'video',
        videoCategoryId: '10',
        q: query,
        maxResults: 1,
        key: YT_API_KEY,
      },
    })
    const item = res.data.items?.[0]
    if (!item) return null

    const videoId = item.id.videoId

    // Get duration
    const detailRes = await axios.get(`${YT_BASE}/videos`, {
      params: { part: 'contentDetails', id: videoId, key: YT_API_KEY },
    })
    const iso = detailRes.data.items?.[0]?.contentDetails?.duration ?? 'PT0S'
    const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
    const duration = (parseInt(match?.[1] ?? 0) * 3600)
      + (parseInt(match?.[2] ?? 0) * 60)
      + parseInt(match?.[3] ?? 0)

    return {
      youtubeId: videoId,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      albumArt: item.snippet.thumbnails.medium?.url,
      duration,
    }
  } catch (err) {
    console.error('YouTube search error:', err.message)
    return null
  }
}

// If no YT API key, return track with no youtubeId (frontend uses hardcoded IDs)
async function matchTrackOnYouTube(title, artist) {
  if (!YT_API_KEY) {
    return {
      id: `${title}-${artist}`.replace(/\s/g, '-').toLowerCase(),
      title,
      artist,
      albumArt: `https://picsum.photos/seed/${encodeURIComponent(title)}/120/120`,
      duration: 0,
      youtubeId: null,
    }
  }
  const result = await searchYouTube(`${title} ${artist} official audio`)
  return result
    ? { id: result.youtubeId, ...result }
    : { id: `${title}-${Date.now()}`, title, artist, albumArt: '', duration: 0, youtubeId: null }
}

// ── GROQ AI ──────────────────────────────────────────────────────────────────
const GROQ_KEY = process.env.GROQ_API_KEY

async function groqGenerateTracks(prompt) {
  if (!GROQ_KEY) throw new Error('No Groq API key')
  const res = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: `You are a music expert. Suggest 10 real songs matching the description.
Return ONLY a JSON array:
[{"title":"Song Name","artist":"Artist Name"},...]`,
        },
        { role: 'user', content: `Playlist for: ${prompt}` },
      ],
      max_tokens: 800,
      temperature: 0.8,
    },
    { headers: { Authorization: `Bearer ${GROQ_KEY}`, 'Content-Type': 'application/json' } }
  )
  const text = res.data.choices?.[0]?.message?.content ?? ''
  const match = text.match(/\[[\s\S]*?\]/)
  if (!match) throw new Error('AI returned invalid format')
  return JSON.parse(match[0])
}

// ── SCRAPER HELPERS ──────────────────────────────────────────────────────────

// Extract Spotify playlist ID from URL
function spotifyPlaylistId(url) {
  const m = url.match(/playlist\/([a-zA-Z0-9]+)/)
  return m?.[1] ?? null
}

// Extract Apple Music playlist ID
function appleMusicId(url) {
  const m = url.match(/pl\.[a-zA-Z0-9]+/)
  return m?.[0] ?? null
}

// Scrape SoundCloud playlist (public HTML scrape)
async function scrapeSoundCloud(url) {
  const res = await axios.get(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    timeout: 10000,
  })
  const $ = cheerio.load(res.data)
  const tracks = []

  // SoundCloud embeds track data in JSON-LD or meta tags
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const json = JSON.parse($(el).html())
      if (json['@type'] === 'MusicPlaylist' && json.track) {
        json.track.forEach(t => {
          const name = t.name ?? ''
          const artist = t.byArtist?.name ?? ''
          if (name) tracks.push({ title: name, artist })
        })
      }
    } catch { /**/ }
  })

  // Fallback: scrape visible track titles
  if (tracks.length === 0) {
    $('a.sc-link-primary').each((_, el) => {
      const title = $(el).text().trim()
      if (title && title.length > 2) tracks.push({ title, artist: '' })
    })
  }

  return tracks.slice(0, 20)
}

// ── ROUTES ───────────────────────────────────────────────────────────────────

// Health check
app.get('/health', (_, res) => res.json({ status: 'ok', service: 'glint-backend' }))

// POST /api/import — scrape playlist from any platform
app.post('/api/import', async (req, res) => {
  const { url } = req.body
  if (!url) return res.status(400).json({ error: 'URL is required' })

  console.log(`Import request: ${url}`)

  try {
    let playlistName = 'Imported Playlist'
    let playlistCover = null
    let rawTracks = [] // { title, artist }

    // ── SPOTIFY ──────────────────────────────────────────────────────────────
    if (url.includes('spotify.com/playlist')) {
      const playlistId = spotifyPlaylistId(url)
      if (!playlistId) return res.status(400).json({ error: 'Invalid Spotify playlist URL' })

      if (!process.env.SPOTIFY_CLIENT_ID) {
        return res.status(400).json({ error: 'Spotify API keys not configured on server. Add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to backend .env' })
      }

      await getSpotifyToken()

      // Fetch playlist info
      const plData = await spotify.getPlaylist(playlistId, {
        fields: 'name,images,owner,tracks.total',
      })
      playlistName = plData.body.name
      playlistCover = plData.body.images?.[0]?.url ?? null

      // Fetch all tracks (paginate if > 100)
      const total = plData.body.tracks.total
      const pages = Math.ceil(Math.min(total, 100) / 50) // max 100 tracks

      for (let page = 0; page < pages; page++) {
        const tracksData = await spotify.getPlaylistTracks(playlistId, {
          limit: 50,
          offset: page * 50,
          fields: 'items(track(name,artists,duration_ms))',
        })
        tracksData.body.items.forEach(item => {
          if (item.track?.name) {
            rawTracks.push({
              title: item.track.name,
              artist: item.track.artists?.map(a => a.name).join(', ') ?? '',
            })
          }
        })
      }

      console.log(`Spotify: "${playlistName}" — ${rawTracks.length} tracks`)
    }

    // ── SOUNDCLOUD ────────────────────────────────────────────────────────────
    else if (url.includes('soundcloud.com')) {
      playlistName = 'SoundCloud Playlist'
      try {
        rawTracks = await scrapeSoundCloud(url)
        console.log(`SoundCloud: scraped ${rawTracks.length} tracks`)
      } catch (e) {
        console.error('SoundCloud scrape failed:', e.message)
        return res.status(400).json({ error: 'Could not scrape SoundCloud playlist. Make sure the URL is public.' })
      }
    }

    // ── APPLE MUSIC / YOUTUBE / OTHER — use AI ────────────────────────────────
    else {
      playlistName = url.includes('apple') ? 'Apple Music Playlist'
        : url.includes('youtube') ? 'YouTube Playlist'
        : 'Imported Playlist'

      if (!GROQ_KEY) {
        return res.status(400).json({
          error: `This platform requires AI to import. Add GROQ_API_KEY to your backend .env file.`
        })
      }

      const urlHint = new URL(url).pathname.split('/').filter(Boolean).join(' ').replace(/-/g, ' ')
      rawTracks = await groqGenerateTracks(`${playlistName} similar to: ${urlHint}`)
      console.log(`AI generated ${rawTracks.length} tracks for ${playlistName}`)
    }

    if (rawTracks.length === 0) {
      return res.status(400).json({ error: 'No tracks found in this playlist.' })
    }

    // ── MATCH EACH TRACK ON YOUTUBE ───────────────────────────────────────────
    console.log(`Matching ${rawTracks.length} tracks on YouTube...`)
    const matchedTracks = await Promise.all(
      rawTracks.slice(0, 30).map(t => matchTrackOnYouTube(t.title, t.artist))
    )

    const tracks = matchedTracks.filter(Boolean)
    const found = tracks.filter(t => t.youtubeId).length

    console.log(`Matched ${found}/${tracks.length} tracks on YouTube`)

    res.json({
      name: playlistName,
      cover: playlistCover,
      platform: url.includes('spotify') ? 'Spotify'
        : url.includes('apple') ? 'Apple Music'
        : url.includes('soundcloud') ? 'SoundCloud'
        : url.includes('youtube') ? 'YouTube'
        : 'Unknown',
      tracks,
      total: rawTracks.length,
      matched: found,
    })

  } catch (err) {
    console.error('Import error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// POST /api/generate — AI playlist from prompt
app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' })

  console.log(`Generate request: "${prompt}"`)

  try {
    let rawTracks = []

    if (GROQ_KEY) {
      rawTracks = await groqGenerateTracks(prompt)
    } else {
      // Fallback based on keywords
      rawTracks = getFallback(prompt)
    }

    const tracks = await Promise.all(
      rawTracks.slice(0, 10).map(t => matchTrackOnYouTube(t.title, t.artist))
    )

    res.json({
      name: prompt.slice(0, 40),
      tracks: tracks.filter(Boolean),
    })
  } catch (err) {
    console.error('Generate error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// GET /api/search — search YouTube
app.get('/api/search', async (req, res) => {
  const { q, limit = 10 } = req.query
  if (!q) return res.status(400).json({ error: 'Query required' })

  try {
    const results = []
    for (let i = 0; i < Math.min(limit, 10); i++) {
      const track = await searchYouTube(q)
      if (track) results.push(track)
      break // searchYouTube already returns 1 result, this is just for clarity
    }
    res.json(results)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── FALLBACK TRACKS ───────────────────────────────────────────────────────────
function getFallback(prompt) {
  const p = prompt.toLowerCase()
  if (p.includes('workout') || p.includes('gym')) return [
    { title: 'Rockstar', artist: 'Post Malone' },
    { title: 'SICKO MODE', artist: 'Travis Scott' },
    { title: 'Power', artist: 'Kanye West' },
    { title: 'HUMBLE.', artist: 'Kendrick Lamar' },
    { title: 'Blinding Lights', artist: 'The Weeknd' },
    { title: 'Industry Baby', artist: 'Lil Nas X' },
  ]
  if (p.includes('chill') || p.includes('lofi') || p.includes('focus')) return [
    { title: 'Clair de Lune', artist: 'Debussy' },
    { title: 'Experience', artist: 'Ludovico Einaudi' },
    { title: 'Holocene', artist: 'Bon Iver' },
    { title: 'Intro', artist: 'The xx' },
    { title: 'Night Owl', artist: 'Galimatias' },
  ]
  return [
    { title: 'Midnight City', artist: 'M83' },
    { title: 'Nightcall', artist: 'Kavinsky' },
    { title: 'Blinding Lights', artist: 'The Weeknd' },
    { title: 'Heat Waves', artist: 'Glass Animals' },
    { title: 'Levitating', artist: 'Dua Lipa' },
    { title: 'Cruel Summer', artist: 'Taylor Swift' },
  ]
}

// ── START ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🎵 Glint Backend running on port ${PORT}`)
  console.log(`   Spotify: ${process.env.SPOTIFY_CLIENT_ID ? '✓ configured' : '✗ not configured'}`)
  console.log(`   YouTube: ${process.env.YOUTUBE_API_KEY ? '✓ configured' : '✗ not configured'}`)
  console.log(`   Groq AI: ${process.env.GROQ_API_KEY ? '✓ configured' : '✗ not configured'}`)
  console.log(`   CORS origin: ${process.env.FRONTEND_URL || '*'}\n`)
})
