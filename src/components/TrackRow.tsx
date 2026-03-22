import React from 'react'
import type { Track } from '../types'

interface TrackRowProps {
  track: Track
  isActive: boolean
  onPlay: (track: Track) => void
  onLike?: () => void
  isLiked?: boolean
}

export default function TrackRow({ track, isActive, onPlay, onLike, isLiked }: TrackRowProps) {
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  return (
    <div 
      onClick={() => onPlay(track)}
      className={`group grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_1fr_100px] items-center gap-4 px-4 py-3 rounded-xl transition-all cursor-pointer ${
        isActive ? 'bg-[#00e628]/10' : 'hover:bg-white/5'
      }`}
    >
      {/* ART & TITLES */}
      <div className="flex items-center gap-3 min-w-0">
        <img 
          src={track.albumArt || 'https://placehold.co/96x96/png'} 
          alt="" 
          className="h-10 w-10 lg:h-12 lg:w-12 shrink-0 rounded-lg object-cover shadow-lg" 
        />
        <div className="min-w-0">
          <p className={`truncate text-sm font-bold leading-tight ${isActive ? 'text-[#00e628]' : 'text-white'}`}>
            {track.title}
          </p>
          {/* Stacks artist under title on mobile ONLY */}
          <p className="truncate text-[10px] text-white/40 font-bold uppercase tracking-tight mt-0.5 md:hidden">
            {track.artist}
          </p>
          {/* Shows artist in its own column on Desktop */}
          <p className="hidden md:block truncate text-xs text-white/40 font-bold uppercase">
            {track.artist}
          </p>
        </div>
      </div>

      {/* ALBUM COLUMN (Hidden on Mobile) */}
      <div className="hidden md:block truncate text-sm text-white/20 font-bold uppercase tracking-widest">
        Single
      </div>

      {/* ACTIONS & TIME */}
      <div className="flex items-center justify-end gap-6">
        {onLike && (
          <button 
            onClick={(e) => { e.stopPropagation(); onLike(); }}
            className={`text-lg transition-transform active:scale-150 ${isLiked ? 'text-[#00e628]' : 'text-white/10 hover:text-white'}`}
          >
            {isLiked ? '♥' : '♡'}
          </button>
        )}
        <span className="hidden md:block text-xs font-mono text-white/20 w-10 text-right">
          {formatTime(track.duration || 0)}
        </span>
        {/* Mobile Play Indicator */}
        <div className="md:hidden text-[#00e628] text-sm font-black">▶</div>
      </div>
    </div>
  )
}