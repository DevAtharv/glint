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
  const playerRef = useRef<any>(null)
  const prevVideoId = useRef<string | null>(null)
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

    ;(window as any).onYouTubeIframeAPIReady = () => {
      console.log('YouTube API ready')
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

      // Destroy existing player
      if (playerRef.current) {
        try { playerRef.current.destroy() } catch {}
      }

      // Remove old container
      const old = document.getElementById('yt-music-player')
      if (old) old.remove()

      // Create container
      const container = document.createElement('div')
      container.id = 'yt-music-player'
      container.style.cssText = `
        position: fixed;
        bottom: 90px;
        right: 20px;
        width: 300px;
        height: 169px;
        z-index: 9999;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 8px 32px rgba(0,0,0,0.6);
        background: #000;
      `
      document.body.appendChild(container)

      readyRef.current = false

      playerRef.current = new (window as any).YT.Player('yt-music-player', {
        videoId: videoId,
        width: 300,
        height: 169,
        playerVars: {
          autoplay: 1,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          fs: 0,
          playsinline: 1,
        },
        events: {
          onReady: (e: any) => {
            console.log('Player ready, playing:', videoId)
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
            if (e.data === 1) {
              timerRef.current = setInterval(() => {
                try {
                  const t = e.target.getCurrentTime()
                  if (typeof t === 'number') onProgress(Math.floor(t))
                } catch {}
              }, 500)
            }
            if (e.data === 2) {
              if (timerRef.current) clearInterval(timerRef.current)
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
  }, [videoId])

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

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (playerRef.current) {
        try { playerRef.current.destroy() } catch {}
      }
      const el = document.getElementById('yt-music-player')
      if (el) el.remove()
    }
  }, [])
}
