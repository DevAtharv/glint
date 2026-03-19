export interface Track {
  id: string
  title: string
  artist: string
  albumArt: string
  duration: number
  youtubeId?: string
  plays?: string
}

export interface Playlist {
  id: string
  name: string
  cover: string
  tracks: Track[]
  createdAt: string
}

export interface User {
  id: string
  email: string
  name: string
  memberType: 'Free' | 'Gold' | 'Premium'
}

export type Page = 'home' | 'search' | 'library' | 'import' | 'profile'
