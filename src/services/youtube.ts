import type { Track } from '../types'

// Piped API instances (free, no key needed)
const PIPED_INSTANCES = [
  'https://pipedapi.kavin.rocks',
  'https://piped-api.privacy.com.de',
  'https://api.piped.projectsegfau.lt',
]

let currentInstance = 0

async function fetchPiped(path: string): Promise<any> {
  for (let i = 0; i < PIPED_INSTANCES.length; i++) {
    const instance = PIPED_INSTANCES[(currentInstance + i) % PIPED_INSTANCES.length]
    try {
      const res = await fetch(`${instance}${path}`, {
        signal: AbortSignal.timeout(8000)
      })
      if (res.ok) {
        currentInstance = (currentInstance + i) % PIPED_INSTANCES.length
        return await res.json()
      }
    } catch (e) {
      console.warn(`Piped instance ${instance} failed, trying next...`)
    }
  }
  throw new Error('All Piped instances failed')
}

function formatDuration(seconds: number): number {
  return seconds || 0
}

function formatViews(views: number): string {
  if (views >= 1_000_000) return (views / 1_000_000).toFixed(1) + 'M'
  if (views >= 1_000) return (views / 1_000).toFixed(1) + 'k'
  return views.toString()
}

export async function searchYouTube(query: string, maxResults = 10): Promise<Track[]> {
  try {
    const data = await fetchPiped(`/search?q=${encodeURIComponent(query)}&filter=videos`)
    
    if (!data.items?.length) return getMockResults(query)

    return data.items.slice(0, maxResults).map((item: any) => ({
      id: item.url?.replace('/watch?v=', '') || item.id || `search-${Date.now()}`,
      title: item.title || 'Unknown',
      artist: item.uploaderName || item.uploader || 'Unknown',
      albumArt: item.thumbnail || item.thumbnailUrl || `https://i.ytimg.com/vi/${item.url?.replace('/watch?v=', '')}/mqdefault.jpg`,
      duration: formatDuration(item.duration),
      youtubeId: item.url?.replace('/watch?v=', '') || item.id,
      plays: item.views ? formatViews(item.views) : undefined,
    }))
  } catch (e) {
    console.warn('Piped API error, using mock:', e)
    return getMockResults(query)
  }
}

export async function getStreamUrl(videoId: string): Promise<string | null> {
  try {
    const data = await fetchPiped(`/streams/${videoId}`)
    
    // Get audio stream URL
    if (data.audioStreams?.length) {
      // Sort by quality and get best audio
      const sorted = data.audioStreams.sort((a: any, b: any) => (b.bitrate || 0) - (a.bitrate || 0))
      return sorted[0]?.url || null
    }
    
    // Fallback to video streams
    if (data.videoStreams?.length) {
      return data.videoStreams[0]?.url || null
    }
    
    return null
  } catch (e) {
    console.warn('Failed to get stream URL:', e)
    return null
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
