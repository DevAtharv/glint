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

// Synthwave & Indie Vibe Tracks (Mock Data)
const MADE_FOR_YOU: Track[] = [
  { id: '1', title: 'Midnight City', artist: 'M83', albumArt: 'https://i.ytimg.com/vi/y6120QOlsfU/mqdefault.jpg', duration: 243, youtubeId: 'y6120QOlsfU' },
  { id: '2', title: 'Sunset', artist: 'The Midnight', albumArt: 'https://i.ytimg.com/vi/rDBiqGOytMw/mqdefault.jpg', duration: 326, youtubeId: 'rDBiqGOytMw' },
]

const RECENTLY_PLAYED: Track[] = [
  { id: '3', title: 'Neon Horizons', artist: 'Synthwave Collective', albumArt: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80', duration: 238, youtubeId: 'H5v3kku4y6Q' },
  { id: '4', title: 'Midnight Pulse', artist: 'Lara Vane', albumArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80', duration: 178, youtubeId: '6I3smoq1HCs' },
  { id: '5', title: 'Silent Strings', artist: 'The Acoustic Trio', albumArt: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=500&q=80', duration: 203, youtubeId: 'PT2_F-1esPk' },
  { id: '6', title: 'Echoes of Soul', artist: 'Marcus Grant', albumArt: 'https://images.unsplash.com/photo-1520166012956-add9ba0ee3f4?w=500&q=80', duration: 167, youtubeId: 'TUVcZfQe-Kw' },
  { id: '7', title: 'Deep Water', artist: 'Aether', albumArt: 'https://images.unsplash.com/photo-1518066000714-58c45f1a2c0a?w=500&q=80', duration: 234, youtubeId: 'JGwWNGJdvx8' },
]

export default function HomePage({ onPlay, currentTrack, onNavigate }: HomePageProps) {
  const { user } = useAuth()
  const [ytTracks, setYtTracks] = useState<Track[]>([])

  useEffect(() => {
    // Only search if we have a key, otherwise we rely on mock data or handle gracefully
    const key = import.meta.env.VITE_YOUTUBE_API_KEY
    if (!key) return
    searchYouTube('trending music 2024', 6).then(setYtTracks).catch(console.error)
  }, [])

  const trendingTracks = ytTracks.length > 0 ? ytTracks : RECENTLY_PLAYED.slice(0, 4)
  const userName = user?.name?.split(' ')[0] || 'User'

  return (
    <div className="min-h-screen bg-[#131313] text-[#e2e2e2] font-['Inter'] pb-32">
      
      {/* Top Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 w-full bg-black/95 border-b border-white/10 md:pl-72">
        <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center bg-[#1f1f1f] rounded-full px-4 py-1.5 border border-[#4c4546]/30">
                <span className="material-symbols-outlined text-white/60 text-sm mr-2">search</span>
                <input className="bg-transparent border-none text-sm text-white/80 focus:ring-0 w-64 outline-none" placeholder="Search for music..." type="text"/>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <button className="text-white/60 hover:text-white transition-colors active:scale-95 duration-200">
                <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="text-white/60 hover:text-white transition-colors active:scale-95 duration-200">
                <span className="material-symbols-outlined">settings</span>
            </button>
            <button 
                onClick={() => onNavigate('profile')}
                className="h-8 w-8 rounded-full bg-[#353535] overflow-hidden border border-white/10 flex items-center justify-center font-bold text-xs"
            >
                {userName.charAt(0).toUpperCase()}
            </button>
        </div>
      </header>

      {/* Main Canvas Area */}
      <main className="flex-1 md:ml-64 p-6 md:p-8 space-y-12">
        
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#00e628]/40 via-[#1f1f1f] to-[#131313] p-8 md:p-12 border border-white/5">
            <div className="relative z-10 max-w-2xl">
                <span className="inline-block px-3 py-1 rounded-full bg-[#00e628]/20 text-[#00e628] text-xs font-bold tracking-wider uppercase mb-4">
                    Personalized for you
                </span>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6">
                    Welcome back, {userName}.
                </h1>
                <p className="text-lg text-white/70 mb-8 leading-relaxed">
                    Your daily mix is ready with new tracks based on your recent listening habits. Jump back into your sonic world.
                </p>
                <div className="flex flex-wrap gap-4">
                    <button 
                        onClick={() => onPlay(RECENTLY_PLAYED[0], RECENTLY_PLAYED)}
                        className="px-8 py-3 bg-[#00e628] text-black font-bold rounded-full flex items-center gap-2 hover:scale-105 transition-transform"
                    >
                        <span className="material-symbols-outlined fill-current" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                        Play Daily Mix
                    </button>
                    <button 
                        onClick={() => onNavigate('library')}
                        className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full backdrop-blur-md border border-white/10 transition-colors"
                    >
                        View Library
                    </button>
                </div>
            </div>
            {/* Background Blur */}
            <div className="absolute right-0 top-0 w-1/3 h-full opacity-30 pointer-events-none">
                <div className="w-full h-full bg-[#00e628]/40 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
            </div>
        </section>

        {/* Recently Played Section */}
        <section>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-white">Recently Played</h2>
                <button className="text-[#00e628] text-sm font-semibold hover:underline">See all</button>
            </div>
            
            <div className="flex gap-6 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] -mx-2 px-2">
                {RECENTLY_PLAYED.map(track => {
                    const isPlaying = currentTrack?.id === track.id
                    return (
                        <div key={track.id} className="flex-none w-40 md:w-48 group cursor-pointer" onClick={() => onPlay(track, RECENTLY_PLAYED)}>
                            <div className="relative aspect-square rounded-xl overflow-hidden mb-3 shadow-lg transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[#00e628]/20">
                                <img src={track.albumArt} alt={track.title} className="w-full h-full object-cover" />
                                
                                {/* Hover Overlay */}
                                <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                    <div className="h-12 w-12 bg-[#00e628] rounded-full flex items-center justify-center text-black shadow-lg hover:scale-105 transition-transform">
                                        {isPlaying ? (
                                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>equalizer</span>
                                        ) : (
                                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <h3 className={`font-bold text-sm truncate ${isPlaying ? 'text-[#00e628]' : 'text-white'}`}>{track.title}</h3>
                            <p className="text-white/40 text-xs">{track.artist}</p>
                        </div>
                    )
                })}
            </div>
        </section>

        {/* Recommended & Trending Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* List Section */}
            <section className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-white">Recommended for You</h2>
                </div>
                <div className="space-y-2">
                    {trendingTracks.map((track, i) => {
                         const isPlaying = currentTrack?.id === track.id
                         return (
                            <div 
                                key={`rec-${track.id}`}
                                onClick={() => onPlay(track, trendingTracks)}
                                className="group flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5"
                            >
                                <div className="relative h-12 w-12 rounded flex-none overflow-hidden">
                                    <img src={track.albumArt} alt={track.title} className="w-full h-full object-cover" />
                                    <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                         {isPlaying ? (
                                            <span className="material-symbols-outlined text-[#00e628]" style={{ fontVariationSettings: "'FILL' 1" }}>equalizer</span>
                                        ) : (
                                            <span className="material-symbols-outlined text-white text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className={`font-medium text-sm truncate ${isPlaying ? 'text-[#00e628]' : 'text-white'}`}>{track.title}</div>
                                    <div className="text-white/40 text-xs truncate">{track.artist}</div>
                                </div>
                                <div className="text-white/40 text-xs hidden sm:block">
                                    {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                                </div>
                                <button className="text-white/30 hover:text-[#00e628] transition-colors" onClick={(e) => e.stopPropagation()}>
                                    <span className="material-symbols-outlined text-xl">favorite</span>
                                </button>
                                <button className="text-white/30 hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>
                                    <span className="material-symbols-outlined text-xl">more_horiz</span>
                                </button>
                            </div>
                         )
                    })}
                </div>
            </section>

            {/* Visual Trending Tiles */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-white">Trending Now</h2>
                </div>
                <div className="space-y-4">
                    <div className="relative h-48 rounded-2xl overflow-hidden group cursor-pointer border border-white/5">
                        <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80" alt="Jazz Vibes" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="h-1.5 w-1.5 bg-[#00e628] rounded-full animate-pulse"></span>
                                <span className="text-[10px] text-[#00e628] uppercase font-black tracking-widest">Hot Playlist</span>
                            </div>
                            <h3 className="text-white font-bold text-lg">Jazz Vibes 2024</h3>
                            <p className="text-white/60 text-xs">Over 2M listeners this week</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
      </main>
    </div>
  )
}
