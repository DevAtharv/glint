import React, { useState, useEffect, useRef } from 'react'
import type { Track, Playlist, Page } from '../types'
import { generatePlaylistFromBackend, importPlaylistFromBackend } from '../services/importApi'

interface ImportPageProps {
  onSavePlaylist: (pl: Playlist) => void
  onPlay: (track: Track) => void
  currentTrack: Track | null
  onNavigate: (page: Page) => void
}

export default function ImportPage({ onSavePlaylist, onNavigate }: ImportPageProps) {
  // --- STATE ---
  const [prompt, setPrompt] = useState('')
  const [url, setUrl] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const logRef = useRef<HTMLDivElement>(null)

  // Auto-scroll the terminal
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [logs])

  // Terminal log function passed to your backend API
  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `> ${new Date().toLocaleTimeString()}: ${msg}`])
  }

  // 🧠 REAL AI GENERATOR
  const handleAIImport = async () => {
    if (!prompt) return
    setIsProcessing(true)
    setLogs([])

    try {
      addLog("Initializing Glint Neural Engine...")
      
      // Calls YOUR actual backend function
      const newPlaylist = await generatePlaylistFromBackend(prompt, addLog)

      addLog("SUCCESS: AI Deployment complete. Saving to Library...")
      onSavePlaylist(newPlaylist)
      
      setTimeout(() => onNavigate('library'), 1500)

    } catch (error: any) {
      addLog(`CRITICAL ERROR: ${error.message || 'Backend connection failed.'}`)
    } finally {
      setIsProcessing(false)
    }
  }

  // 🔗 REAL URL SCRAPER
  const handleUrlImport = async () => {
    if (!url.trim()) return
    setIsProcessing(true)
    setLogs([]) // Clear terminal for scraper logs

    try {
      addLog(`Initializing Scraper for URL...`)
      
      // Calls YOUR actual backend function
      const newPlaylist = await importPlaylistFromBackend(url, addLog)

      addLog("SUCCESS: Playlist scraped successfully. Saving to Library...")
      onSavePlaylist(newPlaylist)
      setUrl('')
      
      setTimeout(() => onNavigate('library'), 1500)

    } catch (error: any) {
      addLog(`SCRAPE ERROR: ${error.message || 'Invalid URL or backend offline.'}`)
    } finally {
      setIsProcessing(false)
    }
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
              disabled={isProcessing || !prompt}
              className={`w-full py-5 rounded-full font-black uppercase tracking-widest transition-all shadow-xl ${
                isProcessing || !prompt ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-[#00e628] text-black hover:scale-[1.02] active:scale-95 shadow-[#00e628]/20'
              }`}
            >
              {isProcessing && prompt ? 'Deploying...' : 'Generate Playlist'}
            </button>
          </div>

          {/* SHARED TERMINAL UI */}
          <div className="h-80 lg:h-auto bg-[#080808] border border-white/5 rounded-[32px] overflow-hidden flex flex-col shadow-2xl">
            <div className="bg-white/5 px-6 py-3 border-b border-white/5 flex justify-between items-center">
              <div className="flex gap-2"><div className="w-2.5 h-2.5 rounded-full bg-red-500/20"/><div className="w-2.5 h-2.5 rounded-full bg-amber-500/20"/><div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20"/></div>
              <span className="text-[9px] font-black text-[#00e628] uppercase tracking-[0.2em]">Deployment_Console</span>
            </div>
            
            <div ref={logRef} className="p-6 font-mono text-[11px] lg:text-xs space-y-3 overflow-y-auto flex-1 scroll-smooth">
              {logs.length > 0 ? logs.map((log, i) => (
                <div key={i} className="animate-in fade-in slide-in-from-left-2">
                  <span className={i === logs.length - 1 ? (log.includes("ERROR") ? "text-red-500" : "text-[#00e628]") : "text-white/30"}>{log}</span>
                </div>
              )) : <p className="text-white/10 italic">Awaiting deployment instructions or URLs...</p>}
              {isProcessing && <span className="inline-block w-2 h-4 bg-[#00e628] animate-pulse ml-2" />}
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
          Paste a link from Spotify or Apple Music. The Glint scraper will extract the metadata and feed live logs to the terminal above.
        </p>

        <div className="flex flex-col lg:flex-row gap-4">
          <input 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-6 py-5 focus:ring-1 focus:ring-[#00e628] focus:border-[#00e628] text-white outline-none font-bold placeholder:text-white/20 transition-all" 
            placeholder="http://googleusercontent.com/spotify.com/playlist/..." 
            type="text"
          />
          <button 
            onClick={handleUrlImport}
            disabled={!url || isProcessing}
            className={`px-10 py-5 rounded-2xl font-black uppercase tracking-widest transition-all ${
              !url || isProcessing ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-white text-black hover:scale-[1.02] active:scale-95 shadow-xl'
            }`}
          >
            {isProcessing && url ? 'Scraping...' : 'Import URL'}
          </button>
        </div>
      </section>

    </div>
  )
}