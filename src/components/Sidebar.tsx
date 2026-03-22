import React from 'react'
import type { Page, Playlist, Track } from '../types'

interface SidebarProps {
  currentPage: Page
  onNavigate: (p: Page) => void
  playlists: Playlist[]
  onPlayPlaylist: (pl: Playlist) => void
  currentTrack: Track | null
}

export default function Sidebar({
  currentPage,
  onNavigate,
  playlists,
  onPlayPlaylist,
  currentTrack,
}: SidebarProps) {
  
  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-full flex-col p-4 bg-black w-64 border-r border-white/10 z-[60] font-['Inter'] text-sm font-medium">
      
      {/* Logo Area */}
      <div className="flex items-center gap-3 mb-8 px-2 cursor-pointer" onClick={() => onNavigate('home')}>
        <div className="h-8 w-8 bg-[#00e628] rounded flex items-center justify-center text-black">
          <span className="material-symbols-outlined font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
        </div>
        <div>
          <div className="text-xl font-bold text-[#00e628]">Glint</div>
          <div className="text-[10px] uppercase tracking-widest text-white/40">Music App</div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1">
        <button
          onClick={() => onNavigate('home')}
          className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ease-in-out ${
            currentPage === 'home'
              ? 'bg-white/10 text-[#75ff69]'
              : 'text-white/60 hover:bg-white/5 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined">home</span>
          <span>Home</span>
        </button>

        <button
          onClick={() => onNavigate('search')}
          className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ease-in-out ${
            currentPage === 'search'
              ? 'bg-white/10 text-[#75ff69]'
              : 'text-white/60 hover:bg-white/5 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined">search</span>
          <span>Search</span>
        </button>

        <button
          onClick={() => onNavigate('library')}
          className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ease-in-out ${
            currentPage === 'library'
              ? 'bg-white/10 text-[#75ff69]'
              : 'text-white/60 hover:bg-white/5 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined">library_music</span>
          <span>Library</span>
        </button>

        <button
          onClick={() => onNavigate('import')}
          className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ease-in-out ${
            currentPage === 'import'
              ? 'bg-white/10 text-[#75ff69]'
              : 'text-white/60 hover:bg-white/5 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined">cloud_upload</span>
          <span>Import</span>
        </button>

        {/* Collection Section */}
        <div className="pt-8 pb-2 px-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">
          Your Collection
        </div>
        
        <button className="w-full flex items-center gap-3 text-white/60 px-4 py-2 rounded-lg hover:bg-white/5 hover:text-white transition-all duration-200 ease-in-out">
          <span className="material-symbols-outlined">favorite</span>
          <span>Liked Songs</span>
        </button>

        <button className="w-full flex items-center gap-3 text-white/60 px-4 py-2 rounded-lg hover:bg-white/5 hover:text-white transition-all duration-200 ease-in-out">
          <span className="material-symbols-outlined">playlist_play</span>
          <span>Playlists</span>
        </button>

        {/* Dynamic User Playlists */}
        <div className="mt-2 space-y-1 overflow-y-auto max-h-48 pl-2 pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#353535] [&::-webkit-scrollbar-thumb]:rounded-full">
            {playlists.map(pl => (
                <button
                    key={pl.id}
                    onClick={() => onPlayPlaylist(pl)}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 text-left transition-colors"
                >
                    <img src={pl.cover} alt={pl.name} className="w-8 h-8 rounded-md object-cover" />
                    <span className="text-sm text-white/80 truncate group-hover:text-white">{pl.name}</span>
                </button>
            ))}
        </div>
      </nav>

      {/* Upgrade Promo */}
      <div className="mt-auto p-4 bg-gradient-to-br from-[#00e628]/20 to-transparent rounded-xl border border-[#00e628]/10">
        <p className="text-xs text-white/80 mb-3">Experience high-fidelity audio without limits.</p>
        <button className="w-full py-2 bg-[#00e628] text-black font-bold rounded hover:opacity-90 transition-opacity">
          Upgrade to Pro
        </button>
      </div>
    </aside>
  )
}
