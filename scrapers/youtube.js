import * as cheerio from 'cheerio'

const YT_API_KEY = process.env.YOUTUBE_API_KEY

function extractPlaylistId(url) {
  const match = url.match(/[?&]list=([a-zA-Z0-9_-]+)/)
  return match?.[1] ?? null
}

export async function scrapeYouTubePlaylist(url) {
  const playlistId = extractPlaylistId(url)
  if (!playlistId) throw new Error('Invalid YouTube playlist URL')

  // Use API if available
  if (YT_API_KEY) {
    try {
      return await fetchYouTubePlaylistAPI(playlistId)
    } catch (e) {
      console.warn('[youtube-playlist] API failed:', e.message)
    }
  }

  // Scrape page as fallback
  return await scrapeYouTubePlaylistPage(playlistId)
}

async function fetchYouTubePlaylistAPI(playlistId) {
  const BASE = 'https://www.googleapis.com/youtube/v3'

  const plRes = await fetch(
    `${BASE}/playlists?part=snippet&id=${playlistId}&key=${YT_API_KEY}`
  )
  const plData = await plRes.json()
  const pl = plData.items?.[0]
  if (!pl) throw new Error('Playlist not found')

  const itemsRes = await fetch(
    `${BASE}/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${YT_API_KEY}`
  )
  const itemsData = await itemsRes.json()

  const tracks = (itemsData.items || [])
    .filter(i => i.snippet?.title && i.snippet.title !== 'Private video' && i.snippet.title !== 'Deleted video')
    .map(i => {
      const vid = i.snippet.resourceId?.videoId
      // Parse "Artist - Title" from video title
      const title = i.snippet.title
      const dashIdx = title.indexOf(' - ')
      return {
        title: dashIdx > 0 ? title.slice(dashIdx + 3) : title,
        artist: dashIdx > 0 ? title.slice(0, dashIdx) : i.snippet.videoOwnerChannelTitle || 'Unknown',
        albumArt: i.snippet.thumbnails?.medium?.url || null,
        durationMs: 0,
        youtubeId: vid, // Already have the ID!
      }
    })

  return {
    platform: 'YouTube',
    name: pl.snippet.title,
    cover: pl.snippet.thumbnails?.medium?.url || null,
    owner: pl.snippet.channelTitle || 'YouTube',
    total: tracks.length,
    tracks,
  }
}

async function scrapeYouTubePlaylistPage(playlistId) {
  const url = `https://www.youtube.com/playlist?list=${playlistId}`
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  })

  if (!res.ok) throw new Error(`YouTube returned ${res.status}`)
  const html = await res.text()

  // YouTube embeds data in ytInitialData
  const match = html.match(/var ytInitialData = ({.+?});/)
  if (!match) throw new Error('Could not find playlist data')

  const data = JSON.parse(match[1])
  const contents = data?.contents?.twoColumnBrowseResultsRenderer
    ?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer
    ?.contents?.[0]?.itemSectionRenderer?.contents?.[0]
    ?.playlistVideoListRenderer?.contents || []

  const tracks = []
  const name = data?.header?.playlistHeaderRenderer?.title?.simpleText || 'YouTube Playlist'

  for (const item of contents) {
    const video = item.playlistVideoRenderer
    if (!video) continue
    const title = video.title?.runs?.[0]?.text || ''
    const channel = video.shortBylineText?.runs?.[0]?.text || 'Unknown'
    const vid = video.videoId
    if (!title || !vid) continue

    const dashIdx = title.indexOf(' - ')
    tracks.push({
      title: dashIdx > 0 ? title.slice(dashIdx + 3) : title,
      artist: dashIdx > 0 ? title.slice(0, dashIdx) : channel,
      albumArt: video.thumbnail?.thumbnails?.[0]?.url || null,
      durationMs: 0,
      youtubeId: vid,
    })
  }

  if (tracks.length === 0) throw new Error('No tracks found in this playlist')

  return { platform: 'YouTube', name, cover: null, owner: 'YouTube', total: tracks.length, tracks }
}
