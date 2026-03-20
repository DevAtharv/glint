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
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 32px', position: 'sticky', top: 0, background: 'rgba(0,0,0,.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,.07)', zIndex: 10, flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={() => history.back()} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 6, width: 30, height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'rgba(255,255,255,.5)' }}>arrow_back</span>
        </button>
        <button style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 6, width: 30, height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'rgba(255,255,255,.5)' }}>arrow_forward</span>
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', flex: '0 1 280px' }}>
        <span className="material-symbols-outlined" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: 'rgba(255,255,255,.25)', pointerEvents: 'none' }}>search</span>
        <input onFocus={() => onNavigate('search')} placeholder="Search tracks, artists..."
          style={{ width: '100%', background: 'var(--bg-mid)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 40, padding: '8px 14px 8px 36px', color: '#e2e2e2', fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none' }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {isDemo && <span style={{ fontSize: 10, color: 'var(--yellow)', background: 'rgba(245,166,35,.1)', padding: '3px 8px', borderRadius: 20, border: '1px solid rgba(245,166,35,.2)', fontWeight: 700 }}>Demo</span>}
        <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 22, color: 'rgba(255,255,255,.45)' }}>notifications</span>
        </button>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 22, color: 'rgba(255,255,255,.45)' }}>settings</span>
        </button>
        <div onClick={() => onNavigate('profile')} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,230,40,.2)', border: '1px solid rgba(0,230,40,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--primary)', cursor: 'pointer' }}>
          {initials}
        </div>
      </div>
    </header>
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

  if (loading) return (
    <div style={{ height: '100vh', background: '#131313', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, background: 'var(--primary)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#000', fontVariationSettings: "'FILL' 1" }}>music_note</span>
        </div>
        <span style={{ fontSize: 24, fontWeight: 900, color: '#4ade80', letterSpacing: '-0.03em' }}>Glint</span>
      </div>
      <div style={{ width: 22, height: 22, border: '2px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
    </div>
  )

  if (!activeUser) return <AuthPage onAuth={() => setGuestMode(true)} isDemo={isDemo} />

  const pageContent = () => {
    if (editingPlaylist) return <EditPlaylistPage playlist={editingPlaylist} onSave={pl => { setPlaylists(p => p.map(x => x.id === pl.id ? pl : x)); setEditingPlaylist(null) }} onBack={() => setEditingPlaylist(null)} onPlay={player.playTrack} currentTrack={player.currentTrack} />
    switch (page) {
      case 'home':    return <HomePage onPlay={player.playTrack} currentTrack={player.currentTrack} onNavigate={p => setPage(p)} />
      case 'search':  return <SearchPage onPlay={player.playTrack} currentTrack={player.currentTrack} />
      case 'library': return <LibraryPage liked={liked} playlists={playlists} onPlay={player.playTrack} currentTrack={player.currentTrack} onLike={handleLike} onEditPlaylist={pl => setEditingPlaylist(pl)} />
      case 'import':  return <ImportPage onSavePlaylist={handleSavePlaylist} onPlay={player.playTrack} currentTrack={player.currentTrack} />
      case 'profile': return <ProfilePage liked={liked} playlists={playlists} onPlay={player.playTrack} currentTrack={player.currentTrack} />
      default: return null
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '256px 1fr', gridTemplateRows: '1fr 80px', height: '100vh', overflow: 'hidden' }}>
      <Sidebar currentPage={page} onNavigate={setPage} playlists={playlists} onPlayPlaylist={pl => pl.tracks[0] && player.playTrack(pl.tracks[0], pl.tracks)} currentTrack={player.currentTrack} />
      <main style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
        <TopBar onNavigate={setPage} />
        <div style={{ flex: 1, overflowY: 'auto' }} key={page}>{pageContent()}</div>
      </main>
      <PlayerBar track={player.currentTrack} isPlaying={player.isPlaying} progress={player.progress} currentSecs={player.currentSecs} shuffle={player.shuffle} repeat={player.repeat} liked={isLiked} volume={player.volume} onTogglePlay={player.togglePlay} onNext={player.next} onPrev={player.prev} onSeek={player.seek} onShuffle={() => player.setShuffle(s => !s)} onRepeat={() => player.setRepeat(r => !r)} onLike={handleLike} onVolumeChange={player.setVolume} />
    </div>
  )
}

export default function App() {
  return <AuthProvider><GlintApp /></AuthProvider>
}
