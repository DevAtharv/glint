import React from 'react'
import type { Track, Page } from '../types'
import TrackRow from '../components/TrackRow'

interface HomePageProps {
  onPlay: (track: Track) => void
  currentTrack: Track | null
  onNavigate: (page: Page) => void
}

export default function HomePage({ onPlay, currentTrack, onNavigate }: HomePageProps) {
  // Mocking some "recent" data for the example
  const recentSongs: Track[] = [] 

  return (
    <div className="p-4 lg:p-8 pb-32">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <p className="text-[#00e628] text-[10px] font-black uppercase tracking-widest mb-1">Welcome back</p>
          <h1 className="text-4xl lg:text-6xl font-black tracking-tighter">Good Evening</h1>
        </div>
      </header>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black tracking-tight">Recent Favourites</h2>
          <button onClick={() => onNavigate('library')} className="text-[10px] font-black uppercase text-[#00e628] hover:underline">View All</button>
        </div>

        {/* FIX: On mobile, this is a 1-column list.
            On desktop, it switches to a 2-column grid for "Recent" tiles.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {recentSongs.length > 0 ? (
            recentSongs.map(track => (
              <TrackRow 
                key={track.id}
                track={track}
                isActive={currentTrack?.id === track.id}
                onPlay={onPlay}
              />
            ))
          ) : (
             <div className="col-span-full p-8 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/5">
                <p className="text-white/20 font-bold italic text-sm">No recent activity found.</p>
             </div>
          )}
        </div>
      </section>
    </div>
  )
}