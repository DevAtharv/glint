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
  
  return (
    <div
      onClick={() => canPlay && onPlay(track)}
      style={{
        display: 'grid',
        gridTemplateColumns: '32px 1fr auto',
        alignItems: 'center',
        gap: 12,
        padding: '8px 10px',
        borderRadius: 10,
        cursor: canPlay ? 'pointer' : 'not-allowed',
        background: isActive ? 'rgba(0,230,40,.08)' : 'transparent',
        transition: 'background .15s',
        opacity: canPlay ? 1 : 0.5,
      }}
      onMouseEnter={e => { if (!isActive && canPlay) e.currentTarget.style.background = 'rgba(255,255,255,.05)' }}
      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
      className="track-row-item"
    >
      <div style={{ textAlign: 'center', position: 'relative' }}>
        <span style={{ fontSize: 12, color: isActive ? '#00e628' : '#474747' }}>{index + 1}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <img src={track.albumArt || `https://picsum.photos/seed/${index}/120/120`} alt={track.title} style={{ width: 40, height: 40, borderRadius: 7, objectFit: 'cover', flexShrink: 0 }} />
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: isActive ? '#00e628' : '#e2e2e2', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{track.title}</p>
          <p style={{ fontSize: 11, color: '#888', marginTop: 2 }}>
            {track.artist}
            {!canPlay && <span style={{ color: '#f5a623', marginLeft: 6 }}> · Not playable</span>}
            {track.plays && <span style={{ color: '#474747' }}> · {track.plays} plays</span>}
          </p>
        </div>
      </div>
      <span style={{ fontSize: 11, color: '#474747' }}>{formatTime(track.duration)}</span>
    </div>
  )
}
