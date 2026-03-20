import { useEffect, useRef, useCallback } from 'react'

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
    console.log('Building YouTube player for video:', vid)
    
    // Remove old iframe if any
    const old = document.getElementById('yt-player-div')
    if (old) old.remove()

    // Fresh container
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
            console.log('YouTube player ready')
            ready.current = true
            e.target.setVolume(volume)
            if (pendingPlay.current || isPlaying) {
              e.target.playVideo()
              startTimer()
            }
          },
          onStateChange(e: any) {
            console.log('YouTube player state:', e.data)
            // 0=ended 1=playing 2=paused 3=buffering 5=cued
            if (e.data === 1) startTimer()
            if (e.data === 2 || e.data === 5) stopTimer()
            if (e.data === 0) { stopTimer(); onEnded() }
          },
          onError(e: any) {
            console.error('YouTube player error:', e.data)
            stopTimer()
            onEnded()
          },
        },
      })
    } catch (error) {
      console.error('Failed to create YouTube player:', error)
    }
  }, [volume, isPlaying, startTimer, onEnded])

  // Load YT script once
  useEffect(() => {
    if (document.getElementById('yt-api-script')) return
    if (window.YT?.Player) return
    
    console.log('Loading YouTube IFrame API')
    const s = document.createElement('script')
    s.id = 'yt-api-script'
    s.src = 'https://www.youtube.com/iframe_api'
    s.async = true
    
    // Set up the callback
    window.onYouTubeIframeAPIReady = () => {
      console.log('YouTube IFrame API ready')
    }
    
    document.head.appendChild(s)
  }, [])

  // New track → rebuild player
  useEffect(() => {
    if (!videoId) return
    if (videoId === prevVideoId.current) return
    prevVideoId.current = videoId
    pendingPlay.current = true
    stopTimer()

    console.log('New track:', videoId)

    const tryBuild = () => {
      if (window.YT?.Player) {
        buildPlayer(videoId)
      } else {
        console.log('YouTube API not ready yet, waiting...')
        setTimeout(tryBuild, 500)
      }
    }

    tryBuild()

    return stopTimer
  }, [videoId, buildPlayer])

  // Play / pause toggle
  useEffect(() => {
    if (!ready.current || !player.current) return
    try {
      if (isPlaying) { 
        console.log('Playing video')
        player.current.playVideo()
        startTimer()
      } else { 
        console.log('Pausing video')
        player.current.pauseVideo()
        stopTimer()
      }
    } catch (e) {
      console.error('Play/pause error:', e)
    }
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
