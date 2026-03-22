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
      <div className="grid grid-cols-2 lg:grid-cols-[300px_1fr_300px] items-center px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <img src={track.albumArt} className="h-10 w-10 lg:h-12 lg:w-12 rounded-lg object-cover" alt="" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white leading-tight">{track.title}</p>
            <p className="truncate text-[10px] text-gray-500 font-bold uppercase tracking-tighter">{track.artist}</p>
          </div>
        </div>

        <div className="hidden lg:flex flex-col items-center gap-2">
          <div className="flex items-center gap-6 text-lg">
            <button onClick={onShuffle} className={shuffle ? 'text-[#00e628]' : 'text-white/20'}>🔀</button>
            <button onClick={onPrev}>⏮</button>
            <button onClick={onTogglePlay} className="h-10 w-10 flex items-center justify-center rounded-full bg-[#00e628] text-black transition-transform hover:scale-110 shadow-lg">{isPlaying ? '⏸' : '▶'}</button>
            <button onClick={onNext}>⏭</button>
            <button onClick={onRepeat} className={repeat ? 'text-[#00e628]' : 'text-white/20'}>🔁</button>
          </div>
          <div className="flex w-full items-center gap-3 max-w-md">
            <span className="text-[10px] text-white/30 font-bold w-10 text-right">{formatTime(currentSecs)}</span>
            <div onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); onSeek(((e.clientX - r.left) / r.width) * 100); }} className="h-1 flex-1 bg-white/10 rounded-full cursor-pointer overflow-hidden relative"><div className="h-full bg-[#00e628] rounded-full" style={{ width: `${progress}%` }} /></div>
            <span className="text-[10px] text-white/30 font-bold w-10">{formatTime(track.duration || 0)}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 sm:gap-4">
          <button onClick={onToggleFullscreen} className="bg-[#00e628]/10 text-[#00e628] border border-[#00e628]/20 px-3 lg:px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#00e628]/20 transition-all active:scale-95">{isFullscreen ? 'Hide Video' : 'View Video'}</button>
          <div className="hidden lg:flex items-center gap-2"><input type="range" min="0" max="100" value={volume} onChange={e => onVolumeChange(Number(e.target.value))} className="w-20 accent-[#00e628]" /></div>
          <button onClick={onTogglePlay} className="lg:hidden h-10 w-10 flex items-center justify-center rounded-full bg-white text-black font-bold">{isPlaying ? '⏸' : '▶'}</button>
        </div>
      </div>
    </div>
  )
}