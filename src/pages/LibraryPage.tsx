import React, { useState } from 'react'
import type { Playlist, Track } from '../types'
import { useAuth } from '../hooks/useAuth'

interface LibraryPageProps {
  playlists: Playlist[]
  onPlayPlaylist: (pl: Playlist) => void
  onPlay: (track: Track, queue?: Track[]) => void
  currentTrack: Track | null
  onNavigate: (page: 'search' | 'import' | 'profile' | 'home') => void
  onEditPlaylist: (pl: Playlist) => void // <-- ADDED THIS PROP
}

// --- Pure SVG Icons ---
const Icons = {
  Search: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
  Bell: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>,
  Settings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2h-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
  HeartFill: ({ className }: { className?: string }) => <svg viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>,
  PlayFill: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 ml-1"><path d="M8 5v14l11-7z" /></svg>,
  PlaySmall: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-0.5"><path d="M8 5v14l11-7z" /></svg>,
  Plus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
  List: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>,
  Grid: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
  Clock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
  Edit: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg> // <-- ADDED EDIT ICON
}

// Mock Data for "Recent Favorites" based on your HTML
const RECENT_FAVORITES: Track[] = [
  { id: 'f1', title: 'Neon Nights', artist: 'Cybercore', albumArt: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80', duration: 222, youtubeId: '' },
  { id: 'f2', title: 'After Hours', artist: 'Velvet Dreams', albumArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80', duration: 255, youtubeId: '' },
  { id: 'f3', title: 'Electric Pulse', artist: 'Digital Rain', albumArt: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=500&q=80', duration: 178, youtubeId: '' },
  { id: 'f4', title: 'Midnight City', artist: 'The Echoes', albumArt: 'https://images.unsplash.com/photo-1520166012956-add9ba0ee3f4?w=500&q=80', duration: 321, youtubeId: '' },
]

export default function LibraryPage({ playlists, onPlayPlaylist, onPlay, currentTrack, onNavigate, onEditPlaylist }: LibraryPageProps) {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'liked' | 'playlists' | 'albums' | 'artists'>('liked')
  const userName = user?.name?.split(' ')[0] || 'User'

  // Format seconds to M:SS
  const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`

  return (
    <div className="min-h-screen bg-[#131313] text-[#e2e2e2] font-sans pb-32">
      
      {/* Top App Bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 w-full bg-[#131313]/95 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-black tracking-tighter text-[#00e628]">Library</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center bg-[#1f1f1f] rounded-full px-4 py-1.5 border border-white/5">
            <div className="text-white/40 mr-2"><Icons.Search /></div>
            <input className="bg-transparent border-none text-sm focus:ring-0 text-white placeholder-white/30 w-48 outline-none" placeholder="Search in library" type="text" />
          </div>
          <button className="text-white/60 hover:text-white transition-colors active:scale-95 duration-200">
            <Icons.Bell />
          </button>
          <button className="text-white/60 hover:text-white transition-colors active:scale-95 duration-200">
            <Icons.Settings />
          </button>
          <button onClick={() => onNavigate('profile')} className="h-8 w-8 rounded-full bg-[#353535] border border-white/10 flex items-center justify-center font-bold text-xs hover:scale-105 transition-transform text-white">
            {userName.charAt(0).toUpperCase()}
          </button>
        </div>
      </header>

      <main className="p-6 max-w-[1400px] mx-auto">
        
        {/* Tabs */}
        <div className="flex items-center gap-8 mb-8 border-b border-white/5 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {(['liked', 'playlists', 'albums', 'artists'] as const).map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 font-bold capitalize whitespace-nowrap transition-all ${
                activeTab === tab 
                  ? 'text-[#00e628] border-b-2 border-[#00e628]' 
                  : 'text-white/40 hover:text-white font-medium'
              }`}
            >
              {tab === 'liked' ? 'Liked Songs' : tab}
            </button>
          ))}
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          
          {/* Main Liked Songs Card */}
          <div className="md:col-span-2 relative group overflow-hidden rounded-2xl aspect-[2/1] bg-gradient-to-br from-[#006e0d]/40 to-[#1f1f1f] border border-white/5 p-6 flex flex-col justify-end cursor-pointer shadow-lg hover:border-[#00e628]/30 transition-colors">
            <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500">
              <Icons.HeartFill className="w-32 h-32 text-[#00e628]" />
            </div>
            <h3 className="text-3xl font-black text-white mb-1 relative z-10">Liked Songs</h3>
            <p className="text-white/60 mb-4 font-medium relative z-10">1,284 tracks saved</p>
            <button className="w-14 h-14 rounded-full bg-[#00e628] text-black flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform relative z-10 hover:bg-[#3be477]">
              <Icons.PlayFill />
            </button>
          </div>

          {/* Create New Card */}
          <div 
            onClick={() => onNavigate('import')}
            className="md:col-span-1 bg-[#1f1f1f] rounded-2xl border border-white/10 p-6 flex flex-col justify-center items-center text-center hover:bg-[#2a2a2a] transition-colors cursor-pointer border-dashed hover:border-[#00e628]/50 group"
          >
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:bg-[#00e628]/10 group-hover:text-[#00e628] transition-colors text-white/60">
              <Icons.Plus />
            </div>
            <span className="font-bold text-sm text-white">Create New</span>
            <span className="text-xs text-white/40 mt-1 font-medium">Playlist or AI Gen</span>
          </div>

          {/* Recommended Card */}
          <div className="md:col-span-1 bg-[#1f1f1f] rounded-2xl border border-white/5 p-6 flex flex-col justify-between hover:bg-[#2a2a2a] transition-colors cursor-pointer shadow-lg">
            <span className="text-xs font-black text-[#00e628] uppercase tracking-widest">Recommended</span>
            <div>
              <h4 className="font-bold text-white text-lg">Daily Mix 1</h4>
              <p className="text-xs text-white/40 font-medium">Based on your library</p>
            </div>
          </div>
        </div>

        {/* Section: Your Playlists Grid */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white tracking-tight">Your Playlists</h3>
            <button className="text-xs font-bold text-[#00e628] hover:underline uppercase tracking-wider">See all</button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {playlists.length > 0 ? (
              playlists.map(pl => (
                <div key={pl.id} className="group cursor-pointer relative" onClick={() => onPlayPlaylist(pl)}>
                  
                  {/* --- NEW EDIT BUTTON --- */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Stops the playlist from playing when you click edit
                      onEditPlaylist(pl); // Triggers your edit screen
                    }}
                    className="absolute top-2 right-2 p-2 bg-black/70 rounded-full text-white opacity-0 group-hover:opacity-100 hover:bg-[#00e628] hover:text-black transition-all z-20 shadow-lg"
                    title="Edit Playlist"
                  >
                    <Icons.Edit />
                  </button>

                  <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-[#353535] shadow-lg border border-white/5">
                    <img src={pl.cover} alt={pl.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                      <div className="w-14 h-14 rounded-full bg-[#00e628] text-black flex items-center justify-center shadow-2xl translate-y-4 group-hover:translate-y-0 transition-all hover:scale-105 hover:bg-[#3be477]">
                        <Icons.PlayFill />
                      </div>
                    </div>
                  </div>
                  <h4 className="font-bold text-base text-white truncate">{pl.name}</h4>
                  <p className="text-sm text-white/40 font-medium truncate">By {userName} • {pl.tracks.length} songs</p>
                </div>
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-white/40 border border-white/5 border-dashed rounded-xl">
                No custom playlists yet. Click 'Create New' above to get started.
              </div>
            )}
          </div>
        </section>

        {/* Section: High-Density Liked Songs List */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white tracking-tight">Recent Favorites</h3>
            <div className="flex gap-2">
              <button className="p-2 bg-white/10 rounded-lg text-[#00e628] hover:bg-white/20 transition-colors">
                <Icons.List />
              </button>
              <button className="p-2 hover:bg-white/5 rounded-lg text-white/60 hover:text-white transition-colors">
                <Icons.Grid />
              </button>
            </div>
          </div>

          <div className="space-y-1">
            {/* Table Header */}
            <div className="grid grid-cols-[48px_1fr_1fr_120px_48px] gap-4 px-4 py-3 text-xs font-black text-white/30 uppercase tracking-widest border-b border-white/5 mb-2">
              <div className="text-center">#</div>
              <div>Title</div>
              <div className="hidden md:block">Album</div>
              <div className="hidden sm:block">Date Added</div>
              <div className="flex justify-end pr-2"><Icons.Clock /></div>
            </div>

            {/* List Items */}
            {RECENT_FAVORITES.map((track, index) => {
              const isPlaying = currentTrack?.id === track.id
              
              return (
                <div 
                  key={track.id}
                  onClick={() => onPlay(track, RECENT_FAVORITES)}
                  className="grid grid-cols-[48px_1fr_1fr_120px_48px] gap-4 px-4 py-3 items-center group hover:bg-[#1f1f1f] rounded-xl transition-colors cursor-pointer border border-transparent hover:border-white/5"
                >
                  {/* Number / Play Button Toggle */}
                  <div className="text-center relative flex justify-center items-center h-full">
                    <span className={`text-base font-medium ${isPlaying ? 'text-[#00e628] hidden' : 'text-white/40 group-hover:hidden'}`}>
                      {index + 1}
                    </span>
                    <div className={`text-[#00e628] ${isPlaying ? 'block' : 'hidden group-hover:block'}`}>
                      <Icons.PlaySmall />
                    </div>
                  </div>

                  {/* Title & Art */}
                  <div className="flex items-center gap-4 min-w-0">
                    <img src={track.albumArt} alt={track.title} className="w-10 h-10 rounded-md object-cover shadow-md" />
                    <div className="truncate">
                      <p className={`font-bold text-base truncate ${isPlaying ? 'text-[#00e628]' : 'text-white'}`}>
                        {track.title}
                      </p>
                      <p className="text-sm text-white/40 truncate hover:underline">{track.artist}</p>
                    </div>
                  </div>

                  {/* Album */}
                  <div className="text-sm font-medium text-white/40 truncate hidden md:block hover:underline">
                    {track.title} - Single
                  </div>

                  {/* Date */}
                  <div className="text-sm font-medium text-white/40 hidden sm:block">
                    2 days ago
                  </div>

                  {/* Duration */}
                  <div className="text-right text-sm font-medium text-white/40 pr-2">
                    {formatTime(track.duration)}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

      </main>
    </div>
  )
}
