import React, { useState, useEffect } from 'react'
import type { Track } from '../types'
import { searchYouTube } from '../services/youtube'
import TrackRow from '../components/TrackRow'
import { useAuth } from '../hooks/useAuth'

interface HomePageProps {
  onPlay: (track: Track, queue?: Track[]) => void
  currentTrack: Track | null
  onNavigate: (page: 'search' | 'import') => void
}

const FEATURED: Track[] = [
  { id: 'y6120QOlsfU', title: 'Midnight City', artist: 'M83', albumArt: 'https://i.ytimg.com/vi/y6120QOlsfU/mqdefault.jpg', duration: 243, youtubeId: 'y6120QOlsfU' },
  { id: 'Q6_dHMzYBFE', title: 'Nightcall', artist: 'Kavinsky', albumArt: 'https://i.ytimg.com/vi/Q6_dHMzYBFE/mqdefault.jpg', duration: 252, youtubeId: 'Q6_dHMzYBFE' },
  { id: 'fHI8X4OXluQ', title: 'Blinding Lights', artist: 'The Weeknd', albumArt: 'https://i.ytimg.com/vi/fHI8X4OXluQ/mqdefault.jpg', duration: 200, youtubeId: 'fHI8X4OXluQ' },
  { id: 'OF4lSCGFLB4', title: 'Starboy', artist: 'The Weeknd', albumArt: 'https://i.ytimg.com/vi/OF4lSCGFLB4/mqdefault.jpg', duration: 230, youtubeId: 'OF4lSCGFLB4' },
  { id: '7wtfhZwyrcc', title: 'Rockstar', artist: 'Post Malone', albumArt: 'https://i.ytimg.com/vi/7wtfhZwyrcc/mqdefault.jpg', duration: 218, youtubeId: '7wtfhZwyrcc' },
]

const RECOMMENDED: Track[] = [
  { id: 'H5v3kku4y6Q', title: 'Heat Waves', artist: 'Glass Animals', albumArt: 'https://i.ytimg.com/vi/H5v3kku4y6Q/mqdefault.jpg', duration: 238, youtubeId: 'H5v3kku4y6Q', plays: '2.1B' },
  { id: '6I3smoq1HCs', title: 'Cruel Summer', artist: 'Taylor Swift', albumArt: 'https://i.ytimg.com/vi/6I3smoq1HCs/mqdefault.jpg', duration: 178, youtubeId: '6I3smoq1HCs', plays: '890M' },
  { id: 'PT2_F-1esPk', title: 'Levitating', artist: 'Dua Lipa', albumArt: 'https://i.ytimg.com/vi/PT2_F-1esPk/mqdefault.jpg', duration: 203, youtubeId: 'PT2_F-1esPk', plays: '1.1B' },
  { id: 'TUVcZfQe-Kw', title: 'As It Was', artist: 'Harry Styles', albumArt: 'https://i.ytimg.com/vi/TUVcZfQe-Kw/mqdefault.jpg', duration: 167, youtubeId: 'TUVcZfQe-Kw', plays: '1.8B' },
  { id: 'JGwWNGJdvx8', title: 'Shape of You', artist: 'Ed Sheeran', albumArt: 'https://i.ytimg.com/vi/JGwWNGJdvx8/mqdefault.jpg', duration: 234, youtubeId: 'JGwWNGJdvx8', plays: '6B' },
  { id: 'OPf0YbXqDm0', title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', albumArt: 'https://i.ytimg.com/vi/OPf0YbXqDm0/mqdefault.jpg', duration: 270, youtubeId: 'OPf0YbXqDm0', plays: '4.9B' },
]

export default function HomePage({ onPlay, currentTrack, onNavigate }: HomePageProps) {
  const { user } = useAuth()
  const [ytTracks, setYtTracks] = useState<Track[]>([])
  const [ytLoading, setYtLoading] = useState(false)
  const firstName = (user?.name ?? 'there').split(' ')[0]

  useEffect(() => {
    const key = import.meta.env.VITE_YOUTUBE_API_KEY
    if (!key) return

    setYtLoading(true)
    searchYouTube('trending music 2024', 6)
      .then(tracks => setYtTracks(tracks))
      .catch(console.error)
      .finally(() => setYtLoading(false))
  }, [])

  const recommendedTracks = ytTracks.length > 0 ? ytTracks : RECOMMENDED

  return (
    <div className="px-4 pb-12 pt-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Hero Section */}
      <div className="relative mb-12 overflow-hidden rounded-[32px] border border-white/5 bg-gradient-to-br from-[#1a1630] via-[#0f1020] to-[#12182e] p-8 sm:p-12 shadow-2xl">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-indigo-500/20 blur-[80px]" />
        
        <div className="relative z-10">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-indigo-400">
            Welcome back, {firstName}
          </p>

          <h1 className="mb-4 max-w-2xl font-serif text-4xl font-medium leading-tight text-white sm:text-5xl lg:text-6xl">
            Your music,<br />
            <span className="italic text-indigo-400">your way.</span>
          </h1>

          <p className="mb-8 max-w-md text-base text-zinc-400">
            Ad-free listening. AI-powered playlists. Import from Spotify and more.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              onClick={() => onNavigate('import')}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-500 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:scale-105 hover:bg-indigo-400 active:scale-95 shadow-lg shadow-indigo-500/25"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Import Playlist
            </button>

            <button
              onClick={() => onNavigate('search')}
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-zinc-300 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white active:scale-95"
            >
              Browse Music
            </button>
          </div>
        </div>
      </div>

      {/* Featured Section */}
      <div className="mb-12">
        <h2 className="mb-6 font-serif text-2xl font-medium text-white">Featured</h2>

        {/* Hidden scrollbar utilities for a cleaner look */}
        <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {FEATURED.map(track => {
            const isPlaying = currentTrack?.id === track.id
            return (
              <div
                key={track.id}
                onClick={() => onPlay(track, FEATURED)}
                className={`group relative w-[160px] sm:w-[180px] shrink-0 snap-start cursor-pointer rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 ${
                  isPlaying
                    ? 'bg-indigo-500/10 border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.1)]'
                    : 'bg-[#11131A] border border-white/5 hover:bg-[#1a1d27] hover:shadow-xl hover:shadow-black/50'
                }`}
              >
                <div className="relative mb-4 overflow-hidden rounded-xl bg-zinc-800 shadow-md">
                  <img
                    src={track.albumArt}
                    alt={track.title}
                    className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Play Overlay */}
                  <div className={`absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500 text-white shadow-lg transform transition-transform group-hover:scale-110">
                      {isPlaying ? (
                        <div className="flex gap-1">
                          <div className="w-1 h-3 bg-white animate-pulse rounded-full" />
                          <div className="w-1 h-3 bg-white animate-pulse rounded-full delay-75" />
                          <div className="w-1 h-3 bg-white animate-pulse rounded-full delay-150" />
                        </div>
                      ) : (
                        <svg className="ml-1 h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>

                <p className={`mb-1 truncate text-base font-semibold transition-colors ${isPlaying ? 'text-indigo-400' : 'text-zinc-100 group-hover:text-white'}`}>
                  {track.title}
                </p>
                <p className="truncate text-sm text-zinc-400 group-hover:text-zinc-300">
                  {track.artist}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recommended/Trending Section */}
      <div>
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-serif text-2xl font-medium text-white">
            {ytTracks.length > 0 ? 'Trending Now' : 'Recommended'}
          </h2>
          
          {ytLoading && (
            <div className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-zinc-400 border border-white/5">
              <div className="h-2 w-2 animate-pulse rounded-full bg-indigo-400" />
              Loading...
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          {recommendedTracks.map((track, i) => (
            <TrackRow
              key={track.id}
              track={track}
              index={i}
              isActive={currentTrack?.id === track.id}
              onPlay={t => onPlay(t, recommendedTracks)}
            />
          ))}
        </div>
      </div>
      
    </div>
  )
}
