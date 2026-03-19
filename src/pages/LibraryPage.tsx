import React, { useState } from 'react'
import type { Track, Playlist } from '../types'
import TrackRow from '../components/TrackRow'

interface LibraryPageProps {
  liked: Track[]
  playlists: Playlist[]
  onPlay: (track: Track, queue?: Track[]) => void
  currentTrack: Track | null
  onLike: (track: Track) => void
}

export default function LibraryPage({ liked, playlists, onPlay, currentTrack }: LibraryPageProps) {
  const [tab, setTab] = useState<'liked' | 'playlists' | 'albums'>('liked')

  const tabStyle = (active: boolean) => ({
    padding: '7px 18px', borderRadius: 8, fontSize: 12, fontWeight: 600 as const,
    cursor: 'pointer', fontFamily: "'Manrope',sans-serif",
    background: active ? '#6C63FF' : '#141720',
    color: active ? '#fff' : '#8B8FA8',
    border: active ? 'none' : '1px solid rgba(255,255,255,.06)',
    transition: 'all .15s',
  })

  return (
    <div style={{ padding: '0 32px 32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, color: '#EEF0FF' }}>Your Library</h2>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#6C63FF', border: 'none', borderRadius: 10, color: '#fff', fontSize: 12, fontWeight: 700, fontFamily: "'Manrope',sans-serif", cursor: 'pointer' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          New Playlist
        </button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <button style={tabStyle(tab === 'liked')} onClick={() => setTab('liked')}>Liked Songs</button>
        <button style={tabStyle(tab === 'playlists')} onClick={() => setTab('playlists')}>Playlists</button>
        <button style={tabStyle(tab === 'albums')} onClick={() => setTab('albums')}>Albums</button>
      </div>

      {tab === 'liked' && (
        liked.length === 0
          ? <Empty icon="❤️" label="No liked songs yet" sub="Heart a song while it plays to save it here" />
          : <div>{liked.map((t, i) => <TrackRow key={t.id} track={t} index={i} isActive={currentTrack?.id === t.id} onPlay={tr => onPlay(tr, liked)} />)}</div>
      )}

      {tab === 'playlists' && (
        playlists.length === 0
          ? <Empty icon="🎵" label="No playlists yet" sub="Use AI Import to create your first playlist" />
          : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
                {playlists.map(pl => (
                  <div
                    key={pl.id}
                    onClick={() => pl.tracks[0] && onPlay(pl.tracks[0], pl.tracks)}
                    style={{
                      background: '#141720', border: '1px solid rgba(255,255,255,.06)',
                      borderRadius: 14, padding: 14, cursor: 'pointer',
                      transition: 'all .2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.14)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.06)'; e.currentTarget.style.transform = 'none' }}
                  >
                    <img src={pl.cover} alt={pl.name} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 9, display: 'block', marginBottom: 10 }} />
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#EEF0FF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 3 }}>{pl.name}</p>
                    <p style={{ fontSize: 11, color: '#8B8FA8' }}>{pl.tracks.length} tracks</p>
                  </div>
                ))}
              </div>
            )
      )}

      {tab === 'albums' && (
        <Empty icon="💿" label="No saved albums" sub="Albums you save will appear here" />
      )}
    </div>
  )
}

function Empty({ icon, label, sub }: { icon: string; label: string; sub: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 0' }}>
      <div style={{ fontSize: 40, marginBottom: 14 }}>{icon}</div>
      <p style={{ fontSize: 15, fontWeight: 600, color: '#8B8FA8', marginBottom: 6 }}>{label}</p>
      <p style={{ fontSize: 13, color: '#494D66' }}>{sub}</p>
    </div>
  )
}
