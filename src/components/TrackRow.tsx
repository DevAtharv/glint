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
        background: isActive ? 'rgba(108,99,255,.08)' : 'transparent',
        transition: 'background .15s',
        opacity: canPlay ? 1 : 0.5,
      }}
      onMouseEnter={e => { if (!isActive && canPlay) e.currentTarget.style.background = '#1F2233' }}
      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
      className="track-row-item"
    >
      <div style={{ textAlign: 'center', position: 'relative' }}>
        <span style={{ fontSize: 12, color: isActive ? '#6C63FF' : '#494D66' }}>{index + 1}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <img src={track.albumArt || `https://picsum.photos/seed/${index}/120/120`} alt={track.title} style={{ width: 40, height: 40, borderRadius: 7, objectFit: 'cover', flexShrink: 0 }} />
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: isActive ? '#8B85FF' : '#EEF0FF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{track.title}</p>
          <p style={{ fontSize: 11, color: '#8B8FA8', marginTop: 2 }}>
            {track.artist}
            {!canPlay && <span style={{ color: '#f5a623', marginLeft: 6 }}> · Not playable</span>}
            {track.plays && <span style={{ color: '#494D66' }}> · {track.plays} plays</span>}
          </p>
        </div>
      </div>
      <span style={{ fontSize: 11, color: '#494D66' }}>{formatTime(track.duration)}</span>
    </div>
  )
}
