import React from 'react'
import type { Page, Playlist, Track } from '../types'

interface SidebarProps {
  currentPage: Page
  onNavigate: (p: Page) => void
  playlists: Playlist[]
  onPlayPlaylist: (pl: Playlist) => void
  currentTrack: Track | null
}

const NAV = [
  { id: 'home' as Page,    icon: 'home',          label: 'Home' },
  { id: 'search' as Page,  icon: 'search',        label: 'Search' },
  { id: 'library' as Page, icon: 'library_music', label: 'Library' },
  { id: 'import' as Page,  icon: 'cloud_upload',  label: 'Import',  badge: 'AI' },
]

export default function Sidebar({ currentPage, onNavigate, playlists, onPlayPlaylist, currentTrack }: SidebarProps) {
  return (
    <div className="flex flex-col h-full bg-black border-r border-white/5">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-lg text-black" style={{ fontVariationSettings: "'FILL' 1" }}>music_note</span>
        </div>
        <h1 className="text-xl font-black text-green-400 tracking-tight">Glint</h1>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 px-3">
        {NAV.map(item => {
          const active = currentPage === item.id
          return (
            <button key={item.id} onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${active ? 'bg-white/10 text-green-400' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="text-[10px] font-bold bg-primary text-black px-2 py-0.5 rounded-full">{item.badge}</span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Collection */}
      <div className="px-6 mt-8">
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4">Your Collection</p>
        <div className="flex flex-col gap-1">
          <button onClick={() => onNavigate('library')} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white/50 hover:bg-white/5 hover:text-white transition-all">
            <span className="material-symbols-outlined">favorite</span>
            <span className="flex-1 text-left">Liked Songs</span>
            <span className="text-xs text-white/30">{playlists.reduce((acc, p) => acc + p.tracks.length, 0)}</span>
          </button>
          <button onClick={() => onNavigate('library')} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white/50 hover:bg-white/5 hover:text-white transition-all">
            <span className="material-symbols-outlined">playlist_play</span>
            <span className="flex-1 text-left">Playlists</span>
            <span className="text-xs text-white/30">{playlists.length}</span>
          </button>
        </div>
      </div>

      {/* Playlists */}
      {playlists.length > 0 && (
        <div className="flex-1 overflow-hidden flex flex-col px-3 mt-8">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4 px-3">Your Playlists</p>
          <div className="flex-1 overflow-y-auto">
            {playlists.map(pl => (
              <button key={pl.id} onClick={() => onPlayPlaylist(pl)}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-white/5 transition-all text-left"
              >
                <img src={pl.cover || `https://picsum.photos/seed/${pl.id}/40/40`} alt={pl.name} className="w-10 h-10 rounded-md object-cover" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white/80 truncate">{pl.name}</p>
                  <p className="text-xs text-white/30">{pl.tracks.length} tracks</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Upgrade */}
      <div className="mt-auto p-4 m-3 bg-white/5 rounded-xl border border-white/5">
        <p className="text-sm font-bold text-white mb-2">Upgrade to Pro</p>
        <p className="text-xs text-white/40 mb-4 leading-relaxed">Unlock AI-powered imports and unlimited cloud storage.</p>
        <button className="w-full py-2.5 bg-primary text-black font-bold text-xs rounded-lg hover:shadow-lg hover:shadow-primary/20 transition-all">
          Upgrade Now
        </button>
      </div>
    </div>
  )
}
