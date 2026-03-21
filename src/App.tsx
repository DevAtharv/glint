import React, { useState, useEffect, useCallback } from 'react'
import { BrowserRouter } from 'react-router-dom'
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

const GUEST_USER = { id: 'guest', email: 'guest@glint.app', name: 'Guest', memberType: 'Free' as const }

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

  useEffect(() => {
    if (user && !isDemo) {
      loadPlaylists(user.id).then(d => setPlaylists(d as Playlist[]))
      loadLiked(user.id).then(d => setLiked(d as Track[]))
    }
  }, [user, isDemo])

  useEffect(() => {
    if (user && !isDemo && playlists.length > 0) {
      savePlaylists(user.id, playlists)
    }
  }, [playlists, user, isDemo])

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
      prev.find(t => t.id === track.id)
        ? prev.filter(t => t.id !== track.id)
        : [track, ...prev]
    )
    player.setLiked(!player.liked)
  }, [player])

  const isLiked = player.currentTrack ? liked.some(t => t.id === player.currentTrack!.id) : false

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0B0D12]">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500">
            <span
              className="material-symbols-outlined text-2xl text-black"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              music_note
            </span>
          </div>
          <span className="text-xl font-black text-[#EEF0FF]">Glint</span>
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
        </div>
      </div>
    )
  }

  if (!activeUser) {
    return <AuthPage onAuth={() => setGuestMode(true)} isDemo={isDemo} />
  }

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
        return <HomePage onPlay={player.playTrack} currentTrack={player.currentTrack} onNavigate={p => setPage(p)} />
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
            onEditPlaylist={pl => setEditingPlaylist(pl)}
          />
        )
      case 'import':
        return <ImportPage onSavePlaylist={handleSavePlaylist} onPlay={player.playTrack} currentTrack={player.currentTrack} />
      case 'profile':
        return <ProfilePage liked={liked} playlists={playlists} onPlay={player.playTrack} currentTrack={player.currentTrack} />
      default:
        return <HomePage onPlay={player.playTrack} currentTrack={player.currentTrack} onNavigate={p => setPage(p)} />
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B0D12] text-[#EEF0FF]">
      <Sidebar
        currentPage={page}
        onNavigate={setPage}
        playlists={playlists}
        onPlayPlaylist={pl => pl.tracks[0] && player.playTrack(pl.tracks[0], pl.tracks)}
        currentTrack={player.currentTrack}
      />

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#0B0D12]">
        <div className="min-h-0 flex-1 overflow-y-auto">
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
    <BrowserRouter>
      <AuthProvider>
        <GlintApp />
      </AuthProvider>
    </BrowserRouter>
  )
}
