import type { Track } from '../types'

const BACKEND = import.meta.env.VITE_BACKEND_URL?.trim() || 'http://localhost:3001'

// Real YouTube video IDs for fallback
const FALLBACK_TRACKS: Track[] = [
  { id: 'y6120QOlsfU', title: 'Midnight City', artist: 'M83', albumArt: 'https://i.ytimg.com/vi/y6120QOlsfU/mqdefault.jpg', duration: 243, youtubeId: 'y6120QOlsfU' },
  { id: 'fHI8X4OXluQ', title: 'Blinding Lights', artist: 'The Weeknd', albumArt: 'https://i.ytimg.com/vi/fHI8X4OXluQ/mqdefault.jpg', duration: 200, youtubeId: 'fHI8X4OXluQ' },
  { id: 'OF4lSCGFLB4', title: 'Starboy', artist: 'The Weeknd', albumArt: 'https://i.ytimg.com/vi/OF4lSCGFLB4/mqdefault.jpg', duration: 230, youtubeId: 'OF4lSCGFLB4' },
  { id: '7wtfhZwyrcc', title: 'Rockstar', artist: 'Post Malone', albumArt: 'https://i.ytimg.com/vi/7wtfhZwyrcc/mqdefault.jpg', duration: 218, youtubeId: '7wtfhZwyrcc' },
  { id: '09R8_2nJtjg', title: 'Sugar', artist: 'Maroon 5', albumArt: 'https://i.ytimg.com/vi/09R8_2nJtjg/mqdefault.jpg', duration: 235, youtubeId: '09R8_2nJtjg' },
  { id: 'JGwWNGJdvx8', title: 'Shape of You', artist: 'Ed Sheeran', albumArt: 'https://i.ytimg.com/vi/JGwWNGJdvx8/mqdefault.jpg', duration: 234, youtubeId: 'JGwWNGJdvx8' },
  { id: 'OPf0YbXqDm0', title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', albumArt: 'https://i.ytimg.com/vi/OPf0YbXqDm0/mqdefault.jpg', duration: 270, youtubeId: 'OPf0YbXqDm0' },
  { id: 'kXYiU_JCYtU', title: 'Numb', artist: 'Linkin Park', albumArt: 'https://i.ytimg.com/vi/kXYiU_JCYtU/mqdefault.jpg', duration: 185, youtubeId: 'kXYiU_JCYtU' },
  { id: '2Vv-BfVoq4g', title: 'Perfect', artist: 'Ed Sheeran', albumArt: 'https://i.ytimg.com/vi/2Vv-BfVoq4g/mqdefault.jpg', duration: 263, youtubeId: '2Vv-BfVoq4g' },
  { id: 'YQHsXMglC9A', title: 'Hello', artist: 'Adele', albumArt: 'https://i.ytimg.com/vi/YQHsXMglC9A/mqdefault.jpg', duration: 295, youtubeId: 'YQHsXMglC9A' },
  { id: 'hLQl3WQQoQ0', title: 'Someone Like You', artist: 'Adele', albumArt: 'https://i.ytimg.com/vi/hLQl3WQQoQ0/mqdefault.jpg', duration: 285, youtubeId: 'hLQl3WQQoQ0' },
  { id: 'PT2_F-1esPk', title: 'Levitating', artist: 'Dua Lipa', albumArt: 'https://i.ytimg.com/vi/PT2_F-1esPk/mqdefault.jpg', duration: 203, youtubeId: 'PT2_F-1esPk' },
  { id: 'H5v3kku4y6Q', title: 'Heat Waves', artist: 'Glass Animals', albumArt: 'https://i.ytimg.com/vi/H5v3kku4y6Q/mqdefault.jpg', duration: 238, youtubeId: 'H5v3kku4y6Q' },
  { id: '6I3smoq1HCs', title: 'Cruel Summer', artist: 'Taylor Swift', albumArt: 'https://i.ytimg.com/vi/6I3smoq1HCs/mqdefault.jpg', duration: 178, youtubeId: '6I3smoq1HCs' },
  { id: 'TUVcZfQe-Kw', title: 'As It Was', artist: 'Harry Styles', albumArt: 'https://i.ytimg.com/vi/TUVcZfQe-Kw/mqdefault.jpg', duration: 167, youtubeId: 'TUVcZfQe-Kw' },
]

export async function searchYouTube(query: string, maxResults = 10): Promise<Track[]> {
  try {
    // Try backend first
    const res = await fetch(`${BACKEND}/api/search?q=${encodeURIComponent(query)}`)
    if (res.ok) {
      const data = await res.json()
      if (data.length > 0) {
        return data.map((item: any) => ({
          id: item.youtubeId,
          title: item.title,
          artist: item.artist,
          albumArt: item.albumArt || `https://i.ytimg.com/vi/${item.youtubeId}/mqdefault.jpg`,
          duration: item.duration || 0,
          youtubeId: item.youtubeId,
        }))
      }
    }
  } catch (e) {
    console.warn('Backend search failed, using fallback:', e)
  }

  // Fallback to local database
  const q = query.toLowerCase().replace(/official audio|official video|lyrics|hd|4k/gi, '').trim()
  const matches = FALLBACK_TRACKS.filter(t => {
    const titleMatch = t.title.toLowerCase().includes(q)
    const artistMatch = t.artist.toLowerCase().includes(q)
    return titleMatch || artistMatch
  })
  
  return matches.length > 0 ? matches.slice(0, maxResults) : FALLBACK_TRACKS.slice(0, maxResults)
}

export async function getStreamUrl(videoId: string): Promise<string | null> {
  return `https://www.youtube.com/embed/${videoId}?autoplay=1`
}
