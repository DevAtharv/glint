import fetch from 'node-fetch'

const API_KEY = process.env.YOUTUBE_API_KEY
const BASE = 'https://www.googleapis.com/youtube/v3'

function parseDuration(iso) {
  const m = iso?.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!m) return 0
  return (parseInt(m[1] || 0) * 3600) + (parseInt(m[2] || 0) * 60) + parseInt(m[3] || 0)
}

function formatViews(n) {
  const num = parseInt(n)
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M'
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'k'
  return String(n)
}

// Search YouTube for a single query, return top N results
export async function searchYouTube(query, maxResults = 10) {
  if (!API_KEY) return getMockResults(query, maxResults)

  const searchRes = await fetch(
    `${BASE}/search?part=snippet&type=video&videoCategoryId=10&q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${API_KEY}`
  )
  const searchData = await searchRes.json()
  if (searchData.error) throw new Error(`YouTube API: ${searchData.error.message}`)
  if (!searchData.items?.length) return []

  const ids = searchData.items.map(i => i.id.videoId).join(',')
  const detailRes = await fetch(
    `${BASE}/videos?part=contentDetails,statistics&id=${ids}&key=${API_KEY}`
  )
  const detailData = await detailRes.json()
  const detailMap = {}
  detailData.items?.forEach(item => {
    detailMap[item.id] = {
      duration: parseDuration(item.contentDetails.duration),
      views: item.statistics.viewCount,
    }
  })

  return searchData.items.map(item => {
    const vid = item.id.videoId
    const snippet = item.snippet
    const detail = detailMap[vid] || { duration: 0, views: '0' }
    return {
      id: vid,
      title: snippet.title,
      artist: snippet.channelTitle,
      albumArt: snippet.thumbnails.medium.url,
      duration: detail.duration,
      youtubeId: vid,
      plays: formatViews(detail.views),
    }
  })
}

// Search YouTube for a batch of {title, artist, youtubeId?} pairs
// If youtubeId already known (from YouTube playlist scrape), skip search
export async function searchYouTubeBatch(pairs) {
  const results = await Promise.allSettled(
    pairs.map(async (pair) => {
      // YouTube playlist tracks already have IDs — just enrich them
      if (pair.youtubeId) {
        return {
          id: pair.youtubeId,
          title: pair.title,
          artist: pair.artist,
          albumArt: `https://i.ytimg.com/vi/${pair.youtubeId}/mqdefault.jpg`,
          duration: pair.duration || 0,
          youtubeId: pair.youtubeId,
          plays: null,
        }
      }
      // Otherwise search for it
      const query = `${pair.title} ${pair.artist} official audio`
      const found = await searchYouTube(query, 1)
      if (found.length > 0) return found[0]

      // If nothing found, return a stub (no youtubeId = can't play, but shows in list)
      return {
        id: `stub-${Date.now()}-${Math.random()}`,
        title: pair.title,
        artist: pair.artist,
        albumArt: `https://picsum.photos/seed/${encodeURIComponent(pair.title)}/120/120`,
        duration: 0,
        youtubeId: null,
        plays: null,
      }
    })
  )

  return results
    .map(r => r.status === 'fulfilled' ? r.value : null)
    .filter(Boolean)
}

// Fallback mock when no API key — uses real video IDs
function getMockResults(query, max) {
  const pool = [
    { id: 'y6120QOlsfU', title: 'Midnight City', artist: 'M83', duration: 243 },
    { id: 'Q6_dHMzYBFE', title: 'Nightcall', artist: 'Kavinsky', duration: 252 },
    { id: 'fHI8X4OXluQ', title: 'Blinding Lights', artist: 'The Weeknd', duration: 200 },
    { id: 'OF4lSCGFLB4', title: 'Starboy', artist: 'The Weeknd', duration: 230 },
    { id: '7wtfhZwyrcc', title: 'Rockstar', artist: 'Post Malone', duration: 218 },
    { id: '09R8_2nJtjg', title: 'Sugar', artist: 'Maroon 5', duration: 235 },
    { id: 'RgKAFK5djSk', title: 'See You Again', artist: 'Wiz Khalifa', duration: 229 },
    { id: 'hTWKbfoikeg', title: 'Smells Like Teen Spirit', artist: 'Nirvana', duration: 301 },
  ]
  return pool.slice(0, max).map(t => ({
    ...t,
    albumArt: `https://i.ytimg.com/vi/${t.id}/mqdefault.jpg`,
    youtubeId: t.id,
    plays: '500k',
  }))
}
