import type { Track } from '../types'

const BACKEND = import.meta.env.VITE_BACKEND_URL?.trim() || 'http://localhost:3001'

// Real YouTube video IDs for fallback
const REAL_TRACKS: Track[] = [
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
  { id: 'E07s5ZYygMg', title: 'Watermelon Sugar', artist: 'Harry Styles', albumArt: 'https://i.ytimg.com/vi/E07s5ZYygMg/mqdefault.jpg', duration: 174, youtubeId: 'E07s5ZYygMg' },
  { id: 'b1kbLWvqugk', title: 'Anti-Hero', artist: 'Taylor Swift', albumArt: 'https://i.ytimg.com/vi/b1kbLWvqugk/mqdefault.jpg', duration: 200, youtubeId: 'b1kbLWvqugk' },
  { id: 'G7KNmW9a75Y', title: 'Flowers', artist: 'Miley Cyrus', albumArt: 'https://i.ytimg.com/vi/G7KNmW9a75Y/mqdefault.jpg', duration: 200, youtubeId: 'G7KNmW9a75Y' },
  { id: 'DyDfgMOUjCI', title: 'Bad Guy', artist: 'Billie Eilish', albumArt: 'https://i.ytimg.com/vi/DyDfgMOUjCI/mqdefault.jpg', duration: 194, youtubeId: 'DyDfgMOUjCI' },
  { id: 'kTJczUg2kfo', title: 'Stay', artist: 'The Kid LAROI & Justin Bieber', albumArt: 'https://i.ytimg.com/vi/kTJczUg2kfo/mqdefault.jpg', duration: 141, youtubeId: 'kTJczUg2kfo' },
  { id: 'RgKAFK5djSk', title: 'See You Again', artist: 'Wiz Khalifa ft. Charlie Puth', albumArt: 'https://i.ytimg.com/vi/RgKAFK5djSk/mqdefault.jpg', duration: 229, youtubeId: 'RgKAFK5djSk' },
  { id: 'hTWKbfoikeg', title: 'Smells Like Teen Spirit', artist: 'Nirvana', albumArt: 'https://i.ytimg.com/vi/hTWKbfoikeg/mqdefault.jpg', duration: 301, youtubeId: 'hTWKbfoikeg' },
]

export async function searchYouTube(query: string, maxResults = 10): Promise<Track[]> {
  const q = query.toLowerCase().replace(/official audio|official video|lyrics|hd|4k/gi, '').trim()
  
  // Search in local database
  const matches = REAL_TRACKS.filter(t => {
    const titleMatch = t.title.toLowerCase().includes(q)
    const artistMatch = t.artist.toLowerCase().includes(q)
    return titleMatch || artistMatch
  })
  
  return matches.length > 0 ? matches.slice(0, maxResults) : REAL_TRACKS.slice(0, maxResults)
}

export async function getStreamUrl(videoId: string): Promise<string | null> {
  return `https://www.youtube.com/embed/${videoId}?autoplay=1`
}
