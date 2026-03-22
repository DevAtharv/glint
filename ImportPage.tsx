import React, { useState } from 'react'
import type { Playlist, Track } from '../types' // Adjust this import based on your actual types file

interface ImportPageProps {
  onImport: (playlist: Playlist) => void
  onNavigate: (page: 'search' | 'library' | 'home' | 'profile') => void
}

const Icons = {
  Sparkles: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z" /></svg>,
  Bolt: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.16-.28L13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z" /></svg>,
  Sync: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>,
  Plus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
}

export default function ImportPage({ onImport, onNavigate }: ImportPageProps) {
  const [prompt, setPrompt] = useState('')
  const [url, setUrl] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  // --- LOGIC: AI Generation ---
  const handleGenerate = () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    
    // Simulate an API call / Generation delay
    setTimeout(() => {
      const newPlaylist: Playlist = {
        id: `ai-${Date.now()}`,
        name: `${prompt.split(' ')[0]} Vibes`, // Creates a name based on the first word
        cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80',
        tracks: [
          // Mock tracks just so it's not empty
          { id: '1', title: 'Generated Track 1', artist: 'Glint AI', duration: 180, albumArt: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80' }
        ]
      }
      
      onImport(newPlaylist) // Pass it up to App.tsx
      setIsGenerating(false)
      onNavigate('library') // Send user to library to see their new playlist
    }, 1500)
  }

  // --- LOGIC: URL Import ---
  const handleUrlImport = () => {
    if (!url.trim()) return
    
    const newPlaylist: Playlist = {
      id: `imported-${Date.now()}`,
      name: 'Imported Playlist',
      cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80',
      tracks: []
    }
    
    onImport(newPlaylist)
    onNavigate('library')
  }

  return (
    <div className="min-h-screen bg-[#131313] text-[#e2e2e2] font-sans pb-32">
      <main className="p-6 md:p-10 max-w-[1600px] mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Playlist Import</h1>
          <p className="text-white/50 max-w-lg">Migrate your library or generate brand new moods using our high-fidelity engine.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          
          {/* AI Generate Section */}
          <section className="bg-white/[0.03] rounded-2xl p-6 border border-white/5 flex flex-col shadow-lg">
            <div className="flex items-center gap-2 mb-6 text-[#00e628]">
              <Icons.Sparkles />
              <h2 className="text-xl font-bold text-white">AI Generate</h2>
            </div>
            
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-[#e2e2e2] focus:border-[#00e628] focus:ring-1 transition-all resize-none outline-none mb-4" 
              placeholder="Describe the vibe..."
            />
            
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !prompt}
              className="w-full py-3 bg-[#00e628] text-black font-black rounded-xl flex items-center justify-center gap-2 hover:bg-[#3be477] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? 'Generating...' : 'Generate Playlist'}
              <Icons.Bolt />
            </button>
          </section>

          {/* Platform Import Section */}
          <section className="bg-white/[0.03] rounded-2xl p-6 border border-white/5 shadow-lg">
            <div className="flex items-center gap-2 mb-6 text-white/40">
              <Icons.Sync />
              <h2 className="text-xl font-bold text-white">Paste URL</h2>
            </div>
            
            <div className="flex flex-col gap-4 mt-16">
              <input 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 focus:ring-1 focus:ring-[#00e628] focus:border-[#00e628] text-white outline-none" 
                placeholder="Paste Spotify or Apple Music link..." 
                type="text"
              />
              <button 
                onClick={handleUrlImport}
                disabled={!url}
                className="w-full bg-white/10 py-4 rounded-xl text-white font-bold hover:bg-white/20 transition-colors disabled:opacity-50"
              >
                Import from Link
              </button>
            </div>
          </section>

        </div>
      </main>
    </div>
  )
}
