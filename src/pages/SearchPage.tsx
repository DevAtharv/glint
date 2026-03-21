import React, { useState } from 'react'
import type { Track } from '../types'
import { searchYouTube } from '../services/youtube'
import TrackRow from '../components/TrackRow'

interface Props {
  onPlay: (track: Track, queue?: Track[]) => void
  currentTrack: Track | null
}

const GENRES = [
  { name: 'Pop', color: 'bg-pink-500' },
  { name: 'Hip-Hop', color: 'bg-yellow-500' },
  { name: 'Rock', color: 'bg-red-500' },
  { name: 'Electronic', color: 'bg-purple-500' },
  { name: 'Focus', color: 'bg-blue-500' },
  { name: 'Chill', color: 'bg-green-500' },
  { name: 'Workout', color: 'bg-orange-500' },
  { name: 'Jazz', color: 'bg-indigo-500' },
]

export default function SearchPage({ onPlay, currentTrack }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Track[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (q: string) => {
    setQuery(q)
    if (!q.trim()) return setResults([])

    setLoading(true)
    try {
      const res = await searchYouTube(q, 10)
      setResults(res)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 pb-10 pt-4 sm:px-6 lg:px-8">

      {/* 🔍 SEARCH BAR */}
      <div className="mb-8">
        <input
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="What do you want to listen to?"
          className="w-full rounded-full bg-[#242424] px-5 py-4 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#1DB954]"
        />
      </div>

      {/* 🎯 SHOW GENRES WHEN EMPTY */}
      {query === '' && (
        <>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Browse all
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {GENRES.map((g) => (
              <button
                key={g.name}
                onClick={() => handleSearch(g.name)}
                className={`relative rounded-xl p-4 h-[100px] text-left font-bold text-white overflow-hidden ${g.color}`}
              >
                <span className="relative z-10">{g.name}</span>

                <div className="absolute bottom-[-10px] right-[-10px] w-20 h-20 bg-black/20 rounded-xl rotate-12" />
              </button>
            ))}
          </div>
        </>
      )}

      {/* 🎵 RESULTS */}
      {query !== '' && (
        <>
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-white">
              Results for "{query}"
            </h2>
            {loading && (
              <span className="text-sm text-gray-400">Searching...</span>
            )}
          </div>

          {results.length === 0 && !loading && (
            <p className="text-gray-500">No results found</p>
          )}

          <div className="space-y-2">
            {results.map((track, i) => (
              <TrackRow
                key={track.id}
                track={track}
                index={i}
                isActive={currentTrack?.id === track.id}
                onPlay={(t) => onPlay(t, results)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
