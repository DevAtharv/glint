import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { signOut } from '../services/supabase'
import TrackRow from '../components/TrackRow'
import type { Track, Playlist } from '../types'

interface ProfilePageProps {
  liked: Track[]
  playlists: Playlist[]
  onPlay: (track: Track, queue?: Track[]) => void
  currentTrack: Track | null
}

export default function ProfilePage({ liked, playlists, onPlay, currentTrack }: ProfilePageProps) {
  const { user, isDemo } = useAuth()

  // Fallback to your name if metadata is missing
  const displayName = user?.user_metadata?.name || 'Atharv'
  const displayEmail = user?.email || 'demo.mode@glint.app'

  const handleLogout = async () => {
    if (isDemo) {
      window.location.reload()
      return
    }
    await signOut()
    window.location.reload()
  }

  // Grab the last 5 liked songs for the "Recent Activity" section
  const recentLikes = liked.slice(0, 5)

  return (
    <div className="p-4 lg:p-10 pb-40 max-w-5xl mx-auto animate-in fade-in duration-500">
      
      {/* 1. HERO SECTION */}
      <header className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-12 lg:mb-16 text-center md:text-left">
        <div className="relative group">
          <div className="absolute inset-0 bg-[#00e628] rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
          <div className="h-32 w-32 lg:h-48 lg:w-48 rounded-full bg-gradient-to-br from-[#121212] to-[#2a2a2a] border-2 border-white/10 flex items-center justify-center relative z-10 shadow-2xl overflow-hidden">
            <span className="text-5xl lg:text-7xl font-black text-white/50 uppercase">
              {displayName.charAt(0)}
            </span>
          </div>
        </div>
        
        <div className="flex-1 pb-2">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <span className="bg-white/10 border border-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-[#00e628]">
              {isDemo ? 'Guest Account' : 'Verified User'}
            </span>
          </div>
          <h1 className="text-4xl lg:text-7xl font-black tracking-tighter mb-1">{displayName}</h1>
          <p className="text-white/40 font-bold text-sm lg:text-base">{displayEmail}</p>
        </div>
      </header>

      {/* 2. STATS GRID */}
      <section className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
        <div className="bg-white/5 border border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-lg hover:bg-white/10 transition-colors">
          <span className="text-4xl mb-2">💜</span>
          <p className="text-3xl font-black text-white">{liked.length}</p>
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">Saved Tracks</p>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-lg hover:bg-white/10 transition-colors">
          <span className="text-4xl mb-2">💽</span>
          <p className="text-3xl font-black text-white">{playlists.length}</p>
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">Playlists</p>
        </div>
        <div className="col-span-2 md:col-span-1 bg-[#00e628]/10 border border-[#00e628]/20 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-lg">
          <span className="text-4xl mb-2">✨</span>
          <p className="text-3xl font-black text-[#00e628]">Active</p>
          <p className="text-[10px] text-[#00e628]/60 font-bold uppercase tracking-widest mt-1">Neural Engine</p>
        </div>
      </section>

      {/* 3. RECENT ACTIVITY & SETTINGS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Col: Recent Likes */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-black tracking-tight mb-6">Recently Liked</h2>
          {recentLikes.length > 0 ? (
            <div className="space-y-1 bg-white/5 border border-white/5 rounded-3xl p-2">
              {recentLikes.map(track => (
                <TrackRow 
                  key={track.id} 
                  track={track} 
                  isActive={currentTrack?.id === track.id} 
                  onPlay={(t) => onPlay(t, liked)} 
                  onLike={() => {}} // Disabled on profile page to keep it clean
                  isLiked={true} 
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
              <p className="text-white/40 font-bold text-sm">No recent activity. Start liking songs!</p>
            </div>
          )}
        </div>

        {/* Right Col: Account Settings */}
        <div>
          <h2 className="text-xl font-black tracking-tight mb-6">Account</h2>
          <div className="bg-white/5 border border-white/5 rounded-3xl p-6 space-y-4">
            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 font-bold text-sm transition-colors flex justify-between items-center group">
              Account Details <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 font-bold text-sm transition-colors flex justify-between items-center group">
              Audio Quality <span className="text-white/40 text-xs">High</span>
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 font-bold text-sm transition-colors flex justify-between items-center group">
              Appearance <span className="text-[#00e628] text-xs">Dark Mode</span>
            </button>
            
            <div className="h-[1px] bg-white/10 w-full my-4" />
            
            <button 
              onClick={handleLogout}
              className="w-full py-4 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white font-black uppercase tracking-widest text-[10px] transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}cl