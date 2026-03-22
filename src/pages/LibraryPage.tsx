import React from 'react'
import type { Track, Playlist, Page } from '../types'
import TrackRow from '../components/TrackRow'

interface LibraryPageProps {
  liked: Track[]
  playlists: Playlist[]
  onPlay: (track: Track, queue?: Track[]) => void
  currentTrack: Track | null
  onLike: (track: Track) => void
  onEditPlaylist: (pl: Playlist) => void
  onPlayPlaylist: (pl: Playlist) => void
  onNavigate: (page: Page) => void
}

export default function LibraryPage({ liked, playlists, onPlay, currentTrack, onLike, onEditPlaylist, onPlayPlaylist, onNavigate }: LibraryPageProps) {
  return (
    <div className="p-4 lg:p-10 pb-40 max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* 1. HEADER */}
      <header className="mb-10 lg:mb-16">
        <p className="text-[#00e628] text-[10px] font-black uppercase tracking-[0.3em] mb-2">Your Collection</p>
        <h1 className="text-5xl lg:text-7xl font-black tracking-tighter mb-2">LIBRARY</h1>
      </header>

      {/* 2. PLAYLISTS SECTION (This was missing!) */}
      {playlists.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black tracking-tight">Your Playlists</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
            {playlists.map((pl) => (
              <div 
                key={pl.id} 
                onClick={() => onPlayPlaylist(pl)}
                className="group cursor-pointer bg-white/5 border border-white/5 rounded-3xl p-4 hover:bg-white/10 transition-all shadow-lg hover:shadow-2xl"
              >
                <div className="aspect-square rounded-2xl overflow-hidden mb-4 relative shadow-inner">
                  <img 
                    src={pl.cover || 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=400&auto=format&fit=crop'} 
                    alt={pl.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <div className="h-12 w-12 bg-[#00e628] rounded-full flex items-center justify-center text-black font-black text-xl shadow-[0_0_20px_rgba(0,230,40,0.4)] transition-transform hover:scale-110">▶</div>
                  </div>
                </div>
                <h3 className="font-bold text-white text-sm truncate">{pl.name}</h3>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">{pl.tracks?.length || 0} Tracks</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. LIKED SONGS SECTION */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black tracking-tight">Liked Songs</h2>
          <p className="text-[#00e628] font-bold uppercase text-[10px] tracking-widest">{liked.length} Tracks</p>
        </div>

        {/* Grid Header - Hidden on Mobile */}
        {liked.length > 0 && (
          <div className="hidden md:grid grid-cols-[auto_1fr_1fr_100px] gap-4 px-4 py-2 mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 border-b border-white/5">
            <div className="w-12">#</div>
            <div>Title</div>
            <div>Album</div>
            <div className="text-right">Time</div>
          </div>
        )}

        {/* Liked Songs List */}
        <div className="space-y-1">
          {liked.length > 0 ? (
            liked.map((track) => (
              <TrackRow 
                key={track.id}
                track={track}
                isActive={currentTrack?.id === track.id}
                onPlay={(t) => onPlay(t, liked)}
                onLike={() => onLike(track)}
                isLiked={true}
              />
            ))
          ) : (
            <div className="py-24 text-center bg-white/5 rounded-[32px] border border-dashed border-white/10">
              <div className="text-4xl mb-4 opacity-50">💜</div>
              <p className="text-white/40 font-bold mb-6 max-w-sm mx-auto">Your liked songs live here. Start exploring and build your collection.</p>
              <button 
                onClick={() => onNavigate('search')}
                className="px-8 py-3 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform"
              >
                Find Music
              </button>
            </div>
          )}
        </div>
      </section>

    </div>
  )
}