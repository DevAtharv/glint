import React from 'react'
import type { Page, Playlist, Track } from '../types'

interface SidebarProps {
  currentPage: Page
  onNavigate: (p: Page) => void
  playlists: Playlist[]
  onPlayPlaylist: (pl: Playlist) => void
  currentTrack: Track | null
}

const nav = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'search', label: 'Search', icon: '🔍' },
  { id: 'library', label: 'Library', icon: '🎵' },
  { id: 'import', label: 'Import', icon: '✨' },
]

export default function Sidebar({
  currentPage,
  onNavigate,
  playlists,
  onPlayPlaylist,
  currentTrack,
}: SidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col w-[260px] h-screen bg-black border-r border-white/10">

      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-tight">
          <span className="text-white">Gl</span>
          <span className="text-[#1DB954]">int</span>
        </h1>
      </div>

      {/* Navigation */}
      <div className="px-4 py-4">
        <p className="text-xs text-gray-500 uppercase mb-2">Menu</p>

        <div className="space-y-1">
          {nav.map(item => {
            const active = currentPage === item.id

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as Page)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                  active
                    ? 'bg-[#1DB954]/10 text-[#1DB954]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Playlists */}
      <div className="flex-1 px-4 overflow-y-auto">
        <p className="text-xs text-gray-500 uppercase mb-2">Your Library</p>

        {playlists.length === 0 && (
          <p className="text-sm text-gray-500">No playlists yet</p>
        )}

        <div className="space-y-2">
          {playlists.map(pl => (
            <button
              key={pl.id}
              onClick={() => onPlayPlaylist(pl)}
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5"
            >
              <img
                src={pl.cover}
                className="w-10 h-10 rounded-md object-cover"
              />

              <div className="text-left">
                <p className="text-sm text-white truncate">{pl.name}</p>
                <p className="text-xs text-gray-500">{pl.tracks.length} songs</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Now Playing */}
      {currentTrack && (
        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-gray-500 mb-2">Now Playing</p>

          <div className="flex items-center gap-3">
            <img
              src={currentTrack.albumArt}
              className="w-10 h-10 rounded-md"
            />

            <div>
              <p className="text-sm text-white truncate">
                {currentTrack.title}
              </p>
              <p className="text-xs text-gray-500">
                {currentTrack.artist}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
