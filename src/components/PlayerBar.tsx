import React, { useMemo, useState } from 'react'
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
}: PlayerBarProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const canPlay = !!track?.youtubeId

  const youtubeUrl = useMemo(() => {
    if (!track?.youtubeId) return ''
    return `https://www.youtube.com/embed/${track.youtubeId}?autoplay=1`
  }, [track?.youtubeId])

  if (!track) {
    return (
      <div className="sticky bottom-0 bg-[#121212] border-t border-white/10 px-4 py-4 text-center text-gray-400">
        Search or play something
      </div>
    )
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = ((e.clientX - rect.left) / rect.width) * 100
    onSeek(Math.max(0, Math.min(100, pct)))
  }

  return (
    <>
      {/* 🔻 MINI PLAYER */}
      <div className="sticky bottom-0 bg-[#121212] border-t border-white/10 px-4 py-3 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-3 min-w-0">
          <img src={track.albumArt} className="w-12 h-12 rounded-lg" />

          <div className="truncate">
            <p className="text-sm text-white truncate">{track.title}</p>
            <p className="text-xs text-gray-400 truncate">{track.artist}</p>
          </div>
        </div>

        {/* CENTER */}
        <div className="flex flex-col items-center gap-2 w-1/2 max-w-md">

          <div className="flex items-center gap-4">

            <button onClick={onPrev} className="text-gray-400 hover:text-white">⏮</button>

            <button
              onClick={onTogglePlay}
              className="bg-green-500 text-black w-10 h-10 rounded-full flex items-center justify-center"
            >
              {isPlaying ? '⏸' : '▶'}
            </button>

            <button onClick={onNext} className="text-gray-400 hover:text-white">⏭</button>
          </div>

          <div className="flex items-center gap-2 w-full">
            <span className="text-xs text-gray-400">{formatTime(currentSecs)}</span>

            <div
              onClick={handleProgressClick}
              className="flex-1 h-1 bg-gray-700 rounded cursor-pointer"
            >
              <div
                className="h-1 bg-green-500 rounded"
                style={{ width: `${progress}%` }}
              />
            </div>

            <span className="text-xs text-gray-400">{formatTime(track.duration || 0)}</span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          <button
            onClick={() => setIsFullscreen(true)}
            className="text-xs text-gray-300 hover:text-white"
          >
            Full
          </button>

          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={e => onVolumeChange(Number(e.target.value))}
            className="w-20 accent-green-500"
          />
        </div>
      </div>

      {/* 🔻 FULLSCREEN */}
      {isFullscreen && canPlay && (
        <div className="fixed inset-0 z-50 flex flex-col text-white">

          {/* Background */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${track.albumArt})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(40px)',
              opacity: 0.4,
            }}
          />
          <div className="absolute inset-0 bg-black/70" />

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full">

            {/* Top */}
            <div className="flex justify-between px-6 py-4">
              <span className="text-gray-400 text-sm">Now Playing</span>
              <button onClick={() => setIsFullscreen(false)}>Close</button>
            </div>

            {/* Center */}
            <div className="flex flex-col items-center justify-center flex-1 px-6">

              <img
                src={track.albumArt}
                className="w-72 h-72 rounded-xl shadow-2xl mb-10"
              />

              <h2 className="text-2xl font-bold text-center">{track.title}</h2>
              <p className="text-gray-400">{track.artist}</p>

              {/* Progress */}
              <div className="w-full max-w-md mt-6">
                <div
                  onClick={handleProgressClick}
                  className="h-1 bg-gray-700 rounded cursor-pointer"
                >
                  <div
                    className="h-1 bg-green-500 rounded"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{formatTime(currentSecs)}</span>
                  <span>{formatTime(track.duration || 0)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-8 mt-8">

                <button onClick={onPrev} className="text-xl text-gray-300 hover:text-white">⏮</button>

                <button
                  onClick={onTogglePlay}
                  className="bg-green-500 text-black w-16 h-16 rounded-full flex items-center justify-center text-2xl"
                >
                  {isPlaying ? '⏸' : '▶'}
                </button>

                <button onClick={onNext} className="text-xl text-gray-300 hover:text-white">⏭</button>
              </div>

              {/* VIDEO */}
              <div className="mt-8 w-full max-w-3xl aspect-video rounded-xl overflow-hidden">
                <iframe
                  src={youtubeUrl}
                  className="w-full h-full"
                  allow="autoplay"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}