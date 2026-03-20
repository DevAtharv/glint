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

export default function PlayerBar({ track, isPlaying, progress, currentSecs, shuffle, repeat, liked, volume, onTogglePlay, onNext, onPrev, onSeek, onShuffle, onRepeat, onLike, onVolumeChange }: PlayerBarProps) {
  const canPlay = !!track?.youtubeId

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    onSeek(((e.clientX - rect.left) / rect.width) * 100)
  }

  if (!track) return (
    <div style={{ gridColumn: 2, background: 'rgba(15,15,15,.95)', borderTop: '1px solid rgba(255,255,255,.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,.25)' }}>Search or browse to start listening</p>
    </div>
  )

  return (
    <div style={{ gridColumn: 2, background: 'rgba(15,15,15,.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,.05)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Progress bar — top edge */}
      <div onClick={handleProgressClick} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,.08)', cursor: 'pointer', zIndex: 10 }}>
        <div style={{ height: '100%', width: `${Math.min(100, progress)}%`, background: 'var(--primary)', boxShadow: '0 0 8px rgba(0,230,40,.5)', borderRadius: '0 3px 3px 0', transition: 'width .5s linear' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '0 24px', height: 80, gap: 24 }}>
        {/* Track info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: 8, overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(255,255,255,.1)', boxShadow: '0 4px 20px rgba(0,0,0,.5)' }}>
            <img src={track.albumArt} alt={track.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#e2e2e2', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>{track.title}</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>{track.artist}</p>
          </div>
          <button onClick={onLike} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, marginLeft: 4, flexShrink: 0 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: liked ? '#4ade80' : 'rgba(255,255,255,.3)', fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
          </button>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <button onClick={onShuffle} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: shuffle ? 'var(--primary)' : 'rgba(255,255,255,.3)' }}>shuffle</span>
            </button>
            <button onClick={onPrev} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 22, color: 'rgba(255,255,255,.6)' }}>skip_previous</span>
            </button>
            <button onClick={onTogglePlay}
              style={{ width: 44, height: 44, background: '#fff', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,.4)', transition: 'transform .1s', flexShrink: 0 }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(.93)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 24, color: '#000', fontVariationSettings: "'FILL' 1" }}>
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            </button>
            <button onClick={onNext} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 22, color: 'rgba(255,255,255,.6)' }}>skip_next</span>
            </button>
            <button onClick={onRepeat} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: repeat ? 'var(--primary)' : 'rgba(255,255,255,.3)' }}>repeat</span>
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 360 }}>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', minWidth: 30, textAlign: 'right' }}>{formatTime(currentSecs)}</span>
            <div onClick={handleProgressClick} style={{ flex: 1, height: 3, background: 'rgba(255,255,255,.1)', borderRadius: 3, cursor: 'pointer', position: 'relative' }}>
              <div style={{ width: `${Math.min(100, progress)}%`, height: '100%', background: 'rgba(255,255,255,.7)', borderRadius: 3 }} />
            </div>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', minWidth: 30 }}>{formatTime(track.duration || 0)}</span>
          </div>
        </div>

        {/* Volume + extras */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'rgba(255,255,255,.4)' }}>lyrics</span>
          </button>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'rgba(255,255,255,.4)' }}>queue_music</span>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'rgba(255,255,255,.4)' }}>volume_up</span>
            <input type="range" min={0} max={100} value={volume} onChange={e => onVolumeChange(Number(e.target.value))}
              style={{ width: 80, accentColor: 'var(--primary)' }} />
          </div>
        </div>
      </div>

      {!canPlay && (
        <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', background: 'rgba(245,166,35,.1)', border: '1px solid rgba(245,166,35,.2)', borderRadius: '8px 8px 0 0', padding: '4px 12px', fontSize: 10, color: 'var(--yellow)', whiteSpace: 'nowrap' }}>
          This track wasn't matched on YouTube
        </div>
      )}
    </div>
  )
}
