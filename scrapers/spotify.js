import * as cheerio from 'cheerio'

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET

let token = null
let tokenExpiry = 0

async function getToken() {
  if (token && Date.now() < tokenExpiry) return token
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64'),
    },
    body: 'grant_type=client_credentials',
  })
  if (!res.ok) throw new Error(`Spotify auth failed: ${res.status}`)
  const data = await res.json()
  token = data.access_token
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000
  return token
}

function extractId(url) {
  const match = url.match(/playlist\/([a-zA-Z0-9]+)/)
  return match?.[1] ?? null
}

export async function scrapeSpotify(url) {
  const playlistId = extractId(url)
  if (!playlistId) throw new Error('Invalid Spotify playlist URL')

  // Method 1: Use official API if keys available
  if (SPOTIFY_CLIENT_ID && SPOTIFY_CLIENT_SECRET) {
    try {
      return await scrapeSpotifyAPI(playlistId)
    } catch (e) {
      console.warn('[spotify] API failed:', e.message, '— trying scrape')
    }
  }

  // Method 2: Scrape the public embed page (no auth needed)
  return await scrapeSpotifyEmbed(playlistId)
}

async function scrapeSpotifyAPI(playlistId) {
  const tk = await getToken()

  const [plRes, tracksRes] = await Promise.all([
    fetch(`https://api.spotify.com/v1/playlists/${playlistId}?fields=name,description,images,owner,tracks.total`, {
      headers: { Authorization: `Bearer ${tk}` },
    }),
    fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=50&fields=items(track(name,artists,album(name,images),duration_ms))`, {
      headers: { Authorization: `Bearer ${tk}` },
    }),
  ])

  if (plRes.status === 404) throw new Error('Playlist not found or private')
  if (!plRes.ok) throw new Error(`Spotify API ${plRes.status}`)

  const pl = await plRes.json()
  const tracksData = await tracksRes.json()

  const tracks = (tracksData.items || [])
    .filter(i => i.track?.name)
    .map(i => ({
      title: i.track.name,
      artist: i.track.artists.map(a => a.name).join(', '),
      albumArt: i.track.album?.images?.[0]?.url || null,
      durationMs: i.track.duration_ms || 0,
    }))

  return {
    platform: 'Spotify',
    name: pl.name,
    cover: pl.images?.[0]?.url || null,
    owner: pl.owner?.display_name || 'Unknown',
    total: pl.tracks?.total || tracks.length,
    tracks,
  }
}

async function scrapeSpotifyEmbed(playlistId) {
  // Spotify's embed endpoint is publicly accessible and returns JSON metadata
  const embedUrl = `https://open.spotify.com/oembed?url=https://open.spotify.com/playlist/${playlistId}`

  try {
    const oembedRes = await fetch(embedUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' },
    })
    const oembed = oembedRes.ok ? await oembedRes.json() : null
    const name = oembed?.title || 'Spotify Playlist'
    const cover = oembed?.thumbnail_url || null

    // Scrape the embed iframe for track list
    const embedHtml = await fetch(`https://open.spotify.com/embed/playlist/${playlistId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html',
      },
    })

    if (!embedHtml.ok) throw new Error(`Embed page ${embedHtml.status}`)
    const html = await embedHtml.text()
    const $ = cheerio.load(html)

    const tracks = []

    // Try to find track data in the page's JSON state
    const scripts = $('script').toArray()
    for (const script of scripts) {
      const content = $(script).html() || ''
      if (content.includes('"trackList"') || content.includes('"tracks"')) {
        try {
          // Look for JSON with track data
          const jsonMatch = content.match(/\{.*"trackList".*\}/s)
          if (jsonMatch) {
            const data = JSON.parse(jsonMatch[0])
            const trackList = data.trackList || data.tracks?.items || []
            for (const t of trackList) {
              if (t.title || t.name) {
                tracks.push({
                  title: t.title || t.name,
                  artist: t.subtitle || t.artists?.map(a => a.name).join(', ') || 'Unknown',
                  albumArt: t.imageUrl || null,
                  durationMs: t.duration || 0,
                })
              }
            }
          }
        } catch { /**/ }
        if (tracks.length > 0) break
      }
    }

    // Fallback: parse visible track rows from embed HTML
    if (tracks.length === 0) {
      $('[data-testid="tracklist-row"], .tracklist-row, .track-row').each((_, el) => {
        const title = $(el).find('[data-testid="track-name"], .track-name, .title').first().text().trim()
        const artist = $(el).find('[data-testid="artist-name"], .artist-name, .subtitle').first().text().trim()
        if (title) tracks.push({ title, artist: artist || 'Unknown', albumArt: null, durationMs: 0 })
      })
    }

    if (tracks.length === 0) {
      throw new Error('Could not extract tracks from Spotify embed. The playlist may be private.')
    }

    return { platform: 'Spotify', name, cover, owner: 'Spotify', total: tracks.length, tracks }
  } catch (e) {
    throw new Error(`Spotify scrape failed: ${e.message}`)
  }
}
