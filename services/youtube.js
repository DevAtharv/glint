const API_KEY = process.env.YOUTUBE_API_KEY
const BASE = 'https://www.googleapis.com/youtube/v3'

function parseDuration(iso) {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!m) return 0
  return (parseInt(m[1] || 0) * 3600) + (parseInt(m[2] || 0) * 60) + parseInt(m[3] || 0)
}

function fmtViews(n) {
  const num = parseInt(n)
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M'
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'k'
  return String(num)
}

export async function searchYouTubeAPI(query, maxResults = 10) {
  if (!API_KEY) return getMock(query, maxResults)

  try {
    const searchRes = await fetch(
      `${BASE}/search?part=snippet&type=video&videoCategoryId=10&q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${API_KEY}`
    )
    const searchData = await searchRes.json()
    if (!searchData.items?.length) return []

    const ids = searchData.items.map(i => i.id.videoId).join(',')
    const detailRes = await fetch(
      `${BASE}/videos?part=contentDetails,statistics&id=${ids}&key=${API_KEY}`
    )
    const detailData = await detailRes.json()
    const details = {}
    detailData.items?.forEach(i => { details[i.id] = i })

    return searchData.items.map(item => {
      const vid = item.id.videoId
      const det = details[vid]
      return {
        id: vid,
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
        albumArt: item.snippet.thumbnails.medium?.url,
        duration: det ? parseDuration(det.contentDetails.duration) : 0,
        youtubeId: vid,
        plays: det ? fmtViews(det.statistics.viewCount || '0') : undefined,
      }
    })
  } catch (e) {
    console.error('[youtube] search error:', e.message)
    return getMock(query, maxResults)
  }
}

// Real video IDs as fallback
const REAL = [
  { id: 'y6120QOlsfU', title: 'Midnight City', artist: 'M83', duration: 243 },
  { id: 'Q6_dHMzYBFE', title: 'Nightcall', artist: 'Kavinsky', duration: 252 },
  { id: 'fHI8X4OXluQ', title: 'Blinding Lights', artist: 'The Weeknd', duration: 200 },
  { id: 'OF4lSCGFLB4', title: 'Starboy', artist: 'The Weeknd', duration: 230 },
  { id: '7wtfhZwyrcc', title: 'Rockstar', artist: 'Post Malone', duration: 218 },
  { id: 'JGwWNGJdvx8', title: 'Shape of You', artist: 'Ed Sheeran', duration: 234 },
  { id: 'OPf0YbXqDm0', title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', duration: 270 },
  { id: 'H5v3kku4y6Q', title: 'Heat Waves', artist: 'Glass Animals', duration: 238 },
  { id: '6I3smoq1HCs', title: 'Cruel Summer', artist: 'Taylor Swift', duration: 178 },
  { id: 'PT2_F-1esPk', title: 'Levitating', artist: 'Dua Lipa', duration: 203 },
]

function getMock(query, limit) {
  const q = query.toLowerCase()
  const matches = REAL.filter(t =>
    t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q)
  )
  const rest = REAL.filter(t => !matches.includes(t))
  return [...matches, ...rest].slice(0, limit).map(t => ({
    ...t,
    albumArt: `https://i.ytimg.com/vi/${t.id}/mqdefault.jpg`,
    youtubeId: t.id,
    plays: Math.floor(Math.random() * 900 + 100) + 'k',
  }))
}
