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
    <div className="p-4 lg:p-8 pb-32">
      <header className="mb-10">
        <h1 className="text-4xl lg:text-6xl font-black tracking-tighter mb-2">Your Library</h1>
        <p className="text-white/40 font-bold uppercase text-xs tracking-widest">{liked.length} Liked Songs</p>
      </header>

      {/* Grid Header - Hidden on Mobile */}
      <div className="hidden md:grid grid-cols-[auto_1fr_1fr_100px] gap-4 px-4 py-2 mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 border-b border-white/5">
        <div className="w-12">#</div>
        <div>Title</div>
        <div>Album</div>
        <div className="text-right">Time</div>
      </div>

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
          <div className="py-20 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
            <p className="text-white/20 font-bold italic">Your library is empty. Start liking songs!</p>
            <button 
              onClick={() => onNavigate('search')}
              className="mt-4 px-6 py-2 bg-[#00e628] text-black rounded-full font-black text-xs uppercase"
            >
              Find Music
            </button>
          </div>
        )}
      </div>
    </div>
  )
}