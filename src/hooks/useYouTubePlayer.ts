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
  const containerRef = useRef<HTMLDivElement | null>(null)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const timerRef = useRef<any>(null)
  const prevVideoId = useRef<string | null>(null)

  // Create container on mount
  useEffect(() => {
    // Remove any existing container
    const existing = document.getElementById('yt-player-container')
    if (existing) existing.remove()

    // Create a visible container for the YouTube player
    const container = document.createElement('div')
    container.id = 'yt-player-container'
    container.style.cssText = `
      position: fixed;
      bottom: 100px;
      right: 20px;
      width: 320px;
      height: 180px;
      z-index: 10000;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
      background: #000;
    `
    document.body.appendChild(container)
    containerRef.current = container

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      container.remove()
    }
  }, [])

  // Update iframe when video changes
  useEffect(() => {
    if (!videoId || !containerRef.current) return
    if (videoId === prevVideoId.current) return

    prevVideoId.current = videoId
    
    // Clear existing content
    containerRef.current.innerHTML = ''

    // Create iframe
    const iframe = document.createElement('iframe')
    iframe.width = '320'
    iframe.height = '180'
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`
    iframe.allow = 'autoplay; encrypted-media; fullscreen'
    iframe.style.border = 'none'
    
    containerRef.current.appendChild(iframe)
    iframeRef.current = iframe

    // Start progress timer (simulated since we can't get real progress from embed)
    if (timerRef.current) clearInterval(timerRef.current)
    let elapsed = 0
    timerRef.current = setInterval(() => {
      elapsed += 1
      onProgress(elapsed)
    }, 1000)
    
    // Assume 3 minute duration
    onDuration(180)

    console.log('Playing video:', videoId)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [videoId, onProgress, onDuration])

  // Show/hide based on playing state
  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.style.display = isPlaying ? 'block' : 'none'
  }, [isPlaying])
}
