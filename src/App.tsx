import React, { useState, useEffect, useCallback } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
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
  const initials = (user?.name || 'Guest').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

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

  useEffect(() => { if (user && !isDemo && playlists.length > 0) savePlaylists(user.id, playlists) }, [playlists, user, isDemo])
  useEffect(() => { if (user && !isDemo) saveLiked(user.id, liked) }, [liked, user, isDemo])

  const handleSavePlaylist = useCallback((pl: Playlist) => {
    setPlaylists(prev => prev.find(p => p.id === pl.id) ? prev.map(p => p.id === pl.id ? pl : p) : [pl, ...prev])
  }, [])

  const handleLike = useCallback(() => {
    if (!player.currentTrack) return
    const track = player.currentTrack
    setLiked(prev => prev.find(t => t.id === track.id) ? prev.filter(t => t.id !== track.id) : [track, ...prev])
    player.setLiked(!player.liked)
  }, [player])

  const isLiked = player.currentTrack ? liked.some(t => t.id === player.currentTrack!.id) : false

  if (loading) {
    return (
      <div style={{ height: '100vh', background: '#0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, background: '#00e628', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 22, color: '#000', fontVariationSettings: "'FILL' 1" }}>music_note</span>
          </div>
          <span style={{ fontSize: 28, fontWeight: 800, color: '#4ade80', letterSpacing: '-0.02em' }}>Glint</span>
        </div>
        <div style={{ width: 24, height: 24, border: '2px solid #00e628', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
      </div>
    )
  }

  if (!activeUser) {
    return <AuthPage onAuth={() => setGuestMode(true)} isDemo={isDemo} />
  }

  const pageContent = () => {
    if (editingPlaylist) return <EditPlaylistPage playlist={editingPlaylist} onSave={pl => { setPlaylists(p => p.map(x => x.id === pl.id ? pl : x)); setEditingPlaylist(null) }} onBack={() => setEditingPlaylist(null)} onPlay={player.playTrack} currentTrack={player.currentTrack} />
    switch (page) {
      case 'home':    return <HomePage onPlay={player.playTrack} currentTrack={player.currentTrack} onNavigate={p => setPage(p)} />
      case 'search':  return <SearchPage onPlay={player.playTrack} currentTrack={player.currentTrack} />
      case 'library': return <LibraryPage liked={liked} playlists={playlists} onPlay={player.playTrack} currentTrack={player.currentTrack} onLike={handleLike} onEditPlaylist={pl => setEditingPlaylist(pl)} />
      case 'import':  return <ImportPage onSavePlaylist={handleSavePlaylist} onPlay={player.playTrack} currentTrack={player.currentTrack} />
      case 'profile': return <ProfilePage liked={liked} playlists={playlists} onPlay={player.playTrack} currentTrack={player.currentTrack} />
      default:        return <HomePage onPlay={player.playTrack} currentTrack={player.currentTrack} onNavigate={p => setPage(p)} />
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gridTemplateRows: '1fr 72px', height: '100vh', overflow: 'hidden' }}>
      <Sidebar currentPage={page} onNavigate={setPage} playlists={playlists} onPlayPlaylist={pl => pl.tracks[0] && player.playTrack(pl.tracks[0], pl.tracks)} currentTrack={player.currentTrack} />
      <main style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#0f0f0f' }}>
        <div style={{ flex: 1, overflowY: 'auto' }}>{pageContent()}</div>
      </main>
      <PlayerBar track={player.currentTrack} isPlaying={player.isPlaying} progress={player.progress} currentSecs={player.currentSecs} shuffle={player.shuffle} repeat={player.repeat} liked={isLiked} volume={player.volume} onTogglePlay={player.togglePlay} onNext={player.next} onPrev={player.prev} onSeek={player.seek} onShuffle={() => player.setShuffle(s => !s)} onRepeat={() => player.setRepeat(r => !r)} onLike={handleLike} onVolumeChange={player.setVolume} />
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
