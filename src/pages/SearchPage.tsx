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

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY as string

export default function SearchPage({ onPlay, currentTrack }: SearchPageProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Track[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [usingFallback, setUsingFallback] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const doSearch = (q: string) => {
    setQuery(q)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (q.length < 2) { setSearched(false); setResults([]); return }
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const r = await searchYouTube(q, 12)
        setResults(r)
        // Check if we got real results or fallback
        const hasRealResults = r.length > 0 && r[0].youtubeId && !r[0].id.startsWith('fb-')
        setUsingFallback(!hasRealResults && !API_KEY)
      } catch (e) {
        setUsingFallback(true)
      }
      setSearched(true)
      setLoading(false)
    }, 500)
  }

  const searchGenre = async (g: typeof GENRES[0]) => {
    setQuery(g.label)
    setLoading(true)
    try {
      const r = await searchYouTube(g.query, 12)
      setResults(r)
      const hasRealResults = r.length > 0 && r[0].youtubeId && !r[0].id.startsWith('fb-')
      setUsingFallback(!hasRealResults && !API_KEY)
    } catch (e) {
      setUsingFallback(true)
    }
    setSearched(true)
    setLoading(false)
  }

  return (
    <div style={{ padding: '0 32px 32px' }}>
      <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, color: '#EEF0FF', marginBottom: 20 }}>Search</h2>

      {/* API Warning */}
      {usingFallback && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 10, marginBottom: 20, background: 'rgba(245,166,35,.08)', border: '1px solid rgba(245,166,35,.2)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#f5a623"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
          <p style={{ fontSize: 12, color: '#f5a623' }}>
            YouTube API quota exceeded. Search is using fallback tracks. Get a new API key or wait for quota reset.
          </p>
        </div>
      )}

      {/* Search input */}
      <div style={{ position: 'relative', marginBottom: 28 }}>
        <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} width="16" height="16" viewBox="0 0 24 24" fill="#494D66">
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        <input
          value={query}
          onChange={e => doSearch(e.target.value)}
          placeholder="Search songs, artists, playlists..."
          style={{
            width: '100%', background: '#141720',
            border: '1px solid rgba(255,255,255,.06)',
            borderRadius: 12, padding: '13px 14px 13px 42px',
            color: '#EEF0FF', fontSize: 14,
            fontFamily: "'Manrope',sans-serif", outline: 'none',
          }}
          onFocus={e => e.target.style.borderColor = 'rgba(108,99,255,.4)'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,.06)'}
        />
        {query && (
          <button onClick={() => { setQuery(''); setSearched(false); setResults([]) }}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#494D66', cursor: 'pointer', fontSize: 18 }}>
            ×
          </button>
        )}
      </div>

      {!searched && (
        <>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#8B8FA8', marginBottom: 14 }}>Browse by Genre</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 28 }}>
            {GENRES.map(g => (
              <div
                key={g.label}
                onClick={() => searchGenre(g)}
                style={{
                  borderRadius: 12, padding: '20px 16px',
                  background: `linear-gradient(135deg,${g.color}cc,${g.color}88)`,
                  cursor: 'pointer', position: 'relative', overflow: 'hidden', minHeight: 80,
                  transition: 'transform .15s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}
              >
                <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 17, color: '#fff', position: 'relative', zIndex: 1 }}>{g.label}</h3>
                <div style={{ position: 'absolute', right: -12, bottom: -12, width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,.15)' }} />
              </div>
            ))}
          </div>
        </>
      )}

      {loading && (
        <div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ height: 56, background: 'rgba(255,255,255,.03)', borderRadius: 10, marginBottom: 2 }} />
          ))}
        </div>
      )}

      {searched && !loading && (
        <div>
          <p style={{ fontSize: 12, color: '#494D66', marginBottom: 12 }}>
            {results.length} results for "<span style={{ color: '#8B8FA8' }}>{query}</span>"
          </p>
          {results.length === 0
            ? <p style={{ color: '#494D66', fontSize: 13, padding: '20px 0' }}>No results found. Try a different search.</p>
            : results.map((t, i) => (
                <TrackRow key={t.id} track={t} index={i} isActive={currentTrack?.id === t.id} onPlay={tr => onPlay(tr, results)} />
              ))
          }
        </div>
      )}
    </div>
  )
}
