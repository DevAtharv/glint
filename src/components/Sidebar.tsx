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
      background: 'linear-gradient(180deg, #0f0f0f 0%, #121212 100%)',
      display: 'flex',
      flexDirection: 'column',
      padding: 0,
      overflow: 'hidden',
      height: '100%',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '24px 24px 20px' }}>
        <div style={{ width: 40, height: 40, background: '#00e628', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#000', fontVariationSettings: "'FILL' 1" }}>music_note</span>
        </div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#4ade80', letterSpacing: '-0.02em', lineHeight: 1.2 }}>Glint</h1>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>Music App</p>
        </div>
      </div>

      {/* Nav */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '0 16px', marginBottom: 24 }}>
        {NAV.map(item => {
          const active = currentPage === item.id
          return (
            <button key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px', borderRadius: 10,
                background: active ? 'rgba(0,230,40,.15)' : 'transparent',
                color: active ? '#4ade80' : 'rgba(255,255,255,.6)',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                border: 'none', transition: 'all .2s',
                textAlign: 'left',
                fontFamily: 'Inter, sans-serif',
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,.08)'; e.currentTarget.style.color = '#fff' } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,.6)' } }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 22, fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span style={{ fontSize: 10, fontWeight: 800, background: '#00e628', color: '#000', padding: '3px 10px', borderRadius: 20, letterSpacing: '.05em' }}>
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Collection */}
      <div style={{ padding: '0 24px', marginBottom: 20 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Your Collection</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            { id: 'library' as Page, icon: 'favorite', label: 'Liked Songs', count: 0 },
            { id: 'library' as Page, icon: 'playlist_play', label: 'Playlists', count: playlists.length },
          ].map((item, i) => (
            <button key={i} onClick={() => onNavigate(item.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 8, color: 'rgba(255,255,255,.6)', fontSize: 13, fontWeight: 500, background: 'transparent', border: 'none', cursor: 'pointer', transition: 'all .15s', fontFamily: 'Inter, sans-serif' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.08)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,.6)' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: "'FILL' 0" }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,.3)' }}>{item.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Playlists */}
      {playlists.length > 0 && (
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '0 16px', marginBottom: 16 }}>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {playlists.map(pl => (
              <div key={pl.id} onClick={() => onPlayPlaylist(pl)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 8px', borderRadius: 8, cursor: 'pointer', transition: 'background .15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <img src={pl.cover || `https://picsum.photos/seed/${pl.id}/48/48`} alt={pl.name} style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#e2e2e2', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pl.name}</p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginTop: 2 }}>{pl.tracks.length} tracks</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upgrade */}
      <div style={{ marginTop: 'auto', margin: '16px', padding: 20, background: 'linear-gradient(135deg, rgba(0,230,40,.1) 0%, rgba(0,230,40,.05) 100%)', borderRadius: 14, border: '1px solid rgba(0,230,40,.15)' }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Upgrade to Pro</p>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', marginBottom: 16, lineHeight: 1.5 }}>Unlock AI-powered imports and unlimited cloud storage.</p>
        <button style={{ width: '100%', padding: '12px', background: '#00e628', color: '#000', fontWeight: 800, fontSize: 12, borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', letterSpacing: '.02em' }}>
          Upgrade Now
        </button>
      </div>
    </aside>
  )
}
