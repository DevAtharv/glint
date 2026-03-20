import React, { useState } from 'react'
import type { Track, Playlist } from '../types'

interface EditPlaylistPageProps {
  playlist: Playlist
  onSave: (playlist: Playlist) => void
  onBack: () => void
  onPlay: (track: Track, queue?: Track[]) => void
  currentTrack: Track | null
}

export default function EditPlaylistPage({ playlist, onSave, onBack, onPlay, currentTrack }: EditPlaylistPageProps) {
  const [name, setName] = useState(playlist.name)
  const [tracks, setTracks] = useState<Track[]>([...playlist.tracks])
  const [editing, setEditing] = useState(false)

  const handleSave = () => {
    onSave({
      ...playlist,
      name,
      tracks,
    })
    setEditing(false)
  }

  const handleRemoveTrack = (index: number) => {
    setTracks(prev => prev.filter((_, i) => i !== index))
  }

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    setTracks(prev => {
      const newTracks = [...prev]
      const temp = newTracks[index]
      newTracks[index] = newTracks[index - 1]
      newTracks[index - 1] = temp
      return newTracks
    })
  }

  const handleMoveDown = (index: number) => {
    if (index === tracks.length - 1) return
    setTracks(prev => {
      const newTracks = [...prev]
      const temp = newTracks[index]
      newTracks[index] = newTracks[index + 1]
      newTracks[index + 1] = temp
      return newTracks
    })
  }

  return (
    <div style={{ padding: '0 32px 32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255,255,255,.05)',
            border: '1px solid rgba(255,255,255,.06)',
            borderRadius: 8,
            width: 36,
            height: 36,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#8B8FA8">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </button>
        <div style={{ flex: 1 }}>
          {editing ? (
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: '2px solid #6C63FF',
                color: '#EEF0FF',
                fontSize: 22,
                fontFamily: "'Instrument Serif', serif",
                outline: 'none',
                width: '100%',
                paddingBottom: 4,
              }}
              autoFocus
            />
          ) : (
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, color: '#EEF0FF' }}>{name}</h2>
          )}
          <p style={{ fontSize: 12, color: '#8B8FA8', marginTop: 4 }}>{tracks.length} tracks</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {editing ? (
            <>
              <button
                onClick={() => { setName(playlist.name); setTracks([...playlist.tracks]); setEditing(false) }}
                style={{
                  padding: '8px 16px',
                  background: 'rgba(255,255,255,.05)',
                  border: '1px solid rgba(255,255,255,.06)',
                  borderRadius: 8,
                  color: '#8B8FA8',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={{
                  padding: '8px 16px',
                  background: '#6C63FF',
                  border: 'none',
                  borderRadius: 8,
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              style={{
                padding: '8px 16px',
                background: '#6C63FF',
                border: 'none',
                borderRadius: 8,
                color: '#fff',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
              </svg>
              Edit Playlist
            </button>
          )}
        </div>
      </div>

      {/* Play All Button */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => tracks.length > 0 && onPlay(tracks[0], tracks)}
          style={{
            padding: '12px 24px',
            background: '#6C63FF',
            border: 'none',
            borderRadius: 25,
            color: '#fff',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M8 5v14l11-7z" />
          </svg>
          Play All
        </button>
      </div>

      {/* Track List */}
      <div style={{ background: '#141720', borderRadius: 14, border: '1px solid rgba(255,255,255,.06)', overflow: 'hidden' }}>
        {tracks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ fontSize: 14, color: '#8B8FA8' }}>No tracks in this playlist</p>
            <p style={{ fontSize: 12, color: '#494D66', marginTop: 6 }}>Import songs from Spotify to add tracks</p>
          </div>
        ) : (
          tracks.map((track, index) => (
            <div
              key={`${track.id}-${index}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 16px',
                borderBottom: index < tracks.length - 1 ? '1px solid rgba(255,255,255,.04)' : 'none',
                background: currentTrack?.id === track.id ? 'rgba(108,99,255,.08)' : 'transparent',
                transition: 'background .15s',
              }}
              onMouseEnter={e => { if (currentTrack?.id !== track.id) e.currentTarget.style.background = 'rgba(255,255,255,.03)' }}
              onMouseLeave={e => { if (currentTrack?.id !== track.id) e.currentTarget.style.background = 'transparent' }}
            >
              {/* Track Number / Play Button */}
              <div style={{ width: 32, textAlign: 'center', flexShrink: 0 }}>
                {editing ? (
                  <span style={{ fontSize: 12, color: '#494D66' }}>{index + 1}</span>
                ) : (
                  <button
                    onClick={() => onPlay(track, tracks)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                    }}
                  >
                    {currentTrack?.id === track.id ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#6C63FF">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#494D66">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>
                )}
              </div>

              {/* Album Art */}
              <img
                src={track.albumArt || `https://picsum.photos/seed/${index}/120/120`}
                alt={track.title}
                style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover', flexShrink: 0, marginRight: 12 }}
              />

              {/* Track Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: currentTrack?.id === track.id ? '#8B85FF' : '#EEF0FF',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {track.title}
                </p>
                <p style={{ fontSize: 11, color: '#8B8FA8', marginTop: 2 }}>{track.artist}</p>
              </div>

              {/* Edit Controls */}
              {editing && (
                <div style={{ display: 'flex', gap: 4, marginLeft: 12 }}>
                  <button
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    style={{
                      background: 'rgba(255,255,255,.05)',
                      border: '1px solid rgba(255,255,255,.06)',
                      borderRadius: 6,
                      width: 28,
                      height: 28,
                      cursor: index === 0 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: index === 0 ? 0.3 : 1,
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#8B8FA8">
                      <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleMoveDown(index)}
                    disabled={index === tracks.length - 1}
                    style={{
                      background: 'rgba(255,255,255,.05)',
                      border: '1px solid rgba(255,255,255,.06)',
                      borderRadius: 6,
                      width: 28,
                      height: 28,
                      cursor: index === tracks.length - 1 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: index === tracks.length - 1 ? 0.3 : 1,
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#8B8FA8">
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleRemoveTrack(index)}
                    style={{
                      background: 'rgba(255,77,109,.1)',
                      border: '1px solid rgba(255,77,109,.2)',
                      borderRadius: 6,
                      width: 28,
                      height: 28,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#FF4D6D">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Edit Mode Instructions */}
      {editing && (
        <div style={{
          marginTop: 16,
          padding: '12px 16px',
          background: 'rgba(108,99,255,.08)',
          border: '1px solid rgba(108,99,255,.2)',
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#6C63FF">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
          </svg>
          <p style={{ fontSize: 12, color: '#8B85FF' }}>
            Use the arrow buttons to reorder tracks. Click the X to remove a track.
          </p>
        </div>
      )}
    </div>
  )
}
