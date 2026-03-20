import { useEffect, useRef } from 'react'

interface Props {
  videoId: string | null
  isPlaying: boolean
  volume: number
  onProgress: (secs: number) => void
  onDuration: (secs: number) => void
  onEnded: () => void
  seekTo?: number | null
}

export function useYouTubePlayer({ videoId, isPlaying, volume, onProgress, onDuration, onEnded, seekTo }: Props) {
  const prevVideoId = useRef<string | null>(null)
  const timerRef = useRef<any>(null)
  const windowRef = useRef<Window | null>(null)

  useEffect(() => {
    if (!videoId) return
    if (videoId === prevVideoId.current) return
    
    prevVideoId.current = videoId

    // Clear existing timer
    if (timerRef.current) clearInterval(timerRef.current)

    // Close existing window
    if (windowRef.current && !windowRef.current.closed) {
      windowRef.current.close()
    }

    // Open YouTube in a new window
    const url = `https://www.youtube.com/watch?v=${videoId}&autoplay=1`
    windowRef.current = window.open(url, '_blank', 'width=560,height=315')

    // Simulate progress
    let elapsed = 0
    timerRef.current = setInterval(() => {
      elapsed += 1
      onProgress(elapsed)
    }, 1000)

    onDuration(180) // Assume 3 minutes

    console.log('Opened YouTube:', url)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [videoId, onProgress, onDuration])

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (windowRef.current && !windowRef.current.closed) {
        windowRef.current.close()
      }
    }
  }, [])
}
