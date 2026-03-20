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
  { id: 'import' as Page,  icon: 'cloud_upload',  label: 'Import' },
]

export default function Sidebar({ currentPage, onNavigate, playlists, onPlayPlaylist, currentTrack }: SidebarProps) {
  return (
    <div className="flex flex-col h-full bg-black p-4 border-r border-white/10">
      {/* Logo */}
      <div className="mb-8 px-4 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-black font-bold">music_note</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-green-500 leading-none">Glint</h1>
          <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Music App</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV.map(item => {
          const active = currentPage === item.id
          return (
            <a key={item.id}
              onClick={(e) => { e.preventDefault(); onNavigate(item.id) }}
              href="#"
              className={`flex items-center gap-3 text-white/60 px-4 py-2 hover:bg-white/5 hover:text-white transition-all duration-200 ease-in-out ${active ? 'bg-white/10 text-green-400 rounded-lg' : ''}`}
            >
              <span className="material-symbols-outlined" data-icon={item.icon}>{item.icon}</span>
              <span className="font-medium text-sm">{item.label}</span>
            </a>
          )
        })}

        <div className="mt-8 mb-2 px-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">Your Collection</div>
        <a className="flex items-center gap-3 text-white/60 px-4 py-2 hover:bg-white/5 hover:text-white transition-all duration-200 ease-in-out" href="#" onClick={e => { e.preventDefault(); onNavigate('library') }}>
          <span className="material-symbols-outlined" data-icon="favorite">favorite</span>
          <span className="font-medium text-sm">Liked Songs</span>
        </a>
        <a className="flex items-center gap-3 text-white/60 px-4 py-2 hover:bg-white/5 hover:text-white transition-all duration-200 ease-in-out" href="#" onClick={e => { e.preventDefault(); onNavigate('library') }}>
          <span className="material-symbols-outlined" data-icon="playlist_play">playlist_play</span>
          <span className="font-medium text-sm">Playlists</span>
        </a>
      </nav>

      {/* Playlists */}
      {playlists.length > 0 && (
        <div className="flex-1 overflow-hidden flex flex-col mt-4">
          <div className="flex-1 overflow-y-auto">
            {playlists.map(pl => (
              <div key={pl.id} onClick={() => onPlayPlaylist(pl)}
                className="flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer hover:bg-white/5 transition-all"
              >
                <img src={pl.cover || `https://picsum.photos/seed/${pl.id}/40/40`} alt={pl.name} className="w-10 h-10 rounded object-cover" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white/80 truncate">{pl.name}</p>
                  <p className="text-xs text-white/30">{pl.tracks.length} tracks</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upgrade */}
      <div className="mt-auto p-4 bg-surface-container-low rounded-xl border border-white/5">
        <p className="text-xs text-white/60 mb-3">Unlock high-fidelity AI imports and unlimited cloud storage.</p>
        <button className="w-full py-2 bg-primary text-black font-bold rounded-lg text-sm active:scale-95 transition-transform">
          Upgrade to Pro
        </button>
      </div>
    </div>
  )
}
