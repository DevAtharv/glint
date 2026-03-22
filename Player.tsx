import React, { useRef, useEffect, useState } from 'react'
import type { Track } from '../types'

interface PlayerProps {
  currentTrack: Track | null
  isPlaying: boolean
  onTogglePlay: () => void
  onNext: () => void
  onPrev: () => void
  onToggleFullScreen: () => void
}

const Icons = {
  Play: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M8 5v14l11-7z" /></svg>,
  Pause: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>,
  Next: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>,
  Prev: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>,
  Heart: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 hover:fill-[#00e628] hover:text-[#00e628] transition-colors"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>,
  Expand: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
}

export default function Player({ currentTrack, isPlaying, onTogglePlay, onNext, onPrev, onToggleFullScreen }: PlayerProps) {
  // If you are using standard HTML5 audio, the ref goes here:
  // const audioRef = useRef<HTMLAudioElement>(null)

  if (!currentTrack) return null // Hide player if nothing has been selected yet

  return (
    <div className="fixed bottom-0 left-0 w-full h-24 bg-[#121212]/95 backdrop-blur-xl border-t border-white/10 flex items-center justify-between px-4 md:px-8 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      
      {/* 1. Now Playing Info */}
      <div className="flex items-center gap-4 w-1/4 min-w-[200px]">
        <div 
          onClick={onToggleFullScreen}
          className="w-14 h-14 rounded-md overflow-hidden flex-shrink-0 shadow-lg cursor-pointer group relative"
        >
          <img src={currentTrack.albumArt} alt={currentTrack.title} className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
            <Icons.Expand />
          </div>
        </div>
        <div className="hidden sm:block truncate pr-4">
          <h5 className="text-sm font-bold text-white truncate hover:underline cursor-pointer">{currentTrack.title}</h5>
          <p className="text-xs text-[#b3b3b3] truncate hover:underline cursor-pointer hover:text-white">{currentTrack.artist}</p>
        </div>
        <button className="text-[#b3b3b3] hidden sm:block">
          <Icons.Heart />
        </button>
      </div>

      {/* 2. Main Controls */}
      <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl">
        <div className="flex items-center gap-6">
          <button className="text-[#b3b3b3] hover:text-white transition-colors" onClick={onPrev}>
            <Icons.Prev />
          </button>
          
          <button 
            onClick={onTogglePlay}
            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md"
          >
            {isPlaying ? <Icons.Pause /> : <Icons.Play />}
          </button>
          
          <button className="text-[#b3b3b3] hover:text-white transition-colors" onClick={onNext}>
            <Icons.Next />
          </button>
        </div>
        
        {/* Progress Bar (Visual Only for now) */}
        <div className="w-full flex items-center gap-3 group">
          <span className="text-[10px] font-medium text-[#b3b3b3] w-8 text-right">0:00</span>
          <div className="flex-1 h-1.5 bg-white/10 rounded-full relative overflow-hidden cursor-pointer flex items-center">
            <div className="absolute left-0 h-full w-1/3 bg-white group-hover:bg-[#00e628] rounded-full transition-colors"></div>
            {/* Scrubber Dot */}
            <div className="absolute left-1/3 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transform -translate-x-1.5 shadow-md transition-opacity"></div>
          </div>
          <span className="text-[10px] font-medium text-[#b3b3b3] w-8">3:42</span>
        </div>
      </div>

      {/* 3. Extra Controls (Volume) */}
      <div className="hidden md:flex items-center justify-end gap-4 w-1/4 min-w-[200px]">
        <div className="flex items-center gap-2 group w-32 cursor-pointer">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#b3b3b3]"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
          <div className="flex-1 h-1.5 bg-white/10 rounded-full relative overflow-hidden flex items-center">
            <div className="absolute left-0 h-full w-2/3 bg-white group-hover:bg-[#00e628] rounded-full transition-colors"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
