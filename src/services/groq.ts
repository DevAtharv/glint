import { searchYouTube } from './youtube'
import type { Track, Playlist } from '../types'

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY as string

// Groq supports browser CORS — call directly, no proxy needed
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

async function groqChat(messages: { role: string; content: string }[]): Promise<string> {
  if (!GROQ_API_KEY || GROQ_API_KEY.trim() === '') {
    throw new Error('NO_KEY')
  }

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY.trim()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama3-8b-8192',
      messages,
      temperature: 0.8,
      max_tokens: 800,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    if (res.status === 401) throw new Error('Invalid Groq API key. Check your .env file.')
    if (res.status === 429) throw new Error('Groq rate limit hit. Try again in a moment.')
    throw new Error(`Groq error ${res.status}: ${text.slice(0, 100)}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? ''
}

function parseTracklist(text: string): { title: string; artist: string }[] {
  // Try JSON array first
  try {
    const match = text.match(/\[[\s\S]*?\]/)
    if (match) {
      const arr = JSON.parse(match[0])
      if (Array.isArray(arr) && arr[0]?.title && arr[0]?.artist) return arr
    }
  } catch { /**/ }

  // Try line-by-line: "Title - Artist" or "Title by Artist"
  const results: { title: string; artist: string }[] = []
  for (const raw of text.split('\n')) {
    const line = raw.replace(/^\d+[\.\)]\s*/, '').replace(/[*_`]/g, '').trim()
    if (!line) continue
    const sep = line.match(/\s[-–—]\s|\s[Bb]y\s/)
    if (sep) {
      const i = line.search(/\s[-–—]\s|\s[Bb]y\s/)
      const title = line.slice(0, i).trim().replace(/^["']|["']$/g, '')
      const artist = line.slice(i + sep[0].length).trim().replace(/^["']|["']$/g, '')
      if (title && artist) results.push({ title, artist })
    }
  }
  return results.slice(0, 8)
}

// ── GENERATE FROM PROMPT ────────────────────────────────────────────────────
export async function generatePlaylistFromPrompt(
  prompt: string,
  onProgress: (msg: string) => void
): Promise<Playlist> {
  onProgress('Asking Groq AI for track suggestions...')

  let pairs: { title: string; artist: string }[] = []
  let usedAI = false

  if (GROQ_API_KEY && GROQ_API_KEY.trim() !== '') {
    try {
      const response = await groqChat([
        {
          role: 'system',
          content: `You are a music expert. Suggest 8 real songs matching the user's description.
Reply with ONLY a JSON array, no markdown, no explanation:
[{"title":"Song Name","artist":"Artist Name"},{"title":"...","artist":"..."}]`,
        },
        {
          role: 'user',
          content: `Playlist for: ${prompt}`,
        },
      ])
      pairs = parseTracklist(response)
      if (pairs.length > 0) usedAI = true
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      if (msg === 'NO_KEY') {
        onProgress('No Groq API key — using curated tracks...')
      } else {
        onProgress(`AI issue: ${msg} — using curated tracks instead...`)
      }
    }
  } else {
    onProgress('No Groq key — using curated fallback tracks...')
  }

  if (pairs.length === 0) {
    pairs = getFallbackPairs(prompt)
  }

  onProgress(`${usedAI ? 'AI found' : 'Using'} ${pairs.length} tracks — searching YouTube...`)

  const results = await Promise.allSettled(
    pairs.map(p => searchYouTube(`${p.title} ${p.artist} official audio`, 1))
  )

  const tracks: Track[] = results.map((r, i) => {
    if (r.status === 'fulfilled' && r.value[0]) return r.value[0]
    return {
      id: `fb-${i}-${Date.now()}`,
      title: pairs[i]?.title ?? 'Unknown',
      artist: pairs[i]?.artist ?? 'Unknown',
      albumArt: `https://picsum.photos/seed/pl${i}/120/120`,
      duration: 200,
      youtubeId: undefined,
    } satisfies Track
  }).filter(Boolean) as Track[]

  onProgress('Playlist ready!')

  return {
    id: `ai-${Date.now()}`,
    name: prompt.slice(0, 40) || 'AI Playlist',
    cover: tracks.find(t => t.albumArt && !t.albumArt.includes('picsum'))?.albumArt
      ?? `https://picsum.photos/seed/ai${Date.now()}/80/80`,
    tracks,
    createdAt: new Date().toISOString(),
  }
}

// ── IMPORT FROM URL ──────────────────────────────────────────────────────────
export async function importPlaylistFromUrl(
  url: string,
  onProgress: (msg: string) => void
): Promise<Playlist> {
  onProgress('Analysing URL...')

  let platform = 'music'
  if (url.includes('spotify.com')) platform = 'Spotify'
  else if (url.includes('music.apple.com')) platform = 'Apple Music'
  else if (url.includes('youtube.com') || url.includes('youtu.be')) platform = 'YouTube'
  else if (url.includes('soundcloud.com')) platform = 'SoundCloud'
  else if (url.includes('tidal.com')) platform = 'Tidal'

  onProgress(`Detected ${platform}. Generating equivalent tracks with AI...`)

  // Pull any readable context from the URL path
  let urlHint = ''
  try {
    const u = new URL(url)
    urlHint = u.pathname.split('/').filter(Boolean).join(' ').replace(/-/g, ' ')
  } catch { /**/ }

  let pairs: { title: string; artist: string }[] = []

  if (GROQ_API_KEY && GROQ_API_KEY.trim() !== '') {
    try {
      const response = await groqChat([
        {
          role: 'system',
          content: `You help users migrate playlists between music platforms.
The user gives you a ${platform} URL. Based on any context in the URL (artist name, playlist name, genre), suggest 8 real songs that would fit this playlist.
Reply ONLY with a JSON array, no markdown:
[{"title":"Song Name","artist":"Artist Name"},...]`,
        },
        {
          role: 'user',
          content: `Import this ${platform} playlist.\nURL hint: ${urlHint}\nFull URL: ${url}`,
        },
      ])
      pairs = parseTracklist(response)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      onProgress(`AI error: ${msg.slice(0, 60)} — using popular ${platform} tracks...`)
    }
  }

  if (pairs.length === 0) {
    onProgress(`Using popular ${platform} tracks as fallback...`)
    pairs = getFallbackPairs(platform)
  }

  onProgress(`Searching YouTube for ${pairs.length} tracks...`)

  const results = await Promise.allSettled(
    pairs.map(p => searchYouTube(`${p.title} ${p.artist} official audio`, 1))
  )

  const tracks: Track[] = results.map((r, i) => {
    if (r.status === 'fulfilled' && r.value[0]) return r.value[0]
    return {
      id: `imp-${i}-${Date.now()}`,
      title: pairs[i]?.title ?? 'Unknown',
      artist: pairs[i]?.artist ?? 'Unknown',
      albumArt: `https://picsum.photos/seed/imp${i}/120/120`,
      duration: 200,
      youtubeId: undefined,
    } satisfies Track
  }).filter(Boolean) as Track[]

  onProgress('Import complete!')

  return {
    id: `import-${Date.now()}`,
    name: `Imported from ${platform}`,
    cover: tracks.find(t => t.albumArt && !t.albumArt.includes('picsum'))?.albumArt
      ?? `https://picsum.photos/seed/imp${Date.now()}/80/80`,
    tracks,
    createdAt: new Date().toISOString(),
  }
}

// ── FALLBACK TRACK LISTS ────────────────────────────────────────────────────
function getFallbackPairs(hint: string): { title: string; artist: string }[] {
  const h = hint.toLowerCase()

  if (h.includes('workout') || h.includes('gym') || h.includes('energy')) return [
    { title: 'Rockstar', artist: 'Post Malone' },
    { title: 'SICKO MODE', artist: 'Travis Scott' },
    { title: 'Power', artist: 'Kanye West' },
    { title: 'HUMBLE.', artist: 'Kendrick Lamar' },
    { title: "God's Plan", artist: 'Drake' },
    { title: 'Blinding Lights', artist: 'The Weeknd' },
    { title: 'Industry Baby', artist: 'Lil Nas X' },
    { title: 'Essence', artist: 'Wizkid' },
  ]
  if (h.includes('focus') || h.includes('study') || h.includes('chill') || h.includes('lofi')) return [
    { title: 'Clair de Lune', artist: 'Claude Debussy' },
    { title: 'Experience', artist: 'Ludovico Einaudi' },
    { title: 'Holocene', artist: 'Bon Iver' },
    { title: 'On the Nature of Daylight', artist: 'Max Richter' },
    { title: 'Intro', artist: 'The xx' },
    { title: 'Gymnopédie No.1', artist: 'Erik Satie' },
    { title: 'Night Owl', artist: 'Galimatias' },
    { title: 'Sleepless', artist: 'Flume' },
  ]
  if (h.includes('sad') || h.includes('heartbreak') || h.includes('melancholy')) return [
    { title: 'Someone Like You', artist: 'Adele' },
    { title: 'The Night We Met', artist: 'Lord Huron' },
    { title: 'Skinny Love', artist: 'Bon Iver' },
    { title: 'All I Want', artist: 'Kodaline' },
    { title: 'Exile', artist: 'Taylor Swift' },
    { title: 'Liability', artist: 'Lorde' },
    { title: 'Motion Picture Soundtrack', artist: 'Radiohead' },
    { title: 'Slow Dancing in the Dark', artist: 'Joji' },
  ]
  if (h.includes('party') || h.includes('dance') || h.includes('happy')) return [
    { title: 'Levitating', artist: 'Dua Lipa' },
    { title: 'As It Was', artist: 'Harry Styles' },
    { title: 'Cruel Summer', artist: 'Taylor Swift' },
    { title: 'Heat Waves', artist: 'Glass Animals' },
    { title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars' },
    { title: 'Shape of You', artist: 'Ed Sheeran' },
    { title: 'Stay', artist: 'The Kid LAROI' },
    { title: 'Bad Guy', artist: 'Billie Eilish' },
  ]
  if (h.includes('spotify') || h.includes('apple') || h.includes('soundcloud')) return [
    { title: 'Blinding Lights', artist: 'The Weeknd' },
    { title: 'Shape of You', artist: 'Ed Sheeran' },
    { title: 'Stay With Me', artist: 'Sam Smith' },
    { title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars' },
    { title: 'Thinking Out Loud', artist: 'Ed Sheeran' },
    { title: 'Someone Like You', artist: 'Adele' },
    { title: 'Shallow', artist: 'Lady Gaga' },
    { title: 'Perfect', artist: 'Ed Sheeran' },
  ]
  // Default
  return [
    { title: 'Midnight City', artist: 'M83' },
    { title: 'Nightcall', artist: 'Kavinsky' },
    { title: 'Take Me to Church', artist: 'Hozier' },
    { title: 'Do I Wanna Know?', artist: 'Arctic Monkeys' },
    { title: 'Heat Waves', artist: 'Glass Animals' },
    { title: 'Levitating', artist: 'Dua Lipa' },
    { title: 'As It Was', artist: 'Harry Styles' },
    { title: 'Cruel Summer', artist: 'Taylor Swift' },
  ]
}
