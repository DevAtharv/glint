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

  // Try line-by-line fallback
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
  return results.slice(0, 25)
}

// ── GENERATE FROM PROMPT ────────────────────────────────────────────────────
export async function generatePlaylistFromPrompt(
  prompt: string,
  onProgress: (msg: string) => void
): Promise<Playlist> {
  onProgress('Asking Groq AI for track suggestions...')

  let pairs: { title: string; artist: string }[] = []

  try {
    const response = await groqChat([
      {
        role: 'system',
        content: `You are a music expert. Suggest 20 real songs matching the user's description.
Reply with ONLY a JSON array, no markdown, no explanation:
[{"title":"Song Name","artist":"Artist Name"},{"title":"...","artist":"..."}]`,
      },
      {
        role: 'user',
        content: `Playlist for: ${prompt}`,
      },
    ])
    pairs = parseTracklist(response)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    if (msg === 'NO_KEY') {
      throw new Error("Missing VITE_GROQ_API_KEY in your .env file! Please add it.")
    }
    throw new Error(`AI API Error: ${msg}`)
  }

  if (pairs.length === 0) {
    throw new Error("AI returned an invalid format. Please try again.")
  }

  onProgress(`AI found ${pairs.length} tracks — searching YouTube...`)

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

  let urlHint = ''
  try {
    const u = new URL(url)
    urlHint = u.pathname.split('/').filter(Boolean).join(' ').replace(/-/g, ' ')
  } catch { /**/ }

  let pairs: { title: string; artist: string }[] = []

  try {
    const response = await groqChat([
      {
        role: 'system',
        content: `You help users migrate playlists between music platforms.
The user gives you a ${platform} URL. Based on any context in the URL (artist name, playlist name, genre), suggest 20 real songs that would fit this playlist.
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
    const msg = err instanceof Error ? err.message : 'Unknown error'
    if (msg === 'NO_KEY') {
      throw new Error("Missing VITE_GROQ_API_KEY in your .env file! Please add it.")
    }
    throw new Error(`AI API Error: ${msg}`)
  }

  if (pairs.length === 0) {
    throw new Error("AI returned an invalid format. Please try again.")
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
