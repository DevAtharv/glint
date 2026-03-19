import type { Track } from '../types'

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY as string
const BASE = 'https://www.googleapis.com/youtube/v3'

function parseDuration(iso: string): number {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!m) return 0
  return (parseInt(m[1] ?? '0') * 3600) + (parseInt(m[2] ?? '0') * 60) + parseInt(m[3] ?? '0')
}

function fmtViews(n: string): string {
  const num = parseInt(n)
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M'
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'k'
  return n
}

export async function searchYouTube(query: string, maxResults = 10): Promise<Track[]> {
  if (!API_KEY) return getMockResults(query)
  try {
    const r = await fetch(
      `${BASE}/search?part=snippet&type=video&videoCategoryId=10&q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${API_KEY}`
    )
    const d = await r.json()
    if (!d.items?.length) return getMockResults(query)

    const ids = d.items.map((i: any) => i.id.videoId).join(',')
    const r2 = await fetch(`${BASE}/videos?part=contentDetails,statistics&id=${ids}&key=${API_KEY}`)
    const d2 = await r2.json()
    const details: Record<string, any> = {}
    d2.items?.forEach((i: any) => { details[i.id] = i })

    return d.items.map((item: any) => {
      const vid = item.id.videoId
      const det = details[vid]
      return {
        id: vid,
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
        albumArt: item.snippet.thumbnails.medium?.url ?? item.snippet.thumbnails.default?.url,
        duration: det ? parseDuration(det.contentDetails.duration) : 0,
        youtubeId: vid,
        plays: det ? fmtViews(det.statistics.viewCount ?? '0') : undefined,
      } satisfies Track
    })
  } catch (e) {
    console.warn('YouTube API error, using mock:', e)
    return getMockResults(query)
  }
}

// Real YouTube video IDs — these will actually play audio
const REAL_TRACKS: Track[] = [
  { id: 'y6120QOlsfU', title: 'Midnight City', artist: 'M83', albumArt: 'https://i.ytimg.com/vi/y6120QOlsfU/mqdefault.jpg', duration: 243, youtubeId: 'y6120QOlsfU' },
  { id: 'Q6_dHMzYBFE', title: 'Nightcall', artist: 'Kavinsky', albumArt: 'https://i.ytimg.com/vi/Q6_dHMzYBFE/mqdefault.jpg', duration: 252, youtubeId: 'Q6_dHMzYBFE' },
  { id: 'fHI8X4OXluQ', title: 'Blinding Lights', artist: 'The Weeknd', albumArt: 'https://i.ytimg.com/vi/fHI8X4OXluQ/mqdefault.jpg', duration: 200, youtubeId: 'fHI8X4OXluQ' },
  { id: 'OF4lSCGFLB4', title: 'Starboy', artist: 'The Weeknd', albumArt: 'https://i.ytimg.com/vi/OF4lSCGFLB4/mqdefault.jpg', duration: 230, youtubeId: 'OF4lSCGFLB4' },
  { id: '7wtfhZwyrcc', title: 'Rockstar', artist: 'Post Malone', albumArt: 'https://i.ytimg.com/vi/7wtfhZwyrcc/mqdefault.jpg', duration: 218, youtubeId: '7wtfhZwyrcc' },
  { id: '09R8_2nJtjg', title: 'Sugar', artist: 'Maroon 5', albumArt: 'https://i.ytimg.com/vi/09R8_2nJtjg/mqdefault.jpg', duration: 235, youtubeId: '09R8_2nJtjg' },
  { id: 'RgKAFK5djSk', title: 'See You Again', artist: 'Wiz Khalifa ft. Charlie Puth', albumArt: 'https://i.ytimg.com/vi/RgKAFK5djSk/mqdefault.jpg', duration: 229, youtubeId: 'RgKAFK5djSk' },
  { id: 'hTWKbfoikeg', title: 'Smells Like Teen Spirit', artist: 'Nirvana', albumArt: 'https://i.ytimg.com/vi/hTWKbfoikeg/mqdefault.jpg', duration: 301, youtubeId: 'hTWKbfoikeg' },
  { id: 'JGwWNGJdvx8', title: 'Shape of You', artist: 'Ed Sheeran', albumArt: 'https://i.ytimg.com/vi/JGwWNGJdvx8/mqdefault.jpg', duration: 234, youtubeId: 'JGwWNGJdvx8' },
  { id: 'OPf0YbXqDm0', title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', albumArt: 'https://i.ytimg.com/vi/OPf0YbXqDm0/mqdefault.jpg', duration: 270, youtubeId: 'OPf0YbXqDm0' },
  { id: 'kXYiU_JCYtU', title: 'Numb', artist: 'Linkin Park', albumArt: 'https://i.ytimg.com/vi/kXYiU_JCYtU/mqdefault.jpg', duration: 185, youtubeId: 'kXYiU_JCYtU' },
  { id: 'YqeW9_5kURI', title: 'Perfect', artist: 'Ed Sheeran', albumArt: 'https://i.ytimg.com/vi/YqeW9_5kURI/mqdefault.jpg', duration: 263, youtubeId: 'YqeW9_5kURI' },
  { id: 'pRpeEdMmmQ0', title: 'Shallow', artist: 'Lady Gaga & Bradley Cooper', albumArt: 'https://i.ytimg.com/vi/pRpeEdMmmQ0/mqdefault.jpg', duration: 216, youtubeId: 'pRpeEdMmmQ0' },
  { id: 'ru0K8uYEZWw', title: 'All of Me', artist: 'John Legend', albumArt: 'https://i.ytimg.com/vi/ru0K8uYEZWw/mqdefault.jpg', duration: 269, youtubeId: 'ru0K8uYEZWw' },
  { id: 'CevxZvSJLk8', title: 'Thinking Out Loud', artist: 'Ed Sheeran', albumArt: 'https://i.ytimg.com/vi/CevxZvSJLk8/mqdefault.jpg', duration: 281, youtubeId: 'CevxZvSJLk8' },
  { id: 'gdZLi9oWNZg', title: 'Stay With Me', artist: 'Sam Smith', albumArt: 'https://i.ytimg.com/vi/gdZLi9oWNZg/mqdefault.jpg', duration: 173, youtubeId: 'gdZLi9oWNZg' },
  { id: 'PT2_F-1esPk', title: 'Levitating', artist: 'Dua Lipa', albumArt: 'https://i.ytimg.com/vi/PT2_F-1esPk/mqdefault.jpg', duration: 203, youtubeId: 'PT2_F-1esPk' },
  { id: 'H5v3kku4y6Q', title: 'Heat Waves', artist: 'Glass Animals', albumArt: 'https://i.ytimg.com/vi/H5v3kku4y6Q/mqdefault.jpg', duration: 238, youtubeId: 'H5v3kku4y6Q' },
  { id: '6I3smoq1HCs', title: 'Cruel Summer', artist: 'Taylor Swift', albumArt: 'https://i.ytimg.com/vi/6I3smoq1HCs/mqdefault.jpg', duration: 178, youtubeId: '6I3smoq1HCs' },
  { id: 'TUVcZfQe-Kw', title: 'As It Was', artist: 'Harry Styles', albumArt: 'https://i.ytimg.com/vi/TUVcZfQe-Kw/mqdefault.jpg', duration: 167, youtubeId: 'TUVcZfQe-Kw' },
]

function getMockResults(query: string): Track[] {
  const q = query.toLowerCase()
  // Try to find matching tracks by title/artist
  const matches = REAL_TRACKS.filter(t =>
    t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q)
  )
  // Return matches first, then fill with rest
  const others = REAL_TRACKS.filter(t => !matches.includes(t))
  return [...matches, ...others].slice(0, 10)
}
