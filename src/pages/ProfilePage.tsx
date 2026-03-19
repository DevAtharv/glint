import React, { useState } from 'react'
import type { Track, Playlist } from '../types'
import { useAuth } from '../hooks/useAuth'
import TrackRow from '../components/TrackRow'

interface ProfilePageProps {
  liked: Track[]
  playlists: Playlist[]
  onPlay: (track: Track, queue?: Track[]) => void
  currentTrack: Track | null
}

export default function ProfilePage({ liked, playlists, onPlay, currentTrack }: ProfilePageProps) {
  const { user, signOut } = useAuth()
  const [signingOut, setSigningOut] = useState(false)

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  const totalMins = liked.reduce((acc, t) => acc + t.duration, 0)
  const hours = Math.round(totalMins / 3600)

  const handleSignOut = async () => {
    setSigningOut(true)
    await signOut()
  }

  const statCard = (value: string | number, label: string, color: string) => (
    <div style={{ textAlign: 'left' }}>
      <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: 26, color: '#EEF0FF' }}>{value}</p>
      <p style={{ fontSize: 11, color, marginTop: 2, fontWeight: 600 }}>{label}</p>
    </div>
  )

  return (
    <div style={{ padding: '0 32px 40px' }}>
      {/* Profile hero */}
      <div style={{
        background: 'linear-gradient(135deg,#141720,#0E1018)',
        border: '1px solid rgba(255,255,255,.06)',
        borderRadius: 20, padding: '28px 32px',
        display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32,
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: 20, background: '#6C63FF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Instrument Serif', serif", fontSize: 30, fontStyle: 'italic', color: '#fff',
          flexShrink: 0,
        }}>
          {initials}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 26, color: '#EEF0FF', marginBottom: 4 }}>
            {user?.name ?? 'User'}
          </h2>
          <p style={{ fontSize: 13, color: '#8B8FA8', marginBottom: 10 }}>{user?.email}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(108,99,255,.12)', color: '#8B85FF', padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(108,99,255,.2)' }}>
              Free Plan
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(45,216,129,.1)', color: '#2DD881', padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(45,216,129,.15)' }}>
              Ad-free
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button style={{ padding: '8px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,.1)', borderRadius: 9, color: '#8B8FA8', fontSize: 12, fontWeight: 600, fontFamily: "'Manrope',sans-serif", cursor: 'pointer' }}>
            Edit Profile
          </button>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            style={{ padding: '8px 16px', background: 'rgba(255,77,109,.08)', border: '1px solid rgba(255,77,109,.15)', borderRadius: 9, color: '#FF4D6D', fontSize: 12, fontWeight: 600, fontFamily: "'Manrope',sans-serif", cursor: 'pointer' }}
          >
            {signingOut ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 32 }}>
        {[
          { v: liked.length, l: 'Liked Songs', c: '#FF4D6D', bg: 'rgba(255,77,109,.08)', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF4D6D"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> },
          { v: playlists.length, l: 'Playlists', c: '#6C63FF', bg: 'rgba(108,99,255,.08)', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="#6C63FF"><path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/></svg> },
          { v: `${hours}h`, l: 'Hours Listened', c: '#2DD881', bg: 'rgba(45,216,129,.08)', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="#2DD881"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg> },
          { v: playlists.filter(p => p.id.startsWith('ai-')).length, l: 'AI Playlists', c: '#f5a623', bg: 'rgba(245,166,35,.08)', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="#f5a623"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> },
        ].map(({ v, l, c, bg, icon }) => (
          <div key={l} style={{ background: '#0E1018', border: '1px solid rgba(255,255,255,.06)', borderRadius: 14, padding: '18px 20px' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              {icon}
            </div>
            <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: 26, color: '#EEF0FF' }}>{v}</p>
            <p style={{ fontSize: 11, color: c, marginTop: 2, fontWeight: 600 }}>{l}</p>
          </div>
        ))}
      </div>

      {/* Recently liked */}
      {liked.length > 0 && (
        <div>
          <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 18, color: '#EEF0FF', marginBottom: 14 }}>Recently Liked</h3>
          {liked.slice(0, 6).map((t, i) => (
            <TrackRow key={t.id} track={t} index={i} isActive={currentTrack?.id === t.id} onPlay={tr => onPlay(tr, liked)} />
          ))}
        </div>
      )}

      {/* Your playlists */}
      {playlists.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 18, color: '#EEF0FF', marginBottom: 14 }}>Your Playlists</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 14 }}>
            {playlists.map(pl => (
              <div
                key={pl.id}
                onClick={() => pl.tracks[0] && onPlay(pl.tracks[0], pl.tracks)}
                style={{ background: '#141720', border: '1px solid rgba(255,255,255,.06)', borderRadius: 14, padding: 14, cursor: 'pointer', transition: 'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.14)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.06)'; e.currentTarget.style.transform = 'none' }}
              >
                <img src={pl.cover} alt={pl.name} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 9, display: 'block', marginBottom: 10 }} />
                <p style={{ fontSize: 12, fontWeight: 600, color: '#EEF0FF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>{pl.name}</p>
                <p style={{ fontSize: 10, color: '#494D66' }}>{pl.tracks.length} tracks</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
