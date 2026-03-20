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

const GUEST_USER = { id: 'guest', email: 'guest@glint.app', name: 'Guest', memberType: 'Free' as const }

function TopBar({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const { user, isDemo } = useAuth()
  const displayUser = user ?? GUEST_USER
  const initials = displayUser.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', position: 'sticky', top: 0, background: 'linear-gradient(180deg,#131313 70%,transparent)', zIndex: 10 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <button style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#888"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        </button>
        <button style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#888"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
        </button>
      </div>
      <div style={{ position: 'relative', width: 260 }}>
        <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="14" height="14" viewBox="0 0 24 24" fill="#474747">
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        <input onFocus={() => onNavigate('search')} placeholder="Search songs, artists..."
          style={{ width: '100%', background: '#1b1b1b', border: '1px solid rgba(255,255,255,.06)', borderRadius: 10, padding: '9px 14px 9px 36px', color: '#e2e2e2', fontSize: 13, fontFamily: "'Inter',sans-serif", outline: 'none' }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(0,230,40,.1)', color: '#00e628', padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(0,230,40,.15)' }}>Ad-free</span>
        {isDemo && <span style={{ fontSize: 10, color: '#f5a623', background: 'rgba(245,166,35,.1)', padding: '3px 8px', borderRadius: 20, border: '1px solid rgba(245,166,35,.2)' }}>Demo</span>}
        <div onClick={() => onNavigate('profile')} style={{ width: 34, height: 34, borderRadius: '50%', background: '#00e628', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#000', cursor: 'pointer' }}>
          {initials}
        </div>
      </div>
    </div>
  )
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

  // Wire up the real YouTube audio player
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
    if (user && !isDemo && playlists.length > 0) savePlaylists(user.id, playlists)
  }, [playlists, user, isDemo])

  useEffect(() => {
    if (user && !isDemo) saveLiked(user.id, liked)
  }, [liked, user, isDemo])

  const handleSavePlaylist = useCallback((pl: Playlist) => {
    setPlaylists(prev => prev.find(p => p.id === pl.id) ? prev.map(p => p.id === pl.id ? pl : p) : [pl, ...prev])
  }, [])

  const handleLike = useCallback(() => {
    if (!player.currentTrack) return
    const track = player.currentTrack
    setLiked(prev => prev.find(t => t.id === track.id) ? prev.filter(t => t.id !== track.id) : [track, ...prev])
    player.setLiked(!player.liked)
  }, [player])

  const handlePlayPlaylist = useCallback((pl: Playlist) => {
    if (pl.tracks.length > 0) player.playTrack(pl.tracks[0], pl.tracks)
  }, [player])

  const handleEditPlaylist = useCallback((pl: Playlist) => {
    setEditingPlaylist(pl)
  }, [])

  const handleUpdatePlaylist = useCallback((pl: Playlist) => {
    setPlaylists(prev => prev.map(p => p.id === pl.id ? pl : p))
    setEditingPlaylist(null)
  }, [])

  const isLiked = player.currentTrack ? liked.some(t => t.id === player.currentTrack!.id) : false

  if (loading) {
    return (
      <div style={{ height: '100vh', background: '#080A0F', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#6C63FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
          </div>
          <span style={{ fontFamily: "'Instrument Serif',serif", fontSize: 24, color: '#EEF0FF' }}>Gl<em style={{ fontStyle: 'italic', color: '#8B85FF' }}>i</em>nt</span>
        </div>
        <div style={{ width: 24, height: 24, border: '2px solid #6C63FF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
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
          onSave={handleUpdatePlaylist}
          onBack={() => setEditingPlaylist(null)}
          onPlay={player.playTrack}
          currentTrack={player.currentTrack}
        />
      )
    }
    
    switch (page) {
      case 'home':    return <HomePage onPlay={player.playTrack} currentTrack={player.currentTrack} onNavigate={p => setPage(p)} />
      case 'search':  return <SearchPage onPlay={player.playTrack} currentTrack={player.currentTrack} />
      case 'library': return (
        <LibraryPage
          liked={liked}
          playlists={playlists}
          onPlay={player.playTrack}
          currentTrack={player.currentTrack}
          onLike={handleLike}
          onEditPlaylist={handleEditPlaylist}
        />
      )
      case 'import':  return <ImportPage onSavePlaylist={handleSavePlaylist} onPlay={player.playTrack} currentTrack={player.currentTrack} />
      case 'profile': return <ProfilePage liked={liked} playlists={playlists} onPlay={player.playTrack} currentTrack={player.currentTrack} />
      default:        return null
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gridTemplateRows: '1fr 88px', height: '100vh', overflow: 'hidden' }}>
      <Sidebar currentPage={page} onNavigate={setPage} playlists={playlists} onPlayPlaylist={handlePlayPlaylist} currentTrack={player.currentTrack} />
      <main style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#080A0F' }}>
        <TopBar onNavigate={setPage} />
        <div style={{ flex: 1, overflowY: 'auto' }} key={page}>
          {pageContent()}
        </div>
      </main>
      <PlayerBar
        track={player.currentTrack}
        isPlaying={player.isPlaying}
        progress={player.progress}
        currentSecs={player.currentSecs}
        shuffle={player.shuffle}
        repeat={player.repeat}
        liked={isLiked}
        onTogglePlay={player.togglePlay}
        onNext={player.next}
        onPrev={player.prev}
        onSeek={player.seek}
        onShuffle={() => player.setShuffle(s => !s)}
        onRepeat={() => player.setRepeat(r => !r)}
        onLike={handleLike}
        volume={player.volume}
        onVolumeChange={player.setVolume}
      />
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
