import React, { useState } from 'react'

// --- Pure SVG Icons for bulletproof rendering ---
const Icons = {
  Sparkles: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z" /></svg>,
  Bolt: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.16-.28L13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z" /></svg>,
  Sync: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>,
  ChevronRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="9 18 15 12 9 6" /></svg>,
  Plus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
  MusicNote: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" /></svg>,
  Cloud: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" /></svg>,
  Globe: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>,
}

export default function ImportPage() {
  const [prompt, setPrompt] = useState('')

  const handleSuggestion = (text: string) => {
    setPrompt(text)
  }

  return (
    <div className="min-h-screen bg-[#131313] text-[#e2e2e2] font-sans pb-32">
      {/* Note: The top header and sidebar are excluded here because 
        they should be part of your main layout shell (App.tsx), 
        not the individual page component. 
      */}
      <main className="p-6 md:p-10 max-w-[1600px] mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Playlist Import</h1>
          <p className="text-white/50 max-w-lg">Migrate your library or generate brand new moods using our high-fidelity engine.</p>
        </header>

        {/* Dual-mode Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
          
          {/* AI Generate Section */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <section className="bg-white/[0.03] backdrop-blur-md rounded-2xl p-6 border border-white/5 flex flex-col h-full shadow-lg">
              <div className="flex items-center gap-2 mb-6">
                <div className="text-[#00e628]">
                  <Icons.Sparkles />
                </div>
                <h2 className="text-xl font-bold text-white">AI Generate</h2>
              </div>
              
              <div className="flex-1 flex flex-col gap-4">
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-[#e2e2e2] focus:border-[#00e628] focus:ring-1 focus:ring-[#00e628] transition-all resize-none placeholder:text-white/20 outline-none" 
                  placeholder="Describe the vibe... 'Late night driving through Tokyo in 1988' or 'Productive afternoon with organic textures'"
                />
                <div className="flex flex-wrap gap-2">
                  {['Midnight Jazz', 'Lofi Chill', 'Cyberpunk', 'Hyperpop', 'Classic Vinyl'].map((tag) => (
                    <button 
                      key={tag}
                      onClick={() => handleSuggestion(tag)}
                      className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/70 hover:bg-white/10 hover:border-[#00e628]/40 hover:text-white transition-all"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button className="px-8 py-3 bg-[#00e628] text-black font-black rounded-full flex items-center gap-2 hover:shadow-[0_0_20px_rgba(0,230,40,0.4)] hover:bg-[#3be477] transition-all active:scale-95">
                  Generate Playlist
                  <Icons.Bolt />
                </button>
              </div>
            </section>
          </div>

          {/* Platform Import Section */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <section className="bg-white/[0.03] backdrop-blur-md rounded-2xl p-6 border border-white/5 h-full shadow-lg">
              <div className="flex items-center gap-2 mb-6">
                <div className="text-white/40">
                  <Icons.Sync />
                </div>
                <h2 className="text-xl font-bold text-white">Platform Import</h2>
              </div>
              
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#1DB954]/20 flex items-center justify-center text-[#1DB954]">
                      <Icons.Globe /> {/* Spotify substitute */}
                    </div>
                    <span className="font-bold text-sm text-white">Spotify</span>
                  </div>
                  <div className="text-white/20 group-hover:text-white transition-colors">
                    <Icons.ChevronRight />
                  </div>
                </button>
                
                <button className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center text-red-500">
                      <Icons.MusicNote />
                    </div>
                    <span className="font-bold text-sm text-white">Apple Music</span>
                  </div>
                  <div className="text-white/20 group-hover:text-white transition-colors">
                    <Icons.ChevronRight />
                  </div>
                </button>
                
                <button className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-500">
                      <Icons.Cloud />
                    </div>
                    <span className="font-bold text-sm text-white">Tidal</span>
                  </div>
                  <div className="text-white/20 group-hover:text-white transition-colors">
                    <Icons.ChevronRight />
                  </div>
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-white/5">
                <p className="text-[10px] text-white/40 uppercase font-black mb-3 tracking-widest">Or Paste URL</p>
                <div className="flex gap-2">
                  <input 
                    className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#00e628] focus:border-[#00e628] text-white placeholder:text-white/30 outline-none" 
                    placeholder="Playlist link..." 
                    type="text"
                  />
                  <button className="bg-white/10 p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/20 transition-colors">
                    <Icons.Plus />
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* Intake Log / Terminal View */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <section className="bg-black border border-white/10 rounded-2xl overflow-hidden flex flex-col h-[400px] shadow-lg">
              <div className="bg-[#1f1f1f] px-4 py-2 border-b border-white/5 flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00e628]/50"></div>
                </div>
                <span className="text-[10px] font-mono text-white/30 tracking-widest uppercase">Intake Log</span>
              </div>
              
              <div className="p-4 font-mono text-xs leading-relaxed flex-1 overflow-y-auto">
                <div className="text-[#00e628]/70 mb-1">[14:02:11] Init glint-import-v2.0.4...</div>
                <div className="text-white/40 mb-1">[14:02:12] Establishing handshake with Spotify API...</div>
                <div className="text-green-400 mb-1">[14:02:13] Connection stable.</div>
                <div className="text-white/40 mb-1">[14:02:15] Fetching metadata for 'Summer Rewind 2023'...</div>
                <div className="text-white/60 mb-1">[14:02:18] Analyzing 42 tracks...</div>
                <div className="text-white/40 mb-1">[14:02:22] Mapping IRSC codes to Glint high-res sources...</div>
                <div className="text-[#00e628] mb-1">[14:02:25] Track #01: Matched (FLAC Available)</div>
                <div className="text-[#00e628] mb-1">[14:02:26] Track #02: Matched (FLAC Available)</div>
                <div className="text-yellow-500 mb-1">[14:02:28] Track #03: Matched (M4A Only)</div>
                <div className="text-[#00e628] mb-1">[14:02:30] Track #04: Matched (FLAC Available)</div>
                <div className="text-white/40 mb-1 flex items-center">
                  [14:02:31] Buffer: 85% complete...
                  <span className="animate-pulse inline-block w-2 h-3.5 bg-[#00e628] ml-2 align-middle"></span>
                </div>
              </div>
            </section>
          </div>

          {/* Generated Playlist Preview */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <section className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/5 flex flex-col h-[400px] shadow-lg">
              
              <div className="p-5 border-b border-white/5 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="font-bold text-white">Previewing Intake</h3>
                  <p className="text-[10px] font-bold text-white/40 tracking-wider mt-0.5">42 TRACKS • 2H 45M</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 rounded-lg border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white/60 hover:text-white hover:bg-white/5 transition-colors">Select All</button>
                  <button className="px-3 py-1.5 rounded-lg border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white/60 hover:text-white hover:bg-white/5 transition-colors">Clear</button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#353535] [&::-webkit-scrollbar-thumb]:rounded-full">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-[10px] text-white/30 uppercase tracking-widest border-b border-white/5">
                      <th className="px-4 py-3 font-black">#</th>
                      <th className="px-4 py-3 font-black">Track</th>
                      <th className="px-4 py-3 font-black">Artist</th>
                      <th className="px-4 py-3 font-black text-right">Bitrate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    
                    <tr className="hover:bg-white/5 transition-colors group cursor-pointer">
                      <td className="px-4 py-3 text-white/40 text-xs">01</td>
                      <td className="px-4 py-3 font-bold text-white">Solar Wind</td>
                      <td className="px-4 py-3 text-white/50 text-xs">Pulse 88</td>
                      <td className="px-4 py-3 text-right">
                        <span className="bg-[#00e628]/10 text-[#00e628] text-[10px] font-black px-2 py-1 rounded">LOSSLESS</span>
                      </td>
                    </tr>
                    
                    <tr className="hover:bg-white/5 transition-colors group cursor-pointer">
                      <td className="px-4 py-3 text-white/40 text-xs">02</td>
                      <td className="px-4 py-3 font-bold text-white">Neon Drift</td>
                      <td className="px-4 py-3 text-white/50 text-xs">SynthWave Theory</td>
                      <td className="px-4 py-3 text-right">
                        <span className="bg-[#00e628]/10 text-[#00e628] text-[10px] font-black px-2 py-1 rounded">LOSSLESS</span>
                      </td>
                    </tr>
                    
                    <tr className="hover:bg-white/5 transition-colors group cursor-pointer">
                      <td className="px-4 py-3 text-white/40 text-xs">03</td>
                      <td className="px-4 py-3 font-bold text-white">Subway Echoes</td>
                      <td className="px-4 py-3 text-white/50 text-xs">Urban Ghost</td>
                      <td className="px-4 py-3 text-right">
                        <span className="bg-white/10 text-white/40 text-[10px] font-black px-2 py-1 rounded">320 KBPS</span>
                      </td>
                    </tr>
                    
                    <tr className="hover:bg-white/5 transition-colors group cursor-pointer">
                      <td className="px-4 py-3 text-white/40 text-xs">04</td>
                      <td className="px-4 py-3 font-bold text-white">Velvet Sky</td>
                      <td className="px-4 py-3 text-white/50 text-xs">Lofi Dreams</td>
                      <td className="px-4 py-3 text-right">
                        <span className="bg-[#00e628]/10 text-[#00e628] text-[10px] font-black px-2 py-1 rounded">LOSSLESS</span>
                      </td>
                    </tr>
                    
                    <tr className="hover:bg-white/5 transition-colors group cursor-pointer">
                      <td className="px-4 py-3 text-white/40 text-xs">05</td>
                      <td className="px-4 py-3 font-bold text-white">Morning Rain</td>
                      <td className="px-4 py-3 text-white/50 text-xs">The Ambient Crew</td>
                      <td className="px-4 py-3 text-right">
                        <span className="bg-[#00e628]/10 text-[#00e628] text-[10px] font-black px-2 py-1 rounded">LOSSLESS</span>
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </section>
          </div>

        </div>
      </main>
    </div>
  )
}
