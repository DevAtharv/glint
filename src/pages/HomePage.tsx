import React, { useState, useEffect } from 'react'
import type { Track } from '../types'
import { searchYouTube } from '../services/youtube'
import { useAuth } from '../hooks/useAuth'

interface HomePageProps {
  onPlay: (track: Track, queue?: Track[]) => void
  currentTrack: Track | null
  onNavigate: (page: 'search' | 'import' | 'profile') => void
}

// --- Pure SVG Icons to fix the text-rendering issue ---
const Icons = {
  Search: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
  Bell: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>,
  Settings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
  PlayFill: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 ml-1"><path d="M8 5v14l11-7z" /></svg>,
  Equalizer: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <rect x="5" y="16" width="3" height="4" rx="1"><animate attributeName="height" values="4;14;4" dur="1s" repeatCount="indefinite" begin="0s" /><animate attributeName="y" values="16;6;16" dur="1s" repeatCount="indefinite" begin="0s" /></rect>
      <rect x="10.5" y="16" width="3" height="4" rx="1"><animate attributeName="height" values="4;16;4" dur="0.8s" repeatCount="indefinite" begin="0.2s" /><animate attributeName="y" values="16;4;16" dur="0.8s" repeatCount="indefinite" begin="0.2s" /></rect>
      <rect x="16" y="16" width="3" height="4" rx="1"><animate attributeName="height" values="4;12;4" dur="1.2s" repeatCount="indefinite" begin="0.4s" /><animate attributeName="y" values="16;8;16" dur="1.2s" repeatCount="indefinite" begin="0.4s" /></rect>
    </svg>
  ),
  Heart: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 hover:fill-current hover:text-[#00e628]"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>,
  More: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>,
}

// --- Mock Data ---
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
    const key = import.meta.env.VITE_YOUTUBE_API_KEY
    if (!key) return
    searchYouTube('trending music 2024', 6).then(setYtTracks).catch(console.error)
  }, [])

  const trendingTracks = ytTracks.length > 0 ? ytTracks : RECENTLY_PLAYED.slice(0, 4)
  const userName = user?.name?.split(' ')[0] || 'User'

  // Helper to format seconds to M:SS
  const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`

  return (
    <div className="min-h-screen bg-[#121212] text-white pb-32">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 w-full bg-[#121212]/95 backdrop-blur-md">
        <div className="flex items-center gap-4 flex-1">
            <div className="hidden md:flex items-center bg-[#242424] rounded-full px-4 py-2 hover:bg-[#2a2a2a] transition-colors group border border-transparent focus-within:border-[#4c4546]">
                <div className="text-[#b3b3b3] group-focus-within:text-white mr-2"><Icons.Search /></div>
                <input className="bg-transparent border-none text-sm text-white focus:ring-0 w-64 outline-none placeholder:text-[#b3b3b3]" placeholder="What do you want to play?" type="text"/>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <button className="text-[#b3b3b3] hover:text-white hover:scale-105 transition-all">
                <Icons.Bell />
            </button>
            <button className="text-[#b3b3b3] hover:text-white hover:scale-105 transition-all">
                <Icons.Settings />
            </button>
            <button 
                onClick={() => onNavigate('profile')}
                className="h-8 w-8 rounded-full bg-[#00e628] text-black hover:scale-105 transition-all flex items-center justify-center font-bold text-sm shadow-md"
            >
                {userName.charAt(0).toUpperCase()}
            </button>
        </div>
      </header>

      {/* Main Canvas Area */}
      <main className="px-6 md:px-8 space-y-10">
        
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#006e0d] to-[#121212] p-8 md:p-10">
            <div className="relative z-10 max-w-2xl">
                <span className="inline-block px-3 py-1 rounded-full bg-black/20 text-white text-xs font-bold tracking-wider uppercase mb-4 backdrop-blur-sm">
                    Personalized for you
                </span>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
                    Welcome back, {userName}.
                </h1>
                <p className="text-base text-white/80 mb-8 max-w-lg">
                    Your daily mix is ready with new tracks based on your recent listening habits. Jump back into your sonic world.
                </p>
                <div className="flex flex-wrap gap-4">
                    <button 
                        onClick={() => onPlay(RECENTLY_PLAYED[0], RECENTLY_PLAYED)}
                        className="px-6 py-3 bg-[#00e628] text-black font-bold rounded-full flex items-center gap-2 hover:scale-105 hover:bg-[#3be477] transition-all shadow-lg"
                    >
                        <Icons.PlayFill />
                        <span className="pr-2">Play Daily Mix</span>
                    </button>
                    <button 
                        onClick={() => onNavigate('library')}
                        className="px-6 py-3 bg-transparent hover:bg-white/10 text-white font-bold rounded-full border border-white/30 hover:border-white transition-all"
                    >
                        View Library
                    </button>
                </div>
            </div>
        </section>

        {/* Recently Played Section */}
        <section>
            <h2 className="text-2xl font-bold tracking-tight text-white mb-6 hover:underline cursor-pointer w-max">
                Recently Played
            </h2>
            
            <div className="flex gap-6 overflow-x-auto pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {RECENTLY_PLAYED.map(track => {
                    const isPlaying = currentTrack?.id === track.id
                    return (
                        <div 
                            key={track.id} 
                            className="flex-none w-40 md:w-48 group cursor-pointer bg-[#181818] p-4 rounded-xl hover:bg-[#282828] transition-colors" 
                            onClick={() => onPlay(track, RECENTLY_PLAYED)}
                        >
                            <div className="relative aspect-square rounded-md overflow-hidden mb-4 shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
                                <img src={track.albumArt} alt={track.title} className="w-full h-full object-cover" />
                                
                                {/* Hover Overlay & Play Button */}
                                <div className={`absolute bottom-2 right-2 transition-all duration-300 ease-out z-10 ${isPlaying ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-90 group-hover:translate-y-0 group-hover:opacity-100 group-hover:scale-100'}`}>
                                    <div className="h-12 w-12 bg-[#00e628] rounded-full flex items-center justify-center text-black shadow-xl hover:scale-105 hover:bg-[#3be477] transition-all">
                                        {isPlaying ? <Icons.Equalizer /> : <Icons.PlayFill />}
                                    </div>
                                </div>
                            </div>
                            <h3 className={`font-bold text-base truncate mb-1 ${isPlaying ? 'text-[#00e628]' : 'text-white'}`}>{track.title}</h3>
                            <p className="text-[#b3b3b3] text-sm truncate">{track.artist}</p>
                        </div>
                    )
                })}
            </div>
        </section>

        {/* Recommended Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
            
            {/* List Section */}
            <section className="lg:col-span-2">
                <h2 className="text-2xl font-bold tracking-tight text-white mb-6">Recommended for You</h2>
                <div className="flex flex-col gap-1">
                    {trendingTracks.map((track, i) => {
                         const isPlaying = currentTrack?.id === track.id
                         return (
                            <div 
                                key={`rec-${track.id}`}
                                onClick={() => onPlay(track, trendingTracks)}
                                className="group flex items-center gap-4 p-2 rounded-md hover:bg-[#2a2a2a] transition-colors cursor-pointer"
                            >
                                {/* Art & Hover Play Button */}
                                <div className="relative h-12 w-12 rounded flex-shrink-0 overflow-hidden shadow-md">
                                    <img src={track.albumArt} alt={track.title} className="w-full h-full object-cover" />
                                    <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                         {isPlaying ? (
                                            <div className="text-[#00e628] w-6 h-6"><Icons.Equalizer /></div>
                                        ) : (
                                            <div className="text-white w-6 h-6 ml-1"><Icons.PlayFill /></div>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Track Info */}
                                <div className="flex-1 min-w-0 pr-4">
                                    <div className={`font-medium text-base truncate ${isPlaying ? 'text-[#00e628]' : 'text-white'}`}>{track.title}</div>
                                    <div className="text-[#b3b3b3] text-sm truncate hover:underline">{track.artist}</div>
                                </div>
                                
                                {/* Actions (Stop Propagation prevents clicking Heart from playing the song) */}
                                <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="text-[#b3b3b3] hover:text-white" onClick={(e) => e.stopPropagation()}>
                                        <Icons.Heart />
                                    </button>
                                </div>

                                {/* Duration */}
                                <div className="text-[#b3b3b3] text-sm w-12 text-right">
                                    {formatTime(track.duration)}
                                </div>

                                {/* More Options */}
                                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                                     <button className="text-[#b3b3b3] hover:text-white" onClick={(e) => e.stopPropagation()}>
                                        <Icons.More />
                                    </button>
                                </div>
                            </div>
                         )
                    })}
                </div>
            </section>

            {/* Visual Trending Tiles */}
            <section>
                <h2 className="text-2xl font-bold tracking-tight text-white mb-6">Trending Now</h2>
                <div className="space-y-4">
                    <div className="relative h-64 rounded-xl overflow-hidden group cursor-pointer shadow-lg">
                        <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80" alt="Jazz Vibes" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 flex flex-col justify-end transition-opacity">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="h-2 w-2 bg-[#00e628] rounded-full animate-pulse shadow-[0_0_8px_#00e628]"></span>
                                <span className="text-[10px] text-[#00e628] uppercase font-black tracking-widest">Hot Playlist</span>
                            </div>
                            <h3 className="text-white font-bold text-2xl mb-1">Jazz Vibes 2024</h3>
                            <p className="text-[#b3b3b3] text-sm font-medium">Over 2M listeners this week</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
      </main>
    </div>
  )
}
