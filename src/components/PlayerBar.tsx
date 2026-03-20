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
    <footer className="col-start-2 bg-[#121212] border-t border-white/5 flex items-center justify-center h-full">
      <p className="text-sm text-white/30">Search or browse to start listening</p>
    </footer>
  )

  return (
    <footer className="col-start-2 bg-[#121212] border-t border-white/5 flex flex-col relative">
      {/* Progress bar */}
      <div onClick={handleProgressClick} className="absolute top-0 left-0 right-0 h-[3px] bg-white/10 cursor-pointer z-50">
        <div className="h-full bg-primary rounded-r-full transition-all" style={{ width: `${Math.min(100, progress)}%` }} />
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-6 h-[72px] gap-6">
        {/* Track info */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container">
            <img src={track.albumArt} alt={track.title} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate max-w-[160px]">{track.title}</p>
            <p className="text-xs text-white/40 truncate max-w-[160px]">{track.artist}</p>
          </div>
          <button onClick={onLike} className="ml-2">
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: liked ? '#4ade80' : 'rgba(255,255,255,.3)', fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-5">
            <button onClick={onShuffle}>
              <span className="material-symbols-outlined text-lg" style={{ color: shuffle ? '#00e628' : 'rgba(255,255,255,.3)' }}>shuffle</span>
            </button>
            <button onClick={onPrev}>
              <span className="material-symbols-outlined text-xl text-white/60">skip_previous</span>
            </button>
            <button onClick={onTogglePlay}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-2xl text-black" style={{ fontVariationSettings: "'FILL' 1" }}>
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            </button>
            <button onClick={onNext}>
              <span className="material-symbols-outlined text-xl text-white/60">skip_next</span>
            </button>
            <button onClick={onRepeat}>
              <span className="material-symbols-outlined text-lg" style={{ color: repeat ? '#00e628' : 'rgba(255,255,255,.3)' }}>repeat</span>
            </button>
          </div>
          <div className="flex items-center gap-2 w-[360px]">
            <span className="text-[10px] text-white/30 min-w-[30px] text-right">{formatTime(currentSecs)}</span>
            <div onClick={handleProgressClick} className="flex-1 h-[3px] bg-white/10 rounded-full cursor-pointer">
              <div className="h-full bg-white/70 rounded-full" style={{ width: `${Math.min(100, progress)}%` }} />
            </div>
            <span className="text-[10px] text-white/30 min-w-[30px]">{formatTime(track.duration || 0)}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="flex items-center justify-end gap-3">
          <button>
            <span className="material-symbols-outlined text-lg text-white/40">queue_music</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-white/40">volume_up</span>
            <input type="range" min={0} max={100} value={volume} onChange={e => onVolumeChange(Number(e.target.value))}
              className="w-20 accent-primary" />
          </div>
        </div>
      </div>

      {!canPlay && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-yellow-500/10 border border-yellow-500/20 rounded-t-lg px-3 py-1 text-[10px] text-yellow-400 whitespace-nowrap">
          This track wasn't matched on YouTube
        </div>
      )}
    </footer>
  )
}
