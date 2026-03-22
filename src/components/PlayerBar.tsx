import React from 'react'
import type { Track } from '../types'

interface PlayerBarProps {
  track: Track | null; isPlaying: boolean; progress: number; currentSecs: number; shuffle: boolean; repeat: boolean; liked: boolean; volume: number;
  onTogglePlay: () => void; onNext: () => void; onPrev: () => void; onSeek: (pct: number) => void; onShuffle: () => void; onRepeat: () => void; onLike: () => void; onVolumeChange: (v: number) => void;
  isFullscreen: boolean; onToggleFullscreen: () => void;
}

export default function PlayerBar({ track, isPlaying, progress, currentSecs, shuffle, repeat, liked, volume, onTogglePlay, onNext, onPrev, onSeek, onShuffle, onRepeat, onLike, onVolumeChange, isFullscreen, onToggleFullscreen }: PlayerBarProps) {
  
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  if (!track) return null

  return (
    <div className="fixed bottom-[85px] lg:bottom-0 z-50 w-full border-t border-white/5 bg-[#121212]/95 backdrop-blur-xl">
      <div className="grid grid-cols-2 lg:grid-cols-[320px_1fr_320px] items-center px-4 py-3 sm:px-6">
        
        {/* LEFT: Track Info */}
        <div className="flex min-w-0 items-center gap-3">
          <img src={track.albumArt} className="h-10 w-10 lg:h-14 lg:w-14 rounded-xl object-cover shadow-2xl" alt="" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm lg:text-base font-black text-white leading-tight">{track.title}</p>
            <p className="truncate text-[10px] lg:text-xs text-[#00e628] font-black uppercase tracking-tighter">{track.artist}</p>
          </div>
        </div>

        {/* CENTER: Desktop Controls */}
        <div className="hidden lg:flex flex-col items-center gap-2">
          <div className="flex items-center gap-8 text-xl">
            <button onClick={onShuffle} className={`transition-colors ${shuffle ? 'text-[#00e628]' : 'text-white/20 hover:text-white'}`}>🔀</button>
            <button onClick={onPrev} className="text-white/40 hover:text-white transition-colors">⏮</button>
            <button 
              onClick={onTogglePlay} 
              className="h-12 w-12 flex items-center justify-center rounded-full bg-white text-black hover:scale-110 transition shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button onClick={onNext} className="text-white/40 hover:text-white transition-colors">⏭</button>
            <button onClick={onRepeat} className={`transition-colors ${repeat ? 'text-[#00e628]' : 'text-white/20 hover:text-white'}`}>🔁</button>
          </div>
          
          <div className="flex w-full items-center gap-3 max-w-md">
            <span className="text-[10px] text-white/30 font-black w-10 text-right">{formatTime(currentSecs)}</span>
            <div 
              onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); onSeek(((e.clientX - r.left) / r.width) * 100); }} 
              className="h-1 flex-1 bg-white/10 rounded-full cursor-pointer relative group"
            >
              <div className="h-full bg-[#00e628] rounded-full relative" style={{ width: `${progress}%` }}>
                 <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
              </div>
            </div>
            <span className="text-[10px] text-white/30 font-black w-10">{formatTime(track.duration || 0)}</span>
          </div>
        </div>

        {/* RIGHT: Full Screen & Volume */}
        <div className="flex items-center justify-end gap-3 lg:gap-6">
          
          {/* 🎬 THIS IS THE BUTTON YOU WERE MISSING ON DESKTOP */}
          <button 
            onClick={onToggleFullscreen} 
            className="group flex items-center gap-2 bg-[#00e628]/10 text-[#00e628] border border-[#00e628]/30 px-4 lg:px-6 py-2.5 rounded-full text-[10px] lg:text-xs font-black uppercase tracking-widest hover:bg-[#00e628] hover:text-black transition-all active:scale-95 shadow-lg shadow-[#00e628]/5"
          >
            <span className="text-sm lg:text-base group-hover:animate-pulse">📺</span>
            <span>{isFullscreen ? 'Hide Video' : 'View Video'}</span>
          </button>
          
          <div className="hidden lg:flex items-center gap-3">
            <span className="text-xs opacity-40">🔈</span>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={volume} 
              onChange={e => onVolumeChange(Number(e.target.value))} 
              className="w-24 accent-[#00e628] cursor-pointer" 
            />
          </div>

          {/* Mobile Play/Pause (Hidden on Desktop) */}
          <button onClick={onTogglePlay} className="lg:hidden h-10 w-10 flex items-center justify-center rounded-full bg-white text-black font-bold shadow-xl">
            {isPlaying ? '⏸' : '▶'}
          </button>
        </div>

      </div>
    </div>
  )
}