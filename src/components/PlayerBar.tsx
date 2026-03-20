import React from 'react'
import type { Track } from '../types'
import { formatTime } from '../utils/helpers'

interface PlayerBarProps {
  track: Track | null
  isPlaying: boolean
  progress: number
  currentSecs: number
  shuffle: boolean
  repeat: boolean
  liked: boolean
  volume: number
  onTogglePlay: () => void
  onNext: () => void
  onPrev: () => void
  onSeek: (pct: number) => void
  onShuffle: () => void
  onRepeat: () => void
  onLike: () => void
  onVolumeChange: (v: number) => void
}

export default function PlayerBar({
  track, isPlaying, progress, currentSecs,
  shuffle, repeat, liked, volume,
  onTogglePlay, onNext, onPrev, onSeek,
  onShuffle, onRepeat, onLike, onVolumeChange,
}: PlayerBarProps) {
  if (!track) {
    return (
      <div style={{ gridColumn: 2, background: '#0E1018', borderTop: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: 13, color: '#494D66' }}>Search or browse to start listening</p>
      </div>
    )
  }

  // Check if track has a valid YouTube ID
  const canPlay = !!track.youtubeId

  return (
    <div style={{ gridColumn: 2, background: '#0E1018', borderTop: '1px solid rgba(255,255,255,.06)', display: 'flex', flexDirection: 'column' }}>
      {!canPlay && (
        <div style={{ background: 'rgba(245,166,35,.1)', borderBottom: '1px solid rgba(245,166,35,.2)', padding: '6px 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#f5a623"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
          <p style={{ fontSize: 11, color: '#f5a623' }}>This track could not be matched on YouTube</p>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 220px', alignItems: 'center', padding: '0 24px', gap: 16, height: canPlay ? 88 : 72 }}>

      {/* Track info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        <img src={track.albumArt} alt={track.title} style={{ width: 46, height: 46, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#EEF0FF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{track.title}</p>
          <p style={{ fontSize: 11, color: '#8B8FA8', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{track.artist}</p>
        </div>
        <button onClick={onLike} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? '#FF4D6D' : 'none'} stroke={liked ? '#FF4D6D' : '#494D66'} strokeWidth="2">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>
      </div>

      {/* Controls + progress */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={onShuffle} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, opacity: shuffle ? 1 : 0.5 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={shuffle ? '#6C63FF' : '#8B8FA8'}>
              <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
            </svg>
          </button>
          <button onClick={onPrev} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.06)', borderRadius: '50%', width: 34, height: 34, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#EEF0FF"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>
          </button>
          <button onClick={onTogglePlay} style={{ background: '#EEF0FF', border: 'none', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isPlaying
              ? <svg width="18" height="18" viewBox="0 0 24 24" fill="#080A0F"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              : <svg width="18" height="18" viewBox="0 0 24 24" fill="#080A0F"><path d="M8 5v14l11-7z"/></svg>
            }
          </button>
          <button onClick={onNext} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.06)', borderRadius: '50%', width: 34, height: 34, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#EEF0FF"><path d="M6 18l8.5-6L6 6v12zm2.5-6L12 9v6l-3.5-3zM16 6h2v12h-2z"/></svg>
          </button>
          <button onClick={onRepeat} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, opacity: repeat ? 1 : 0.5 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={repeat ? '#6C63FF' : '#8B8FA8'}>
              <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
          <span style={{ fontSize: 10, color: '#494D66', minWidth: 28 }}>{formatTime(currentSecs)}</span>
          <div onClick={handleProgressClick} style={{ flex: 1, height: 3, background: 'rgba(255,255,255,.08)', borderRadius: 3, cursor: 'pointer', position: 'relative' }}>
            <div style={{ width: `${Math.min(100, progress)}%`, height: '100%', background: '#6C63FF', borderRadius: 3 }} />
          </div>
          <span style={{ fontSize: 10, color: '#494D66', minWidth: 28, textAlign: 'right' }}>{formatTime(track.duration || 0)}</span>
        </div>
      </div>

      {/* Volume */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill={volume === 0 ? '#FF4D6D' : '#494D66'}>
          <path d={volume === 0
            ? "M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"
            : "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"
          }/>
        </svg>
        <input
          type="range" min="0" max="100" value={volume}
          onChange={e => onVolumeChange(Number(e.target.value))}
          style={{ width: 80, accentColor: '#6C63FF' }}
        />
      </div>
      </div>
    </div>
  )
}
