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
          content: `You are a music expert. Suggest 25 real songs matching the description.
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

// Scrape Spotify playlist from embed page (no API keys needed!)
async function scrapeSpotifyEmbed(playlistId) {
  try {
    // Get playlist metadata from oembed
    const oembedRes = await axios.get(
      `https://open.spotify.com/oembed?url=https://open.spotify.com/playlist/${playlistId}`,
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    )
    const name = oembedRes.data?.title || 'Spotify Playlist'
    const cover = oembedRes.data?.thumbnail_url || null

    // Try multiple methods to extract tracks
    let tracks = []

    // Method 1: Try the embed page
    try {
      const embedRes = await axios.get(`https://open.spotify.com/embed/playlist/${playlistId}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      })
      const html = embedRes.data

      // Look for JSON state with track data
      const stateMatch = html.match(/<script[^>]*>window\.__INITIAL_STATE__\s*=\s*({.*?})<\/script>/s)
      if (stateMatch) {
        try {
          const state = JSON.parse(stateMatch[1])
          const trackList = state?.playlist?.tracks?.items || []
          for (const item of trackList) {
            const track = item.track || item
            if (track?.name) {
              tracks.push({
                title: track.name,
                artist: track.artists?.map(a => a.name || a).join(', ') || 'Unknown',
                albumArt: track.album?.images?.[0]?.url || null,
              })
            }
          }
        } catch { /**/ }
      }

      // Method 2: Parse track names from script tags
      if (tracks.length === 0) {
        const trackMatches = html.match(/"name":"([^"]+)".*?"artists":\[([^\]]+)\]/g) || []
        for (const match of trackMatches.slice(0, 50)) {
          try {
            const nameMatch = match.match(/"name":"([^"]+)"/)
            const artistsMatch = match.match(/"artists":\[([^\]]+)\]/)
            if (nameMatch) {
              const title = nameMatch[1]
              let artist = 'Unknown'
              if (artistsMatch) {
                const artistNames = artistsMatch[1].match(/"name":"([^"]+)"/g) || []
                artist = artistNames.map(a => a.match(/"name":"([^"]+)"/)[1]).join(', ')
              }
              tracks.push({ title, artist, albumArt: null })
            }
          } catch { /**/ }
        }
      }

      // Method 3: Use cheerio to parse the HTML
      if (tracks.length === 0) {
        const $ = cheerio.load(html)
        $('meta[content*="spotify.com"]').each((_, el) => {
          const content = $(el).attr('content') || ''
          if (content.includes('track')) {
            // Extract track info from meta tags
          }
        })
      }
    } catch { /**/ }

    // If scraping failed, fall back to AI
    if (tracks.length === 0) {
      console.log('Embed scraping yielded no tracks, using AI fallback')
      throw new Error('Could not extract tracks from embed')
    }

    return { name, cover, tracks }
  } catch (e) {
    throw new Error(`Spotify scrape failed: ${e.message}`)
  }
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

      // Try Spotify API first if credentials are configured
      if (process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET) {
        try {
          console.log(`Trying Spotify API for playlist: ${playlistId}`)
          
          // Get access token
          const tokenRes = await axios.post('https://accounts.spotify.com/api/token', 
            'grant_type=client_credentials',
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')
              }
            }
          )
          const accessToken = tokenRes.data.access_token
          console.log('Got Spotify access token')

          // Get playlist info
          const playlistRes = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
            params: { fields: 'name,images,tracks.total,tracks.items(track(name,artists(name),album(name,images)))' }
          })
          
          playlistName = playlistRes.data.name
          playlistCover = playlistRes.data.images?.[0]?.url || null
          const totalTracks = playlistRes.data.tracks.total
          console.log(`Playlist: "${playlistName}" - ${totalTracks} tracks`)

          // Get all tracks
          rawTracks = []
          const firstTracks = playlistRes.data.tracks.items || []
          for (const item of firstTracks) {
            if (item.track?.name) {
              rawTracks.push({
                title: item.track.name,
                artist: item.track.artists?.map(a => a.name).join(', ') || 'Unknown'
              })
            }
          }

          // Fetch remaining pages if more than 100 tracks
          if (totalTracks > 100) {
            for (let offset = 100; offset < totalTracks; offset += 100) {
              const moreTracks = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
                params: { limit: 100, offset, fields: 'items(track(name,artists(name)))' }
              })
              for (const item of moreTracks.data.items) {
                if (item.track?.name) {
                  rawTracks.push({
                    title: item.track.name,
                    artist: item.track.artists?.map(a => a.name).join(', ') || 'Unknown'
                  })
                }
              }
            }
          }

          console.log(`Got ${rawTracks.length} tracks from Spotify API`)
        } catch (e) {
          console.error('Spotify API failed:', e.message)
          // Fall through to web scraping
        }
      }

      // If API didn't work, try web scraping from embed page
      if (rawTracks.length === 0) {
        console.log('Trying embed page scraping for Spotify playlist...')
        try {
          const embedRes = await axios.get(`https://open.spotify.com/embed/playlist/${playlistId}`, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept-Language': 'en-US,en;q=0.9',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            },
            timeout: 15000
          })

          const html = embedRes.data
          
          // Check if page is available
          if (html.includes('Page not available') || html.includes('not available')) {
            return res.status(400).json({ 
              error: 'This playlist is private or unavailable. Please make it public in Spotify first.' 
            })
          }

          // Extract tracks from title and subtitle pairs
          const titles = []
          const subtitles = []
          
          // Get all title values (track names)
          const titleMatches = html.match(/"title":"([^"]*)"/g) || []
          for (const match of titleMatches) {
            const value = match.match(/"title":"([^"]*)"/)
            if (value && value[1]) {
              titles.push(value[1])
            }
          }
          
          // Get all subtitle values (artist names)
          const subtitleMatches = html.match(/"subtitle":"([^"]*)"/g) || []
          for (const match of subtitleMatches) {
            const value = match.match(/"subtitle":"([^"]*)"/)
            if (value && value[1]) {
              subtitles.push(value[1])
            }
          }

          // First title is usually the playlist name
          if (titles.length > 0) {
            playlistName = titles[0]
          }
          
          // Get playlist name from oembed if available
          try {
            const oembedRes = await axios.get(`https://open.spotify.com/oembed?url=https://open.spotify.com/playlist/${playlistId}`, {
              headers: { 'User-Agent': 'Mozilla/5.0' },
              timeout: 5000
            })
            if (oembedRes.data?.title) {
              playlistName = oembedRes.data.title
            }
            if (oembedRes.data?.thumbnail_url) {
              playlistCover = oembedRes.data.thumbnail_url
            }
          } catch { /**/ }

          // Pair up titles with subtitles (skip first which is playlist name)
          // Subtitles array has one extra at start (usually "Spotify")
          const startIdx = subtitles.length > titles.length ? 1 : 0
          for (let i = 1; i < titles.length && (i - 1 + startIdx) < subtitles.length; i++) {
            const title = titles[i]
            const artist = subtitles[i - 1 + startIdx] || 'Unknown'
            
            // Skip if title looks like a UI element
            if (title && !['Home', 'Search', 'Your Library', 'Create Playlist'].includes(title)) {
              rawTracks.push({
                title: title,
                artist: artist
              })
            }
          }

          console.log(`Extracted ${rawTracks.length} tracks from embed page`)
          if (rawTracks.length > 0) {
            console.log(`Sample: "${rawTracks[0].title}" by ${rawTracks[0].artist}`)
          }
        } catch (e) {
          console.error('Embed scraping failed:', e.message)
        }
      }

      // If still no tracks, return error
      if (rawTracks.length === 0) {
        return res.status(400).json({ 
          error: 'Could not get tracks from this playlist. Make sure it is public and try again.' 
        })
      }
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

    // ── MATCH EACH TRACK ON YOUTUBE ONE BY ONE ─────────────────────────────────
    console.log(`Matching ${rawTracks.length} tracks on YouTube one by one...`)
    const matchedTracks = []
    let matchCount = 0
    
    for (let i = 0; i < Math.min(rawTracks.length, 100); i++) {
      const track = rawTracks[i]
      console.log(`[${i+1}/${rawTracks.length}] Searching: "${track.title}" by ${track.artist}`)
      
      try {
        const matched = await matchTrackOnYouTube(track.title, track.artist)
        matchedTracks.push(matched)
        if (matched.youtubeId) {
          matchCount++
          console.log(`  ✓ Found: ${matched.youtubeId}`)
        } else {
          console.log(`  ✗ No YouTube match`)
        }
      } catch (e) {
        console.log(`  ✗ Error: ${e.message}`)
        matchedTracks.push({
          id: `${track.title}-${Date.now()}`,
          title: track.title,
          artist: track.artist,
          albumArt: '',
          duration: 0,
          youtubeId: null
        })
      }
    }

    const tracks = matchedTracks.filter(Boolean)
    console.log(`\nMatched ${matchCount}/${tracks.length} tracks on YouTube`)

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
      matched: matchCount,
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
      rawTracks.slice(0, 25).map(t => matchTrackOnYouTube(t.title, t.artist))
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
