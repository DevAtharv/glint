import React, { useState } from "react"
import type { Track } from "../types"
import { searchYouTube } from "../services/youtube"
import TrackRow from "../components/TrackRow"

interface SearchPageProps {
  onPlay?: (track: Track, queue?: Track[]) => void
  currentTrack?: Track | null
}

export default function SearchPage({ onPlay, currentTrack }: SearchPageProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Track[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (value: string) => {
    setQuery(value)

    if (value.trim().length < 2) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const found = await searchYouTube(value, 10)
      setResults(found)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold">Search</h1>
        <p className="text-zinc-400 text-sm">Find songs, artists, and playlists.</p>
      </div>

      <input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search songs or artists"
        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 outline-none focus:border-zinc-600"
      />

      {loading && <p className="text-zinc-400 text-sm">Searching...</p>}

      <div className="space-y-2">
        {results.map((track, index) => (
          <TrackRow
            key={track.id}
            track={track}
            index={index}
            isActive={currentTrack?.id === track.id}
            onPlay={(t) => onPlay?.(t, results)}
          />
        ))}
      </div>
    </div>
  )
}
