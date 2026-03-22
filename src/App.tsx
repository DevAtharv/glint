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
  const [guestMode, setGuestMode] = useState(false)
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null)
  
  const [isFullscreen, setIsFullscreen] = useState(false)

  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    const saved = localStorage.getItem('glint-playlists')
    return saved ? JSON.parse(saved) : []
  })
  
  const [liked, setLiked] = useState<Track[]>(() => {
    const saved = localStorage.getItem('glint-liked')
    return saved ? JSON.parse(saved) : []
  })

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
    containerId: 'youtube-main-player' 
  })

  useEffect(() => {
    localStorage.setItem('glint-playlists', JSON.stringify(playlists))
    if (user && !isDemo) savePlaylists(user.id, playlists)
  }, [playlists, user, isDemo])

  useEffect(() => {
    localStorage.setItem('glint-liked', JSON.stringify(liked))
    if (user && !isDemo) saveLiked(user.id, liked)
  }, [liked, user, isDemo])

  useEffect(() => {
    if (user && !isDemo) {
      loadPlaylists(user.id).then(d => {
        if (d && (d as Playlist[]).length > 0) setPlaylists(d as Playlist[])
      })
      loadLiked(user.id).then(d => {
        if (d && (d as Track[]).length > 0) setLiked(d as Track[])
      })
    }
  }, [user, isDemo])

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

  const isLiked = player.currentTrack ? liked.some(t => t.id === player.currentTrack!.id) : false

  if (loading) return <div className="flex h-screen items-center justify-center bg-[#121212] text-white">Loading...</div>
  if (!activeUser) return <AuthPage onAuth={() => setGuestMode(true)} isDemo={isDemo} />

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
      case 'home': return <HomePage onPlay={player.playTrack} currentTrack={player.currentTrack} onNavigate={setPage} />
      case 'search': return <SearchPage onPlay={player.playTrack} currentTrack={player.currentTrack} />
      case 'library': return <LibraryPage liked={liked} playlists={playlists} onPlay={player.playTrack} currentTrack={player.currentTrack} onLike={handleLike} onEditPlaylist={setEditingPlaylist} onPlayPlaylist={pl => pl.tracks?.[0] && player.playTrack(pl.tracks[0], pl.tracks)} onNavigate={setPage} />
      case 'import': return <ImportPage onSavePlaylist={handleSavePlaylist} onPlay={player.playTrack} currentTrack={player.currentTrack} onNavigate={setPage} />
      case 'profile': return <ProfilePage liked={liked} playlists={playlists} onPlay={player.playTrack} currentTrack={player.currentTrack} />
      default: return <HomePage onPlay={player.playTrack} currentTrack={player.currentTrack} onNavigate={setPage} />
    }
  }

  return (
    <div className="flex h-screen bg-[#121212] text-white overflow-hidden relative">
      
      <div 
        className={`transition-all duration-500 overflow-hidden ${
          isFullscreen 
            ? 'fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-3xl' 
            : 'absolute top-0 left-0 w-[250px] h-[250px] opacity-0 pointer-events-none -z-50'
        }`}
      >
        <div 
          id="youtube-main-player" 
          className={`transition-all duration-500 ${
            isFullscreen ? 'w-full max-w-5xl aspect-video rounded-3xl shadow-[0_0_100px_rgba(0,230,40,0.2)] border border-white/10' : 'w-full h-full'
          }`}
        />
        
        {isFullscreen && (
          <div className="mt-8 flex flex-col items-center gap-4">
            <h2 className="text-2xl font-black text-white">{player.currentTrack?.title}</h2>
            <button 
              onClick={() => setIsFullscreen(false)}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-full text-sm font-bold backdrop-blur-md transition-colors border border-white/10"
            >
              ✕ Close Video
            </button>
          </div>
        )}
      </div>

      <Sidebar 
        currentPage={page} 
        onNavigate={setPage} 
        playlists={playlists} 
        liked={liked} // <--- Added this line
        onPlayPlaylist={pl => pl.tracks?.[0] && player.playTrack(pl.tracks[0], pl.tracks)} 
        currentTrack={player.currentTrack} 
      />

      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">{pageContent()}</div>
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
          isFullscreen={isFullscreen}
          onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
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