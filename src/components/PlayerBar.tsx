import React from 'react'
import type { Track } from '../types'

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
  isFullscreen: boolean
  onToggleFullscreen: () => void
}

export default function PlayerBar({ 
  track, isPlaying, progress, currentSecs, shuffle, repeat, liked, volume, 
  onTogglePlay, onNext, onPrev, onSeek, onShuffle, onRepeat, onLike, onVolumeChange, 
  isFullscreen, onToggleFullscreen 
}: PlayerBarProps) {
  
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  if (!track) return null

  return (
    <div className="fixed bottom-[85px] lg:bottom-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-2xl border-t border-white/5 transition-all">
      
      {/* 📱 MOBILE PROGRESS BAR (Spans the very top edge) */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/10 lg:hidden cursor-pointer" onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); onSeek(((e.clientX - r.left) / r.width) * 100); }}>
        <div className="h-full bg-[#00e628] shadow-[0_0_10px_#00e628]" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex items-center justify-between px-4 lg:px-6 h-16 lg:h-24">
        
        {/* 1. LEFT: Track Info (Takes exactly 1/3 width) */}
        <div className="flex items-center gap-3 w-1/2 lg:w-1/3 min-w-0">
          <img src={track.albumArt} className="h-10 w-10 lg:h-14 lg:w-14 rounded-md object-cover shadow-lg" alt="" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm lg:text-base font-bold text-white leading-tight">{track.title}</p>
            <p className="truncate text-[10px] lg:text-xs text-white/50 font-medium mt-0.5">{track.artist}</p>
          </div>
        </div>

        {/* 2. CENTER: Desktop Controls (Takes exactly 1/3 width) */}
        <div className="hidden lg:flex flex-col items-center justify-center w-1/3 max-w-md gap-2">
          {/* Top Row: Buttons */}
          <div className="flex items-center gap-6">
            <button onClick={onShuffle} className={`text-sm transition-colors ${shuffle ? 'text-[#00e628]' : 'text-white/40 hover:text-white'}`}>🔀</button>
            <button onClick={onPrev} className="text-white/60 hover:text-white text-lg transition-colors">⏮</button>
            <button onClick={onTogglePlay} className="h-10 w-10 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 transition-transform shadow-md">
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button onClick={onNext} className="text-white/60 hover:text-white text-lg transition-colors">⏭</button>
            <button onClick={onRepeat} className={`text-sm transition-colors ${repeat ? 'text-[#00e628]' : 'text-white/40 hover:text-white'}`}>🔁</button>
          </div>
          
          {/* Bottom Row: Scrubber */}
          <div className="flex items-center gap-3 w-full">
            <span className="text-[10px] text-white/40 w-8 text-right font-mono">{formatTime(currentSecs)}</span>
            <div 
              onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); onSeek(((e.clientX - r.left) / r.width) * 100); }} 
              className="h-1.5 flex-1 bg-white/10 rounded-full cursor-pointer group relative flex items-center"
            >
              <div className="h-full bg-white group-hover:bg-[#00e628] rounded-full transition-colors relative" style={{ width: `${progress}%` }}>
                 <div className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-md transition-opacity" />
              </div>
            </div>
            <span className="text-[10px] text-white/40 w-8 font-mono">{formatTime(track.duration || 0)}</span>
          </div>
        </div>

        {/* 3. RIGHT: Secondary Actions (Takes exactly 1/3 width) */}
        <div className="flex items-center justify-end gap-4 w-1/2 lg:w-1/3">
          
          {/* Desktop Video Toggle */}
          <button 
            onClick={onToggleFullscreen} 
            className={`hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wide uppercase transition-all ${
              isFullscreen ? 'bg-[#00e628] text-black shadow-[0_0_15px_rgba(0,230,40,0.3)]' : 'bg-transparent text-white/60 hover:text-white border border-white/10 hover:border-white/30'
            }`}
          >
            📺 {isFullscreen ? 'Hide' : 'Video'}
          </button>
          
          {/* Desktop Volume */}
          <div className="hidden lg:flex items-center gap-2 group">
            <span className="text-white/40 text-sm group-hover:text-white transition-colors">🔈</span>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={volume} 
              onChange={e => onVolumeChange(Number(e.target.value))} 
              className="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-white hover:accent-[#00e628] transition-all" 
            />
          </div>

          {/* Mobile Quick Actions */}
          <div className="flex lg:hidden items-center gap-5 pr-2">
            <button onClick={onLike} className={`text-xl transition-transform active:scale-125 ${liked ? 'text-[#00e628]' : 'text-white/40'}`}>
              {liked ? '♥' : '♡'}
            </button>
            <button onClick={onToggleFullscreen} className="text-white/60 hover:text-white text-xl transition-colors">
              📺
            </button>
            <button onClick={onTogglePlay} className="text-white text-2xl active:scale-95 transition-transform">
              {isPlaying ? '⏸' : '▶'}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}