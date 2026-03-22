import React from 'react'
import type { Page, Playlist, Track } from '../types'

interface SidebarProps {
  currentPage: Page
  onNavigate: (page: Page) => void
  playlists: Playlist[]
  liked: Track[] 
  onPlayPlaylist: (pl: Playlist) => void
  currentTrack: Track | null
}

export default function Sidebar({ currentPage, onNavigate, playlists, liked, onPlayPlaylist }: SidebarProps) {
  return (
    <aside className="hidden lg:flex h-full w-[280px] flex-col border-r border-white/5 bg-[#121212] p-6">
      <div className="mb-10 flex cursor-pointer items-center gap-2 px-2" onClick={() => onNavigate('home')}>
        <div className="h-8 w-8 rounded-lg bg-[#00e628] flex items-center justify-center font-black text-black">G</div>
        <h1 className="text-2xl font-black tracking-tighter text-white uppercase">Glint</h1>
      </div>

      <nav className="space-y-1 mb-10">
        <button onClick={() => onNavigate('home')} className={`flex w-full items-center gap-4 rounded-xl px-4 py-3 font-bold text-sm ${currentPage === 'home' ? 'bg-[#00e628]/10 text-[#00e628]' : 'text-white/40 hover:bg-white/5'}`}>🏠 Home</button>
        <button onClick={() => onNavigate('search')} className={`flex w-full items-center gap-4 rounded-xl px-4 py-3 font-bold text-sm ${currentPage === 'search' ? 'bg-[#00e628]/10 text-[#00e628]' : 'text-white/40 hover:bg-white/5'}`}>🔍 Search</button>
        <button onClick={() => onNavigate('import')} className={`flex w-full items-center gap-4 rounded-xl px-4 py-3 font-bold text-sm ${currentPage === 'import' ? 'bg-[#00e628]/10 text-[#00e628]' : 'text-white/40 hover:bg-white/5'}`}>✨ AI Import</button>
      </nav>

      <div className="mb-10">
        <p className="mb-4 px-4 text-[10px] font-black uppercase tracking-widest text-white/20">Collection</p>
        <button onClick={() => onNavigate('library')} className={`group flex w-full flex-col rounded-2xl p-4 transition-all active:scale-95 ${currentPage === 'library' ? 'bg-[#00e628] text-black shadow-lg shadow-[#00e628]/20' : 'bg-white/5 text-white'}`}>
          <div className="flex justify-between w-full mb-1"><span className="text-xl">💜</span><span className="text-[10px] font-black opacity-40 uppercase tracking-tighter">Library</span></div>
          <p className="font-black text-lg leading-tight text-left">Liked Songs</p>
          <p className="text-xs font-bold opacity-60 text-left">{liked.length} songs</p>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-1">
        <p className="mb-4 px-3 text-[10px] font-black uppercase tracking-widest text-white/20">Playlists</p>
        {playlists.map(pl => (
          <button key={pl.id} onClick={() => onPlayPlaylist(pl)} className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-white/40 hover:text-white hover:bg-white/5 truncate text-xs font-bold transition-all">
            <img src={pl.cover} className="h-6 w-6 rounded object-cover" alt="" /> {pl.name}
          </button>
        ))}
      </div>

      <footer className="mt-auto pt-6 border-t border-white/5">
        <p className="text-[10px] font-medium text-white/20">Build by <span className="text-white/50 font-bold">Atharv</span></p>
        <a href="https://atharvagarwal.in" target="_blank" rel="noreferrer" className="text-[11px] font-black text-[#00e628] opacity-60 hover:opacity-100 transition-opacity tracking-tight">atharvagarwal.in</a>
      </footer>
    </aside>
  )
}