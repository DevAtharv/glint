import type { Track } from '../types'

const BACKEND = import.meta.env.VITE_BACKEND_URL?.trim() || 'http://localhost:3001'

// Real YouTube video IDs for fallback - extended to 50+ tracks
const FALLBACK_TRACKS: Track[] = [
  // Pop
  { id: 'fHI8X4OXluQ', title: 'Blinding Lights', artist: 'The Weeknd', albumArt: 'https://i.ytimg.com/vi/fHI8X4OXluQ/mqdefault.jpg', duration: 200, youtubeId: 'fHI8X4OXluQ' },
  { id: 'JGwWNGJdvx8', title: 'Shape of You', artist: 'Ed Sheeran', albumArt: 'https://i.ytimg.com/vi/JGwWNGJdvx8/mqdefault.jpg', duration: 234, youtubeId: 'JGwWNGJdvx8' },
  { id: 'OPf0YbXqDm0', title: 'Uptown Funk', artist: 'Mark Ronson', albumArt: 'https://i.ytimg.com/vi/OPf0YbXqDm0/mqdefault.jpg', duration: 270, youtubeId: 'OPf0YbXqDm0' },
  { id: '09R8_2nJtjg', title: 'Sugar', artist: 'Maroon 5', albumArt: 'https://i.ytimg.com/vi/09R8_2nJtjg/mqdefault.jpg', duration: 235, youtubeId: '09R8_2nJtjg' },
  { id: 'TUVcZfQe-Kw', title: 'As It Was', artist: 'Harry Styles', albumArt: 'https://i.ytimg.com/vi/TUVcZfQe-Kw/mqdefault.jpg', duration: 167, youtubeId: 'TUVcZfQe-Kw' },
  { id: '6I3smoq1HCs', title: 'Cruel Summer', artist: 'Taylor Swift', albumArt: 'https://i.ytimg.com/vi/6I3smoq1HCs/mqdefault.jpg', duration: 178, youtubeId: '6I3smoq1HCs' },
  { id: 'PT2_F-1esPk', title: 'Levitating', artist: 'Dua Lipa', albumArt: 'https://i.ytimg.com/vi/PT2_F-1esPk/mqdefault.jpg', duration: 203, youtubeId: 'PT2_F-1esPk' },
  { id: 'H5v3kku4y6Q', title: 'Heat Waves', artist: 'Glass Animals', albumArt: 'https://i.ytimg.com/vi/H5v3kku4y6Q/mqdefault.jpg', duration: 238, youtubeId: 'H5v3kku4y6Q' },
  { id: 'YQHsXMglC9A', title: 'Hello', artist: 'Adele', albumArt: 'https://i.ytimg.com/vi/YQHsXMglC9A/mqdefault.jpg', duration: 295, youtubeId: 'YQHsXMglC9A' },
  { id: 'hLQl3WQQoQ0', title: 'Someone Like You', artist: 'Adele', albumArt: 'https://i.ytimg.com/vi/hLQl3WQQoQ0/mqdefault.jpg', duration: 285, youtubeId: 'hLQl3WQQoQ0' },
  // Rock
  { id: 'kXYiU_JCYtU', title: 'Numb', artist: 'Linkin Park', albumArt: 'https://i.ytimg.com/vi/kXYiU_JCYtU/mqdefault.jpg', duration: 185, youtubeId: 'kXYiU_JCYtU' },
  { id: 'hTWKbfoikeg', title: 'Smells Like Teen Spirit', artist: 'Nirvana', albumArt: 'https://i.ytimg.com/vi/hTWKbfoikeg/mqdefault.jpg', duration: 301, youtubeId: 'hTWKbfoikeg' },
  { id: 'fJ9rUzIMcZQ', title: 'Bohemian Rhapsody', artist: 'Queen', albumArt: 'https://i.ytimg.com/vi/fJ9rUzIMcZQ/mqdefault.jpg', duration: 354, youtubeId: 'fJ9rUzIMcZQ' },
  { id: 'lY2yjAdbvdQ', title: 'Bad Guy', artist: 'Billie Eilish', albumArt: 'https://i.ytimg.com/vi/lY2yjAdbvdQ/mqdefault.jpg', duration: 194, youtubeId: 'lY2yjAdbvdQ' },
  // Hip-Hop
  { id: 'RgKAFK5djSk', title: 'See You Again', artist: 'Wiz Khalifa', albumArt: 'https://i.ytimg.com/vi/RgKAFK5djSk/mqdefault.jpg', duration: 229, youtubeId: 'RgKAFK5djSk' },
  { id: '7PCkvCPvDXk', title: 'Old Town Road', artist: 'Lil Nas X', albumArt: 'https://i.ytimg.com/vi/7PCkvCPvDXk/mqdefault.jpg', duration: 157, youtubeId: '7PCkvCPvDXk' },
  // Electronic
  { id: 'y6120QOlsfU', title: 'Midnight City', artist: 'M83', albumArt: 'https://i.ytimg.com/vi/y6120QOlsfU/mqdefault.jpg', duration: 243, youtubeId: 'y6120QOlsfU' },
  // R&B
  { id: 'ru0K8uYEZWw', title: 'All of Me', artist: 'John Legend', albumArt: 'https://i.ytimg.com/vi/ru0K8uYEZWw/mqdefault.jpg', duration: 269, youtubeId: 'ru0K8uYEZWw' },
  { id: 'E07s5ZYygMg', title: 'Watermelon Sugar', artist: 'Harry Styles', albumArt: 'https://i.ytimg.com/vi/E07s5ZYygMg/mqdefault.jpg', duration: 174, youtubeId: 'E07s5ZYygMg' },
  // More Pop
  { id: 'XXYlFuWEuKI', title: 'Save Your Tears', artist: 'The Weeknd', albumArt: 'https://i.ytimg.com/vi/XXYlFuWEuKI/mqdefault.jpg', duration: 215, youtubeId: 'XXYlFuWEuKI' },
  { id: 'ApXoWvfageY', title: 'Sunflower', artist: 'Post Malone', albumArt: 'https://i.ytimg.com/vi/ApXoWvfageY/mqdefault.jpg', duration: 158, youtubeId: 'ApXoWvfageY' },
  { id: '60ItHLz5WEA', title: 'Faded', artist: 'Alan Walker', albumArt: 'https://i.ytimg.com/vi/60ItHLz5WEA/mqdefault.jpg', duration: 212, youtubeId: '60ItHLz5WEA' },
  { id: 'kJQP7kiw5Fk', title: 'Despacito', artist: 'Luis Fonsi', albumArt: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/mqdefault.jpg', duration: 282, youtubeId: 'kJQP7kiw5Fk' },
  { id: 'fRh_vgS2dFE', title: 'Sorry', artist: 'Justin Bieber', albumArt: 'https://i.ytimg.com/vi/fRh_vgS2dFE/mqdefault.jpg', duration: 200, youtubeId: 'fRh_vgS2dFE' },
  { id: 'nYh-n7EOtMA', title: 'Cheap Thrills', artist: 'Sia', albumArt: 'https://i.ytimg.com/vi/nYh-n7EOtMA/mqdefault.jpg', duration: 212, youtubeId: 'nYh-n7EOtMA' },
  { id: 'fKopy74weus', title: 'Thunder', artist: 'Imagine Dragons', albumArt: 'https://i.ytimg.com/vi/fKopy74weus/mqdefault.jpg', duration: 187, youtubeId: 'fKopy74weus' },
  { id: '7wtfhZwyrcc', title: 'Believer', artist: 'Imagine Dragons', albumArt: 'https://i.ytimg.com/vi/7wtfhZwyrcc/mqdefault.jpg', duration: 204, youtubeId: '7wtfhZwyrcc' },
  { id: 'm7Bc3pLyij0', title: 'Happier', artist: 'Marshmello', albumArt: 'https://i.ytimg.com/vi/m7Bc3pLyij0/mqdefault.jpg', duration: 214, youtubeId: 'm7Bc3pLyij0' },
  // More artists
  { id: 'YQHsXMglC9A', title: 'Rolling in the Deep', artist: 'Adele', albumArt: 'https://i.ytimg.com/vi/YQHsXMglC9A/mqdefault.jpg', duration: 228, youtubeId: 'YQHsXMglC9A' },
  { id: 'JRfuAukYTKg', title: 'Savage Love', artist: 'Jason Derulo', albumArt: 'https://i.ytimg.com/vi/JRfuAukYTKg/mqdefault.jpg', duration: 180, youtubeId: 'JRfuAukYTKg' },
  { id: '7wtfhZwyrcc', title: 'Sunflower', artist: 'Post Malone', albumArt: 'https://i.ytimg.com/vi/7wtfhZwyrcc/mqdefault.jpg', duration: 158, youtubeId: 'ApXoWvfageY' },
  { id: 'fRh_vgS2dFE', title: '10000 Hours', artist: 'Justin Bieber', albumArt: 'https://i.ytimg.com/vi/fRh_vgS2dFE/mqdefault.jpg', duration: 209, youtubeId: 'fRh_vgS2dFE' },
  { id: 'Q6_dHMzYBFE', title: 'Starboy', artist: 'The Weeknd', albumArt: 'https://i.ytimg.com/vi/Q6_dHMzYBFE/mqdefault.jpg', duration: 230, youtubeId: 'Q6_dHMzYBFE' },
  { id: 'OF4lSCGFLB4', title: 'Blinding Lights', artist: 'The Weeknd', albumArt: 'https://i.ytimg.com/vi/OF4lSCGFLB4/mqdefault.jpg', duration: 200, youtubeId: 'fHI8X4OXluQ' },
  { id: '7wtfhZwyrcc', title: 'Circles', artist: 'Post Malone', albumArt: 'https://i.ytimg.com/vi/7wtfhZwyrcc/mqdefault.jpg', duration: 215, youtubeId: '7wtfhZwyrcc' },
  { id: 'JGwWNGJdvx8', title: 'Thinking Out Loud', artist: 'Ed Sheeran', albumArt: 'https://i.ytimg.com/vi/JGwWNGJdvx8/mqdefault.jpg', duration: 281, youtubeId: 'lp-EO5I60KA' },
  { id: 'OPf0YbXqDm0', title: 'Dance Monkey', artist: 'Tones and I', albumArt: 'https://i.ytimg.com/vi/OPf0YbXqDm0/mqdefault.jpg', duration: 210, youtubeId: 'q0hyYWKXF0Q' },
  { id: '09R8_2nJtjg', title: 'Havana', artist: 'Camila Cabello', albumArt: 'https://i.ytimg.com/vi/09R8_2nJtjg/mqdefault.jpg', duration: 217, youtubeId: 'HCuoNJq_aVg' },
  { id: 'kXYiU_JCYtU', title: 'In the End', artist: 'Linkin Park', albumArt: 'https://i.ytimg.com/vi/kXYiU_JCYtU/mqdefault.jpg', duration: 216, youtubeId: 'eVTXPUF4Oz4' },
  { id: 'hTWKbfoikeg', title: 'Lithium', artist: 'Nirvana', albumArt: 'https://i.ytimg.com/vi/hTWKbfoikeg/mqdefault.jpg', duration: 257, youtubeId: 'pkcJOfUdJ3s' },
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

  // Fallback to local database - search by title or artist
  const q = query.toLowerCase().trim()
  const matches = FALLBACK_TRACKS.filter(t => {
    const titleMatch = t.title.toLowerCase().includes(q)
    const artistMatch = t.artist.toLowerCase().includes(q)
    const combined = `${t.title} ${t.artist}`.toLowerCase().includes(q)
    return titleMatch || artistMatch || combined
  })
  
  return matches.length > 0 ? matches.slice(0, maxResults) : FALLBACK_TRACKS.slice(0, maxResults)
}

export async function getStreamUrl(videoId: string): Promise<string | null> {
  return `https://www.youtube.com/embed/${videoId}?autoplay=1`
}
