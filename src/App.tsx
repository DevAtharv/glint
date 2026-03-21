import React, { useState, useEffect, useCallback } from 'react'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { usePlayer } from './hooks/usePlayer'
import { useYouTubePlayer } from './hooks/useYouTubePlayer'
import Sidebar from './components/Sidebar'
import PlayerBar from './components/PlayerBar'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import LibraryPage from './pages/LibraryPage'
import ImportPage from './pages/ImportPage'
import ProfilePage from './pages/ProfilePage'
import EditPlaylistPage from './pages/EditPlaylistPage'
import type { Page, Track, Playlist } from './types'
import { savePlaylists, loadPlaylists, saveLiked, loadLiked } from './services/supabase'

const GUEST_USER = {
  id: 'guest',
  email: 'guest@glint.app',
  name: 'Guest',
  memberType: 'Free' as const,
}

function GlintApp() {
  const { user, loading, isDemo } = useAuth()
  const [page, setPage] = useState<Page>('home')
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [liked, setLiked] = useState<Track[]>([])
  const [guestMode, setGuestMode] = useState(false)
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null)

  const player = usePlayer()
  const activeUser = user ?? (guestMode ? GUEST_USER : null)

  useYouTubePlayer({
    videoId: player.currentTrack?.youtubeId ?? null,
    isPlaying: player.isPlaying,
    volume: player.volume,
    onProgress: player.handleProgress,
    onDuration: player.handleDuration,
    onEnded: player.handleEnded,
    seekTo: player.seekTo,
  })

  // Load data
  useEffect(() => {
    if (user && !isDemo) {
      loadPlaylists(user.id).then(d => setPlaylists(d as Playlist[]))
      loadLiked(user.id).then(d => setLiked(d as Track[]))
    }
  }, [user, isDemo])

  // Save playlists
  useEffect(() => {
    if (user && !isDemo) {
      savePlaylists(user.id, playlists)
    }
  }, [playlists, user, isDemo])

  // Save liked
  useEffect(() => {
    if (user && !isDemo) {
      saveLiked(user.id, liked)
    }
  }, [liked, user, isDemo])

  const handleSavePlaylist = useCallback((pl: Playlist) => {
    setPlaylists(prev =>
      prev.find(p => p.id === pl.id)
        ? prev.map(p => (p.id === pl.id ? pl : p))
        : [pl, ...prev]
    )
  }, [])

  const handleLike = useCallback(() => {
    if (!player.currentTrack) return

    const track = player.currentTrack

    setLiked(prev =>
      prev.some(t => t.id === track.id)
        ? prev.filter(t => t.id !== track.id)
        : [track, ...prev]
    )

    player.setLiked(!player.liked)
  }, [player])

  const isLiked = player.currentTrack
    ? liked.some(t => t.id === player.currentTrack!.id)
    : false

  // 🔻 Loading Screen
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#121212] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-green-500 border-t-transparent animate-spin" />
          <p className="text-sm text-gray-400">Loading Glint...</p>
        </div>
      </div>
    )
  }

  // 🔻 Auth
  if (!activeUser) {
    return <AuthPage onAuth={() => setGuestMode(true)} isDemo={isDemo} />
  }

  // 🔻 Page Router
  const pageContent = () => {
    if (editingPlaylist) {
      return (
        <EditPlaylistPage
          playlist={editingPlaylist}
          onSave={pl => {
            setPlaylists(p => p.map(x => (x.id === pl.id ? pl : x)))
            setEditingPlaylist(null)
          }}
          onBack={() => setEditingPlaylist(null)}
          onPlay={player.playTrack}
          currentTrack={player.currentTrack}
        />
      )
    }

    switch (page) {
      case 'home':
        return <HomePage onPlay={player.playTrack} currentTrack={player.currentTrack} onNavigate={setPage} />
      case 'search':
        return <SearchPage onPlay={player.playTrack} currentTrack={player.currentTrack} />
      case 'library':
        return (
          <LibraryPage
            liked={liked}
            playlists={playlists}
            onPlay={player.playTrack}
            currentTrack={player.currentTrack}
            onLike={handleLike}
            onEditPlaylist={setEditingPlaylist}
          />
        )
      case 'import':
        return <ImportPage onSavePlaylist={handleSavePlaylist} onPlay={player.playTrack} currentTrack={player.currentTrack} />
      case 'profile':
        return <ProfilePage liked={liked} playlists={playlists} onPlay={player.playTrack} currentTrack={player.currentTrack} />
      default:
        return <HomePage onPlay={player.playTrack} currentTrack={player.currentTrack} onNavigate={setPage} />
    }
  }

  return (
    <div className="flex h-screen bg-[#121212] text-white overflow-hidden">

      {/* Sidebar */}
      <Sidebar
        currentPage={page}
        onNavigate={setPage}
        playlists={playlists}
        onPlayPlaylist={pl => pl.tracks[0] && player.playTrack(pl.tracks[0], pl.tracks)}
        currentTrack={player.currentTrack}
      />

      {/* Main */}
      <main className="flex flex-1 flex-col overflow-hidden">

        <div className="flex-1 overflow-y-auto">
          {pageContent()}
        </div>

        <PlayerBar
          track={player.currentTrack}
          isPlaying={player.isPlaying}
          progress={player.progress}
          currentSecs={player.currentSecs}
          shuffle={player.shuffle}
          repeat={player.repeat}
          liked={isLiked}
          volume={player.volume}
          onTogglePlay={player.togglePlay}
          onNext={player.next}
          onPrev={player.prev}
          onSeek={player.seek}
          onShuffle={() => player.setShuffle(s => !s)}
          onRepeat={() => player.setRepeat(r => !r)}
          onLike={handleLike}
          onVolumeChange={player.setVolume}
        />
      </main>
    </div>
  )
}
export default function App() {
  return (
    <AuthProvider>
      <GlintApp />
    </AuthProvider>
  )
}