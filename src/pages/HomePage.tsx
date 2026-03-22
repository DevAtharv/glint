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

// Synthwave & Indie Vibe Tracks
const MADE_FOR_YOU: Track[] = [
  { id: 'y6120QOlsfU', title: 'Midnight City', artist: 'M83', albumArt: 'https://i.ytimg.com/vi/y6120QOlsfU/mqdefault.jpg', duration: 243, youtubeId: 'y6120QOlsfU' },
  { id: 'rDBiqGOytMw', title: 'Sunset', artist: 'The Midnight', albumArt: 'https://i.ytimg.com/vi/rDBiqGOytMw/mqdefault.jpg', duration: 326, youtubeId: 'rDBiqGOytMw' },
  { id: '8GW6sLrK40k', title: 'Resonance', artist: 'HOME', albumArt: 'https://i.ytimg.com/vi/8GW6sLrK40k/mqdefault.jpg', duration: 212, youtubeId: '8GW6sLrK40k' },
  { id: 'MV_3Dpw-BRY', title: 'Nightcall', artist: 'Kavinsky', albumArt: 'https://i.ytimg.com/vi/MV_3Dpw-BRY/mqdefault.jpg', duration: 258, youtubeId: 'MV_3Dpw-BRY' },
]

const RECENTLY_PLAYED: Track[] = [
  { id: 'H5v3kku4y6Q', title: 'Heat Waves', artist: 'Glass Animals', albumArt: 'https://i.ytimg.com/vi/H5v3kku4y6Q/mqdefault.jpg', duration: 238, youtubeId: 'H5v3kku4y6Q' },
  { id: '6I3smoq1HCs', title: 'Cruel Summer', artist: 'Taylor Swift', albumArt: 'https://i.ytimg.com/vi/6I3smoq1HCs/mqdefault.jpg', duration: 178, youtubeId: '6I3smoq1HCs' },
  { id: 'PT2_F-1esPk', title: 'Levitating', artist: 'Dua Lipa', albumArt: 'https://i.ytimg.com/vi/PT2_F-1esPk/mqdefault.jpg', duration: 203, youtubeId: 'PT2_F-1esPk' },
  { id: 'TUVcZfQe-Kw', title: 'As It Was', artist: 'Harry Styles', albumArt: 'https://i.ytimg.com/vi/TUVcZfQe-Kw/mqdefault.jpg', duration: 167, youtubeId: 'TUVcZfQe-Kw' },
  { id: 'JGwWNGJdvx8', title: 'Shape of You', artist: 'Ed Sheeran', albumArt: 'https://i.ytimg.com/vi/JGwWNGJdvx8/mqdefault.jpg', duration: 234, youtubeId: 'JGwWNGJdvx8' },
]

const shuffleArray = (array: Track[]) => [...array].sort(() => Math.random() - 0.5)

// The bouncing equalizer animation for the playing track
function PlayingVisualizer() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="black">
      <rect x="5" y="16" width="3" height="4" rx="1">
        <animate attributeName="height" values="4;14;4" dur="1s" repeatCount="indefinite" begin="0s" />
        <animate attributeName="y" values="16;6;16" dur="1s" repeatCount="indefinite" begin="0s" />
      </rect>
      <rect x="10.5" y="16" width="3" height="4" rx="1">
        <animate attributeName="height" values="4;16;4" dur="0.8s" repeatCount="indefinite" begin="0.2s" />
        <animate attributeName="y" values="16;4;16" dur="0.8s" repeatCount="indefinite" begin="0.2s" />
      </rect>
      <rect x="16" y="16" width="3" height="4" rx="1">
        <animate attributeName="height" values="4;12;4" dur="1.2s" repeatCount="indefinite" begin="0.4s" />
        <animate attributeName="y" values="16;8;16" dur="1.2s" repeatCount="indefinite" begin="0.4s" />
      </rect>
    </svg>
  )
}

export default function HomePage({ onPlay, currentTrack, onNavigate }: HomePageProps) {
  const { user } = useAuth()
  const [ytTracks, setYtTracks] = useState<Track[]>([])
  
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'

  // Shuffle on mount to keep it fresh
  const randomMadeForYou = useMemo(() => shuffleArray(MADE_FOR_YOU).slice(0, 4), [])
  const randomRecentlyPlayed = useMemo(() => shuffleArray(RECENTLY_PLAYED), [])

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }, [])

  useEffect(() => {
    const key = import.meta.env.VITE_YOUTUBE_API_KEY
    if (!key) return
    searchYouTube('trending music 2024', 6).then(setYtTracks).catch(console.error)
  }, [])

  const trendingTracks = ytTracks.length > 0 ? ytTracks : randomRecentlyPlayed

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans text-white pb-32">
      <div className="mx-auto max-w-[1400px] px-4 pt-8 sm:px-6 lg:px-8">
        
        {/* HEADER: Matches "Home Dashboard" Top Right Icons */}
        <div className="mb-10 flex items-center justify-between">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            {greeting}
          </h1>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <button 
              onClick={() => onNavigate('search')} 
              className="text-[#b3b3b3] hover:text-white transition-colors"
              title="Search"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            
            <button 
              className="text-[#b3b3b3] hover:text-white transition-colors"
              title="Notifications"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>

            <button 
              onClick={() => onNavigate('profile')}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#181818] text-sm font-bold text-[#b3b3b3] hover:text-white hover:bg-[#282828] transition-all ring-1 ring-white/10 shadow-lg"
            >
              {initials}
            </button>
          </div>
        </div>

        {/* SECTION 1: Made For You (4 Large Squares) */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold tracking-tight text-white">
            Made for you
          </h2>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {randomMadeForYou.map(track => {
              const isPlaying = currentTrack?.id === track.id
              return (
                <div
                  key={`made-${track.id}`}
                  onClick={() => onPlay(track, randomMadeForYou)}
                  className="group relative cursor-pointer rounded-xl bg-[#181818] p-4 sm:p-5 transition-all duration-300 hover:bg-[#282828]"
                >
                  <div className="relative mb-4 w-full overflow-hidden rounded-md shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
                    <img
                      src={track.albumArt}
                      alt={track.title}
                      className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Spotify-style Green Play Button Overlay */}
                    <div className={`absolute bottom-2 right-2 flex items-center justify-center transition-all duration-300 ease-out ${
                      isPlaying ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-90 group-hover:translate-y-0 group-hover:opacity-100 group-hover:scale-100'
                    }`}>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1ed760] text-black shadow-xl hover:bg-[#3be477] hover:scale-105 transition-all">
                        {isPlaying ? (
                          <PlayingVisualizer />
                        ) : (
                          <svg className="ml-1 h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className={`mb-1 truncate text-base font-bold tracking-tight ${isPlaying ? 'text-[#1ed760]' : 'text-white'}`}>
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

        {/* SECTION 2: Recently Played (Horizontal Scroll) */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold tracking-tight text-white">
            Recently Played
          </h2>

          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {randomRecentlyPlayed.map(track => {
              const isPlaying = currentTrack?.id === track.id
              return (
                <div
                  key={`recent-${track.id}`}
                  onClick={() => onPlay(track, randomRecentlyPlayed)}
                  className="group relative w-[160px] shrink-0 snap-start cursor-pointer rounded-lg bg-[#181818] p-4 transition-all duration-300 hover:bg-[#282828]"
                >
                  <div className="relative mb-3 w-full overflow-hidden rounded-md shadow-md">
                    <img
                      src={track.albumArt}
                      alt={track.title}
                      className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className={`absolute bottom-2 right-2 flex items-center justify-center transition-all duration-300 ease-out ${
                      isPlaying ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-90 group-hover:translate-y-0 group-hover:opacity-100 group-hover:scale-100'
                    }`}>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1ed760] text-black shadow-lg hover:bg-[#3be477] hover:scale-105 transition-all">
                        {isPlaying ? <PlayingVisualizer /> : <svg className="ml-1 h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>}
                      </div>
                    </div>
                  </div>
                  <p className={`truncate text-sm font-bold tracking-tight ${isPlaying ? 'text-[#1ed760]' : 'text-white'}`}>{track.title}</p>
                  <p className="truncate text-xs font-medium text-[#b3b3b3]">{track.artist}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* SECTION 3: Trending Tracks */}
        <div>
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-white">
            Trending Now
          </h2>
          <div className="flex flex-col">
            {trendingTracks.map((track, i) => (
              <TrackRow
                key={`trending-${track.id}`}
                track={track}
                index={i}
                isActive={currentTrack?.id === track.id}
                onPlay={t => onPlay(t, trendingTracks)}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
