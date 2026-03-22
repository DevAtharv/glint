import React, { useState, useEffect, useRef } from 'react'
import type { Track, Playlist, Page } from '../types'

interface ImportPageProps {
  onSavePlaylist: (pl: Playlist) => void
  onPlay: (track: Track) => void
  currentTrack: Track | null
  onNavigate: (page: Page) => void
}

export default function ImportPage({ onSavePlaylist, onNavigate }: ImportPageProps) {
  // --- AI GENERATION STATE ---
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const logRef = useRef<HTMLDivElement>(null)

  // --- URL SCRAPER STATE ---
  const [url, setUrl] = useState('')
  const [isImportingUrl, setIsImportingUrl] = useState(false)

  // Auto-scroll the terminal
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [logs])

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `> ${new Date().toLocaleTimeString()}: ${msg}`])
  }

  // 🧠 LOCAL AI SIMULATION ENGINE
  const handleAIImport = async () => {
    if (!prompt) return
    setIsGenerating(true)
    setLogs([])

    try {
      addLog("Initializing Glint Neural Engine...")
      await new Promise(r => setTimeout(r, 800))
      
      addLog(`Analyzing Request: "${prompt}"`)
      await new Promise(r => setTimeout(r, 1000))
      
      addLog("Connecting to LLM and Global Audio Nodes...")
      await new Promise(r => setTimeout(r, 1200))
      
      addLog(`Successfully extracted high-fidelity tracks.`)
      await new Promise(r => setTimeout(r, 800))
      
      addLog("Generating unique metadata...")
      await new Promise(r => setTimeout(r, 800))
      
      addLog("SUCCESS: Deployment complete. Saving to Library...")

      // Create the new AI Playlist
      const newPlaylist: Playlist = {
        id: `ai-${Date.now()}`,
        name: `AI: ${prompt.substring(0, 15)}...`,
        cover: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=400&auto=format&fit=crop',
        tracks: [
          { id: `t1-${Date.now()}`, title: 'Neural Pulse', artist: 'Glint AI', albumArt: 'https://picsum.photos/seed/synth1/400/400', duration: 210, youtubeId: 'jfKfPfyJRdk' },
          { id: `t2-${Date.now()}`, title: 'Data Stream Beta', artist: 'Glint AI', albumArt: 'https://picsum.photos/seed/synth2/400/400', duration: 185, youtubeId: 'jfKfPfyJRdk' }
        ]
      }
      
      onSavePlaylist(newPlaylist)
      
      // Teleport to library
      setTimeout(() => onNavigate('library'), 1500)

    } catch (error) {
      addLog("CRITICAL ERROR: Connection failed.")
    } finally {
      setIsGenerating(false)
    }
  }

  // 🔗 URL SCRAPER SIMULATION ENGINE
  const handleUrlImport = async () => {
    if (!url.trim()) return
    setIsImportingUrl(true)

    // Simulate scraping delay
    await new Promise(r => setTimeout(r, 1500))

    const isSpotify = url.includes('spotify.com')
    const platformName = isSpotify ? 'Spotify' : 'Platform'

    const newPlaylist: Playlist = {
      id: `imported-${Date.now()}`,
      name: `Imported ${platformName} Mix`,
      cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80',
      tracks: [
        { id: `imp1-${Date.now()}`, title: 'Imported Track 1', artist: 'Unknown Artist', albumArt: 'https://picsum.photos/seed/imp1/400/400', duration: 200, youtubeId: 'jfKfPfyJRdk' }
      ]
    }
    
    onSavePlaylist(newPlaylist)
    setIsImportingUrl(false)
    setUrl('')
    onNavigate('library')
  }

  return (
    <div className="p-4 lg:p-10 pb-40 max-w-6xl mx-auto animate-in fade-in duration-500">
      <header className="mb-10">
        <p className="text-[#00e628] text-[10px] font-black uppercase tracking-[0.3em] mb-2">Import Modules</p>
        <h1 className="text-5xl lg:text-7xl font-black tracking-tighter mb-4">MIGRATE & DEPLOY</h1>
      </header>

      {/* =========================================
          MODULE 1: AI NEURAL ENGINE
      ========================================= */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-6 text-white/50">
          <span className="text-xl">✨</span>
          <h2 className="text-lg font-black uppercase tracking-widest">AI Generator</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <div className="flex flex-col gap-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the mood, genre, or vibe..."
              className="w-full flex-1 bg-white/5 border border-white/10 rounded-[32px] p-6 text-lg font-bold focus:border-[#00e628]/50 outline-none resize-none shadow-2xl transition-all"
            />
            <button
              onClick={handleAIImport}
              disabled={isGenerating || !prompt}
              className={`w-full py-5 rounded-full font-black uppercase tracking-widest transition-all shadow-xl ${
                isGenerating ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-[#00e628] text-black hover:scale-[1.02] active:scale-95 shadow-[#00e628]/20'
              }`}
            >
              {isGenerating ? 'Deploying...' : 'Generate Playlist'}
            </button>
          </div>

          <div className="h-80 lg:h-auto bg-[#080808] border border-white/5 rounded-[32px] overflow-hidden flex flex-col shadow-2xl">
            <div className="bg-white/5 px-6 py-3 border-b border-white/5 flex justify-between items-center">
              <div className="flex gap-2"><div className="w-2.5 h-2.5 rounded-full bg-red-500/20"/><div className="w-2.5 h-2.5 rounded-full bg-amber-500/20"/><div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20"/></div>
              <span className="text-[9px] font-black text-[#00e628] uppercase tracking-[0.2em]">Deployment_Console</span>
            </div>
            
            <div ref={logRef} className="p-6 font-mono text-[11px] lg:text-xs space-y-3 overflow-y-auto flex-1 scroll-smooth">
              {logs.length > 0 ? logs.map((log, i) => (
                <div key={i} className="animate-in fade-in slide-in-from-left-2">
                  <span className={i === logs.length - 1 ? "text-[#00e628]" : "text-white/30"}>{log}</span>
                </div>
              )) : <p className="text-white/10 italic">Awaiting deployment instructions...</p>}
              {isGenerating && <span className="inline-block w-2 h-4 bg-[#00e628] animate-pulse ml-2" />}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          MODULE 2: SPOTIFY / PLATFORM SCRAPER
      ========================================= */}
      <section className="bg-white/5 border border-white/10 rounded-[32px] p-6 lg:p-10 shadow-2xl">
        <div className="flex items-center gap-2 mb-6 text-white/50">
          <span className="text-xl">🔗</span>
          <h2 className="text-lg font-black uppercase tracking-widest">Platform Scraper</h2>
        </div>
        
        <p className="text-white/40 font-bold mb-6 text-sm lg:text-base max-w-2xl">
          Paste a link from Spotify, Apple Music, or YouTube. The Glint scraper will extract the metadata and rebuild the playlist in your library.
        </p>

        <div className="flex flex-col lg:flex-row gap-4">
          <input 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-6 py-5 focus:ring-1 focus:ring-[#00e628] focus:border-[#00e628] text-white outline-none font-bold placeholder:text-white/20 transition-all" 
            placeholder="https://open.spotify.com/playlist/..." 
            type="text"
          />
          <button 
            onClick={handleUrlImport}
            disabled={!url || isImportingUrl}
            className={`px-10 py-5 rounded-2xl font-black uppercase tracking-widest transition-all ${
              !url || isImportingUrl ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-white text-black hover:scale-[1.02] active:scale-95 shadow-xl'
            }`}
          >
            {isImportingUrl ? 'Scraping...' : 'Import URL'}
          </button>
        </div>
      </section>

    </div>
  )
}