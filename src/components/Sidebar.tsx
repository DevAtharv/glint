import React from 'react'
import type { Page, Playlist, Track } from '../types'

interface SidebarProps {
  currentPage: Page
  onNavigate: (page: Page) => void
  playlists: Playlist[]
  liked: Track[] // Added this to track the count
  onPlayPlaylist: (pl: Playlist) => void
  currentTrack: Track | null
}

const NavItem = ({ 
  icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: React.ReactNode, 
  label: string, 
  active: boolean, 
  onClick: () => void 
}) => (
  <button
    onClick={onClick}
    className={`flex w-full items-center gap-4 rounded-xl px-4 py-3 transition-all duration-200 ${
      active 
        ? 'bg-[#00e628]/10 text-[#00e628]' 
        : 'text-white/50 hover:bg-white/5 hover:text-white'
    }`}
  >
    <span className="text-xl">{icon}</span>
    <span className="font-bold text-sm tracking-tight">{label}</span>
  </button>
)

export default function Sidebar({ 
  currentPage, 
  onNavigate, 
  playlists, 
  liked,
  onPlayPlaylist 
}: SidebarProps) {
  return (
    <aside className="flex h-full w-[280px] flex-col border-r border-white/5 bg-[#121212] p-6">
      
      {/* Brand Logo */}
      <div 
        className="mb-10 flex cursor-pointer items-center gap-2 px-2"
        onClick={() => onNavigate('home')}
      >
        <div className="h-8 w-8 rounded-lg bg-[#00e628] flex items-center justify-center font-black text-black">G</div>
        <h1 className="text-2xl font-black tracking-tighter text-white uppercase">Glint</h1>
      </div>

      {/* Main Navigation */}
      <nav className="space-y-1">
        <NavItem icon="🏠" label="Home" active={currentPage === 'home'} onClick={() => onNavigate('home')} />
        <NavItem icon="🔍" label="Search" active={currentPage === 'search'} onClick={() => onNavigate('search')} />
        <NavItem icon="✨" label="AI Import" active={currentPage === 'import'} onClick={() => onNavigate('import')} />
      </nav>

      {/* Your Collection */}
      <div className="mt-10">
        <p className="mb-4 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Your Collection</p>
        
        {/* Liked Songs Tile */}
        <button 
          onClick={() => onNavigate('library')}
          className={`group relative flex w-full flex-col overflow-hidden rounded-2xl p-4 transition-all hover:scale-[1.02] active:scale-95 ${
            currentPage === 'library' 
              ? 'bg-gradient-to-br from-[#00e628] to-[#009c1b] text-black shadow-[0_10px_30px_rgba(0,230,40,0.3)]' 
              : 'bg-white/5 text-white'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">💜</span>
            <span className={`text-[10px] font-black uppercase tracking-widest ${currentPage === 'library' ? 'text-black/60' : 'text-white/30'}`}>
              Library
            </span>
          </div>
          <p className="text-left font-black text-lg leading-none">Liked Songs</p>
          <p className={`mt-1 text-left text-xs font-bold ${currentPage === 'library' ? 'text-black/70' : 'text-white/40'}`}>
            {liked.length} songs
          </p>
        </button>
      </div>

      {/* Playlists Section */}
      <div className="mt-10 flex-1 overflow-y-auto">
        <p className="mb-4 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Your Playlists</p>
        <div className="space-y-1">
          {playlists.length > 0 ? (
            playlists.map(pl => (
              <button
                key={pl.id}
                onClick={() => onPlayPlaylist(pl)}
                className="group flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left transition-all hover:bg-white/5"
              >
                <div className="h-6 w-6 overflow-hidden rounded-md bg-white/5">
                  <img src={pl.cover} alt="" className="h-full w-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="truncate text-xs font-bold text-white/40 group-hover:text-white transition-colors">
                  {pl.name}
                </span>
              </button>
            ))
          ) : (
            <p className="px-4 text-xs text-white/10 italic">No playlists yet...</p>
          )}
        </div>
      </div>

      {/* Signature Footer */}
      <footer className="mt-auto pt-6 border-t border-white/5">
        <div className="px-2">
          <p className="text-[10px] font-medium text-white/20 mb-0.5">Build by <span className="text-white/40 font-bold">Atharv</span></p>
          <a 
            href="https://atharvagarwal.in" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[11px] font-bold text-[#00e628] opacity-60 hover:opacity-100 transition-opacity"
          >
            atharvagarwal.in
          </a>
        </div>
      </footer>
    </aside>
  )
}