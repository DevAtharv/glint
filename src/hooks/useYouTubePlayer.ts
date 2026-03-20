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

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

export function useYouTubePlayer({ videoId, isPlaying, volume, onProgress, onDuration, onEnded, seekTo }: Props) {
  const player = useRef<any>(null)
  const ready = useRef(false)
  const timer = useRef<any>(null)
  const prevVideoId = useRef<string | null>(null)
  const prevSeek = useRef<number | null>(null)
  const pendingPlay = useRef(false)
  const [apiReady, setApiReady] = useState(false)

  const stopTimer = () => { if (timer.current) { clearInterval(timer.current); timer.current = null } }

  const startTimer = useCallback(() => {
    stopTimer()
    timer.current = setInterval(() => {
      try {
        const t = player.current?.getCurrentTime?.()
        const d = player.current?.getDuration?.()
        if (typeof t === 'number') onProgress(Math.floor(t))
        if (typeof d === 'number' && d > 0) onDuration(Math.floor(d))
      } catch { /**/ }
    }, 500)
  }, [onProgress, onDuration])

  const buildPlayer = useCallback((vid: string) => {
    console.log('Building player for:', vid)
    
    // Remove old elements
    const oldWrap = document.getElementById('yt-player-wrap')
    if (oldWrap) oldWrap.remove()

    // Create container
    const wrap = document.createElement('div')
    wrap.id = 'yt-player-wrap'
    wrap.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;'
    const div = document.createElement('div')
    div.id = 'yt-player-div'
    wrap.appendChild(div)
    document.body.appendChild(wrap)

    ready.current = false
    if (player.current) { try { player.current.destroy() } catch { /**/ } }

    try {
      player.current = new window.YT.Player('yt-player-div', {
        videoId: vid,
        width: '1',
        height: '1',
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady(e: any) {
            console.log('Player ready')
            ready.current = true
            e.target.setVolume(volume)
            if (pendingPlay.current || isPlaying) {
              e.target.playVideo()
              startTimer()
            }
          },
          onStateChange(e: any) {
            // 0=ended 1=playing 2=paused 3=buffering 5=cued
            if (e.data === 1) startTimer()
            if (e.data === 2 || e.data === 5) stopTimer()
            if (e.data === 0) { stopTimer(); onEnded() }
          },
          onError(e: any) {
            console.error('Player error:', e.data)
            stopTimer()
            onEnded()
          },
        },
      })
    } catch (err) {
      console.error('Failed to create player:', err)
    }
  }, [volume, isPlaying, startTimer, onEnded])

  // Load YouTube IFrame API
  useEffect(() => {
    if (window.YT?.Player) {
      setApiReady(true)
      return
    }

    if (document.getElementById('yt-api-script')) {
      // Script already loading, wait for it
      const checkReady = setInterval(() => {
        if (window.YT?.Player) {
          clearInterval(checkReady)
          setApiReady(true)
        }
      }, 100)
      return () => clearInterval(checkReady)
    }

    const script = document.createElement('script')
    script.id = 'yt-api-script'
    script.src = 'https://www.youtube.com/iframe_api'
    
    window.onYouTubeIframeAPIReady = () => {
      console.log('YouTube API ready')
      setApiReady(true)
    }
    
    document.head.appendChild(script)
  }, [])

  // Build player when video changes
  useEffect(() => {
    if (!videoId || !apiReady) return
    if (videoId === prevVideoId.current) return
    
    console.log('Video changed to:', videoId)
    prevVideoId.current = videoId
    pendingPlay.current = true
    stopTimer()
    buildPlayer(videoId)

    return stopTimer
  }, [videoId, apiReady, buildPlayer])

  // Play/pause
  useEffect(() => {
    if (!ready.current || !player.current) return
    try {
      if (isPlaying) {
        player.current.playVideo()
        startTimer()
      } else {
        player.current.pauseVideo()
        stopTimer()
      }
    } catch { /**/ }
  }, [isPlaying, startTimer])

  // Volume
  useEffect(() => {
    try { player.current?.setVolume?.(volume) } catch { /**/ }
  }, [volume])

  // Seek
  useEffect(() => {
    if (seekTo === null || seekTo === undefined) return
    if (seekTo === prevSeek.current) return
    prevSeek.current = seekTo
    try { player.current?.seekTo?.(seekTo, true) } catch { /**/ }
  }, [seekTo])
}
