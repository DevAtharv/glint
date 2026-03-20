import { searchYouTube } from './youtube'
import type { Track, Playlist } from '../types'

const BACKEND = (import.meta.env.VITE_BACKEND_URL || '').trim()

export async function generatePlaylistFromPrompt(
  prompt: string,
  onProgress: (msg: string) => void
): Promise<Playlist> {
  onProgress(`Generating: "${prompt}"`)

  if (BACKEND) {
    try {
      onProgress('Calling backend AI...')
      const res = await fetch(`${BACKEND}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onProgress(`Got ${data.tracks.length} tracks from AI`)
      return {
        id: `ai-${Date.now()}`,
        name: data.name || prompt.slice(0, 40),
        cover: data.tracks[0]?.albumArt || '',
        tracks: data.tracks as Track[],
        createdAt: new Date().toISOString(),
      }
    } catch (e: unknown) {
      onProgress(`Backend error: ${e instanceof Error ? e.message : 'failed'} — using fallback`)
    }
  }

  // Fallback: use Groq directly from browser if key is set
  const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY?.trim()
  if (GROQ_KEY) {
    try {
      onProgress('Calling Groq AI directly...')
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${GROQ_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            {
              role: 'system',
              content: `You are a music expert. Suggest 10 real songs matching the description.
Return ONLY a JSON array: [{"title":"Song Name","artist":"Artist Name"},...]`,
            },
            { role: 'user', content: `Playlist for: ${prompt}` },
          ],
          max_tokens: 800,
          temperature: 0.8,
        }),
      })
      const data = await res.json()
      const text = data.choices?.[0]?.message?.content ?? ''
      const match = text.match(/\[[\s\S]*?\]/)
      if (match) {
        const pairs = JSON.parse(match[0]) as { title: string; artist: string }[]
        onProgress(`Groq suggested ${pairs.length} tracks, searching YouTube...`)
        return buildFromPairs(pairs, prompt, onProgress)
      }
    } catch (e: unknown) {
      onProgress(`Groq error: ${e instanceof Error ? e.message : 'failed'} — using fallback`)
    }
  }

  onProgress('Using curated fallback tracks...')
  const pairs = getFallbackPairs(prompt)
  return buildFromPairs(pairs, prompt, onProgress)
}

export async function importPlaylistFromUrl(
  url: string,
  onProgress: (msg: string) => void
): Promise<Playlist> {
  if (!BACKEND) {
    onProgress('No backend URL — add VITE_BACKEND_URL=http://localhost:3001 to .env')
    onProgress('Generating similar tracks with AI instead...')
    const urlHint = url.split('/').filter(Boolean).pop()?.replace(/-/g, ' ') ?? 'popular'
    return generatePlaylistFromPrompt(urlHint, onProgress)
  }

  onProgress('Connecting to backend...')
  const res = await fetch(`${BACKEND}/api/import`, {   // ← fixed: /api/import not /api/spotify/import
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`)
  onProgress(`"${data.name}" — ${data.matched}/${data.total} tracks matched on YouTube`)
  return {
    id: `import-${Date.now()}`,
    name: data.name,
    cover: data.cover || data.tracks[0]?.albumArt || '',
    tracks: data.tracks as Track[],
    createdAt: new Date().toISOString(),
  }
}

async function buildFromPairs(
  pairs: { title: string; artist: string }[],
  name: string,
  onProgress: (msg: string) => void
): Promise<Playlist> {
  onProgress(`Searching YouTube for ${pairs.length} tracks...`)
  const results = await Promise.allSettled(
    pairs.map(p => searchYouTube(`${p.title} ${p.artist} official audio`, 1))
  )
  const tracks: Track[] = results.map((r, i) =>
    r.status === 'fulfilled' && r.value[0]
      ? r.value[0]
      : {
          id: `fb-${i}`,
          title: pairs[i].title,
          artist: pairs[i].artist,
          albumArt: `https://picsum.photos/seed/${i}/120/120`,
          duration: 200,
          youtubeId: undefined,
        } satisfies Track
  )
  onProgress('Done!')
  return {
    id: `pl-${Date.now()}`,
    name: name.slice(0, 40) || 'Playlist',
    cover: tracks.find(t => t.albumArt && !t.albumArt.includes('picsum'))?.albumArt ?? '',
    tracks,
    createdAt: new Date().toISOString(),
  }
}

function getFallbackPairs(hint: string) {
  const h = hint.toLowerCase()
  if (h.includes('workout') || h.includes('gym')) return [
    { title: 'Rockstar', artist: 'Post Malone' },
    { title: 'SICKO MODE', artist: 'Travis Scott' },
    { title: 'Power', artist: 'Kanye West' },
    { title: 'HUMBLE.', artist: 'Kendrick Lamar' },
    { title: 'Blinding Lights', artist: 'The Weeknd' },
    { title: 'Industry Baby', artist: 'Lil Nas X' },
  ]
  if (h.includes('chill') || h.includes('lofi') || h.includes('focus')) return [
    { title: 'Clair de Lune', artist: 'Claude Debussy' },
    { title: 'Experience', artist: 'Ludovico Einaudi' },
    { title: 'Holocene', artist: 'Bon Iver' },
    { title: 'Intro', artist: 'The xx' },
    { title: 'Night Owl', artist: 'Galimatias' },
    { title: 'Gymnopédie No.1', artist: 'Erik Satie' },
  ]
  if (h.includes('sad') || h.includes('heartbreak')) return [
    { title: 'Someone Like You', artist: 'Adele' },
    { title: 'The Night We Met', artist: 'Lord Huron' },
    { title: 'Skinny Love', artist: 'Bon Iver' },
    { title: 'All I Want', artist: 'Kodaline' },
    { title: 'Exile', artist: 'Taylor Swift' },
    { title: 'Slow Dancing in the Dark', artist: 'Joji' },
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