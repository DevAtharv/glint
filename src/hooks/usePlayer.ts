import { useState, useCallback } from 'react'
import type { Track } from '../types'

export function usePlayer() {
  const [queue, setQueue] = useState<Track[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentSecs, setCurrentSecs] = useState(0)
  const [duration, setDuration] = useState(0)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const [liked, setLiked] = useState(false)
  const [volume, setVolume] = useState(80)
  const [seekTo, setSeekTo] = useState<number | null>(null)

  const currentTrack = queue[currentIndex] ?? null

  const handleProgress = useCallback(
    (secs: number) => {
      setCurrentSecs(secs)
      setProgress(duration > 0 ? (secs / duration) * 100 : 0)
    },
    [duration]
  )

  const handleDuration = useCallback((secs: number) => {
    setDuration(secs)
  }, [])

  const handleEnded = useCallback(() => {
    if (repeat) {
      setSeekTo(0)
      setIsPlaying(true)
      return
    }

    if (!queue.length) return

    const nextIdx = shuffle
      ? Math.floor(Math.random() * queue.length)
      : (currentIndex + 1) % queue.length

    setCurrentIndex(nextIdx)
    setCurrentSecs(0)
    setProgress(0)
    setIsPlaying(true)
    setSeekTo(null)
  }, [repeat, shuffle, queue, currentIndex])

  const playTrack = useCallback((track: Track, newQueue?: Track[]) => {
    const q = newQueue ?? [track]
    const idx = q.findIndex(t => t.id === track.id)

    setQueue(q)
    setCurrentIndex(idx >= 0 ? idx : 0)
    setCurrentSecs(0)
    setProgress(0)
    setDuration(track.duration || 0)
    setIsPlaying(true)
    setLiked(false)
    setSeekTo(null)
  }, [])

  const togglePlay = useCallback(() => {
    setIsPlaying(p => !p)
  }, [])

  const seek = useCallback(
    (pct: number) => {
      const secs = Math.floor((pct / 100) * duration)
      setProgress(pct)
      setCurrentSecs(secs)
      setSeekTo(secs)
    },
    [duration]
  )

  const next = useCallback(() => {
    if (!queue.length) return

    const nextIdx = shuffle
      ? Math.floor(Math.random() * queue.length)
      : (currentIndex + 1) % queue.length

    setCurrentIndex(nextIdx)
    setCurrentSecs(0)
    setProgress(0)
    setIsPlaying(true)
    setSeekTo(null)
  }, [queue, currentIndex, shuffle])

  const prev = useCallback(() => {
    if (!queue.length) return

    if (currentSecs > 3) {
      seek(0)
      return
    }

    const prevIdx = (currentIndex - 1 + queue.length) % queue.length
    setCurrentIndex(prevIdx)
    setCurrentSecs(0)
    setProgress(0)
    setIsPlaying(true)
    setSeekTo(null)
  }, [currentIndex, queue.length, currentSecs, seek])

  return {
    currentTrack,
    queue,
    isPlaying,
    progress,
    currentSecs,
    duration,
    shuffle,
    repeat,
    liked,
    volume,
    seekTo,
    playTrack,
    togglePlay,
    seek,
    next,
    prev,
    setShuffle,
    setRepeat,
    setLiked,
    setVolume,
    handleProgress,
    handleDuration,
    handleEnded,
  }
}
