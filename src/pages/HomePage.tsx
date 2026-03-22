import React from 'react'
import type { Page, Track } from '../types'

interface HomePageProps {
  onPlay: (track: Track) => void
  currentTrack: Track | null
  onNavigate: (page: Page) => void
  likedCount: number
}

export default function HomePage({ onNavigate, likedCount }: HomePageProps) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening'

  return (
    <div className="p-4 lg:p-10 pb-40 max-w-7xl mx-auto animate-in fade-in duration-700">
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-1 w-8 bg-[#00e628] rounded-full" />
          <p className="text-[#00e628] text-[10px] font-black uppercase tracking-[0.4em]">Personalized for Atharv</p>
        </div>
        <h1 className="text-5xl lg:text-8xl font-black tracking-tighter leading-none">{greeting}</h1>
      </header>

      {/* Hero Card */}
      <section 
        onClick={() => onNavigate('import')}
        className="relative h-64 lg:h-96 w-full rounded-[40px] overflow-hidden mb-10 group cursor-pointer shadow-2xl border border-white/5"
      >
        <img 
          src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 grayscale-[0.3] group-hover:grayscale-0"
          alt=""
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute bottom-8 left-8 lg:bottom-12 lg:left-12">
          <span className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white mb-4 inline-block">Neural Engine Active</span>
          <h2 className="text-3xl lg:text-6xl font-black text-white tracking-tight mb-4 uppercase">AI Playlist<br/>Deployment</h2>
          <button className="bg-[#00e628] text-black px-8 py-3 rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 transition-transform">Get Started</button>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <button onClick={() => onNavigate('library')} className="flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/5 p-4 rounded-2xl transition-all">
          <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-2xl shadow-lg">💜</div>
          <div className="text-left"><p className="font-black text-white text-sm">Liked Songs</p><p className="text-[10px] text-white/40 font-bold uppercase">{likedCount} Tracks</p></div>
        </button>
        <button onClick={() => onNavigate('import')} className="flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/5 p-4 rounded-2xl transition-all">
          <div className="h-14 w-14 rounded-xl bg-[#00e628] flex items-center justify-center text-2xl text-black">✨</div>
          <div className="text-left"><p className="font-black text-white text-sm">AI Import</p><p className="text-[10px] text-[#00e628] font-bold uppercase">Terminal Ready</p></div>
        </button>
      </div>

      <section>
        <h3 className="text-2xl font-black mb-6 tracking-tight">Glint Daily Mixes</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-square bg-white/5 border border-white/5 rounded-3xl mb-4 overflow-hidden relative shadow-xl">
                 <img src={`https://picsum.photos/seed/${i+10}/400/400`} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" alt=""/>
              </div>
              <p className="font-black text-sm truncate px-1 uppercase tracking-tighter">Mix 0{i}</p>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-1">AI Curated</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}