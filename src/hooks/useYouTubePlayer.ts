import { useEffect, useRef } from 'react'

interface Props {
  videoId: string | null
  isPlaying: boolean
  volume: number
  onProgress: (secs: number) => void
  onDuration: (secs: number) => void
  onEnded: () => void
  seekTo?: number | null
  containerId: string // NEW: Tell the hook where to render the video
}

export function useYouTubePlayer({ videoId, isPlaying, volume, onProgress, onDuration, onEnded, seekTo, containerId }: Props) {
  const playerRef = useRef<any>(null)
  const timerRef = useRef<any>(null)
  const readyRef = useRef(false)

  // Load YouTube IFrame API
  useEffect(() => {
    if ((window as any).YT?.Player) return
    
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    tag.id = 'youtube-iframe-api'
    
    if (!document.getElementById('youtube-iframe-api')) {
      document.head.appendChild(tag)
    }
  }, [])

  // Create/update player when video changes
  useEffect(() => {
    if (!videoId) return
    
    const waitForAPI = () => {
      if (!(window as any).YT?.Player) {
        setTimeout(waitForAPI, 100)
        return
      }

      // Destroy existing player if it exists
      if (playerRef.current) {
        try { playerRef.current.destroy() } catch {}
      }

      // Ensure the container exists in the DOM before trying to mount
      const container = document.getElementById(containerId)
      if (!container) {
        setTimeout(waitForAPI, 100)
        return
      }

      readyRef.current = false

      playerRef.current = new (window as any).YT.Player(containerId, {
        videoId: videoId,
        width: '100%',
        height: '100%',
        playerVars: {
          autoplay: 1,
          controls: 0, // Hide YouTube controls, we are building our own
          modestbranding: 1,
          rel: 0,
          fs: 0,
          playsinline: 1,
          disablekb: 1 // Disable keyboard controls on the iframe itself
        },
        events: {
          onReady: (e: any) => {
            readyRef.current = true
            e.target.setVolume(volume)
            e.target.playVideo()
            
            // Start progress tracking
            if (timerRef.current) clearInterval(timerRef.current)
            timerRef.current = setInterval(() => {
              try {
                const t = e.target.getCurrentTime()
                const d = e.target.getDuration()
                if (typeof t === 'number') onProgress(Math.floor(t))
                if (typeof d === 'number' && d > 0) onDuration(Math.floor(d))
              } catch {}
            }, 500)
          },
          onStateChange: (e: any) => {
            // 0=ended, 1=playing, 2=paused
            if (e.data === 0) {
              if (timerRef.current) clearInterval(timerRef.current)
              onEnded()
            }
          },
          onError: () => {
            console.error('YouTube player error')
            onEnded()
          }
        }
      })
    }

    waitForAPI()

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [videoId, containerId]) // Re-run if container ID changes

  // Handle play/pause
  useEffect(() => {
    if (!readyRef.current || !playerRef.current) return
    try {
      if (isPlaying) {
        playerRef.current.playVideo()
      } else {
        playerRef.current.pauseVideo()
      }
    } catch {}
  }, [isPlaying])

  // Handle volume
  useEffect(() => {
    if (!playerRef.current) return
    try {
      playerRef.current.setVolume(volume)
    } catch {}
  }, [volume])

  // Handle seek
  useEffect(() => {
    if (seekTo === null || seekTo === undefined || !playerRef.current) return
    try {
      playerRef.current.seekTo(seekTo, true)
    } catch {}
  }, [seekTo])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (playerRef.current) {
        try { playerRef.current.destroy() } catch {}
      }
    }
  }, [])
}
