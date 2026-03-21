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
  { id: 'kXYiU_JCYtU', title: 'Numb', artist: 'Linkin Park', albumArt: 'https://i.ytimg.com/vi/kXYiU_JCYtU/mqdefault.jpg', duration: 185, youtubeId: 'kXYiU_JCYtU', plays: '1.8B' },
  { id: 'pRpeEdMmmQ0', title: 'Shallow', artist: 'Lady Gaga & Bradley Cooper', albumArt: 'https://i.ytimg.com/vi/pRpeEdMmmQ0/mqdefault.jpg', duration: 216, youtubeId: 'pRpeEdMmmQ0', plays: '940M' },
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
      .finally(() => setYtLoading(false))
  }, [])

  const recommendedTracks = ytTracks.length > 0 ? ytTracks : RECOMMENDED

  return (
    <div className="px-4 pb-10 pt-4 sm:px-6 lg:px-8">
      <div className="mb-8 overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,#1a1630_0%,#0f1020_50%,#12182e_100%)] p-5 sm:p-7 lg:p-10">
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(108,99,255,0.25)_0%,transparent_70%)] sm:h-56 sm:w-56" />

          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8B85FF] sm:text-xs">
            Welcome back, {firstName}
          </p>

          <h1 className="mb-3 max-w-2xl font-serif text-4xl leading-[1.05] text-[#EEF0FF] sm:text-5xl lg:text-6xl">
            Your music,<br />
            <em className="italic text-[#8B85FF]">your way.</em>
          </h1>

          <p className="mb-5 max-w-md text-sm leading-6 text-[#A0A3B1] sm:text-base">
            Ad-free listening. AI-powered playlists. Import from Spotify and more.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => onNavigate('import')}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-600"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Import Playlist
            </button>

            <button
              onClick={() => onNavigate('search')}
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-transparent px-5 py-3 text-sm font-semibold text-[#A0A3B1] transition hover:bg-white/5 hover:text-[#EEF0FF]"
            >
              Browse Music
            </button>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl text-[#EEF0FF] sm:text-2xl">Featured</h2>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2">
          {FEATURED.map(track => (
            <div
              key={track.id}
              onClick={() => onPlay(track, FEATURED)}
              className={`w-[160px] shrink-0 cursor-pointer rounded-2xl border p-3 transition ${
                currentTrack?.id === track.id
                  ? 'border-indigo-500/30 bg-[rgba(108,99,255,0.12)]'
                  : 'border-white/10 bg-[#11131A] hover:bg-[#171923]'
              }`}
            >
              <img
                src={track.albumArt}
                alt={track.title}
                className="mb-3 aspect-video w-full rounded-xl object-cover"
              />
              <p className="mb-1 truncate text-sm font-semibold text-[#EEF0FF]">{track.title}</p>
              <p className="truncate text-xs text-[#A0A3B1]">{track.artist}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl text-[#EEF0FF] sm:text-2xl">
            {ytTracks.length > 0 ? 'Trending Now' : 'Recommended'}
          </h2>
          {ytLoading && <span className="text-xs text-[#6B6F85]">Loading from YouTube...</span>}
        </div>

        <div className="space-y-2">
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
