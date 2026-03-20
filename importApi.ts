import type { Track, Playlist } from './src/types/index'

const BACKEND = import.meta.env.VITE_BACKEND_URL?.trim() || 'http://localhost:3001'

export function hasBackend(): boolean {
  return !!import.meta.env.VITE_BACKEND_URL?.trim()
}

export async function importFromBackend(
  url: string,
  onProgress: (msg: string) => void
): Promise<Playlist> {
  onProgress('Connecting to Glint backend...')

  const res = await fetch(`${BACKEND}/api/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `Backend error ${res.status}`)

  onProgress(`Scraped "${data.name}" — ${data.total} tracks found on ${data.platform}`)
  onProgress(`Matched ${data.matched} of ${data.tracks.length} tracks on YouTube`)

  return {
    id: `import-${Date.now()}`,
    name: data.name,
    cover: data.cover || data.tracks[0]?.albumArt || '',
    tracks: data.tracks as Track[],
    createdAt: new Date().toISOString(),
  }
}

export async function generateFromBackend(
  prompt: string,
  onProgress: (msg: string) => void
): Promise<Playlist> {
  onProgress('Asking Groq AI via backend...')

  const res = await fetch(`${BACKEND}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `Backend error ${res.status}`)

  onProgress(`AI generated ${data.tracks.length} tracks`)
  return {
    id: `ai-${Date.now()}`,
    name: data.name || prompt.slice(0, 40),
    cover: data.tracks[0]?.albumArt || '',
    tracks: data.tracks as Track[],
    createdAt: new Date().toISOString(),
  }
}
