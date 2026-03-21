import React, { useState, useEffect, useMemo } from 'react'
import type { Track } from '../types'
import { searchYouTube } from '../services/youtube'
import TrackRow from '../components/TrackRow'
import { useAuth } from '../hooks/useAuth'

interface HomePageProps {
  onPlay: (track: Track, queue?: Track[]) => void
  currentTrack: Track | null
  onNavigate: (page: 'search' | 'import' | 'profile') => void
}

const QUICK_PICKS: Track[] = [
  { id: 'y6120QOlsfU', title: 'Midnight City', artist: 'M83', albumArt: 'https://i.ytimg.com/vi/y6120QOlsfU/mqdefault.jpg', duration: 243, youtubeId: 'y6120QOlsfU' },
  { id: 'rDBiqGOytMw', title: 'Sunset', artist: 'The Midnight', albumArt: 'https://i.ytimg.com/vi/rDBiqGOytMw/mqdefault.jpg', duration: 326, youtubeId: 'rDBiqGOytMw' },
  { id: '8GW6sLrK40k', title: 'Resonance', artist: 'HOME', albumArt: 'https://i.ytimg.com/vi/8GW6sLrK40k/mqdefault.jpg', duration: 212, youtubeId: '8GW6sLrK40k' },
  { id: 'MV_3Dpw-BRY', title: 'Nightcall', artist: 'Kavinsky', albumArt: 'https://i.ytimg.com/vi/MV_3Dpw-BRY/mqdefault.jpg', duration: 258, youtubeId: 'MV_3Dpw-BRY' },
  { id: 'awimGQAAweA', title: 'Running In The Night', artist: 'FM-84', albumArt: 'https://i.ytimg.com/vi/awimGQAAweA/mqdefault.jpg', duration: 270, youtubeId: 'awimGQAAweA' },
  { id: '0AioD3iFv5c', title: 'On the Run', artist: 'Timecop1983', albumArt: 'https://i.ytimg.com/vi/0AioD3iFv5c/mqdefault.jpg', duration: 315, youtubeId: '0AioD3iFv5c' },
]

const FEATURED: Track[] = [
  { id: 'H5v3kku4y6Q', title: 'Heat Waves', artist: 'Glass Animals', albumArt: 'https://i.ytimg.com/vi/H5v3kku4y6Q/mqdefault.jpg', duration: 238, youtubeId: 'H5v3kku4y6Q' },
  { id: '6I3smoq1HCs', title: 'Cruel Summer', artist: 'Taylor Swift', albumArt: 'https://i.ytimg.com/vi/6I3smoq1HCs/mqdefault.jpg', duration: 178, youtubeId: '6I3smoq1HCs' },
  { id: 'PT2_F-1esPk', title: 'Levitating', artist: 'Dua Lipa', albumArt: 'https://i.ytimg.com/vi/PT2_F-1esPk/mqdefault.jpg', duration: 203, youtubeId: 'PT2_F-1esPk' },
  { id: 'TUVcZfQe-Kw', title: 'As It Was', artist: 'Harry Styles', albumArt: 'https://i.ytimg.com/vi/TUVcZfQe-Kw/mqdefault.jpg', duration: 167, youtubeId: 'TUVcZfQe-Kw' },
  { id: 'JGwWNGJdvx8', title: 'Shape of You', artist: 'Ed Sheeran', albumArt: 'https://i.ytimg.com/vi/JGwWNGJdvx8/mqdefault.jpg', duration: 234, youtubeId: 'JGwWNGJdvx8' },
  { id: 'OPf0YbXqDm0', title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', albumArt: 'https://i.ytimg.com/vi/OPf0YbXqDm0/mqdefault.jpg', duration: 270, youtubeId: 'OPf0YbXqDm0' },
]

export default function HomePage({ onPlay, currentTrack, onNavigate }: HomePageProps) {
  const { user } = useAuth()
  const [ytTracks, setYtTracks] = useState<Track[]>([])
  const [ytLoading, setYtLoading] = useState(false)
  
  const firstName = (user?.name ?? 'there').split(' ')[0]
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }, [])

  useEffect(() => {
    const key = import.meta.env.VITE_YOUTUBE_API_KEY
    if (!key) return

    setYtLoading(true)
    searchYouTube('trending music 2024', 8)
      .then(tracks => setYtTracks(tracks))
      .catch(console.error)
      .finally(() => setYtLoading(false))
  }, [])

  const recommendedTracks = ytTracks.length > 0 ? ytTracks : FEATURED

  return (
    <div className="relative min-h-screen bg-[#050505] font-sans text-white selection:bg-[#1ed760]/30 selection:text-white pb-24">
      
      {/* 🌌 AMBIENT ANIMATED BACKGROUND GLOWS */}
      <div className="pointer-events-none absolute left-0 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1ed760]/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 top-[20%] h-[600px] w-[600px] translate-x-1/3 rounded-full bg-indigo-500/10 blur-[150px]" />

      <div className="relative z-10 mx-auto max-w-[1600px] px-4 pt-8 sm:px-6 lg:px-8">
        
        {/* ✨ HYPER-PREMIUM HEADER */}
        <div className="mb-10 flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="bg-gradient-to-br from-white via-white/90 to-white/40 bg-clip-text text-4xl font-extrabold tracking-tighter text-transparent sm:text-5xl drop-shadow-sm">
            {greeting}
          </h1>
          
          <div className="flex items-center gap-3 sm:gap-4">
            <button 
              onClick={() => onNavigate('search')} 
              className="group relative hidden sm:flex items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-bold text-white backdrop-blur-md transition-all hover:border-white/30 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] active:scale-95"
            >
              Browse
            </button>
            <button 
              onClick={() => onNavigate('import')} 
              className="group relative hidden sm:flex items-center justify-center overflow-hidden rounded-full bg-[#1ed760] px-6 py-2.5 text-sm font-bold text-black transition-all hover:scale-105 hover:bg-[#3be477] hover:shadow-[0_0_30px_rgba(30,215,96,0.4)] active:scale-95"
            >
              Import
            </button>
            <button 
              onClick={() => onNavigate('profile')}
              className="relative ml-2 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-[#181818] to-[#0a0a0a] text-sm font-bold text-white shadow-xl backdrop-blur-xl transition-all hover:scale-105 hover:border-[#1ed760]/50 hover:shadow-[0_0_25px_rgba(30,215,96,0.2)] active:scale-95"
            >
              {initials}
            </button>
          </div>
        </div>

        {/* 🎛️ GLASSMORPHISM QUICK PICKS */}
        <div className="mb-14 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 fill-mode-both">
          {QUICK_PICKS.map(track => {
            const isPlaying = currentTrack?.id === track.id
            return (
              <div
                key={`quick-${track.id}`}
                onClick={() => onPlay(track, QUICK_PICKS)}
                className="group relative flex h-16 sm:h-20 cursor-pointer items-center overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-xl transition-all duration-500 hover:border-white/10 hover:bg-white/[0.06] hover:shadow-2xl hover:shadow-[#1ed760]/5"
              >
                {/* Inner Light Sweep Effect */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

                <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 transition-opacity group-hover:opacity-0 z-10" />
                  <img
                    src={track.albumArt}
                    alt={track.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                
                <div className="flex flex-1 items-center justify-between px-4 z-10">
                  <p className={`truncate text-sm sm:text-base font-bold tracking-tight transition-colors duration-300 ${isPlaying ? 'text-[#1ed760]' : 'text-white/90 group-hover:text-white'}`}>
                    {track.title}
                  </p>
                  
                  {/* Neon Play Button */}
                  <div className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#1ed760] text-black shadow-[0_0_20px_rgba(30,215,96,0.4)] transition-all duration-300 ease-out hover:scale-110 hover:bg-[#3be477] hover:shadow-[0_0_30px_rgba(30,215,96,0.6)] ${
                    isPlaying ? 'opacity-100 scale-100' : 'opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100'
                  }`}>
                    {isPlaying ? (
                      <div className="flex gap-[3px] items-center justify-center">
                        <div className="w-1 h-3 sm:h-4 bg-black animate-pulse rounded-full" />
                        <div className="w-1 h-3 sm:h-4 bg-black animate-pulse rounded-full delay-75" />
                      </div>
                    ) : (
                      <svg className="ml-1 h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* 🎧 FADE-MASKED HORIZONTAL CAROUSEL */}
        <div className="mb-14 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">
          <h2 className="mb-6 text-2xl font-extrabold tracking-tight text-white/90 hover:text-white transition-colors cursor-pointer inline-block">
            Made For You
          </h2>

          <div className="relative">
            {/* Edge Fade Masks for a seamless infinite scroll look */}
            <div className="absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-[#050505] to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none" />

            <div className="flex gap-5 overflow-x-auto pb-8 pt-2 snap-x snap-mandatory px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {FEATURED.map(track => {
                const isPlaying = currentTrack?.id === track.id
                return (
                  <div
                    key={`featured-${track.id}`}
                    onClick={() => onPlay(track, FEATURED)}
                    className={`group relative w-[160px] sm:w-[190px] shrink-0 snap-start cursor-pointer rounded-2xl p-4 transition-all duration-500 hover:-translate-y-2 ${
                      isPlaying ? 'bg-white/10 border border-white/20' : 'bg-white/[0.02] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 hover:shadow-2xl hover:shadow-white/5'
                    }`}
                  >
                    <div className="relative mb-5 overflow-hidden rounded-xl shadow-[0_15px_35px_rgba(0,0,0,0.6)]">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                      <img
                        src={track.albumArt}
                        alt={track.title}
                        className="aspect-square w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                      
                      {/* Premium Floating Overlay */}
                      <div className={`absolute bottom-3 right-3 z-20 flex items-center justify-center transition-all duration-400 ease-out ${
                        isPlaying ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-90 group-hover:translate-y-0 group-hover:opacity-100 group-hover:scale-100'
                      }`}>
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1ed760] text-black shadow-[0_10px_20px_rgba(0,0,0,0.5)] hover:bg-[#3be477] hover:scale-110 transition-all">
                          {isPlaying ? (
                            <div className="flex gap-1 items-center justify-center h-full">
                              <div className="w-1 h-3 bg-black animate-pulse rounded-full" />
                              <div className="w-1 h-3 bg-black animate-pulse rounded-full delay-75" />
                              <div className="w-1 h-3 bg-black animate-pulse rounded-full delay-150" />
                            </div>
                          ) : (
                            <svg className="ml-1 h-7 w-7" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className={`mb-1 truncate text-base font-extrabold tracking-tight transition-colors ${isPlaying ? 'text-[#1ed760]' : 'text-white'}`}>
                      {track.title}
                    </p>
                    <p className="truncate text-sm font-medium text-[#888888] group-hover:text-[#b3b3b3] transition-colors">
                      {track.artist}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* 📊 ELEGANT TRENDING LIST */}
        <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300 fill-mode-both">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-extrabold tracking-tight text-white/90 hover:text-white transition-colors cursor-pointer inline-block">
              {ytTracks.length > 0 ? 'Trending Worldwide' : 'Popular Tracks'}
            </h2>
            
            {ytLoading && (
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#1ed760] shadow-[0_0_15px_rgba(30,215,96,0.1)]">
                <div className="h-1.5 w-1.5 animate-ping rounded-full bg-[#1ed760]" />
                Live Sync
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-2xl p-2 sm:p-4">
            <div className="flex px-4 py-3 border-b border-white/5 mb-2 text-[11px] uppercase text-[#666666] font-extrabold tracking-widest">
              <div className="w-10 text-center">#</div>
              <div className="flex-1">Title</div>
              <div className="w-16 text-right">Time</div>
            </div>

            <div className="flex flex-col gap-1">
              {recommendedTracks.map((track, i) => (
                <div key={`rec-${track.id}`} className="group rounded-xl transition-all duration-300 hover:bg-white/[0.04]">
                   <TrackRow
                    track={track}
                    index={i}
                    isActive={currentTrack?.id === track.id}
                    onPlay={t => onPlay(t, recommendedTracks)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
