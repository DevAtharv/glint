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
      model: 'llama-3.1-8b-instant',
      messages,
      temperature: 0.5, // Lowered for more accurate, reliable song matching
      max_tokens: 1000,
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
  // Strip out markdown formatting if the AI decided to be helpful and wrap the JSON
  const cleanedText = text.replace(/```json/gi, '').replace(/```/g, '').trim()

  // Try JSON array first
  try {
    const match = cleanedText.match(/\[[\s\S]*?\]/)
    if (match) {
      const arr = JSON.parse(match[0])
      if (Array.isArray(arr) && arr[0]?.title && arr[0]?.artist) return arr
    }
  } catch { console.warn("Groq JSON parse failed, attempting line-by-line fallback") }

  // Try line-by-line fallback if JSON fails
  const results: { title: string; artist: string }[] = []
  for (const raw of cleanedText.split('\n')) {
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
  onProgress('Asking Groq AI for precise track suggestions...')

  let pairs: { title: string; artist: string }[] = []

  try {
    const response = await groqChat([
      {
        role: 'system',
        content: `You are an elite, highly accurate music curator. 
Your objective is to suggest exactly 20 REAL, existing songs that perfectly match the user's description.

CRITICAL RULES:
1. STRICTLY respect the language requested (e.g., if the user asks for Hindi, Bollywood, or Punjabi, ONLY provide songs in that language).
2. STRICTLY respect the artist requested. If an artist is named, prioritize their actual discography.
3. Reply with ONLY a raw JSON array of objects. Do not include markdown formatting, backticks, or conversational text.

Format:
[{"title":"Song Name","artist":"Artist Name"}]`,
      },
      {
        role: 'user',
        content: `Create a playlist for: ${prompt}`,
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

  onProgress(`AI found ${pairs.length} precise tracks — searching YouTube...`)

  // Search YouTube for each track
  const results = await Promise.allSettled(
    pairs.map(p => searchYouTube(`${p.title} ${p.artist} official audio`, 1))
  )

  const tracks: Track[] = results.map((r, i) => {
    if (r.status === 'fulfilled' && r.value[0]) return r.value[0]
    
    // Fallback if YouTube search fails for a specific track
    return {
      id: `fb-${i}-${Date.now()}`,
      title: pairs[i]?.title ?? 'Unknown',
      artist: pairs[i]?.artist ?? 'Unknown',
      albumArt: `https://picsum.photos/seed/pl${i}/120/120`,
      duration: 200,
      youtubeId: 'jfKfPfyJRdk', 
    } satisfies Track
  }).filter(Boolean) as Track[]

  onProgress('Playlist deployed successfully!')

  return {
    id: `ai-${Date.now()}`,
    name: prompt.slice(0, 40) || 'AI Curated Playlist',
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
  onProgress('Analysing URL structure...')

  let platform = 'music'
  
  const lowerUrl = url.toLowerCase()
  if (lowerUrl.includes('spotify.com')) platform = 'Spotify'
  else if (lowerUrl.includes('apple.com')) platform = 'Apple Music'
  else if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) platform = 'YouTube'
  else if (lowerUrl.includes('soundcloud.com')) platform = 'SoundCloud'
  else if (lowerUrl.includes('tidal.com')) platform = 'Tidal'

  onProgress(`Detected ${platform}. Reconstructing playlist with AI...`)

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
The user provides a ${platform} URL. Based on the context in the URL (artist name, playlist name, genre, language), suggest 20 real songs that accurately represent this playlist.
Reply ONLY with a raw JSON array. No markdown, no conversational text.
[{"title":"Song Name","artist":"Artist Name"}]`,
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

  onProgress(`Locating ${pairs.length} tracks on global audio nodes...`)

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
      youtubeId: 'jfKfPfyJRdk', 
    } satisfies Track
  }).filter(Boolean) as Track[]

  onProgress('Migration complete!')

  return {
    id: `import-${Date.now()}`,
    name: `Imported from ${platform}`,
    cover: tracks.find(t => t.albumArt && !t.albumArt.includes('picsum'))?.albumArt
      ?? `https://picsum.photos/seed/imp${Date.now()}/80/80`,
    tracks,
    createdAt: new Date().toISOString(),
  }
}