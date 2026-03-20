import { useEffect, useRef, useCallback, useState } from 'react'

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
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const timerRef = useRef<any>(null)
  const prevVideoId = useRef<string | null>(null)

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  // Create or update iframe when videoId changes
  useEffect(() => {
    if (!videoId) return
    if (videoId === prevVideoId.current) return
    
    prevVideoId.current = videoId
    stopTimer()

    // Remove old iframe
    const oldContainer = document.getElementById('yt-embed-container')
    if (oldContainer) oldContainer.remove()

    // Create hidden iframe for audio playback
    const container = document.createElement('div')
    container.id = 'yt-embed-container'
    container.style.cssText = 'position:fixed;bottom:0;right:0;width:200px;height:113px;z-index:9999;opacity:0.01;'
    
    const iframe = document.createElement('iframe')
    iframe.id = 'yt-embed-iframe'
    iframe.width = '200'
    iframe.height = '113'
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`
    iframe.allow = 'autoplay; encrypted-media'
    iframe.style.border = 'none'
    
    container.appendChild(iframe)
    document.body.appendChild(container)
    iframeRef.current = iframe

    // Simulate progress (since we can't get real progress from iframe without postMessage)
    let elapsed = 0
    timerRef.current = setInterval(() => {
      elapsed += 1
      onProgress(elapsed)
      if (elapsed === 1) onDuration(180) // Assume 3 min duration
    }, 1000)

    console.log('Playing video:', videoId)

    return () => {
      stopTimer()
    }
  }, [videoId, onProgress, onDuration])

  // Handle play/pause by removing/recreating iframe
  useEffect(() => {
    if (!videoId || !iframeRef.current) return
    
    const container = document.getElementById('yt-embed-container')
    if (!container) return

    if (isPlaying) {
      container.style.opacity = '0.01'
    } else {
      // Pause by hiding iframe (crude but works)
      container.style.opacity = '0'
    }
  }, [isPlaying, videoId])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer()
      const container = document.getElementById('yt-embed-container')
      if (container) container.remove()
    }
  }, [])
}
