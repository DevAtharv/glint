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

function GlintApp() {
  const { user, loading, isDemo } = useAuth()
  const [page, setPage] = useState<Page>('home')
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  // 🛠 Added state to handle editing
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null)
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [liked, setLiked] = useState<Track[]>([])
  
  const player = usePlayer()

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
    if (user && !isDemo) {
      loadPlaylists(user.id).then((d: any) => { if (d) setPlaylists(d as Playlist[]) })
      loadLiked(user.id).then((d: any) => { if (d) setLiked(d as Track[]) })
    }
  }, [user, isDemo])

  useEffect(() => {
    if (user && !isDemo) { 
      savePlaylists(user.id, playlists); 
      saveLiked(user.id, liked); 
    }
  }, [playlists, liked, user, isDemo])

  const handleNavigate = (newPage: Page) => {
    setEditingPlaylist(null) // Close editor if navigating away
    setPage(newPage)
  }

  const handleLike = useCallback(() => {
    if (!player.currentTrack) return
    const track = player.currentTrack
    setLiked(prev => prev.some(t => t.id === track.id) ? prev.filter(t => t.id !== track.id) : [track, ...prev])
    player.setLiked(!player.liked)
  }, [player.currentTrack, player.liked, player.setLiked])

  const isLiked = player.currentTrack ? liked.some(t => t.id === player.currentTrack!.id) : false

  if (loading) return <div className="h-screen bg-black flex items-center justify-center text-[#00e628] font-black text-2xl animate-pulse">GLINT</div>
  if (!user && !isDemo) return <AuthPage onAuth={() => {}} isDemo={false} />

  const renderPage = () => {
    // 🛠 Render EditPlaylistPage if a playlist is selected for editing
    if (editingPlaylist) {
      return (
        <EditPlaylistPage 
          playlist={editingPlaylist} 
          onSave={(updatedPlaylist) => {
            setPlaylists(prev => prev.map(p => p.id === updatedPlaylist.id ? updatedPlaylist : p))
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
        return <HomePage onPlay={player.playTrack} currentTrack={player.currentTrack} onNavigate={handleNavigate} likedCount={liked.length} />
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
            onEditPlaylist={setEditingPlaylist} // 🛠 Passed edit function
            onDeletePlaylist={(id) => setPlaylists(prev => prev.filter(p => p.id !== id))} // 🛠 Passed delete function
            onPlayPlaylist={pl => pl.tracks?.[0] && player.playTrack(pl.tracks[0], pl.tracks)} 
            onNavigate={handleNavigate} 
          />
        )
      case 'import': 
        return <ImportPage onSavePlaylist={p => setPlaylists(prev => [p, ...prev])} onPlay={player.playTrack} currentTrack={player.currentTrack} onNavigate={handleNavigate} />
      case 'profile': 
        return <ProfilePage liked={liked} playlists={playlists} onPlay={player.playTrack} currentTrack={player.currentTrack} />
      default: 
        return <HomePage onPlay={player.playTrack} currentTrack={player.currentTrack} onNavigate={handleNavigate} likedCount={liked.length} />
    }
  }

  return (
    <div className="flex h-screen bg-[#121212] text-white overflow-hidden relative flex-col lg:flex-row">
      <div className={`transition-all duration-500 overflow-hidden ${isFullscreen ? 'fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-3xl' : 'absolute top-0 left-0 w-[1px] h-[1px] opacity-0 pointer-events-none -z-50'}`}>
        <div id="youtube-main-player" className={`${isFullscreen ? 'w-full max-w-5xl aspect-video rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,230,40,0.2)]' : 'w-full h-full'}`} />
        {isFullscreen && <button onClick={() => setIsFullscreen(false)} className="mt-8 px-8 py-3 bg-[#00e628] text-black rounded-full font-black uppercase tracking-widest hover:scale-105 transition-transform">✕ Close Video</button>}
      </div>

      <Sidebar currentPage={page} onNavigate={handleNavigate} playlists={playlists} liked={liked} onPlayPlaylist={pl => pl.tracks?.[0] && player.playTrack(pl.tracks[0], pl.tracks)} currentTrack={player.currentTrack} />

      <main className="flex flex-1 flex-col overflow-hidden pb-[140px] lg:pb-0">
        <div className="flex-1 overflow-y-auto">{renderPage()}</div>
        
        <PlayerBar track={player.currentTrack} isPlaying={player.isPlaying} progress={player.progress} currentSecs={player.currentSecs} shuffle={player.shuffle} repeat={player.repeat} liked={isLiked} volume={player.volume} onTogglePlay={player.togglePlay} onNext={player.next} onPrev={player.prev} onSeek={player.seek} onShuffle={() => player.setShuffle(s => !s)} onRepeat={() => player.setRepeat(r => !r)} onLike={handleLike} onVolumeChange={player.setVolume} isFullscreen={isFullscreen} onToggleFullscreen={() => setIsFullscreen(!isFullscreen)} />
      </main>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center bg-[#121212]/95 backdrop-blur-xl border-t border-white/5 py-3 pb-6 px-4">
         {['home', 'search', 'library', 'import', 'profile'].map((p) => (
           <button key={p} onClick={() => handleNavigate(p as Page)} className={`flex flex-col items-center gap-1 transition-all ${page === p ? 'text-[#00e628] -translate-y-1' : 'text-white/40 hover:text-white/80'}`}>
              <span className="text-xl">
                {p === 'home' ? '🏠' : p === 'search' ? '🔍' : p === 'library' ? '📚' : p === 'import' ? '✨' : '👤'}
              </span>
              <span className="text-[9px] font-black uppercase tracking-widest">{p}</span>
           </button>
         ))}
      </nav>
    </div>
  )
}

export default function App() { return <AuthProvider><GlintApp /></AuthProvider> }