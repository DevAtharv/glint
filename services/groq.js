const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function groqGenerate(prompt) {
  if (!GROQ_API_KEY) return getFallback(prompt)

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: `You are a music expert. Suggest 8 real songs matching the user's description.
Return ONLY a JSON array, no markdown, no explanation:
[{"title":"Song Name","artist":"Artist Name"},...]`,
          },
          { role: 'user', content: `Playlist for: ${prompt}` },
        ],
        temperature: 0.8,
        max_tokens: 600,
      }),
    })

    if (!res.ok) throw new Error(`Groq ${res.status}`)
    const data = await res.json()
    const text = data.choices?.[0]?.message?.content ?? ''
    const parsed = parseJSON(text)
    if (parsed.length > 0) return parsed
  } catch (e) {
    console.warn('[groq] error:', e.message, '— using fallback')
  }

  return getFallback(prompt)
}

function parseJSON(text) {
  try {
    const match = text.match(/\[[\s\S]*?\]/)
    if (match) {
      const arr = JSON.parse(match[0])
      if (Array.isArray(arr) && arr[0]?.title) return arr
    }
  } catch { /**/ }
  return []
}

function getFallback(hint) {
  const h = (hint || '').toLowerCase()
  if (h.includes('workout') || h.includes('gym') || h.includes('energy')) return [
    { title: 'Rockstar', artist: 'Post Malone' },
    { title: 'Power', artist: 'Kanye West' },
    { title: 'HUMBLE.', artist: 'Kendrick Lamar' },
    { title: "God's Plan", artist: 'Drake' },
    { title: 'Blinding Lights', artist: 'The Weeknd' },
    { title: 'Industry Baby', artist: 'Lil Nas X' },
    { title: 'SICKO MODE', artist: 'Travis Scott' },
    { title: 'Numb', artist: 'Linkin Park' },
  ]
  if (h.includes('focus') || h.includes('study') || h.includes('lofi') || h.includes('chill')) return [
    { title: 'Clair de Lune', artist: 'Claude Debussy' },
    { title: 'Experience', artist: 'Ludovico Einaudi' },
    { title: 'Holocene', artist: 'Bon Iver' },
    { title: 'On the Nature of Daylight', artist: 'Max Richter' },
    { title: 'Intro', artist: 'The xx' },
    { title: 'Night Owl', artist: 'Galimatias' },
    { title: 'Gymnopédie No.1', artist: 'Erik Satie' },
    { title: 'Sleepless', artist: 'Flume' },
  ]
  if (h.includes('sad') || h.includes('heartbreak')) return [
    { title: 'Someone Like You', artist: 'Adele' },
    { title: 'The Night We Met', artist: 'Lord Huron' },
    { title: 'Skinny Love', artist: 'Bon Iver' },
    { title: 'All I Want', artist: 'Kodaline' },
    { title: 'Exile', artist: 'Taylor Swift' },
    { title: 'Liability', artist: 'Lorde' },
    { title: 'Slow Dancing in the Dark', artist: 'Joji' },
    { title: 'Motion Picture Soundtrack', artist: 'Radiohead' },
  ]
  return [
    { title: 'Midnight City', artist: 'M83' },
    { title: 'Nightcall', artist: 'Kavinsky' },
    { title: 'Do I Wanna Know?', artist: 'Arctic Monkeys' },
    { title: 'Heat Waves', artist: 'Glass Animals' },
    { title: 'Levitating', artist: 'Dua Lipa' },
    { title: 'As It Was', artist: 'Harry Styles' },
    { title: 'Cruel Summer', artist: 'Taylor Swift' },
    { title: 'Take Me to Church', artist: 'Hozier' },
  ]
}
