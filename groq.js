const GROQ_API_KEY = process.env.GROQ_API_KEY
const GROQ_BASE = 'https://api.groq.com/openai/v1'

export async function groqChat(prompt) {
  if (!GROQ_API_KEY) {
    console.log('[groq] No API key — using fallback tracks')
    return getFallbackPairs(prompt)
  }

  const res = await fetch(`${GROQ_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'system',
          content: `You are an expert music curator. Given a mood or description, suggest exactly 8 real songs.
Return ONLY a JSON array like: [{"title":"Song Name","artist":"Artist Name"},...]
No explanation. Just JSON.`,
        },
        { role: 'user', content: `Create a playlist for: ${prompt}` },
      ],
      temperature: 0.8,
      max_tokens: 512,
    }),
  })

  if (!res.ok) throw new Error(`Groq API error: ${res.status}`)
  const data = await res.json()
  const text = data.choices?.[0]?.message?.content ?? ''

  try {
    const match = text.match(/\[[\s\S]*\]/)
    if (match) return JSON.parse(match[0])
  } catch { /* fall through */ }

  return getFallbackPairs(prompt)
}

function getFallbackPairs(prompt) {
  const p = prompt.toLowerCase()
  if (p.includes('workout') || p.includes('gym') || p.includes('energy')) return [
    { title: 'Rockstar', artist: 'Post Malone' },
    { title: 'SICKO MODE', artist: 'Travis Scott' },
    { title: 'Power', artist: 'Kanye West' },
    { title: 'HUMBLE.', artist: 'Kendrick Lamar' },
    { title: "God's Plan", artist: 'Drake' },
    { title: 'Blinding Lights', artist: 'The Weeknd' },
    { title: 'Industry Baby', artist: 'Lil Nas X' },
    { title: 'Gasoline', artist: 'The Weeknd' },
  ]
  if (p.includes('focus') || p.includes('study')) return [
    { title: 'Clair de Lune', artist: 'Claude Debussy' },
    { title: 'Experience', artist: 'Ludovico Einaudi' },
    { title: 'Holocene', artist: 'Bon Iver' },
    { title: 'On the Nature of Daylight', artist: 'Max Richter' },
    { title: 'Weightless', artist: 'Marconi Union' },
    { title: 'Gymnopédie No.1', artist: 'Erik Satie' },
    { title: 'Intro', artist: 'The xx' },
    { title: 'Night Owl', artist: 'Galimatias' },
  ]
  if (p.includes('sad') || p.includes('heartbreak')) return [
    { title: 'Someone Like You', artist: 'Adele' },
    { title: 'The Night We Met', artist: 'Lord Huron' },
    { title: 'Skinny Love', artist: 'Bon Iver' },
    { title: 'All I Want', artist: 'Kodaline' },
    { title: 'Exile', artist: 'Taylor Swift' },
    { title: 'Liability', artist: 'Lorde' },
    { title: 'Motion Picture Soundtrack', artist: 'Radiohead' },
    { title: 'Superstar', artist: 'Sheryl Crow' },
  ]
  return [
    { title: 'Midnight City', artist: 'M83' },
    { title: 'Nightcall', artist: 'Kavinsky' },
    { title: 'Take Me to Church', artist: 'Hozier' },
    { title: 'Electric Feel', artist: 'MGMT' },
    { title: 'Do I Wanna Know?', artist: 'Arctic Monkeys' },
    { title: 'Cruel Summer', artist: 'Taylor Swift' },
    { title: 'Heat Waves', artist: 'Glass Animals' },
    { title: 'Levitating', artist: 'Dua Lipa' },
  ]
}
