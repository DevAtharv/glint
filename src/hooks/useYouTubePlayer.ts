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
  const timerRef = useRef<any>(null)
  const prevVideoId = useRef<string | null>(null)

  useEffect(() => {
    if (!videoId) return
    if (videoId === prevVideoId.current) return
    
    prevVideoId.current = videoId
    
    // Clear any existing timer
    if (timerRef.current) clearInterval(timerRef.current)

    // Remove old player
    const oldPlayer = document.getElementById('yt-player-embed')
    if (oldPlayer) oldPlayer.remove()

    // Create a visible, clickable YouTube player
    const container = document.createElement('div')
    container.id = 'yt-player-embed'
    container.style.cssText = `
      position: fixed;
      bottom: 90px;
      left: 50%;
      transform: translateX(-50%);
      width: 400px;
      height: 225px;
      z-index: 9999;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0,0,0,0.8);
      background: #000;
      border: 2px solid rgba(108,99,255,0.5);
    `
    
    // Create iframe with YouTube embed
    const iframe = document.createElement('iframe')
    iframe.id = 'yt-iframe'
    iframe.width = '400'
    iframe.height = '225'
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`
    iframe.allow = 'autoplay; encrypted-media; fullscreen'
    iframe.allowFullscreen = true
    iframe.style.border = 'none'
    
    container.appendChild(iframe)
    document.body.appendChild(container)

    // Simulate progress tracking
    let elapsed = 0
    timerRef.current = setInterval(() => {
      elapsed += 1
      onProgress(elapsed)
    }, 1000)
    
    // Assume 3 minute duration
    onDuration(180)

    console.log('YouTube player created for video:', videoId)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      container.remove()
    }
  }, [videoId, onProgress, onDuration])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      const player = document.getElementById('yt-player-embed')
      if (player) player.remove()
    }
  }, [])
}
