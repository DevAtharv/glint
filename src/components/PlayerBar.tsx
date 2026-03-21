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
    const params = new URLSearchParams({
      autoplay: '1',
      rel: '0',
      modestbranding: '1',
      playsinline: '1',
    })
    return `https://www.youtube.com/embed/${track.youtubeId}?${params.toString()}`
  }, [track?.youtubeId])

  if (!track) {
    return (
      <div className="sticky bottom-0 z-40 border-t border-white/10 bg-[#0B0D12]/95 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-center px-4 sm:px-6">
          <p className="text-xs sm:text-sm text-[#8B8FA8]">Search or browse to start listening</p>
        </div>
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
      <div className="sticky bottom-0 z-40 border-t border-white/10 bg-[#0B0D12]/95 backdrop-blur-xl">
        {!canPlay && (
          <div className="flex items-center gap-2 border-b border-amber-400/20 bg-amber-400/10 px-4 py-2 text-xs text-amber-300 sm:px-6">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
            </svg>
            <span>This track could not be matched on YouTube</span>
          </div>
        )}

        <div className="grid min-h-[88px] grid-cols-1 gap-4 px-4 py-3 sm:px-6 md:grid-cols-[minmax(220px,320px)_1fr_minmax(180px,220px)] md:items-center">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={track.albumArt}
              alt={track.title}
              className="h-12 w-12 shrink-0 rounded-xl object-cover"
            />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#EEF0FF]">
                {track.title}
              </p>
              <p className="truncate text-xs text-[#8B8FA8]">
                {track.artist}
              </p>
            </div>

            <button
              onClick={onLike}
              aria-label={liked ? 'Unlike track' : 'Like track'}
              className="shrink-0 rounded-full p-2 transition hover:bg-white/5"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill={liked ? '#FF4D6D' : 'none'}
                stroke={liked ? '#FF4D6D' : '#8B8FA8'}
                strokeWidth="2"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={onShuffle}
                aria-label="Shuffle"
                className={`rounded-full p-2 transition hover:bg-white/5 ${shuffle ? 'opacity-100' : 'opacity-50'}`}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill={shuffle ? '#8B85FF' : '#8B8FA8'}
                >
                  <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
                </svg>
              </button>

              <button
                onClick={onPrev}
                aria-label="Previous"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#EEF0FF">
                  <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
                </svg>
              </button>

              <button
                onClick={onTogglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF0FF] transition hover:scale-[1.03]"
              >
                {isPlaying ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#080A0F">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#080A0F">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              <button
                onClick={onNext}
                aria-label="Next"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#EEF0FF">
                  <path d="M6 18l8.5-6L6 6v12zm2.5-6L12 9v6l-3.5-3zM16 6h2v12h-2z" />
                </svg>
              </button>

              <button
                onClick={onRepeat}
                aria-label="Repeat"
                className={`rounded-full p-2 transition hover:bg-white/5 ${repeat ? 'opacity-100' : 'opacity-50'}`}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill={repeat ? '#8B85FF' : '#8B8FA8'}
                >
                  <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
                </svg>
              </button>
            </div>

            <div className="flex w-full items-center gap-2">
              <span className="min-w-10 text-[10px] text-[#6B6F85] sm:text-xs">
                {formatTime(currentSecs)}
              </span>

              <div
                onClick={handleProgressClick}
                className="h-1.5 flex-1 cursor-pointer overflow-hidden rounded-full bg-white/10"
              >
                <div
                  className="h-full rounded-full bg-indigo-500"
                  style={{ width: `${Math.min(100, progress)}%` }}
                />
              </div>

              <span className="min-w-10 text-right text-[10px] text-[#6B6F85] sm:text-xs">
                {formatTime(track.duration || 0)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 md:justify-end">
            <button
              onClick={() => setIsFullscreen(true)}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-[#EEF0FF] transition hover:bg-white/10 sm:text-sm"
            >
              Full screen
            </button>

            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill={volume === 0 ? '#FF4D6D' : '#8B8FA8'}>
                <path
                  d={
                    volume === 0
                      ? 'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z'
                      : 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z'
                  }
                />
              </svg>

              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={e => onVolumeChange(Number(e.target.value))}
                className="w-24 accent-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {isFullscreen && canPlay && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#EEF0FF]">{track.title}</p>
              <p className="truncate text-xs text-[#8B8FA8]">{track.artist}</p>
            </div>

            <button
              onClick={() => setIsFullscreen(false)}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-[#EEF0FF] transition hover:bg-white/10"
            >
              Close
            </button>
          </div>

          <div className="flex flex-1 items-center justify-center p-3 sm:p-6">
            <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#0B0D12] shadow-2xl">
              <div className="aspect-video w-full">
                <iframe
                  src={youtubeUrl}
                  title={track.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
