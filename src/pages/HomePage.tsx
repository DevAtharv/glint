import React, { useState, useEffect, useMemo } from 'react'
import type { Track } from '../types'
import { searchYouTube } from '../services/youtube'
import TrackRow from '../components/TrackRow'
import { useAuth } from '../hooks/useAuth'

interface HomePageProps {
  onPlay: (track: Track, queue?: Track[]) => void
  currentTrack: Track | null
  onNavigate: (page: 'search' | 'import') => void
}

// Updated to match the "Electric Dreams" Synthwave & Indie Vibe from the screenshot
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

  // Dynamic time-based greeting just like the screenshot
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
    <div className="px-4 pb-24 pt-8 sm:px-6 lg:px-8 max-w-[1600px] mx-auto font-sans bg-[#121212] min-h-screen text-white">
      
      {/* Header & Dynamic Greeting */}
      <div className="mb-8 flex items-end justify-between">
        <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl">
          {greeting}
        </h1>
        <div className="hidden sm:flex gap-3">
          <button onClick={() => onNavigate('search')} className="rounded-full bg-transparent border border-[#727272] px-5 py-2 text-sm font-bold text-white hover:border-white hover:scale-105 transition-all">
            Browse
          </button>
          <button onClick={() => onNavigate('import')} className="rounded-full bg-[#1ed760] px-5 py-2 text-sm font-bold text-black hover:bg-[#3be477] hover:scale-105 transition-all shadow-[0_4px_12px_rgba(30,215,96,0.3)]">
            Import
          </button>
        </div>
      </div>

      {/* Made For You / Quick Picks Grid (Matches the "Home Dashboard" screenshot) */}
      <div className="mb-12 grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {QUICK_PICKS.map(track => {
          const isPlaying = currentTrack?.id === track.id
          return (
            <div
              key={`quick-${track.id}`}
              onClick={() => onPlay(track, QUICK_PICKS)}
              className="group relative flex h-16 sm:h-20 cursor-pointer items-center overflow-hidden rounded-md bg-[#2a2a2a]/60 transition-all duration-300 hover:bg-[#3e3e3e]/80"
            >
              <img
                src={track.albumArt}
                alt={track.title}
                className="h-16 w-16 sm:h-20 sm:w-20 object-cover shadow-[4px_0_12px_rgba(0,0,0,0.5)]"
              />
              <div className="flex flex-1 items-center justify-between px-4">
                <p className={`truncate text-sm sm:text-base font-bold tracking-tight ${isPlaying ? 'text-[#1ed760]' : 'text-white'}`}>
                  {track.title}
                </p>
                
                {/* Floating right play button */}
                <div className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#1ed760] text-black shadow-xl transition-all duration-300 ease-in-out hover:scale-105 hover:bg-[#3be477] ${
                  isPlaying ? 'opacity-100 scale-100' : 'opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100'
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

      {/* Recently Played / Featured Carousels */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-white hover:underline cursor-pointer inline-block">
          Recently Played
        </h2>

        {/* Hidden scrollbar utilities */}
        <div className="flex gap-5 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {FEATURED.map(track => {
            const isPlaying = currentTrack?.id === track.id
            return (
              <div
                key={`featured-${track.id}`}
                onClick={() => onPlay(track, FEATURED)}
                className={`group relative w-[160px] sm:w-[180px] shrink-0 snap-start cursor-pointer rounded-lg p-4 transition-all duration-300 ${
                  isPlaying ? 'bg-[#282828]' : 'bg-[#181818] hover:bg-[#282828]'
                }`}
              >
                <div className="relative mb-4 overflow-hidden rounded-md shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
                  <img
                    src={track.albumArt}
                    alt={track.title}
                    className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Floating Play Overlay */}
                  <div className={`absolute bottom-2 right-2 flex items-center justify-center transition-all duration-300 ease-out ${
                    isPlaying ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
                  }`}>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1ed760] text-black shadow-xl hover:bg-[#3be477] hover:scale-105 transition-all">
                      {isPlaying ? (
                        <div className="flex gap-1 items-center justify-center h-full">
                          <div className="w-1 h-3 bg-black animate-pulse rounded-full" />
                          <div className="w-1 h-3 bg-black animate-pulse rounded-full delay-75" />
                          <div className="w-1 h-3 bg-black animate-pulse rounded-full delay-150" />
                        </div>
                      ) : (
                        <svg className="ml-1 h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      )}
                    </div>
                  </div>
                </div>

                <p className={`mb-1 truncate text-base font-bold tracking-tight transition-colors ${isPlaying ? 'text-[#1ed760]' : 'text-white'}`}>
                  {track.title}
                </p>
                <p className="truncate text-sm font-medium text-[#b3b3b3]">
                  {track.artist}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Trending Tracks Section */}
      <div>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-white hover:underline cursor-pointer inline-block">
            {ytTracks.length > 0 ? 'Trending Now' : 'Popular'}
          </h2>
          
          {ytLoading && (
            <div className="flex items-center gap-2 rounded-full bg-[#181818] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#b3b3b3] border border-white/5">
              <div className="h-1.5 w-1.5 animate-ping rounded-full bg-[#1ed760]" />
              Syncing
            </div>
          )}
        </div>

        <div className="mt-2">
          {/* Header Row for Tracks */}
          <div className="flex px-4 py-2 border-b border-white/5 mb-2 text-[11px] uppercase text-[#b3b3b3] font-bold tracking-widest">
            <div className="w-10 text-center">#</div>
            <div className="flex-1">Title</div>
            <div className="w-16 text-right">Time</div>
          </div>

          <div className="flex flex-col">
            {recommendedTracks.map((track, i) => (
              <TrackRow
                key={`rec-${track.id}`}
                track={track}
                index={i}
                isActive={currentTrack?.id === track.id}
                onPlay={t => onPlay(t, recommendedTracks)}
              />
            ))}
          </div>
        </div>
      </div>
      
    </div>
  )
}
