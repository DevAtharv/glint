import React, { useState } from 'react'
import type { Playlist, Track } from '../types'
// THIS IS THE MAGIC FIX: We import your actual AI services!
import { generatePlaylistFromPrompt, importPlaylistFromUrl } from '../services/groq'

interface ImportPageProps {
  onSavePlaylist: (playlist: Playlist) => void 
  onNavigate?: (page: any) => void
  onPlay?: (track: Track) => void
  currentTrack?: Track | null
}

const Icons = {
  Sparkles: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z" /></svg>,
  Bolt: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.16-.28L13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z" /></svg>,
  Sync: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>,
}

export default function ImportPage({ onSavePlaylist, onNavigate }: ImportPageProps) {
  const [prompt, setPrompt] = useState('')
  const [url, setUrl] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [statusMsg, setStatusMsg] = useState('') // This shows the cool terminal loading steps!

  // --- REAL AI GENERATION ---
  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    setStatusMsg('Initializing AI...')

    try {
      const newPlaylist = await generatePlaylistFromPrompt(prompt, setStatusMsg)
      onSavePlaylist(newPlaylist)
      if (onNavigate) onNavigate('library')
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Failed to generate playlist.')
    } finally {
      setIsGenerating(false)
      setStatusMsg('')
    }
  }

  // --- REAL URL IMPORT ---
  const handleUrlImport = async () => {
    if (!url.trim()) return
    setIsGenerating(true)
    setStatusMsg('Analysing URL...')

    try {
      const newPlaylist = await importPlaylistFromUrl(url, setStatusMsg)
      onSavePlaylist(newPlaylist)
      if (onNavigate) onNavigate('library')
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Failed to import playlist.')
    } finally {
      setIsGenerating(false)
      setStatusMsg('')
    }
  }

  return (
    <div className="min-h-screen bg-[#131313] text-[#e2e2e2] font-sans pb-32">
      <main className="p-6 md:p-10 max-w-[1600px] mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Playlist Import</h1>
          <p className="text-white/50 max-w-lg">Migrate your library or generate brand new moods using our high-fidelity engine.</p>
        </header>

        {/* LOADING STATUS BAR */}
        {statusMsg && (
          <div className="mb-6 p-4 bg-[#00e628]/10 border border-[#00e628]/30 rounded-lg text-[#00e628] font-mono text-sm flex items-center gap-3 animate-pulse">
            <div className="w-4 h-4 rounded-full border-2 border-[#00e628] border-t-transparent animate-spin"></div>
            {statusMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          
          <section className="bg-white/[0.03] rounded-2xl p-6 border border-white/5 flex flex-col shadow-lg">
            <div className="flex items-center gap-2 mb-6 text-[#00e628]">
              <Icons.Sparkles />
              <h2 className="text-xl font-bold text-white">AI Generate</h2>
            </div>
            
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-[#e2e2e2] focus:border-[#00e628] focus:ring-1 transition-all resize-none outline-none mb-4" 
              placeholder="Describe the vibe... e.g., 'Late night driving through Tokyo'"
            />
            
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !prompt}
              className="w-full py-3 bg-[#00e628] text-black font-black rounded-xl flex items-center justify-center gap-2 hover:bg-[#3be477] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? 'Working...' : 'Generate Playlist'}
              <Icons.Bolt />
            </button>
          </section>

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
                disabled={isGenerating || !url}
                className="w-full bg-white/10 py-4 rounded-xl text-white font-bold hover:bg-white/20 transition-colors disabled:opacity-50"
              >
                {isGenerating ? 'Working...' : 'Import from Link'}
              </button>
            </div>
          </section>

        </div>
      </main>
    </div>
  )
}
