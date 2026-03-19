import * as cheerio from 'cheerio'

export async function scrapeSoundCloud(url) {
  try {
    // SoundCloud oEmbed gives basic info
    const oembedRes = await fetch(
      `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(url)}`,
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    )

    const oembed = oembedRes.ok ? await oembedRes.json() : null
    const name = oembed?.title || 'SoundCloud Playlist'
    const cover = oembed?.thumbnail_url || null

    // Fetch the actual page to scrape tracks
    const pageRes = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html',
      },
    })

    if (!pageRes.ok) throw new Error(`SoundCloud returned ${pageRes.status}`)
    const html = await pageRes.text()
    const $ = cheerio.load(html)

    const tracks = []

    // Try to find track data in page scripts
    $('script').each((_, el) => {
      const content = $(el).html() || ''
      if (content.includes('"tracks"') && content.includes('"title"')) {
        try {
          const jsonMatch = content.match(/\{.*"tracks".*\}/s)
          if (jsonMatch) {
            const data = JSON.parse(jsonMatch[0])
            const tList = data.tracks || []
            for (const t of tList) {
              if (t.title) {
                tracks.push({
                  title: t.title,
                  artist: t.user?.username || t.publisher_metadata?.artist || 'Unknown',
                  albumArt: t.artwork_url || null,
                  durationMs: t.duration || 0,
                })
              }
            }
          }
        } catch { /**/ }
      }
    })

    // DOM fallback
    if (tracks.length === 0) {
      $('.trackList__item, .soundList__item').each((_, el) => {
        const title = $(el).find('.trackItem__trackTitle, .soundTitle__title').first().text().trim()
        const artist = $(el).find('.trackItem__username, .soundTitle__username').first().text().trim()
        if (title) tracks.push({ title, artist: artist || 'Unknown', albumArt: null, durationMs: 0 })
      })
    }

    if (tracks.length === 0) {
      throw new Error('Could not extract tracks from SoundCloud. Try a different playlist URL.')
    }

    return { platform: 'SoundCloud', name, cover, owner: 'SoundCloud', total: tracks.length, tracks }
  } catch (e) {
    throw new Error(`SoundCloud scrape failed: ${e.message}`)
  }
}
