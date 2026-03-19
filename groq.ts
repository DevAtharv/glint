/**
 * groq.ts — ALL Groq calls go through the backend.
 * VITE_GROQ_API_KEY is NOT used here anymore — keep it only in backend .env
 * Frontend only calls /api/generate and /api/spotify/import
 */
import { searchYouTube } from './youtube'
import type { Track, Playlist } from '../types'

const BACKEND = import.meta.env.VITE_BACKEND_URL?.trim() || ''

// ── GENERATE FROM PROMPT ─────────────────────────────────────────────────────
export async function generatePlaylistFromPrompt(
  prompt: string,
  onProgress: (msg: string) => void
): Promise<Playlist> {
  if (!BACKEND) {
    // No backend — use fallback pairs + YouTube search directly
    onProgress('No backend configured — using curated tracks...')
    const pairs = getFallbackPairs(prompt)
    return buildPlaylistFromPairs(pairs, prompt, onProgress)
  }

  onProgress('Asking AI via backend...')
  try {
    const res = await fetch(`${BACKEND}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `Backend error ${res.status}`)
    onProgress(`AI suggested ${data.tracks.length} tracks`)
    return {
      id: `ai-${Date.now()}`,
      name: data.name || prompt.slice(0, 40),
      cover: data.tracks[0]?.albumArt || '',
      tracks: data.tracks as Track[],
      createdAt: new Date().toISOString(),
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    onProgress(`Backend error: ${msg} — using fallback tracks...`)
    const pairs = getFallbackPairs(prompt)
    return buildPlaylistFromPairs(pairs, prompt, onProgress)
  }
}

// ── IMPORT FROM URL (Spotify only, others use fallback) ──────────────────────
export async function importPlaylistFromUrl(
  url: string,
  onProgress: (msg: string) => void
): Promise<Playlist> {
  if (!BACKEND) {
    onProgress('Backend not configured — set VITE_BACKEND_URL in .env for Spotify import')
    onProgress('Generating similar tracks with fallback...')
    const pairs = getFallbackPairs('popular music')
    return buildPlaylistFromPairs(pairs, 'Imported Playlist', onProgress)
  }

  onProgress('Sending to backend...')
  try {
    const res = await fetch(`${BACKEND}/api/spotify/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `Backend error ${res.status}`)
    onProgress(`Found "${data.name}" — ${data.matched} of ${data.total} tracks matched on YouTube`)
    return {
      id: `spotify-${Date.now()}`,
      name: data.name,
      cover: data.cover || data.tracks[0]?.albumArt || '',
      tracks: data.tracks as Track[],
      createdAt: new Date().toISOString(),
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown'
    if (msg.includes('fetch') || msg.includes('network') || msg.includes('ECONNREFUSED')) {
      throw new Error('Cannot reach backend. Make sure glint-backend is running: cd glint-backend && node server.js')
    }
    throw e
  }
}

// ── HELPERS ──────────────────────────────────────────────────────────────────
async function buildPlaylistFromPairs(
  pairs: { title: string; artist: string }[],
  name: string,
  onProgress: (msg: string) => void
): Promise<Playlist> {
  onProgress(`Searching YouTube for ${pairs.length} tracks...`)
  const results = await Promise.allSettled(
    pairs.map(p => searchYouTube(`${p.title} ${p.artist} official audio`, 1))
  )
  const tracks: Track[] = results.map((r, i) => {
    if (r.status === 'fulfilled' && r.value[0]) return r.value[0]
    return {
      id: `fb-${i}`,
      title: pairs[i]?.title ?? 'Unknown',
      artist: pairs[i]?.artist ?? 'Unknown',
      albumArt: `https://picsum.photos/seed/pl${i}/120/120`,
      duration: 200,
      youtubeId: undefined,
    } satisfies Track
  })
  onProgress('Done!')
  return {
    id: `pl-${Date.now()}`,
    name: name.slice(0, 40) || 'Playlist',
    cover: tracks.find(t => t.albumArt && !t.albumArt.includes('picsum'))?.albumArt ?? '',
    tracks,
    createdAt: new Date().toISOString(),
  }
}

function getFallbackPairs(hint: string): { title: string; artist: string }[] {
  const h = hint.toLowerCase()
  if (h.includes('workout') || h.includes('gym')) return [
    { title: 'Rockstar', artist: 'Post Malone' },
    { title: 'SICKO MODE', artist: 'Travis Scott' },
    { title: 'Power', artist: 'Kanye West' },
    { title: 'HUMBLE.', artist: 'Kendrick Lamar' },
    { title: 'Blinding Lights', artist: 'The Weeknd' },
    { title: 'Industry Baby', artist: 'Lil Nas X' },
  ]
  if (h.includes('focus') || h.includes('study') || h.includes('chill') || h.includes('lofi')) return [
    { title: 'Clair de Lune', artist: 'Claude Debussy' },
    { title: 'Experience', artist: 'Ludovico Einaudi' },
    { title: 'Holocene', artist: 'Bon Iver' },
    { title: 'Intro', artist: 'The xx' },
    { title: 'Night Owl', artist: 'Galimatias' },
    { title: 'Gymnopédie No.1', artist: 'Erik Satie' },
  ]
  if (h.includes('sad') || h.includes('heartbreak') || h.includes('melancholy')) return [
    { title: 'Someone Like You', artist: 'Adele' },
    { title: 'The Night We Met', artist: 'Lord Huron' },
    { title: 'Skinny Love', artist: 'Bon Iver' },
    { title: 'All I Want', artist: 'Kodaline' },
    { title: 'Exile', artist: 'Taylor Swift' },
    { title: 'Slow Dancing in the Dark', artist: 'Joji' },
  ]
  if (h.includes('party') || h.includes('dance') || h.includes('happy')) return [
    { title: 'Levitating', artist: 'Dua Lipa' },
    { title: 'As It Was', artist: 'Harry Styles' },
    { title: 'Cruel Summer', artist: 'Taylor Swift' },
    { title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars' },
    { title: 'Shape of You', artist: 'Ed Sheeran' },
    { title: 'Bad Guy', artist: 'Billie Eilish' },
  ]
  return [
    { title: 'Blinding Lights', artist: 'The Weeknd' },
    { title: 'Shape of You', artist: 'Ed Sheeran' },
    { title: 'Heat Waves', artist: 'Glass Animals' },
    { title: 'Cruel Summer', artist: 'Taylor Swift' },
    { title: 'As It Was', artist: 'Harry Styles' },
    { title: 'Midnight City', artist: 'M83' },
  ]
}
