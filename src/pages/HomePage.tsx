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
  { id: '41qC3w3UUkU', title: 'Tech Noir', artist: 'Gunship', albumArt: 'https://i.ytimg.com/vi/41qC3w3UUkU/mqdefault.jpg', duration: 290, youtubeId: '41qC3w3UUkU' },
  { id: 'er416Ad3R1g', title: 'A Real Hero', artist: 'College & Electric Youth', albumArt: 'https://i.ytimg.com/vi/er416Ad3R1g/mqdefault.jpg', duration: 267, youtubeId: 'er416Ad3R1g' },
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
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <rect x="4" y="15" width="4" height="5" rx="1">
        <animate attributeName="height" values="5;14;5" dur="1s" repeatCount="indefinite" begin="0s" />
        <animate attributeName="y" values="15;6;15" dur="1s" repeatCount="indefinite" begin="0s" />
      </rect>
      <rect x="10" y="15" width="4" height="5" rx="1">
        <animate attributeName="height" values="5;16;5" dur="0.8s" repeatCount="indefinite" begin="0.2s" />
        <animate attributeName="y" values="15;4;15" dur="0.8s" repeatCount="indefinite" begin="0.2s" />
      </rect>
      <rect x="16" y="15" width="4" height="5" rx="1">
        <animate attributeName="height" values="5;12;5" dur="1.2s" repeatCount="indefinite" begin="0.4s" />
        <animate attributeName="y" values="15;8;15" dur="1.2s" repeatCount="indefinite" begin="0.4s" />
      </rect>
    </svg>
  )
}

export default function HomePage({ onPlay, currentTrack, onNavigate }: HomePageProps) {
  const { user } = useAuth()
  const [ytTracks, setYtTracks] = useState<Track[]>([])
  const [activeFilter, setActiveFilter] = useState<'All' | 'Music' | 'Podcasts'>('All')
  
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'

  // Standard 6 items for the top greeting grid
  const greetingGridTracks = useMemo(() => shuffleArray(MADE_FOR_YOU).slice(0, 6), [])
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
    <div className="min-h-screen bg-gradient-to-b from-[#1e1e1e] to-[#121212] font-sans text-white pb-32">
      <div className="mx-auto max-w-[1600px] px-4 pt-6 sm:px-6 lg:px-8">
        
        {/* HEADER: Profile & Navigation */}
        <div className="mb-6 flex items-center justify-between sticky top-0 bg-transparent z-10 py-4">
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveFilter('All')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeFilter === 'All' ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              All
            </button>
            <button 
              onClick={() => setActiveFilter('Music')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeFilter === 'Music' ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              Music
            </button>
            <button 
              onClick={() => setActiveFilter('Podcasts')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeFilter === 'Podcasts' ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              Podcasts
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              className="text-[#b3b3b3] hover:text-white transition-colors"
              title="Notifications"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>
            <button 
              onClick={() => onNavigate('profile')}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#181818] text-xs font-bold text-white hover:scale-105 transition-all ring-4 ring-[#121212] shadow-lg"
            >
              {initials}
            </button>
          </div>
        </div>

        {/* SECTION 1: Greeting & Compact Grid (The Spotify Signature Look) */}
        <div className="mb-10 mt-2">
          <h1 className="mb-6 text-3xl font-bold tracking-tight text-white drop-shadow-sm">
            {greeting}
          </h1>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
            {greetingGridTracks.map(track => {
              const isPlaying = currentTrack?.id === track.id
              return (
                <div
                  key={`grid-${track.id}`}
                  onClick={() => onPlay(track, greetingGridTracks)}
                  className="group relative flex h-16 cursor-pointer items-center overflow-hidden rounded-md bg-white/5 transition-colors duration-300 hover:bg-white/20"
                >
                  <img
                    src={track.albumArt}
                    alt={track.title}
                    className="h-16 w-16 object-cover shadow-[4px_0_12px_rgba(0,0,0,0.5)]"
                  />
                  <div className="flex flex-1 items-center justify-between px-4">
                    <p className={`truncate text-sm font-bold ${isPlaying ? 'text-[#1ed760]' : 'text-white'}`}>
                      {track.title}
                    </p>
                    
                    {/* Hover Play Button */}
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1ed760] text-black shadow-lg transition-all duration-300 ${
                      isPlaying ? 'opacity-100 scale-100' : 'opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100'
                    }`}>
                      {isPlaying ? (
                        <PlayingVisualizer />
                      ) : (
                        <svg className="ml-1 h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* SECTION 2: Recently Played (Horizontal Scroll Cards) */}
        <div className="mb-10">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-white hover:underline cursor-pointer">
              Recently Played
            </h2>
            <span className="text-sm font-bold text-[#b3b3b3] hover:underline cursor-pointer">Show all</span>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {randomRecentlyPlayed.map(track => {
              const isPlaying = currentTrack?.id === track.id
              return (
                <div
                  key={`recent-${track.id}`}
                  onClick={() => onPlay(track, randomRecentlyPlayed)}
                  className="group relative w-[180px] shrink-0 snap-start cursor-pointer rounded-lg bg-[#181818] p-4 transition-all duration-300 hover:bg-[#282828]"
                >
                  <div className="relative mb-4 w-full overflow-hidden rounded-md shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
                    <img
                      src={track.albumArt}
                      alt={track.title}
                      className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Spotify-style Floating Play Button */}
                    <div className={`absolute bottom-2 right-2 flex items-center justify-center transition-all duration-300 ease-out ${
                      isPlaying ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-90 group-hover:translate-y-0 group-hover:opacity-100 group-hover:scale-100'
                    }`}>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1ed760] text-black shadow-xl hover:bg-[#3be477] hover:scale-105 transition-all">
                        {isPlaying ? <PlayingVisualizer /> : <svg className="ml-1 h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>}
                      </div>
                    </div>
                  </div>
                  <h3 className={`truncate text-base font-bold pb-1 ${isPlaying ? 'text-[#1ed760]' : 'text-white'}`}>
                    {track.title}
                  </h3>
                  <p className="line-clamp-2 text-sm font-medium text-[#b3b3b3]">
                    {track.artist}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* SECTION 3: Trending Tracks (List Layout) */}
        <div>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-white hover:underline cursor-pointer">
              Trending Now
            </h2>
          </div>
          <div className="flex flex-col rounded-xl bg-[#121212]/50 p-2 border border-white/5">
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
