import React from 'react'
import type { Page, Playlist, Track } from '../types'
import { formatTime } from '../utils/helpers'

interface SidebarProps {
  currentPage: Page
  onNavigate: (p: Page) => void
  playlists: Playlist[]
  onPlayPlaylist: (pl: Playlist) => void
  currentTrack: Track | null
}

const navItems: { id: Page; label: string; icon: React.ReactNode; badge?: string }[] = [
  {
    id: 'home',
    label: 'Home',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
  },
  {
    id: 'search',
    label: 'Search',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
      </svg>
    ),
  },
  {
    id: 'library',
    label: 'Library',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z" />
      </svg>
    ),
  },
  {
    id: 'import',
    label: 'Import Playlist',
    badge: 'AI',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
]

export default function Sidebar({
  currentPage,
  onNavigate,
  playlists,
  onPlayPlaylist,
  currentTrack,
}: SidebarProps) {
  return (
    <aside className="hidden h-screen w-[290px] shrink-0 flex-col border-r border-white/10 bg-[#0B0D12] lg:flex">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-6">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-500">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        </div>
        <span className="font-serif text-xl text-[#EEF0FF]">
          Gl<em className="italic text-[#8B85FF]">i</em>nt
        </span>
      </div>

      <div className="px-3 pt-4">
        <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#6B6F85]">
          Menu
        </p>

        <div className="space-y-1">
          {navItems.map(item => {
            const active = currentPage === item.id
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                  active
                    ? 'bg-[rgba(108,99,255,0.12)] text-[#8B85FF]'
                    : 'text-[#A0A3B1] hover:bg-white/5 hover:text-[#EEF0FF]'
                }`}
              >
                {active && <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-indigo-500" />}
                <span className="shrink-0">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="rounded-full border border-indigo-500/20 bg-[rgba(108,99,255,0.12)] px-2 py-0.5 text-[10px] font-bold text-[#8B85FF]">
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-3 pt-6">
        <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#6B6F85]">
          Your Playlists
        </p>

        <div className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
          {playlists.length === 0 && (
            <p className="px-2 py-2 text-sm text-[#6B6F85]">No playlists yet. Import one.</p>
          )}

          {playlists.map(pl => (
            <button
              key={pl.id}
              onClick={() => onPlayPlaylist(pl)}
              className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-white/5"
            >
              <img
                src={pl.cover}
                alt={pl.name}
                className="h-10 w-10 shrink-0 rounded-lg object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[#EEF0FF]">{pl.name}</p>
                <p className="text-xs text-[#6B6F85]">{pl.tracks.length} tracks</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {currentTrack && (
        <div className="border-t border-white/10 px-5 py-4">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.08em] text-[#6B6F85]">
            Now Playing
          </p>
          <div className="flex items-center gap-3">
            <img
              src={currentTrack.albumArt}
              alt=""
              className="h-10 w-10 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#EEF0FF]">{currentTrack.title}</p>
              <p className="truncate text-xs text-[#A0A3B1]">{currentTrack.artist}</p>
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-white/10 px-5 py-4">
        <p className="mb-1 text-[10px] uppercase tracking-[0.08em] text-white/25">Made with ♡ by</p>
        <p className="text-sm font-bold text-[#EEF0FF]">Atharv</p>
        <a
          href="https://atharvagarwal.in"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block text-xs text-[#6C63FF]"
        >
          atharvagarwal.in
        </a>
      </div>
    </aside>
  )
}
