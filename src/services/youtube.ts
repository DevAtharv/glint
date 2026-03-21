import type { Track } from '../types'

const BACKEND = import.meta.env.VITE_BACKEND_URL?.trim() || ''

const FALLBACK_TRACKS: Track[] = [
  { id: 'fHI8X4OXluQ', title: 'Blinding Lights', artist: 'The Weeknd', albumArt: 'https://i.ytimg.com/vi/fHI8X4OXluQ/mqdefault.jpg', duration: 200, youtubeId: 'fHI8X4OXluQ' },
  { id: 'JGwWNGJdvx8', title: 'Shape of You', artist: 'Ed Sheeran', albumArt: 'https://i.ytimg.com/vi/JGwWNGJdvx8/mqdefault.jpg', duration: 234, youtubeId: 'JGwWNGJdvx8' },
  { id: 'OPf0YbXqDm0', title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', albumArt: 'https://i.ytimg.com/vi/OPf0YbXqDm0/mqdefault.jpg', duration: 270, youtubeId: 'OPf0YbXqDm0' },
  { id: '09R8_2nJtjg', title: 'Sugar', artist: 'Maroon 5', albumArt: 'https://i.ytimg.com/vi/09R8_2nJtjg/mqdefault.jpg', duration: 235, youtubeId: '09R8_2nJtjg' },
  { id: 'TUVcZfQe-Kw', title: 'As It Was', artist: 'Harry Styles', albumArt: 'https://i.ytimg.com/vi/TUVcZfQe-Kw/mqdefault.jpg', duration: 167, youtubeId: 'TUVcZfQe-Kw' },
  { id: '6I3smoq1HCs', title: 'Cruel Summer', artist: 'Taylor Swift', albumArt: 'https://i.ytimg.com/vi/6I3smoq1HCs/mqdefault.jpg', duration: 178, youtubeId: '6I3smoq1HCs' },
  { id: 'PT2_F-1esPk', title: 'Levitating', artist: 'Dua Lipa', albumArt: 'https://i.ytimg.com/vi/PT2_F-1esPk/mqdefault.jpg', duration: 203, youtubeId: 'PT2_F-1esPk' },
  { id: 'H5v3kku4y6Q', title: 'Heat Waves', artist: 'Glass Animals', albumArt: 'https://i.ytimg.com/vi/H5v3kku4y6Q/mqdefault.jpg', duration: 238, youtubeId: 'H5v3kku4y6Q' },
  { id: 'YQHsXMglC9A', title: 'Hello', artist: 'Adele', albumArt: 'https://i.ytimg.com/vi/YQHsXMglC9A/mqdefault.jpg', duration: 295, youtubeId: 'YQHsXMglC9A' },
  { id: 'hLQl3WQQoQ0', title: 'Someone Like You', artist: 'Adele', albumArt: 'https://i.ytimg.com/vi/hLQl3WQQoQ0/mqdefault.jpg', duration: 285, youtubeId: 'hLQl3WQQoQ0' },
  { id: 'kXYiU_JCYtU', title: 'Numb', artist: 'Linkin Park', albumArt: 'https://i.ytimg.com/vi/kXYiU_JCYtU/mqdefault.jpg', duration: 185, youtubeId: 'kXYiU_JCYtU' },
  { id: 'hTWKbfoikeg', title: 'Smells Like Teen Spirit', artist: 'Nirvana', albumArt: 'https://i.ytimg.com/vi/hTWKbfoikeg/mqdefault.jpg', duration: 301, youtubeId: 'hTWKbfoikeg' },
  { id: 'fJ9rUzIMcZQ', title: 'Bohemian Rhapsody', artist: 'Queen', albumArt: 'https://i.ytimg.com/vi/fJ9rUzIMcZQ/mqdefault.jpg', duration: 354, youtubeId: 'fJ9rUzIMcZQ' },
  { id: 'RgKAFK5djSk', title: 'See You Again', artist: 'Wiz Khalifa', albumArt: 'https://i.ytimg.com/vi/RgKAFK5djSk/mqdefault.jpg', duration: 229, youtubeId: 'RgKAFK5djSk' },
  { id: '7PCkvCPvDXk', title: 'Old Town Road', artist: 'Lil Nas X', albumArt: 'https://i.ytimg.com/vi/7PCkvCPvDXk/mqdefault.jpg', duration: 157, youtubeId: '7PCkvCPvDXk' },
  { id: 'y6120QOlsfU', title: 'Midnight City', artist: 'M83', albumArt: 'https://i.ytimg.com/vi/y6120QOlsfU/mqdefault.jpg', duration: 243, youtubeId: 'y6120QOlsfU' },
  { id: 'ru0K8uYEZWw', title: 'All of Me', artist: 'John Legend', albumArt: 'https://i.ytimg.com/vi/ru0K8uYEZWw/mqdefault.jpg', duration: 269, youtubeId: 'ru0K8uYEZWw' },
  { id: 'E07s5ZYygMg', title: 'Watermelon Sugar', artist: 'Harry Styles', albumArt: 'https://i.ytimg.com/vi/E07s5ZYygMg/mqdefault.jpg', duration: 174, youtubeId: 'E07s5ZYygMg' },
  { id: 'ApXoWvfageY', title: 'Sunflower', artist: 'Post Malone', albumArt: 'https://i.ytimg.com/vi/ApXoWvfageY/mqdefault.jpg', duration: 158, youtubeId: 'ApXoWvfageY' },
  { id: 'XXYlFuWEuKI', title: 'Save Your Tears', artist: 'The Weeknd', albumArt: 'https://i.ytimg.com/vi/XXYlFuWEuKI/mqdefault.jpg', duration: 215, youtubeId: 'XXYlFuWEuKI' },
  { id: 'kJQP7kiw5Fk', title: 'Despacito', artist: 'Luis Fonsi', albumArt: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/mqdefault.jpg', duration: 282, youtubeId: 'kJQP7kiw5Fk' },
  { id: 'fRh_vgS2dFE', title: 'Sorry', artist: 'Justin Bieber', albumArt: 'https://i.ytimg.com/vi/fRh_vgS2dFE/mqdefault.jpg', duration: 200, youtubeId: 'fRh_vgS2dFE' },
  { id: 'nYh-n7EOtMA', title: 'Cheap Thrills', artist: 'Sia', albumArt: 'https://i.ytimg.com/vi/nYh-n7EOtMA/mqdefault.jpg', duration: 212, youtubeId: 'nYh-n7EOtMA' },
  { id: 'fKopy74weus', title: 'Thunder', artist: 'Imagine Dragons', albumArt: 'https://i.ytimg.com/vi/fKopy74weus/mqdefault.jpg', duration: 187, youtubeId: 'fKopy74weus' },
  { id: '7wtfhZwyrcc', title: 'Believer', artist: 'Imagine Dragons', albumArt: 'https://i.ytimg.com/vi/7wtfhZwyrcc/mqdefault.jpg', duration: 204, youtubeId: '7wtfhZwyrcc' },
  { id: 'm7Bc3pLyij0', title: 'Happier', artist: 'Marshmello', albumArt: 'https://i.ytimg.com/vi/m7Bc3pLyij0/mqdefault.jpg', duration: 214, youtubeId: 'm7Bc3pLyij0' },
  { id: '60ItHLz5WEA', title: 'Faded', artist: 'Alan Walker', albumArt: 'https://i.ytimg.com/vi/60ItHLz5WEA/mqdefault.jpg', duration: 212, youtubeId: '60ItHLz5WEA' },
  { id: 'gdZLi9oWNZg', title: 'Dynamite', artist: 'BTS', albumArt: 'https://i.ytimg.com/vi/gdZLi9oWNZg/mqdefault.jpg', duration: 199, youtubeId: 'gdZLi9oWNZg' },
]

function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/\bofficial\b|\audi[o]?|\video\b|\lyrics?\b|\mv\b|\remaster(ed)?\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function scoreTrack(query: string, track: Track): number {
  const q = normalize(query)
  const title = normalize(track.title)
  const artist = normalize(track.artist)

  let score = 0
  if (q === title) score += 100
  if (q.includes(title)) score += 40
  if (title.includes(q)) score += 35
  if (q.includes(artist)) score += 25
  if (artist && q.includes(artist)) score += 20

  const qWords = q.split(' ').filter(Boolean)
  const titleWords = title.split(' ').filter(Boolean)
  const artistWords = artist.split(' ').filter(Boolean)

  for (const w of qWords) {
    if (titleWords.includes(w)) score += 8
    if (artistWords.includes(w)) score += 4
  }

  return score
}

export async function searchYouTube(searchQuery: string, maxResults = 10): Promise<Track[]> {
  const q = searchQuery.trim()
  if (!q) return FALLBACK_TRACKS.slice(0, maxResults)

  try {
    if (BACKEND) {
      const res = await fetch(`${BACKEND}/api/search?q=${encodeURIComponent(q)}&limit=${maxResults}`, {
        signal: AbortSignal.timeout(5000),
      })

      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          return data
            .map((item: any) => ({
              id: item.youtubeId || item.id || `${item.title}-${item.artist}`,
              title: item.title,
              artist: item.artist,
              albumArt: item.albumArt || `https://i.ytimg.com/vi/${item.youtubeId}/mqdefault.jpg`,
              duration: item.duration || 0,
              youtubeId: item.youtubeId,
            }))
            .slice(0, maxResults)
        }
      }
    }
  } catch {
    // fall through to local fallback
  }

  const scored = FALLBACK_TRACKS
    .map(track => ({ track, score: scoreTrack(q, track) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(x => x.track)

  return scored.length > 0 ? scored.slice(0, maxResults) : FALLBACK_TRACKS.slice(0, maxResults)
}

export async function getStreamUrl(videoId: string): Promise<string | null> {
  return `https://www.youtube.com/embed/${videoId}?autoplay=1`
}
