import React, { useState } from 'react'
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
  // ADDED PROPS
  isFullscreen: boolean
  onToggleFullscreen: () => void
}

export default function PlayerBar({
  track,
  isPlaying,
  progress,
  currentSecs,
  shuffle,
  repeat,
  liked,
  volume,
  onTogglePlay,
  onNext,
  onPrev,
  onSeek,
  onShuffle,
  onRepeat,
  onLike,
  onVolumeChange,
  isFullscreen,
  onToggleFullscreen
}: PlayerBarProps) {
  const [showOptions, setShowOptions] = useState(false)

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = ((e.clientX - rect.left) / rect.width) * 100
    onSeek(Math.max(0, Math.min(100, pct)))
  }

  if (!track) {
    return (
      <div className="sticky bottom-0 z-40 border-t border-white/10 bg-[#121212]/95 px-4 py-4 text-center text-gray-400 backdrop-blur-xl">
        Search or play something
      </div>
    )
  }

  return (
    <div className="sticky bottom-0 z-40 border-t border-white/10 bg-[#121212]/95 backdrop-blur-xl">
      <div className="grid grid-cols-1 gap-3 px-4 py-3 sm:px-6 lg:grid-cols-[minmax(240px,320px)_1fr_minmax(220px,280px)] lg:items-center">
        
        {/* LEFT: Track Info */}
        <div className="flex min-w-0 items-center gap-3">
          <img src={track.albumArt} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{track.title}</p>
            <p className="truncate text-xs text-gray-400">{track.artist}</p>
          </div>
          <button onClick={onLike} className="p-2 transition hover:bg-white/5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill={liked ? '#00e628' : 'none'} stroke={liked ? '#00e628' : '#8B8FA8'} strokeWidth="2">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        </div>

        {/* CENTER: Controls */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-4">
            <button onClick={onShuffle} className={`p-2 transition ${shuffle ? 'text-[#00e628]' : 'text-gray-500'}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" /></svg>
            </button>
            <button onClick={onPrev} className="text-white hover:scale-110 transition"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" /></svg></button>
            <button onClick={onTogglePlay} className="h-12 w-12 flex items-center justify-center rounded-full bg-[#00e628] text-black hover:scale-105 transition shadow-lg">
              {isPlaying ? <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg> : <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="ml-1"><path d="M8 5v14l11-7z" /></svg>}
            </button>
            <button onClick={onNext} className="text-white hover:scale-110 transition"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zm2.5-6L12 9v6l-3.5-3zM16 6h2v12h-2z" /></svg></button>
            <button onClick={onRepeat} className={`p-2 transition ${repeat ? 'text-[#00e628]' : 'text-gray-500'}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" /></svg>
            </button>
          </div>
          <div className="flex w-full items-center gap-2">
            <span className="text-[10px] text-gray-500 w-10 text-right">{formatTime(currentSecs)}</span>
            <div onClick={handleProgressClick} className="h-1.5 flex-1 bg-white/10 rounded-full cursor-pointer relative group">
              <div className="h-full bg-[#00e628] rounded-full" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-[10px] text-gray-500 w-10">{formatTime(track.duration || 0)}</span>
          </div>
        </div>

        {/* RIGHT: Options & Toggle */}
        <div className="flex items-center justify-end gap-3">
          <button 
            onClick={onToggleFullscreen} 
            className="flex items-center gap-2 rounded-full border border-[#00e628]/30 bg-[#00e628]/10 px-4 py-2 text-xs font-black text-[#00e628] hover:bg-[#00e628]/20 transition-all active:scale-95"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
            VIEW VIDEO
          </button>
          <div className="flex items-center gap-2">
            <input type="range" min="0" max="100" value={volume} onChange={e => onVolumeChange(Number(e.target.value))} className="w-20 accent-[#00e628]" />
          </div>
        </div>

      </div>
    </div>
  )
}