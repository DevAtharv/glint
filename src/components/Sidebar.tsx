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
    <aside style={{
      gridRow: '1/3',
      width: 256,
      background: '#000',
      borderRight: '1px solid rgba(255,255,255,.08)',
      display: 'flex',
      flexDirection: 'column',
      padding: 16,
      paddingTop: 0,
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '20px 16px 20px' }}>
        <div style={{ width: 32, height: 32, background: 'var(--primary)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#000', fontVariationSettings: "'FILL' 1" }}>music_note</span>
        </div>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 900, color: '#4ade80', letterSpacing: '-0.03em', lineHeight: 1 }}>Glint</h1>
          <p style={{ fontSize: 9, color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 2 }}>Music App</p>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 8 }}>
        {NAV.map(item => {
          const active = currentPage === item.id
          return (
            <a key={item.id}
              onClick={(e) => { e.preventDefault(); onNavigate(item.id) }}
              href="#"
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '9px 16px', borderRadius: 8,
                background: active ? 'rgba(255,255,255,.1)' : 'transparent',
                color: active ? '#4ade80' : 'rgba(255,255,255,.5)',
                fontSize: 13, fontWeight: 500, cursor: 'pointer',
                textDecoration: 'none', transition: 'all .15s',
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,.05)'; e.currentTarget.style.color = '#fff' } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,.5)' } }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span style={{ fontSize: 9, fontWeight: 800, background: 'rgba(0,230,40,.15)', color: 'var(--primary)', padding: '2px 6px', borderRadius: 20, border: '1px solid rgba(0,230,40,.2)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
                  {item.badge}
                </span>
              )}
            </a>
          )
        })}
      </nav>

      {/* Collection */}
      <div style={{ marginBottom: 8, marginTop: 16, padding: '0 16px' }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.25)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>Your Collection</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[
            { id: 'library' as Page, icon: 'favorite', label: 'Liked Songs' },
            { id: 'library' as Page, icon: 'playlist_play', label: 'Playlists' },
          ].map((item, i) => (
            <a key={i} href="#" onClick={e => { e.preventDefault(); onNavigate(item.id) }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 16px', borderRadius: 8, color: 'rgba(255,255,255,.5)', fontSize: 13, fontWeight: 500, textDecoration: 'none', transition: 'all .15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.05)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,.5)' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{item.icon}</span>
              {item.label}
            </a>
          ))}
        </div>
      </div>

      {/* Playlists */}
      {playlists.length > 0 && (
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
            {playlists.map(pl => (
              <div key={pl.id} onClick={() => onPlayPlaylist(pl)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 16px', borderRadius: 8, cursor: 'pointer', transition: 'background .15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.05)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <img src={pl.cover || `https://picsum.photos/seed/${pl.id}/32/32`} alt={pl.name} style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 500, color: '#e2e2e2', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pl.name}</p>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,.3)' }}>{pl.tracks.length} tracks</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upgrade */}
      <div style={{ marginTop: 'auto', padding: 16, background: 'var(--bg-mid)', borderRadius: 12, border: '1px solid rgba(255,255,255,.05)' }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Upgrade to Pro</p>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginBottom: 12, lineHeight: 1.5 }}>Unlock high-fidelity AI imports and unlimited cloud storage.</p>
        <button style={{ width: '100%', padding: '8px', background: 'var(--primary)', color: '#000', fontWeight: 900, fontSize: 11, borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
          Upgrade Now
        </button>
      </div>
    </aside>
  )
}
