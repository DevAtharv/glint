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
    <button
      type="button"
      onClick={() => canPlay && onPlay(track)}
      disabled={!canPlay}
      className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
        isActive
          ? 'bg-[rgba(108,99,255,0.12)]'
          : canPlay
            ? 'hover:bg-white/5'
            : 'cursor-not-allowed opacity-50'
      }`}
    >
      <div className="w-7 shrink-0 text-center text-xs text-[#6B6F85] sm:w-8 sm:text-sm">
        {index + 1}
      </div>

      <div className="flex min-w-0 flex-1 items-center gap-3">
        <img
          src={track.albumArt || `https://picsum.photos/seed/${index}/120/120`}
          alt={track.title}
          className="h-11 w-11 shrink-0 rounded-lg object-cover sm:h-12 sm:w-12"
        />

        <div className="min-w-0 flex-1">
          <p className={`truncate text-sm font-medium ${isActive ? 'text-[#8B85FF]' : 'text-[#EEF0FF]'}`}>
            {track.title}
          </p>

          <p className="truncate text-xs text-[#A0A3B1]">
            {track.artist}
            {!canPlay && <span className="ml-2 text-amber-400">· Not playable</span>}
            {track.plays && <span className="ml-2 text-[#6B6F85]">· {track.plays} plays</span>}
          </p>
        </div>
      </div>

      <span className="shrink-0 text-xs text-[#6B6F85] sm:text-sm">
        {formatTime(track.duration)}
      </span>
    </button>
  )
}
