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
    <div className="px-4 pb-12 pt-6 sm:px-6 lg:px-8 max-w-[1400px] mx-auto font-sans bg-[#121212] min-h-screen text-white">
      
      {/* Hero Section */}
      <div className="relative mb-12 overflow-hidden rounded-xl bg-gradient-to-br from-[#2a2a2a] to-[#121212] p-8 sm:p-12">
        <div className="relative z-10">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[#b3b3b3]">
            Welcome back, {firstName}
          </p>

          <h1 className="mb-4 max-w-2xl text-5xl font-bold tracking-tighter text-white sm:text-6xl lg:text-7xl">
            Your music, <br />
            your way.
          </h1>

          <p className="mb-8 max-w-md text-sm font-medium text-[#b3b3b3]">
            Ad-free listening. AI-powered playlists. Import seamlessly from anywhere.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              onClick={() => onNavigate('import')}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1ed760] px-8 py-3.5 text-sm font-bold text-black transition-all hover:scale-105 hover:bg-[#3be477]"
            >
              Import Playlist
            </button>

            <button
              onClick={() => onNavigate('search')}
              className="inline-flex items-center justify-center rounded-full border border-[#727272] bg-transparent px-8 py-3.5 text-sm font-bold text-white transition-all hover:scale-105 hover:border-white"
            >
              Browse Music
            </button>
          </div>
        </div>
      </div>

      {/* Featured Section */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-white hover:underline cursor-pointer inline-block">
          Featured
        </h2>

        {/* Hidden scrollbar utilities for a cleaner look */}
        <div className="flex gap-4 overflow-x-auto pb-6 pt-2 px-2 -mx-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {FEATURED.map(track => {
            const isPlaying = currentTrack?.id === track.id
            return (
              <div
                key={track.id}
                onClick={() => onPlay(track, FEATURED)}
                className={`group relative w-[180px] sm:w-[200px] shrink-0 snap-start cursor-pointer rounded-md p-4 transition-all duration-300 ${
                  isPlaying
                    ? 'bg-[#282828]'
                    : 'bg-[#181818] hover:bg-[#282828]'
                }`}
              >
                <div className="relative mb-4">
                  <img
                    src={track.albumArt}
                    alt={track.title}
                    className="aspect-square w-full rounded-md object-cover shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
                  />
                  
                  {/* Floating Play Overlay (Spotify Style) */}
                  <div className={`absolute bottom-2 right-2 flex items-center justify-center shadow-xl transition-all duration-300 ease-in-out ${
                    isPlaying 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
                  }`}>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1ed760] text-black hover:bg-[#3be477] hover:scale-105 transition-all">
                      {isPlaying ? (
                        <div className="flex gap-1 items-center justify-center h-full">
                          <div className="w-1 h-3 bg-black animate-pulse rounded-full" />
                          <div className="w-1 h-3 bg-black animate-pulse rounded-full delay-75" />
                          <div className="w-1 h-3 bg-black animate-pulse rounded-full delay-150" />
                        </div>
                      ) : (
                        <svg className="ml-1 h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>

                <p className={`mb-1 truncate text-base font-bold tracking-tight ${isPlaying ? 'text-[#1ed760]' : 'text-white'}`}>
                  {track.title}
                </p>
                <p className="truncate text-sm font-medium text-[#b3b3b3] hover:underline cursor-pointer inline-block">
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
          <h2 className="text-2xl font-bold tracking-tight text-white hover:underline cursor-pointer inline-block">
            {ytTracks.length > 0 ? 'Trending Now' : 'Recommended'}
          </h2>
          
          {ytLoading && (
            <div className="flex items-center gap-2 rounded-full bg-[#181818] px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-[#b3b3b3]">
              <div className="h-2 w-2 animate-pulse rounded-full bg-[#1ed760]" />
              Loading
            </div>
          )}
        </div>

        <div className="mt-2 rounded-lg">
          {/* Header Row for Tracks */}
          <div className="flex px-4 py-2 border-b border-white/10 mb-2 text-sm text-[#b3b3b3] font-medium tracking-wide">
            <div className="w-8 text-center">#</div>
            <div className="flex-1">Title</div>
            <div className="w-12 text-right">⌚</div>
          </div>

          <div className="flex flex-col">
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
      
    </div>
  )
}
