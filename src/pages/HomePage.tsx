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

// All have real youtubeId so audio works immediately
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
    // Try to load live YouTube results if API key is set
    const key = import.meta.env.VITE_YOUTUBE_API_KEY
    if (!key) return
    setYtLoading(true)
    searchYouTube('trending music 2024', 6).then(tracks => {
      setYtTracks(tracks)
      setYtLoading(false)
    })
  }, [])

  const recommendedTracks = ytTracks.length > 0 ? ytTracks : RECOMMENDED

  return (
    <div style={{ padding: '0 32px 40px' }}>
      {/* Hero */}
      <div style={{ borderRadius: 20, background: 'linear-gradient(135deg,#1a1630 0%,#0f1020 50%,#12182e 100%)', padding: '36px 40px', marginBottom: 32, position: 'relative', overflow: 'hidden', border: '1px solid rgba(108,99,255,.15)' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle,rgba(108,99,255,.25) 0%,transparent 70%)' }} />
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', color: '#8B85FF', textTransform: 'uppercase', marginBottom: 10 }}>Welcome back, {firstName}</p>
        <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 38, lineHeight: 1.1, color: '#EEF0FF', marginBottom: 10 }}>
          Your music,<br /><em style={{ fontStyle: 'italic', color: '#8B85FF' }}>your way.</em>
        </h1>
        <p style={{ fontSize: 13, color: '#8B8FA8', maxWidth: 320, lineHeight: 1.6, marginBottom: 20 }}>
          Ad-free listening. AI-powered playlists. Import from Spotify & more.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => onNavigate('import')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: '#6C63FF', border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700, fontFamily: "'Manrope',sans-serif", cursor: 'pointer' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            Import Playlist
          </button>
          <button onClick={() => onNavigate('search')}
            style={{ padding: '10px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,.1)', borderRadius: 10, color: '#8B8FA8', fontSize: 13, fontWeight: 600, fontFamily: "'Manrope',sans-serif", cursor: 'pointer' }}>
            Browse Music
          </button>
        </div>
      </div>

      {/* Featured / Recently Played */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 20, color: '#EEF0FF' }}>Featured</h2>
        </div>
        <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 4 }}>
          {FEATURED.map(track => (
            <div key={track.id} onClick={() => onPlay(track, FEATURED)}
              style={{ flexShrink: 0, width: 150, background: currentTrack?.id === track.id ? 'rgba(108,99,255,.12)' : '#141720', border: `1px solid ${currentTrack?.id === track.id ? 'rgba(108,99,255,.3)' : 'rgba(255,255,255,.06)'}`, borderRadius: 14, padding: 14, cursor: 'pointer', transition: 'all .2s' }}
              onMouseEnter={e => { if (currentTrack?.id !== track.id) e.currentTarget.style.borderColor = 'rgba(255,255,255,.14)' }}
              onMouseLeave={e => { if (currentTrack?.id !== track.id) e.currentTarget.style.borderColor = 'rgba(255,255,255,.06)' }}
            >
              <img src={track.albumArt} alt={track.title} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: 9, display: 'block', marginBottom: 10 }} />
              <p style={{ fontSize: 12, fontWeight: 600, color: '#EEF0FF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>{track.title}</p>
              <p style={{ fontSize: 11, color: '#8B8FA8' }}>{track.artist}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 20, color: '#EEF0FF' }}>
            {ytTracks.length > 0 ? 'Trending Now' : 'Recommended'}
          </h2>
          {ytLoading && <span style={{ fontSize: 12, color: '#494D66' }}>Loading from YouTube...</span>}
        </div>
        {recommendedTracks.map((track, i) => (
          <TrackRow key={track.id} track={track} index={i}
            isActive={currentTrack?.id === track.id}
            onPlay={t => onPlay(t, recommendedTracks)} />
        ))}
      </div>
    </div>
  )
}
