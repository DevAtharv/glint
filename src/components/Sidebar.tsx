import React from 'react'
import type { Page, Playlist, Track } from '../types'

interface SidebarProps {
  currentPage: Page
  onNavigate: (p: Page) => void
  playlists: Playlist[]
  onPlayPlaylist: (pl: Playlist) => void
  currentTrack: Track | null
}

// --- Pure SVG Icons ---
const Icons = {
  Home: ({ active }: { active?: boolean }) => (
    <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? "0" : "2"} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Search: ({ active }: { active?: boolean }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "3" : "2"} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Library: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  ),
  Plus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  ArrowRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  Pin: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-[#00e628]">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
  ),
  PlayArrow: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-0.5">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

export default function Sidebar({
  currentPage,
  onNavigate,
  playlists,
  onPlayPlaylist,
  currentTrack,
}: SidebarProps) {
  
  return (
    <aside className="hidden lg:flex flex-col w-[300px] h-screen bg-black p-2 gap-2 font-sans select-none z-50">

      {/* -------------------------------------------------------------
        CARD 1: MAIN NAVIGATION 
        ------------------------------------------------------------- 
      */}
      <div className="bg-[#121212] rounded-xl px-3 py-4 flex flex-col gap-5 border border-white/5">
        
        {/* Logo */}
        <div className="px-3 mb-2 cursor-pointer flex items-center gap-2" onClick={() => onNavigate('home')}>
          <div className="h-8 w-8 bg-[#00e628] rounded-full flex items-center justify-center text-black shadow-[0_0_12px_rgba(0,230,40,0.4)]">
            <Icons.PlayArrow />
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            <span className="text-white">Gl</span>
            <span className="text-[#00e628]">int</span>
          </h1>
        </div>

        {/* Home & Search Buttons */}
        <div className="space-y-1">
          <button
            onClick={() => onNavigate('home')}
            className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-md transition duration-300 font-bold ${
              currentPage === 'home'
                ? 'text-white bg-[#1a1a1a]'
                : 'text-[#b3b3b3] hover:text-white hover:bg-[#1a1a1a]'
            }`}
          >
            <Icons.Home active={currentPage === 'home'} />
            <span className="text-base">Home</span>
          </button>

          <button
            onClick={() => onNavigate('search')}
            className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-md transition duration-300 font-bold ${
              currentPage === 'search'
                ? 'text-white bg-[#1a1a1a]'
                : 'text-[#b3b3b3] hover:text-white hover:bg-[#1a1a1a]'
            }`}
          >
            <Icons.Search active={currentPage === 'search'} />
            <span className="text-base">Search</span>
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------
        CARD 2: YOUR LIBRARY
        ------------------------------------------------------------- 
      */}
      <div className="bg-[#121212] rounded-xl flex-1 flex flex-col overflow-hidden relative border border-white/5">
        
        {/* Library Header Row */}
        <div className="px-4 pt-4 pb-2 flex items-center justify-between z-10">
          <button 
            onClick={() => onNavigate('library')}
            className="flex items-center gap-3 text-[#b3b3b3] hover:text-white transition duration-300 font-bold group"
          >
            <Icons.Library />
            <span className="text-base">Your Library</span>
          </button>
          
          <div className="flex items-center gap-1">
            {/* Upgraded Plus Button to draw attention */}
            <button 
              onClick={() => onNavigate('import')}
              className="flex items-center gap-1 px-2 py-1 text-[#b3b3b3] hover:text-white hover:bg-[#2a2a2a] rounded-full transition duration-300 group"
              title="Import or Create Playlist"
            >
              <Icons.Plus />
            </button>
            <button className="p-1.5 text-[#b3b3b3] hover:text-white hover:bg-[#2a2a2a] rounded-full transition duration-300">
              <Icons.ArrowRight />
            </button>
          </div>
        </div>

        {/* --- NEW: AI INSTRUCTIONAL TEXT --- */}
        <div className="px-4 pb-3">
          <div className="bg-[#00e628]/10 border border-[#00e628]/20 rounded-lg p-3 cursor-pointer hover:bg-[#00e628]/20 transition-colors" onClick={() => onNavigate('import')}>
            <p className="text-xs text-[#e2e2e2] leading-snug">
              Click the <strong className="text-white bg-white/10 px-1 rounded mx-0.5">+</strong> icon to import a playlist and unlock <span className="font-bold text-[#00e628] drop-shadow-[0_0_8px_rgba(0,230,40,0.5)]">AI Features ✨</span>
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 flex gap-2">
          <button className="px-3 py-1.5 bg-[#2a2a2a] hover:bg-[#333333] text-white text-sm font-medium rounded-full transition-colors">
            Playlists
          </button>
          <button className="px-3 py-1.5 bg-[#2a2a2a] hover:bg-[#333333] text-white text-sm font-medium rounded-full transition-colors">
            Artists
          </button>
        </div>

        {/* Scrollable Playlists Area */}
        <div className="flex-1 overflow-y-auto px-2 py-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#4d4d4d] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#737373] [&::-webkit-scrollbar-track]:bg-transparent">
          
          {/* Static Liked Songs Item */}
          <button className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-[#1a1a1a] transition duration-200 group">
            <div className="w-12 h-12 rounded-md bg-gradient-to-br from-[#450af5] to-[#8e8ee5] flex items-center justify-center flex-shrink-0 shadow-md">
              <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-base text-white font-medium truncate">Liked Songs</p>
              <div className="flex items-center gap-1.5 text-sm text-[#b3b3b3]">
                <Icons.Pin />
                <span>Playlist • 120 songs</span>
              </div>
            </div>
          </button>

          {/* User Playlists */}
          {playlists.length === 0 ? (
            <div className="px-3 py-4 mt-2 text-sm text-[#b3b3b3] font-medium text-center border-t border-white/5">
              Your library is empty.
            </div>
          ) : (
            <div className="mt-1 space-y-1">
              {playlists.map(pl => (
                <button
                  key={pl.id}
                  onClick={() => onPlayPlaylist(pl)}
                  className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-[#1a1a1a] transition duration-200 group"
                >
                  <img
                    src={pl.cover}
                    alt={pl.name}
                    className="w-12 h-12 rounded-md object-cover flex-shrink-0 shadow-md"
                  />
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-base text-white font-medium truncate group-hover:text-white transition-colors">
                      {pl.name}
                    </p>
                    <p className="text-sm text-[#b3b3b3] truncate">
                      Playlist • {pl.tracks?.length || 0} songs
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
