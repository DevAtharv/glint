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
    id: 'home', label: 'Home',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>,
  },
  {
    id: 'search', label: 'Search',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>,
  },
  {
    id: 'library', label: 'Library',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/></svg>,
  },
  {
    id: 'import', label: 'Import Playlist',
    badge: 'AI',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  },
]

export default function Sidebar({ currentPage, onNavigate, playlists, onPlayPlaylist, currentTrack }: SidebarProps) {
  return (
    <aside style={{
      gridRow: '1/3',
      background: '#0e0e0e',
      borderRight: '1px solid rgba(255,255,255,.06)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 9, background: '#00e628', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#000"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
        </div>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 20, fontWeight: 900, color: '#00e628', letterSpacing: '-0.02em' }}>
          Glint
        </span>
      </div>

      {/* Nav */}
      <div style={{ padding: '16px 12px 8px' }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', color: '#474747', textTransform: 'uppercase', padding: '0 8px', marginBottom: 6 }}>Menu</p>
        {navItems.map(item => (
          <div
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 8px', borderRadius: 9, cursor: 'pointer',
              marginBottom: 2, position: 'relative',
              background: currentPage === item.id ? 'rgba(255,255,255,.08)' : 'transparent',
              color: currentPage === item.id ? '#00e628' : '#888',
              fontSize: 13, fontWeight: 500,
              transition: 'all .15s',
            }}
            onMouseEnter={e => { if (currentPage !== item.id) e.currentTarget.style.background = 'rgba(255,255,255,.05)' }}
            onMouseLeave={e => { if (currentPage !== item.id) e.currentTarget.style.background = 'transparent' }}
          >
            {currentPage === item.id && (
              <div style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 3, background: '#00e628', borderRadius: '0 3px 3px 0' }} />
            )}
            {item.icon}
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.badge && (
              <span style={{ fontSize: 10, fontWeight: 700, background: 'rgba(0,230,40,.12)', color: '#00e628', padding: '2px 7px', borderRadius: 20, border: '1px solid rgba(0,230,40,.2)' }}>
                {item.badge}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Playlists */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '8px 12px' }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', color: '#474747', textTransform: 'uppercase', padding: '0 8px', marginBottom: 8 }}>Your Playlists</p>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {playlists.length === 0 && (
            <p style={{ fontSize: 12, color: '#474747', padding: '8px 8px' }}>No playlists yet. Import one!</p>
          )}
          {playlists.map(pl => (
            <div
              key={pl.id}
              onClick={() => onPlayPlaylist(pl)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '7px 8px', borderRadius: 8, cursor: 'pointer',
                marginBottom: 2, transition: 'background .15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.05)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <img src={pl.cover} alt={pl.name} style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 500, color: '#e2e2e2', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pl.name}</p>
                <p style={{ fontSize: 10, color: '#474747', marginTop: 1 }}>{pl.tracks.length} tracks</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Now playing in sidebar */}
      {currentTrack && (
        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,.06)' }}>
          <p style={{ fontSize: 10, color: '#474747', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 8 }}>Now Playing</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src={currentTrack.albumArt} alt="" style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover' }} />
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#e2e2e2', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentTrack.title}</p>
              <p style={{ fontSize: 10, color: '#888', marginTop: 1 }}>{currentTrack.artist}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
