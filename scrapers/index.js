import { scrapeSpotify } from './spotify.js'
import { scrapeAppleMusic } from './apple.js'
import { scrapeSoundCloud } from './soundcloud.js'
import { scrapeYouTubePlaylist } from './youtube.js'

export async function scrapePlaylist(url) {
  if (url.includes('spotify.com')) return scrapeSpotify(url)
  if (url.includes('music.apple.com')) return scrapeAppleMusic(url)
  if (url.includes('soundcloud.com')) return scrapeSoundCloud(url)
  if (url.includes('youtube.com') || url.includes('youtu.be')) return scrapeYouTubePlaylist(url)
  throw new Error(`Unsupported platform. Supported: Spotify, Apple Music, SoundCloud, YouTube`)
}
