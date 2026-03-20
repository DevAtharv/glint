import React from 'react'
import type { Track } from '../types'
import { formatTime } from '../utils/helpers'

interface TrackRowProps {
  track: Track
  index: number
  isActive?: boolean
  onPlay: (track: Track) => void
}

export default function TrackRow({ track, index, isActive, onPlay }: TrackRowProps) {
  const canPlay = !!track.youtubeId
  const [hovered, setHovered] = React.useState(false)

  return (
    <div
      onClick={() => canPlay && onPlay(track)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '40px 1fr auto',
        alignItems: 'center',
        gap: 12,
        padding: '8px 12px',
        borderRadius: 8,
        cursor: canPlay ? 'pointer' : 'default',
        background: isActive ? 'rgba(255,255,255,.06)' : hovered ? 'rgba(255,255,255,.04)' : 'transparent',
        transition: 'background .1s',
        opacity: canPlay ? 1 : 0.45,
      }}
    >
      {/* Index / play icon */}
      <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 32 }}>
        {hovered && canPlay ? (
          <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--primary)', fontVariationSettings: "'FILL' 1" }}>
            {isActive ? 'pause_circle' : 'play_circle'}
          </span>
        ) : (
          <span style={{ fontSize: 12, color: isActive ? 'var(--primary)' : 'rgba(255,255,255,.2)', fontWeight: isActive ? 700 : 400 }}>{index + 1}</span>
        )}
      </div>

      {/* Art + info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        <img src={track.albumArt || `https://picsum.photos/seed/${index}/40/40`} alt={track.title}
          style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: isActive ? 'var(--primary)' : '#e2e2e2', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{track.title}</p>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginTop: 2 }}>
            {track.artist}
            {!canPlay && <span style={{ color: 'var(--yellow)', marginLeft: 6 }}>· Not playable</span>}
            {track.plays && <span style={{ color: 'rgba(255,255,255,.2)' }}> · {track.plays}</span>}
          </p>
        </div>
      </div>

      {/* Duration */}
      <span style={{ fontSize: 11, color: 'rgba(255,255,255,.25)', flexShrink: 0 }}>{formatTime(track.duration)}</span>
    </div>
  )
}
