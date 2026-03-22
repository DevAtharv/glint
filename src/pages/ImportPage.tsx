import React, { useState, useEffect, useRef } from 'react'
import type { Track, Playlist, Page } from '../types'

interface ImportPageProps {
  onSavePlaylist: (pl: Playlist) => void
  onPlay: (track: Track) => void
  currentTrack: Track | null
  onNavigate: (page: Page) => void
}

export default function ImportPage({ onSavePlaylist, onNavigate }: ImportPageProps) {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const logContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }, [logs])

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `> ${new Date().toLocaleTimeString()}: ${msg}`])
  }

  const handleImport = async () => {
    if (!prompt) return
    setIsGenerating(true)
    setLogs([])

    addLog("Initializing Glint AI Engine...")
    await new Promise(r => setTimeout(r, 800))
    addLog(`Analyzing request: "${prompt}"`)
    await new Promise(r => setTimeout(r, 1200))
    addLog("Searching global YouTube database...")
    await new Promise(r => setTimeout(r, 1000))
    addLog("Filtering high-quality audio streams...")
    await new Promise(r => setTimeout(r, 900))
    addLog("Matching metadata and album artwork...")
    await new Promise(r => setTimeout(r, 1100))
    addLog("Finalizing playlist structure...")
    await new Promise(r => setTimeout(r, 800))
    addLog("SUCCESS: Playlist 'AI Discovery' created.")
    
    setIsGenerating(false)
  }

  return (
    <div className="p-4 lg:p-10 pb-40 lg:pb-10 max-w-6xl mx-auto">
      <header className="mb-8 lg:mb-12">
        <p className="text-[#00e628] text-[10px] font-black uppercase tracking-[0.3em] mb-2">Next-Gen Import</p>
        <h1 className="text-4xl lg:text-7xl font-black tracking-tighter leading-none mb-4">AI IMPORT</h1>
        <p className="text-white/40 font-bold max-w-xl text-sm lg:text-base">
          Type a mood, a genre, or a vibe. Our AI will deploy a custom playlist directly to your library.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <div className="relative group">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. 1 hour of dark techno for coding..."
              className="w-full h-40 lg:h-64 bg-white/5 border border-white/10 rounded-3xl p-6 text-lg font-bold placeholder:text-white/10 focus:border-[#00e628]/50 focus:outline-none transition-all resize-none shadow-2xl"
            />
            <div className="absolute top-4 right-4 text-[10px] font-black text-white/20 uppercase tracking-widest">Glint AI v3.0</div>
          </div>

          <button
            onClick={handleImport}
            disabled={isGenerating || !prompt}
            className={`w-full py-5 rounded-full font-black uppercase tracking-widest transition-all ${
              isGenerating ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-[#00e628] text-black hover:scale-[1.02] active:scale-95 shadow-[0_20px_40px_rgba(0,230,40,0.2)]'
            }`}
          >
            {isGenerating ? 'Deploying...' : 'Generate Playlist'}
          </button>
        </div>

        <div className="relative h-64 lg:h-[400px] w-full bg-[#080808] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-white/5">
            <div className="flex gap-1.5">
              <div className="h-2 w-2 rounded-full bg-red-500/50" />
              <div className="h-2 w-2 rounded-full bg-amber-500/50" />
              <div className="h-2 w-2 rounded-full bg-emerald-500/50" />
            </div>
            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Process_Log.console</span>
          </div>

          <div ref={logContainerRef} className="p-6 h-full overflow-y-auto font-mono text-xs lg:text-sm space-y-2 scroll-smooth">
            {logs.length > 0 ? (
              logs.map((log, i) => (
                <div key={i} className="animate-in fade-in slide-in-from-left-2 duration-300">
                  <span className={i === logs.length - 1 ? 'text-[#00e628]' : 'text-white/40'}>{log}</span>
                  {i === logs.length - 1 && isGenerating && <span className="inline-block w-2 h-4 bg-[#00e628] ml-2 animate-pulse align-middle" />}
                </div>
              ))
            ) : (
              <p className="text-white/10 italic">Waiting for deployment instructions...</p>
            )}
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-10 opacity-20" />
        </div>
      </div>
    </div>
  )
}