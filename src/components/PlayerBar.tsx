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
    <footer style={{ gridColumn: '2', background: '#121212', borderTop: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,.3)' }}>Search or browse to start listening</p>
    </footer>
  )

  return (
    <footer style={{ gridColumn: '2', background: '#121212', borderTop: '1px solid rgba(255,255,255,.06)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Progress bar */}
      <div onClick={handleProgressClick} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,.1)', cursor: 'pointer', zIndex: 10 }}>
        <div style={{ height: '100%', width: `${Math.min(100, progress)}%`, background: '#00e628', borderRadius: '0 2px 2px 0' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '0 16px', height: 72, gap: 16 }}>
        {/* Track info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#282828' }}>
            <img src={track.albumArt || 'https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228'} alt={track.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 140 }}>{track.title}</p>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 140 }}>{track.artist}</p>
          </div>
          <button onClick={onLike} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, marginLeft: 8, flexShrink: 0 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: liked ? '#00e628' : 'rgba(255,255,255,.3)', fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
          </button>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button onClick={onShuffle} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: shuffle ? '#00e628' : 'rgba(255,255,255,.3)' }}>shuffle</span>
            </button>
            <button onClick={onPrev} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'rgba(255,255,255,.6)' }}>skip_previous</span>
            </button>
            <button onClick={onTogglePlay}
              style={{ width: 36, height: 36, background: '#fff', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform .1s' }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(.9)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 22, color: '#000', fontVariationSettings: "'FILL' 1" }}>
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            </button>
            <button onClick={onNext} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'rgba(255,255,255,.6)' }}>skip_next</span>
            </button>
            <button onClick={onRepeat} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: repeat ? '#00e628' : 'rgba(255,255,255,.3)' }}>repeat</span>
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 320 }}>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', minWidth: 30, textAlign: 'right' }}>{formatTime(currentSecs)}</span>
            <div onClick={handleProgressClick} style={{ flex: 1, height: 3, background: 'rgba(255,255,255,.1)', borderRadius: 2, cursor: 'pointer' }}>
              <div style={{ width: `${Math.min(100, progress)}%`, height: '100%', background: '#00e628', borderRadius: 2 }} />
            </div>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', minWidth: 30 }}>{formatTime(track.duration || 0)}</span>
          </div>
        </div>

        {/* Volume */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'rgba(255,255,255,.4)' }}>queue_music</span>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'rgba(255,255,255,.4)' }}>volume_up</span>
            <input type="range" min={0} max={100} value={volume} onChange={e => onVolumeChange(Number(e.target.value))}
              style={{ width: 80, accentColor: '#00e628' }} />
          </div>
        </div>
      </div>

      {!canPlay && (
        <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', background: 'rgba(245,166,35,.1)', border: '1px solid rgba(245,166,35,.2)', borderRadius: '8px 8px 0 0', padding: '4px 12px', fontSize: 10, color: '#f5a623', whiteSpace: 'nowrap' }}>
          This track wasn't matched on YouTube
        </div>
      )}
    </footer>
  )
}
