export type Page = 'home' | 'search' | 'library' | 'import' | 'profile'

export interface Track {
  id: string
  title: string
  artist: string
  albumArt: string
  duration: number
  youtubeId: string
}

export interface Playlist {
  id: string
  name: string
  cover: string
  tracks: Track[]
  userId?: string
  createdAt?: string // <--- ADDED THIS TO FIX THE ERROR
}