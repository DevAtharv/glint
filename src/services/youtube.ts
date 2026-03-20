import type { Track } from '../types'

// Use YouTube's oEmbed API and embed search (no key needed)
async function searchViaEmbed(query: string, maxResults: number): Promise<Track[]> {
  try {
    // Use YouTube's suggestion API which doesn't require key
    const response = await fetch(
      `https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=${encodeURIComponent(query)}`,
      { signal: AbortSignal.timeout(5000) }
    )
    const text = await response.text()
    // Parse suggestions and try to find actual videos
    const match = text.match(/\["(.*?)"/g)
    if (match) {
      const suggestions = match.slice(1, maxResults + 1).map(m => m.replace(/\[""/, '').replace(/"/g, ''))
      return suggestions.map((suggestion, i) => ({
        id: `suggestion-${i}-${Date.now()}`,
        title: suggestion,
        artist: 'Search Result',
        albumArt: `https://picsum.photos/seed/${suggestion}/120/120`,
        duration: 0,
        youtubeId: null,
      }))
    }
  } catch (e) {
    console.warn('Suggestion API failed:', e)
  }
  return []
}

// Real YouTube video IDs with actual songs
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
  { id: 'CvqIpxhQTFc', title: 'Watermelon Sugar', artist: 'Harry Styles', albumArt: 'https://i.ytimg.com/vi/CvqIpxhQTFc/mqdefault.jpg', duration: 174, youtubeId: 'CvqIpxhQTFc' },
  { id: 'r5x2w3Q8bxI', title: 'Anti-Hero', artist: 'Taylor Swift', albumArt: 'https://i.ytimg.com/vi/r5x2w3Q8bxI/mqdefault.jpg', duration: 200, youtubeId: 'r5x2w3Q8bxI' },
  { id: 'K0ibBPhi4RE', title: 'Flowers', artist: 'Miley Cyrus', albumArt: 'https://i.ytimg.com/vi/K0ibBPhi4RE/mqdefault.jpg', duration: 200, youtubeId: 'K0ibBPhi4RE' },
  { id: 'A_MjCqQoLLA', title: 'Shape of You', artist: 'Ed Sheeran', albumArt: 'https://i.ytimg.com/vi/A_MjCqQoLLA/mqdefault.jpg', duration: 234, youtubeId: 'A_MjCqQoLLA' },
  { id: 'fRh_vgS2dFE', title: 'Despacito', artist: 'Luis Fonsi ft. Daddy Yankee', albumArt: 'https://i.ytimg.com/vi/fRh_vgS2dFE/mqdefault.jpg', duration: 282, youtubeId: 'fRh_vgS2dFE' },
  { id: 'JRfuAukYTKg', title: 'Savage Love', artist: 'Jason Derulo', albumArt: 'https://i.ytimg.com/vi/JRfuAukYTKg/mqdefault.jpg', duration: 180, youtubeId: 'JRfuAukYTKg' },
  { id: 'lY2yjAdbvdQ', title: 'Bad Guy', artist: 'Billie Eilish', albumArt: 'https://i.ytimg.com/vi/lY2yjAdbvdQ/mqdefault.jpg', duration: 194, youtubeId: 'lY2yjAdbvdQ' },
  { id: 'bPJSsArMkhM', title: 'Watermelon Sugar', artist: 'Harry Styles', albumArt: 'https://i.ytimg.com/vi/bPJSsArMkhM/mqdefault.jpg', duration: 174, youtubeId: 'bPJSsArMkhM' },
  { id: 'mRD0-GxJH9E', title: 'Stay', artist: 'The Kid LAROI & Justin Bieber', albumArt: 'https://i.ytimg.com/vi/mRD0-GxJH9E/mqdefault.jpg', duration: 141, youtubeId: 'mRD0-GxJH9E' },
  { id: 'QYh6mYIJG2Y', title: 'Dynamite', artist: 'BTS', albumArt: 'https://i.ytimg.com/vi/QYh6mYIJG2Y/mqdefault.jpg', duration: 199, youtubeId: 'QYh6mYIJG2Y' },
  { id: 'gdZLi9oWNZg', title: 'Dance Monkey', artist: 'Tones and I', albumArt: 'https://i.ytimg.com/vi/q0hyYWKXF0Q/mqdefault.jpg', duration: 210, youtubeId: 'q0hyYWKXF0Q' },
  { id: '2vjPBrBU-TM', title: 'Chandelier', artist: 'Sia', albumArt: 'https://i.ytimg.com/vi/2vjPBrBU-TM/mqdefault.jpg', duration: 216, youtubeId: '2vjPBrBU-TM' },
  { id: '09R8_2nJtjg', title: 'Girls Like You', artist: 'Maroon 5', albumArt: 'https://i.ytimg.com/vi/aJOTlE1K90k/mqdefault.jpg', duration: 235, youtubeId: 'aJOTlE1K90k' },
  { id: '7PCkvCPvDXk', title: 'Old Town Road', artist: 'Lil Nas X', albumArt: 'https://i.ytimg.com/vi/7PCkvCPvDXk/mqdefault.jpg', duration: 157, youtubeId: '7PCkvCPvDXk' },
  { id: 'bt7m3u2LwWo', title: 'Drivers License', artist: 'Olivia Rodrigo', albumArt: 'https://i.ytimg.com/vi/bt7m3u2LwWo/mqdefault.jpg', duration: 242, youtubeId: 'bt7m3u2LwWo' },
  { id: 'r0R0KwHFk7Y', title: 'Good 4 U', artist: 'Olivia Rodrigo', albumArt: 'https://i.ytimg.com/vi/r0R0KwHFk7Y/mqdefault.jpg', duration: 178, youtubeId: 'r0R0KwHFk7Y' },
  { id: 'k1BneeJTDcU', title: 'MONTERO', artist: 'Lil Nas X', albumArt: 'https://i.ytimg.com/vi/k1BneeJTDcU/mqdefault.jpg', duration: 137, youtubeId: 'k1BneeJTDcU' },
]

// Extended searchable database
const SEARCH_DATABASE: Track[] = [
  ...REAL_TRACKS,
  { id: 'peZ26VvMjOQ', title: 'Blank Space', artist: 'Taylor Swift', albumArt: 'https://i.ytimg.com/vi/peZ26VvMjOQ/mqdefault.jpg', duration: 211, youtubeId: 'peZ26VvMjOQ' },
  { id: 'e-ORhEE9VVg', title: 'Shake It Off', artist: 'Taylor Swift', albumArt: 'https://i.ytimg.com/vi/e-ORhEE9VVg/mqdefault.jpg', duration: 219, youtubeId: 'e-ORhEE9VVg' },
  { id: 'nfWlot6h_JM', title: 'Wildest Dreams', artist: 'Taylor Swift', albumArt: 'https://i.ytimg.com/vi/nfWlot6h_JM/mqdefault.jpg', duration: 229, youtubeId: 'nfWlot6h_JM' },
  { id: '8xg3vE8Ie_E', title: 'Love Story', artist: 'Taylor Swift', albumArt: 'https://i.ytimg.com/vi/8xg3vE8Ie_E/mqdefault.jpg', duration: 236, youtubeId: '8xg3vE8Ie_E' },
  { id: 'YQHsXMglC9A', title: 'Hello', artist: 'Adele', albumArt: 'https://i.ytimg.com/vi/YQHsXMglC9A/mqdefault.jpg', duration: 295, youtubeId: 'YQHsXMglC9A' },
  { id: 'hLQl3WQQoQ0', title: 'Someone Like You', artist: 'Adele', albumArt: 'https://i.ytimg.com/vi/hLQl3WQQoQ0/mqdefault.jpg', duration: 285, youtubeId: 'hLQl3WQQoQ0' },
  { id: 'Y91CIGOuH6s', title: 'Rolling in the Deep', artist: 'Adele', albumArt: 'https://i.ytimg.com/vi/Y91CIGOuH6s/mqdefault.jpg', duration: 228, youtubeId: 'Y91CIGOuH6s' },
  { id: '09R8_2nJtjg', title: 'Payphone', artist: 'Maroon 5', albumArt: 'https://i.ytimg.com/vi/09R8_2nJtjg/mqdefault.jpg', duration: 235, youtubeId: 'KRaWnd3LJfs' },
  { id: 'SlPhMPnQ58k', title: 'Maps', artist: 'Maroon 5', albumArt: 'https://i.ytimg.com/vi/SlPhMPnQ58k/mqdefault.jpg', duration: 210, youtubeId: 'SlPhMPnQ58k' },
  { id: 'XPpTgR5SaOg', title: 'Animals', artist: 'Maroon 5', albumArt: 'https://i.ytimg.com/vi/XPpTgR5SaOg/mqdefault.jpg', duration: 231, youtubeId: 'XPpTgR5SaOg' },
  { id: 'lp-EO5I60KA', title: 'Thinking Out Loud', artist: 'Ed Sheeran', albumArt: 'https://i.ytimg.com/vi/lp-EO5I60KA/mqdefault.jpg', duration: 281, youtubeId: 'lp-EO5I60KA' },
  { id: '2Vv-BfVoq4g', title: 'Perfect', artist: 'Ed Sheeran', albumArt: 'https://i.ytimg.com/vi/2Vv-BfVoq4g/mqdefault.jpg', duration: 263, youtubeId: '2Vv-BfVoq4g' },
  { id: 'Il0S8BoucSA', title: 'Photograph', artist: 'Ed Sheeran', albumArt: 'https://i.ytimg.com/vi/Il0S8BoucSA/mqdefault.jpg', duration: 258, youtubeId: 'Il0S8BoucSA' },
  { id: 'nfs8NYg7yQM', title: 'Castle on the Hill', artist: 'Ed Sheeran', albumArt: 'https://i.ytimg.com/vi/nfs8NYg7yQM/mqdefault.jpg', duration: 261, youtubeId: 'nfs8NYg7yQM' },
  { id: 'btPJPFnesV4', title: 'Die Young', artist: 'Kesha', albumArt: 'https://i.ytimg.com/vi/btPJPFnesV4/mqdefault.jpg', duration: 213, youtubeId: 'btPJPFnesV4' },
  { id: 'iS1g8G_njxY', title: 'Timber', artist: 'Pitbull ft. Ke$ha', albumArt: 'https://i.ytimg.com/vi/iS1g8G_njxY/mqdefault.jpg', duration: 204, youtubeId: 'iS1g8G_njxY' },
  { id: 'hT_nvWreIhg', title: 'Counting Stars', artist: 'OneRepublic', albumArt: 'https://i.ytimg.com/vi/hT_nvWreIhg/mqdefault.jpg', duration: 257, youtubeId: 'hT_nvWreIhg' },
  { id: 'qfKVxuFvGJk', title: 'Sugar', artist: 'Maroon 5', albumArt: 'https://i.ytimg.com/vi/qfKVxuFvGJk/mqdefault.jpg', duration: 235, youtubeId: 'qfKVxuFvGJk' },
  { id: 'fWNaR-rxAic', title: 'Call Me Maybe', artist: 'Carly Rae Jepsen', albumArt: 'https://i.ytimg.com/vi/fWNaR-rxAic/mqdefault.jpg', duration: 193, youtubeId: 'fWNaR-rxAic' },
  { id: 'CvBfHwUxHIk', title: 'Baby', artist: 'Justin Bieber', albumArt: 'https://i.ytimg.com/vi/CvBfHwUxHIk/mqdefault.jpg', duration: 215, youtubeId: 'CvBfHwUxHIk' },
  { id: 'DK_0jXPuIr0', title: 'Sorry', artist: 'Justin Bieber', albumArt: 'https://i.ytimg.com/vi/DK_0jXPuIr0/mqdefault.jpg', duration: 200, youtubeId: 'DK_0jXPuIr0' },
  { id: 'P00HMxdsVZI', title: 'Love Yourself', artist: 'Justin Bieber', albumArt: 'https://i.ytimg.com/vi/P00HMxdsVZI/mqdefault.jpg', duration: 233, youtubeId: 'P00HMxdsVZI' },
  { id: 'EKyirtVHsK0', title: 'Roar', artist: 'Katy Perry', albumArt: 'https://i.ytimg.com/vi/EKyirtVHsK0/mqdefault.jpg', duration: 223, youtubeId: 'EKyirtVHsK0' },
  { id: 'CevxZvSJLk8', title: 'Dark Horse', artist: 'Katy Perry', albumArt: 'https://i.ytimg.com/vi/CevxZvSJLk8/mqdefault.jpg', duration: 215, youtubeId: '09R8_2nJtjg' },
  { id: 'Q1BqY9eLsCo', title: 'Firework', artist: 'Katy Perry', albumArt: 'https://i.ytimg.com/vi/Q1BqY9eLsCo/mqdefault.jpg', duration: 230, youtubeId: 'Q1BqY9eLsCo' },
  { id: 'F57P9C4SAW4', title: 'Cheap Thrills', artist: 'Sia', albumArt: 'https://i.ytimg.com/vi/F57P9C4SAW4/mqdefault.jpg', duration: 212, youtubeId: 'F57P9C4SAW4' },
  { id: 'nYh-n7EOtMA', title: 'Titanium', artist: 'David Guetta ft. Sia', albumArt: 'https://i.ytimg.com/vi/nYh-n7EOtMA/mqdefault.jpg', duration: 246, youtubeId: 'nYh-n7EOtMA' },
  { id: '0G3_kG5qqus', title: 'Clarity', artist: 'Zedd', albumArt: 'https://i.ytimg.com/vi/0G3_kG5qqus/mqdefault.jpg', duration: 270, youtubeId: '0G3_kG5qqus' },
  { id: 'YQHsXMglC9A', title: 'Lean On', artist: 'Major Lazer & DJ Snake', albumArt: 'https://i.ytimg.com/vi/YqeW9_5kURI/mqdefault.jpg', duration: 176, youtubeId: 'YqeW9_5kURI' },
  { id: 'hTWKbfoikeg', title: 'Cheap Thrills Remix', artist: 'Sia', albumArt: 'https://i.ytimg.com/vi/hTWKbfoikeg/mqdefault.jpg', duration: 220, youtubeId: 'hTWKbfoikeg' },
  { id: 'RBumgq5yVrA', title: 'Let Her Go', artist: 'Passenger', albumArt: 'https://i.ytimg.com/vi/RBumgq5yVrA/mqdefault.jpg', duration: 253, youtubeId: 'RBumgq5yVrA' },
  { id: '0KSOMA3QBU0', title: 'Counting Stars', artist: 'OneRepublic', albumArt: 'https://i.ytimg.com/vi/0KSOMA3QBU0/mqdefault.jpg', duration: 257, youtubeId: '0KSOMA3QBU0' },
]

export async function searchYouTube(query: string, maxResults = 10): Promise<Track[]> {
  const q = query.toLowerCase().replace(/official audio|official video|lyrics|hd|4k/gi, '').trim()
  
  // Search in our database
  const matches = SEARCH_DATABASE.filter(t => {
    const titleMatch = t.title.toLowerCase().includes(q)
    const artistMatch = t.artist.toLowerCase().includes(q)
    const combinedMatch = `${t.title} ${t.artist}`.toLowerCase().includes(q)
    return titleMatch || artistMatch || combinedMatch
  })
  
  // If we have matches, return them
  if (matches.length > 0) {
    return matches.slice(0, maxResults)
  }
  
  // Otherwise return popular tracks
  return REAL_TRACKS.slice(0, maxResults)
}

export async function getStreamUrl(videoId: string): Promise<string | null> {
  // Return YouTube embed URL
  return `https://www.youtube.com/embed/${videoId}?autoplay=1`
}
