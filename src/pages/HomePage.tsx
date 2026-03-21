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
]

const RECOMMENDED: Track[] = [
  { id: 'H5v3kku4y6Q', title: 'Heat Waves', artist: 'Glass Animals', albumArt: 'https://i.ytimg.com/vi/H5v3kku4y6Q/mqdefault.jpg', duration: 238, youtubeId: 'H5v3kku4y6Q' },
  { id: '6I3smoq1HCs', title: 'Cruel Summer', artist: 'Taylor Swift', albumArt: 'https://i.ytimg.com/vi/6I3smoq1HCs/mqdefault.jpg', duration: 178, youtubeId: '6I3smoq1HCs' },
]

export default function HomePage({ onPlay, currentTrack, onNavigate }: HomePageProps) {
  const { user } = useAuth()
  const [ytTracks, setYtTracks] = useState<Track[]>([])
  const firstName = (user?.name ?? 'there').split(' ')[0]

  useEffect(() => {
    searchYouTube('trending music', 6).then(setYtTracks)
  }, [])

  const recommendedTracks = ytTracks.length > 0 ? ytTracks : RECOMMENDED

  return (
    <div className="space-y-10">

      {/* HERO */}
      <div className="relative rounded-3xl p-8 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-zinc-800 overflow-hidden shadow-xl">

  {/* glow */}
  <div className="absolute -top-20 -right-20 w-72 h-72 bg-green-500/20 blur-3xl rounded-full" />

  <p className="text-xs uppercase tracking-widest text-green-400 mb-2">
    Welcome back
  </p>

  <h1 className="text-5xl font-bold mb-3 leading-tight">
    Your music,<br />
    <span className="text-green-400 italic">your way.</span>
  </h1>

  <p className="text-zinc-400 text-sm mb-6 max-w-md">
    Ad-free listening. AI-powered playlists. Import from Spotify & more.
  </p>

  <div className="flex gap-4">
    <button className="bg-green-500 hover:bg-green-400 px-6 py-3 rounded-full font-semibold text-black transition shadow-lg">
      Import Playlist
    </button>

    <button className="border border-zinc-700 px-6 py-3 rounded-full text-zinc-300 hover:bg-zinc-800 transition">
      Browse Music
    </button>
  </div>
</div>
      {/* FEATURED */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Featured</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {FEATURED.map(track => (
            <div
              key={track.id}
              onClick={() => onPlay(track, FEATURED)}
              className="bg-zinc-900 rounded-2xl p-4 hover:bg-zinc-800 transition cursor-pointer"
            >
              <img
                src={track.albumArt}
                className="w-full aspect-video object-cover rounded-lg mb-3"
              />
              <p className="text-sm font-medium truncate">{track.title}</p>
              <p className="text-xs text-zinc-400">{track.artist}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RECOMMENDED */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {ytTracks.length ? 'Trending Now' : 'Recommended'}
        </h2>

        <div className="space-y-2">
          {recommendedTracks.map((track, i) => (
            <TrackRow
              key={track.id}
              track={track}
              index={i}
              isActive={currentTrack?.id === track.id}
              onPlay={(t) => onPlay(t, recommendedTracks)}
            />
          ))}
        </div>
      </div>

    </div>
  )
}
