import { useState, useEffect, useCallback, useRef } from 'react';
import type { Track } from '../types';

export function usePlayer() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentSecs, setCurrentSecs] = useState(0);
  const [volume, setVolume] = useState(100);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [liked, setLiked] = useState(false);
  const [seekTo, setSeekTo] = useState<number | null>(null);

  // Wake Lock Reference to keep the browser from sleeping
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  const playTrack = useCallback((track: Track, newQueue?: Track[]) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    if (newQueue) setQueue(newQueue);
  }, []);

  const togglePlay = useCallback(() => setIsPlaying((p) => !p), []);

  const next = useCallback(() => {
    if (!currentTrack || queue.length === 0) return;
    if (repeat) {
      setSeekTo(0);
      setIsPlaying(true);
      return;
    }
    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
    if (shuffle) {
      const randomIndex = Math.floor(Math.random() * queue.length);
      setCurrentTrack(queue[randomIndex]);
    } else if (currentIndex < queue.length - 1) {
      setCurrentTrack(queue[currentIndex + 1]);
    } else {
      setIsPlaying(false);
    }
  }, [currentTrack, queue, shuffle, repeat]);

  const prev = useCallback(() => {
    if (!currentTrack || queue.length === 0) return;
    if (currentSecs > 3) {
      setSeekTo(0);
      return;
    }
    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
    if (currentIndex > 0) {
      setCurrentTrack(queue[currentIndex - 1]);
    }
  }, [currentTrack, queue, currentSecs]);

  const seek = useCallback((pct: number) => {
    if (!currentTrack) return;
    const targetSecs = (pct / 100) * (currentTrack.duration || 0);
    setSeekTo(targetSecs);
    setProgress(pct);
    setCurrentSecs(targetSecs);
  }, [currentTrack]);

  const handleProgress = useCallback(
    ({ playedSeconds, played }: { playedSeconds: number; played: number }) => {
      setCurrentSecs(playedSeconds);
      setProgress(played * 100);
      setSeekTo(null);
    },
    []
  );

  const handleDuration = useCallback((duration: number) => {
    // Optionally capture actual duration here
  }, []);

  const handleEnded = useCallback(() => {
    next();
  }, [next]);

  // ==========================================
  // 🎧 MEDIA SESSION API (Lock Screen Controls)
  // ==========================================
  useEffect(() => {
    if ('mediaSession' in navigator && currentTrack) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist,
        album: 'Glint AI',
        artwork: [
          {
            src: currentTrack.albumArt || 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=512&auto=format&fit=crop',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      });

      navigator.mediaSession.setActionHandler('play', () => setIsPlaying(true));
      navigator.mediaSession.setActionHandler('pause', () => setIsPlaying(false));
      navigator.mediaSession.setActionHandler('previoustrack', prev);
      navigator.mediaSession.setActionHandler('nexttrack', next);
    }
  }, [currentTrack, next, prev]);

  // Sync OS Play/Pause state
  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    }
  }, [isPlaying]);

  // ==========================================
  // 📱 WAKE LOCK API (Keep JS alive in background)
  // ==========================================
  useEffect(() => {
    const requestWakeLock = async () => {
      if ('wakeLock' in navigator && isPlaying) {
        try {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
        } catch (err) {
          console.warn('Wake Lock error:', err);
        }
      }
    };

    const releaseWakeLock = async () => {
      if (wakeLockRef.current !== null) {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    };

    if (isPlaying) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }

    // Re-request lock if user switches tabs and comes back
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isPlaying) {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      releaseWakeLock();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isPlaying]);

  return {
    currentTrack,
    isPlaying,
    progress,
    currentSecs,
    volume,
    shuffle,
    repeat,
    liked,
    seekTo,
    playTrack,
    togglePlay,
    next,
    prev,
    seek,
    setVolume,
    setShuffle,
    setRepeat,
    setLiked,
    handleProgress,
    handleDuration,
    handleEnded,
  };
}
