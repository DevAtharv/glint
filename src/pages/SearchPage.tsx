import React, { useState, useRef } from 'react'
import type { Track } from '../types'
import { searchYouTube } from '../services/youtube'
import TrackRow from '../components/TrackRow'

interface SearchPageProps {
  onPlay: (track: Track, queue?: Track[]) => void
  currentTrack: Track | null
}

const GENRES = [
  { label: 'Pop', color: '#FF4D6D', query: 'pop hits 2024' },
  { label: 'Hip-Hop', color: '#f5a623', query: 'hip hop rap 2024' },
  { label: 'Electronic', color: '#6C63FF', query: 'electronic music 2024' },
  { label: 'Ambient', color: '#2DD881', query: 'ambient relaxing music' },
  { label: 'Jazz', color: '#e040fb', query: 'jazz music 2024' },
  { label: 'Classical', color: '#00bcd4', query: 'classical piano music' },
  { label: 'R&B', color: '#ff7043', query: 'rnb soul 2024' },
  { label: 'Indie', color: '#78909c', query: 'indie alternative 2024' },
]

export default function SearchPage({ onPlay, currentTrack }: SearchPageProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Track[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const doSearch = (q: string) => {
    setQuery(q)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (q.length < 2) {
      setSearched(false)
      setResults([])
      return
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const r = await searchYouTube(q, 12)
        setResults(r)
      } finally {
        setSearched(true)
        setLoading(false)
      }
    }, 400)
  }

  const searchGenre = async (g: typeof GENRES[0]) => {
    setQuery(g.label)
    setLoading(true)
    try {
      const r = await searchYouTube(g.query, 12)
      setResults(r)
    } finally {
      setSearched(true)
      setLoading(false)
    }
  }

  return (
    <div className="px-4 pb-8 pt-4 sm:px-6 lg:px-8">
      <h2 className="mb-5 font-serif text-2xl text-[#EEF0FF]">Search</h2>

      <div className="relative mb-7">
        <svg
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="#6B6F85"
        >
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>

        <input
          value={query}
          onChange={e => doSearch(e.target.value)}
          placeholder="Search songs, artists, playlists..."
          className="w-full rounded-2xl border border-white/10 bg-[#11131A] py-3 pl-11 pr-12 text-sm text-[#EEF0FF] outline-none transition placeholder:text-[#6B6F85] focus:border-indigo-500/40"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setSearched(false)
              setResults([])
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-lg leading-none text-[#6B6F85] transition hover:bg-white/5 hover:text-[#EEF0FF]"
          >
            ×
          </button>
        )}
      </div>

      {!searched && (
        <>
          <p className="mb-3 text-sm font-semibold text-[#A0A3B1]">Browse by Genre</p>

          <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {GENRES.map(g => (
              <button
                key={g.label}
                type="button"
                onClick={() => searchGenre(g)}
                className="relative min-h-[92px] overflow-hidden rounded-2xl p-4 text-left transition hover:scale-[1.01]"
                style={{
                  background: `linear-gradient(135deg, ${g.color}cc, ${g.color}88)`,
                }}
              >
                <h3 className="relative z-10 font-serif text-lg text-white">{g.label}</h3>
                <div className="absolute -right-3 -bottom-3 h-16 w-16 rounded-full bg-white/15" />
              </button>
            ))}
          </div>
        </>
      )}

      {loading && (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 rounded-2xl bg-white/5" />
          ))}
        </div>
      )}

      {searched && !loading && (
        <div>
          <p className="mb-3 text-xs text-[#6B6F85]">
            {results.length} results for <span className="text-[#A0A3B1]">"{query}"</span>
          </p>

          {results.length === 0 ? (
            <p className="py-5 text-sm text-[#6B6F85]">No results found. Try a different search.</p>
          ) : (
            <div className="space-y-2">
              {results.map((t, i) => (
                <TrackRow
                  key={t.id}
                  track={t}
                  index={i}
                  isActive={currentTrack?.id === t.id}
                  onPlay={tr => onPlay(tr, results)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
