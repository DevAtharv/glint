import type { Track, Playlist } from '../types'

// Backend URL — in dev uses Vite proxy, in prod point to your VPS
const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

export interface ImportResult {
  name: string
  platform: string
  cover: string | null
  tracks: Track[]
}

export async function importPlaylistFromBackend(
  url: string,
  onProgress: (msg: string) => void
): Promise<Playlist> {
  onProgress('Sending URL to backend scraper...')

  const res = await fetch(`${BACKEND}/api/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || `Backend error ${res.status}`)
  }

  onProgress(`Scraped ${data.tracks.length} tracks from ${data.platform}`)
  onProgress('Matching each track on YouTube...')

  // Tracks already have youtubeId from the backend
  const matched = data.tracks.filter((t: Track) => t.youtubeId)
  const unmatched = data.tracks.filter((t: Track) => !t.youtubeId)

  if (unmatched.length > 0) {
    onProgress(`${matched.length} matched · ${unmatched.length} not found on YouTube`)
  } else {
    onProgress(`All ${matched.length} tracks found on YouTube!`)
  }

  return {
    id: `import-${Date.now()}`,
    name: data.name || `Imported from ${data.platform}`,
    cover: data.cover || data.tracks[0]?.albumArt || '',
    tracks: data.tracks,
    createdAt: new Date().toISOString(),
  }
}

export async function generatePlaylistFromBackend(
  prompt: string,
  onProgress: (msg: string) => void
): Promise<Playlist> {
  onProgress('Asking Groq AI to curate tracks...')

  const res = await fetch(`${BACKEND}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || `Backend error ${res.status}`)
  }

  onProgress(`AI picked ${data.tracks.length} tracks. Finding on YouTube...`)
  onProgress('Done!')

  return {
    id: `ai-${Date.now()}`,
    name: data.name || prompt.slice(0, 40),
    cover: data.tracks[0]?.albumArt || '',
    tracks: data.tracks,
    createdAt: new Date().toISOString(),
  }
}

export async function searchFromBackend(query: string, limit = 10): Promise<Track[]> {
  const res = await fetch(`${BACKEND}/api/search?q=${encodeURIComponent(query)}&limit=${limit}`)
  if (!res.ok) throw new Error(`Search failed: ${res.status}`)
  return res.json()
}
