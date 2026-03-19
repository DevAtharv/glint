import { searchYouTube } from './youtube'
import { fetchSpotifyPlaylist, hasSpotifyKeys } from './spotify'
import type { Track, Playlist } from '../types'

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY as string
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

async function groqChat(messages: { role: string; content: string }[]): Promise<string> {
  if (!GROQ_API_KEY?.trim()) throw new Error('NO_KEY')

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY.trim()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages,
      temperature: 0.8,
      max_tokens: 800,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    if (res.status === 401) throw new Error('Invalid Groq API key — check your .env file')
    if (res.status === 429) throw new Error('Groq rate limit — try again in a moment')
    throw new Error(`Groq ${res.status}: ${text.slice(0, 120)}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? ''
}

function parseTracklist(text: string): { title: string; artist: string }[] {
  // Try JSON array
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
  return results.slice(0, 10)
}

async function tracksToYouTube(
  pairs: { title: string; artist: string }[],
  onProgress: (msg: string) => void
): Promise<Track[]> {
  const limited = pairs.slice(0, 20) // cap at 20
  onProgress(`Searching YouTube for ${limited.length} tracks...`)

  const results = await Promise.allSettled(
    limited.map(p => searchYouTube(`${p.title} ${p.artist} official audio`, 1))
  )

  return results.map((r, i) => {
    if (r.status === 'fulfilled' && r.value[0]) return r.value[0]
    return {
      id: `fb-${i}-${Date.now()}`,
      title: limited[i]?.title ?? 'Unknown',
      artist: limited[i]?.artist ?? 'Unknown',
      albumArt: `https://picsum.photos/seed/pl${i}/120/120`,
      duration: 200,
      youtubeId: undefined,
    } satisfies Track
  }).filter(Boolean) as Track[]
}

// ── GENERATE FROM PROMPT ─────────────────────────────────────────────────────
export async function generatePlaylistFromPrompt(
  prompt: string,
  onProgress: (msg: string) => void
): Promise<Playlist> {
  onProgress('Asking Groq AI for track suggestions...')

  let pairs: { title: string; artist: string }[] = []

  if (GROQ_API_KEY?.trim()) {
    try {
      const response = await groqChat([
        {
          role: 'system',
          content: `You are a music expert. Suggest 8 real songs matching the user's description.
Reply with ONLY a JSON array, no markdown, no explanation:
[{"title":"Song Name","artist":"Artist Name"},{"title":"...","artist":"..."}]`,
        },
        { role: 'user', content: `Playlist for: ${prompt}` },
      ])
      pairs = parseTracklist(response)
      if (pairs.length > 0) onProgress(`AI suggested ${pairs.length} tracks`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      onProgress(msg === 'NO_KEY' ? 'No Groq key — using curated tracks...' : `AI: ${msg} — using fallback...`)
    }
  } else {
    onProgress('No Groq key — using curated fallback tracks...')
  }

  if (pairs.length === 0) pairs = getFallbackPairs(prompt)

  const tracks = await tracksToYouTube(pairs, onProgress)
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

// ── IMPORT FROM URL ───────────────────────────────────────────────────────────
export async function importPlaylistFromUrl(
  url: string,
  onProgress: (msg: string) => void
): Promise<Playlist> {
  onProgress('Analysing URL...')

  const isSpotify = url.includes('spotify.com/playlist')
  const isApple = url.includes('music.apple.com')
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be')
  const isSoundCloud = url.includes('soundcloud.com')

  // ── SPOTIFY: use real API ──────────────────────────────────────────────────
  if (isSpotify) {
    if (hasSpotifyKeys()) {
      try {
        onProgress('Fetching real tracks from Spotify API...')
        const spotifyData = await fetchSpotifyPlaylist(url)
        onProgress(`Found "${spotifyData.name}" — ${spotifyData.tracks.length} tracks by ${spotifyData.owner}`)

        const pairs = spotifyData.tracks.map(t => ({ title: t.title, artist: t.artist }))
        const tracks = await tracksToYouTube(pairs, onProgress)

        onProgress('Import complete!')
        return {
          id: `spotify-${Date.now()}`,
          name: spotifyData.name,
          cover: spotifyData.cover ?? tracks[0]?.albumArt ?? '',
          tracks,
          createdAt: new Date().toISOString(),
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown'
        if (msg === 'NO_SPOTIFY_KEYS') {
          onProgress('No Spotify keys — falling back to AI...')
        } else {
          onProgress(`Spotify error: ${msg} — falling back to AI...`)
        }
      }
    } else {
      onProgress('No Spotify API keys set — falling back to AI (add VITE_SPOTIFY_CLIENT_ID + VITE_SPOTIFY_CLIENT_SECRET for exact imports)')
    }
  }

  // ── ALL PLATFORMS: AI fallback ─────────────────────────────────────────────
  const platform = isSpotify ? 'Spotify' : isApple ? 'Apple Music' : isYouTube ? 'YouTube' : isSoundCloud ? 'SoundCloud' : 'music'
  onProgress(`Using AI to generate ${platform} equivalent tracks...`)

  let urlHint = ''
  try { urlHint = new URL(url).pathname.split('/').filter(Boolean).join(' ').replace(/-/g, ' ') } catch { /**/ }

  let pairs: { title: string; artist: string }[] = []

  if (GROQ_API_KEY?.trim()) {
    try {
      const response = await groqChat([
        {
          role: 'system',
          content: `You help users migrate playlists between music platforms.
The user gives you a ${platform} URL. Based on any context in the URL path, suggest 8 real songs that would fit.
Reply ONLY with a JSON array:
[{"title":"Song Name","artist":"Artist Name"},...]`,
        },
        {
          role: 'user',
          content: `Import this ${platform} playlist.\nURL path hint: ${urlHint}\nFull URL: ${url}`,
        },
      ])
      pairs = parseTracklist(response)
      if (pairs.length > 0) onProgress(`AI suggested ${pairs.length} tracks`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      onProgress(`AI: ${msg.slice(0, 60)} — using popular tracks...`)
    }
  }

  if (pairs.length === 0) {
    onProgress(`Using popular ${platform} tracks as fallback...`)
    pairs = getFallbackPairs(platform)
  }

  const tracks = await tracksToYouTube(pairs, onProgress)
  onProgress('Import complete!')

  return {
    id: `import-${Date.now()}`,
    name: `Imported from ${platform}`,
    cover: tracks.find(t => t.albumArt && !t.albumArt.includes('picsum'))?.albumArt ?? '',
    tracks,
    createdAt: new Date().toISOString(),
  }
}

// ── FALLBACKS ─────────────────────────────────────────────────────────────────
function getFallbackPairs(hint: string): { title: string; artist: string }[] {
  const h = hint.toLowerCase()
  if (h.includes('workout') || h.includes('gym') || h.includes('energy')) return [
    { title: 'Rockstar', artist: 'Post Malone' }, { title: 'SICKO MODE', artist: 'Travis Scott' },
    { title: 'Power', artist: 'Kanye West' }, { title: 'HUMBLE.', artist: 'Kendrick Lamar' },
    { title: "God's Plan", artist: 'Drake' }, { title: 'Blinding Lights', artist: 'The Weeknd' },
    { title: 'Industry Baby', artist: 'Lil Nas X' }, { title: 'Gasoline', artist: 'The Weeknd' },
  ]
  if (h.includes('focus') || h.includes('study') || h.includes('chill') || h.includes('lofi')) return [
    { title: 'Clair de Lune', artist: 'Claude Debussy' }, { title: 'Experience', artist: 'Ludovico Einaudi' },
    { title: 'Holocene', artist: 'Bon Iver' }, { title: 'On the Nature of Daylight', artist: 'Max Richter' },
    { title: 'Intro', artist: 'The xx' }, { title: 'Gymnopédie No.1', artist: 'Erik Satie' },
    { title: 'Night Owl', artist: 'Galimatias' }, { title: 'Sleepless', artist: 'Flume' },
  ]
  if (h.includes('sad') || h.includes('heartbreak') || h.includes('melancholy')) return [
    { title: 'Someone Like You', artist: 'Adele' }, { title: 'The Night We Met', artist: 'Lord Huron' },
    { title: 'Skinny Love', artist: 'Bon Iver' }, { title: 'All I Want', artist: 'Kodaline' },
    { title: 'Exile', artist: 'Taylor Swift' }, { title: 'Liability', artist: 'Lorde' },
    { title: 'Motion Picture Soundtrack', artist: 'Radiohead' }, { title: 'Slow Dancing in the Dark', artist: 'Joji' },
  ]
  if (h.includes('party') || h.includes('dance') || h.includes('happy')) return [
    { title: 'Levitating', artist: 'Dua Lipa' }, { title: 'As It Was', artist: 'Harry Styles' },
    { title: 'Cruel Summer', artist: 'Taylor Swift' }, { title: 'Heat Waves', artist: 'Glass Animals' },
    { title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars' }, { title: 'Shape of You', artist: 'Ed Sheeran' },
    { title: 'Stay', artist: 'The Kid LAROI' }, { title: 'Bad Guy', artist: 'Billie Eilish' },
  ]
  return [
    { title: 'Blinding Lights', artist: 'The Weeknd' }, { title: 'Shape of You', artist: 'Ed Sheeran' },
    { title: 'Stay With Me', artist: 'Sam Smith' }, { title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars' },
    { title: 'Thinking Out Loud', artist: 'Ed Sheeran' }, { title: 'Someone Like You', artist: 'Adele' },
    { title: 'Shallow', artist: 'Lady Gaga' }, { title: 'Perfect', artist: 'Ed Sheeran' },
  ]
}
