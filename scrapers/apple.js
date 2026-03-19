import * as cheerio from 'cheerio'

export async function scrapeAppleMusic(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    })

    if (!res.ok) throw new Error(`Apple Music returned ${res.status}`)
    const html = await res.text()
    const $ = cheerio.load(html)

    // Apple Music embeds playlist data in a <script type="application/ld+json"> tag
    let tracks = []
    let name = 'Apple Music Playlist'
    let cover = null

    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const data = JSON.parse($(el).html())
        if (data['@type'] === 'MusicPlaylist' || data.name) {
          name = data.name || name
          cover = data.image || cover
          const items = data.track || data.tracks || []
          for (const t of items) {
            tracks.push({
              title: t.name || t['@name'] || '',
              artist: t.byArtist?.name || t.artist || 'Unknown',
              albumArt: t.image || null,
              durationMs: 0,
            })
          }
        }
      } catch { /**/ }
    })

    // Try Next.js __NEXT_DATA__ JSON
    if (tracks.length === 0) {
      const nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)
      if (nextDataMatch) {
        try {
          const data = JSON.parse(nextDataMatch[1])
          const props = data?.props?.pageProps
          const plData = props?.data || props?.content || {}
          name = plData.name || plData.title || name
          cover = plData.artwork?.url?.replace('{w}', '300').replace('{h}', '300').replace('{f}', 'jpg') || cover

          const trackList = plData.tracks || plData.relationships?.tracks?.data || []
          for (const t of trackList) {
            const attrs = t.attributes || t
            tracks.push({
              title: attrs.name || '',
              artist: attrs.artistName || 'Unknown',
              albumArt: attrs.artwork?.url?.replace('{w}', '120').replace('{h}', '120').replace('{f}', 'jpg') || null,
              durationMs: attrs.durationInMillis || 0,
            })
          }
        } catch { /**/ }
      }
    }

    // Last resort: scrape visible track names from DOM
    if (tracks.length === 0) {
      $('[class*="track"], [class*="song"]').each((_, el) => {
        const title = $(el).find('[class*="title"], [class*="name"]').first().text().trim()
        const artist = $(el).find('[class*="artist"], [class*="subtitle"]').first().text().trim()
        if (title.length > 1) {
          tracks.push({ title, artist: artist || 'Unknown', albumArt: null, durationMs: 0 })
        }
      })
    }

    if (tracks.length === 0) {
      throw new Error('Could not extract tracks. Apple Music playlists require JavaScript to render.')
    }

    return { platform: 'Apple Music', name, cover, owner: 'Apple Music', total: tracks.length, tracks }
  } catch (e) {
    throw new Error(`Apple Music scrape failed: ${e.message}`)
  }
}
