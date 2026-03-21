import React, { useState } from 'react'
import type { Playlist, Track } from '../types'
import { generatePlaylistFromPrompt, importPlaylistFromUrl } from '../services/groq'
import { importFromBackend, generateFromBackend, hasBackend } from '../../importApi'
import TrackRow from '../components/TrackRow'

interface ImportPageProps {
  onSavePlaylist: (pl: Playlist) => void
  onPlay: (track: Track, queue?: Track[]) => void
  currentTrack: Track | null
}

const MOODS = ['Chill', 'Energetic', 'Focus', 'Happy', 'Melancholy', 'Late Night', 'Workout', 'Party']
const PLATFORMS = ['Spotify', 'Apple Music', 'YouTube Music', 'SoundCloud']

export default function ImportPage({ onSavePlaylist, onPlay, currentTrack }: ImportPageProps) {
  const [prompt, setPrompt] = useState('')
  const [importUrl, setImportUrl] = useState('')
  const [selectedMoods, setSelectedMoods] = useState<string[]>(['Chill'])
  const [selectedPlatform, setSelectedPlatform] = useState('Spotify')
  const [statusLines, setStatusLines] = useState<{ msg: string; type: 'info' | 'ok' | 'err' }[]>([])
  const [loading, setLoading] = useState(false)
  const [generatedPlaylist, setGeneratedPlaylist] = useState<Playlist | null>(null)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<'generate' | 'import'>('generate')

  const hasGroqKey = !!(import.meta.env.VITE_GROQ_API_KEY?.trim())
  const BACKEND = import.meta.env.VITE_BACKEND_URL?.trim() || ''

  const addStatus = (msg: string, type: 'info' | 'ok' | 'err' = 'info') =>
    setStatusLines(prev => [...prev, { msg, type }])

  const reset = () => {
    setStatusLines([])
    setGeneratedPlaylist(null)
    setSaved(false)
  }

  const handleGenerate = async () => {
    const fullPrompt = prompt.trim() || selectedMoods.join(', ') + ' music'
    reset()
    setLoading(true)

    try {
      addStatus(`Starting: "${fullPrompt}"`, 'info')
      let pl: Playlist

      if (hasBackend()) {
        addStatus('Using backend for full AI generation...', 'info')
        pl = await generateFromBackend(fullPrompt, msg => addStatus(msg, 'info'))
      } else {
        pl = await generatePlaylistFromPrompt(fullPrompt, msg => addStatus(msg, 'info'))
      }

      if (pl.tracks.length === 0) {
        addStatus('No tracks found — try a different description', 'err')
      } else {
        addStatus(`Done! ${pl.tracks.length} tracks ready`, 'ok')
        setGeneratedPlaylist(pl)
      }
    } catch (e: unknown) {
      addStatus(e instanceof Error ? e.message : 'Unknown error', 'err')
    } finally {
      setLoading(false)
    }
  }

  const handleImport = async () => {
    const url = importUrl.trim()
    if (!url) {
      addStatus('Please paste a playlist URL', 'err')
      return
    }
    if (!url.startsWith('http')) {
      addStatus('URL must start with http:// or https://', 'err')
      return
    }

    reset()
    setLoading(true)

    try {
      addStatus(`Importing from: ${url.slice(0, 50)}...`, 'info')
      let pl: Playlist

      if (hasBackend()) {
        addStatus('Using backend for full playlist import...', 'info')
        pl = await importFromBackend(url, msg => addStatus(msg, 'info'))
      } else {
        pl = await importPlaylistFromUrl(url, msg => addStatus(msg, 'info'))
      }

      if (pl.tracks.length === 0) {
        addStatus('No tracks found — try a different URL', 'err')
      } else {
        addStatus(`Done! ${pl.tracks.length} tracks ready`, 'ok')
        setGeneratedPlaylist(pl)
      }
    } catch (e: unknown) {
      addStatus(e instanceof Error ? e.message : 'Unknown error', 'err')
    } finally {
      setLoading(false)
    }
  }

  // Spotify-style chips: white background when active, dark gray when inactive
  const chip = (label: string, active: boolean, onClick: () => void) => (
    <button
      type="button"
      onClick={onClick}
      className={`mb-3 mr-3 inline-flex select-none items-center rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
        active
          ? 'bg-white text-black'
          : 'bg-[#2a2a2a] text-white hover:bg-[#333333]'
      }`}
    >
      {label}
    </button>
  )

  const inputStyles = "w-full rounded-md border border-transparent bg-[#2a2a2a] px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-[#b3b3b3] hover:bg-[#333333] focus:bg-[#333333] focus:border-white/30 focus:ring-1 focus:ring-white/30"

  const StatusDot = ({ active, colorClass }: { active: boolean, colorClass: string }) => (
    <span className="relative flex h-2 w-2">
      {active && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${colorClass}`}></span>}
      <span className={`relative inline-flex rounded-full h-2 w-2 ${colorClass}`}></span>
    </span>
  )

  return (
    <div className="px-4 pb-12 pt-8 sm:px-6 lg:px-8 max-w-5xl mx-auto font-sans bg-[#121212] min-h-screen text-white">
      
      {/* Header */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter text-white mb-2">AI Playlist Import</h1>
          <p className="text-sm text-[#b3b3b3] font-medium">
            Generate custom vibes or migrate your library seamlessly.
          </p>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 rounded-full bg-[#242424] px-3 py-1.5 text-xs font-medium text-[#b3b3b3]">
            <StatusDot active={!!BACKEND} colorClass={BACKEND ? 'bg-[#1ed760]' : 'bg-amber-500'} />
            Backend {BACKEND ? 'Connected' : 'Not set'}
          </div>
          <div className="flex items-center gap-2 rounded-full bg-[#242424] px-3 py-1.5 text-xs font-medium text-[#b3b3b3]">
            <StatusDot active={hasGroqKey} colorClass={hasGroqKey ? 'bg-[#1ed760]' : 'bg-rose-500'} />
            Groq AI {hasGroqKey ? 'Connected' : 'Missing'}
          </div>
          <div className="flex items-center gap-2 rounded-full bg-[#242424] px-3 py-1.5 text-xs font-medium text-[#b3b3b3]">
            <StatusDot active={true} colorClass="bg-[#1ed760]" />
            YouTube Ready
          </div>
        </div>
      </div>

      {/* Segmented Control Tabs */}
      <div className="mb-8 flex gap-4 border-b border-white/10 pb-4">
        {(['generate', 'import'] as const).map(t => (
          <button
            key={t}
            type="button"
            onClick={() => {
              setActiveTab(t)
              reset()
            }}
            className={`pb-2 text-sm font-bold tracking-wide transition-all relative ${
              activeTab === t
                ? 'text-white'
                : 'text-[#b3b3b3] hover:text-white'
            }`}
          >
            {t === 'generate' ? 'Generate with AI' : 'Import URL'}
            {activeTab === t && (
              <span className="absolute -bottom-[17px] left-0 right-0 h-1 bg-[#1ed760] rounded-t-md"></span>
            )}
          </button>
        ))}
      </div>

      {/* Main Form Area */}
      <div className="mb-8 rounded-lg bg-[#181818] p-6 sm:p-8">
        
        {activeTab === 'generate' && (
          <div className="animate-in fade-in duration-300">
            <h3 className="mb-2 text-xl font-bold text-white tracking-tight">Describe your vibe</h3>
            <p className="mb-6 text-sm text-[#b3b3b3]">
              {hasGroqKey
                ? 'Type out a scenario, mood, or genre, and let AI build the perfect tracklist.'
                : 'Will use curated fallback tracks since AI is not connected.'}
            </p>

            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="e.g. late night coding lofi, aggressive gym hip-hop, sad indie rainy day..."
              rows={3}
              className={`${inputStyles} mb-6 resize-none`}
            />

            <div className="mb-8">
              {MOODS.map(m => chip(m, selectedMoods.includes(m), () =>
                setSelectedMoods(p => p.includes(m) ? p.filter(x => x !== m) : [...p, m])
              ))}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-full bg-[#1ed760] px-8 py-3.5 text-sm font-bold text-black transition-all hover:scale-105 hover:bg-[#3be477] disabled:pointer-events-none disabled:opacity-50"
              >
                {loading ? <Spinner color="border-black" /> : null}
                {loading ? 'Generating...' : 'Generate Playlist'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'import' && (
          <div className="animate-in fade-in duration-300">
            <h3 className="mb-2 text-xl font-bold text-white tracking-tight">Import from another platform</h3>
            <p className="mb-6 text-sm text-[#b3b3b3]">
              Paste a public playlist link to automatically sync it to your library.
            </p>

            <div className="mb-6">
              {PLATFORMS.map(p => chip(p, selectedPlatform === p, () => setSelectedPlatform(p)))}
            </div>

            <input
              value={importUrl}
              onChange={e => setImportUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleImport()}
              placeholder={
                selectedPlatform === 'Spotify' ? 'https://open.spotify.com/playlist/...'
                : selectedPlatform === 'Apple Music' ? 'https://music.apple.com/playlist/...'
                : selectedPlatform === 'YouTube Music' ? 'https://music.youtube.com/playlist?list=...'
                : 'https://soundcloud.com/user/sets/...'
              }
              className={`${inputStyles} mb-4`}
            />

            <div className="flex items-center justify-between mt-6">
              <p className="text-xs text-[#b3b3b3]">
                Note: Private playlists are not supported.
              </p>
              <button
                type="button"
                onClick={handleImport}
                disabled={loading || !importUrl.trim()}
                className="flex items-center justify-center gap-2 rounded-full bg-[#1ed760] px-8 py-3.5 text-sm font-bold text-black transition-all hover:scale-105 hover:bg-[#3be477] disabled:pointer-events-none disabled:opacity-50"
              >
                {loading ? <Spinner color="border-black" /> : null} 
                {loading ? 'Importing...' : 'Import Playlist'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Terminal Status Log */}
      {statusLines.length > 0 && (
        <div className="mb-8 rounded-lg bg-black p-5 font-mono">
          <p className="mb-3 text-[11px] uppercase tracking-wider text-[#b3b3b3] font-bold">
            Activity Log
          </p>
          <div className="space-y-2">
            {statusLines.map((line, i) => (
              <div key={i} className="flex items-start gap-3 animate-in fade-in duration-200">
                <span className="mt-[2px] text-sm font-bold">
                  {line.type === 'ok' ? <span className="text-[#1ed760]">✓</span> 
                   : line.type === 'err' ? <span className="text-rose-500">✕</span> 
                   : <span className="text-[#b3b3b3]">›</span>}
                </span>
                <p className={`text-sm ${
                    line.type === 'ok' ? 'text-white'
                    : line.type === 'err' ? 'text-rose-400'
                    : i === statusLines.length - 1 ? 'text-white' : 'text-[#b3b3b3]'
                  }`}
                >
                  {line.msg}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results Area */}
      {generatedPlaylist && !loading && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#b3b3b3] font-bold mb-2">Playlist</p>
              <h2 className="text-5xl font-bold text-white tracking-tighter mb-4">{generatedPlaylist.name}</h2>
              <p className="text-sm text-[#b3b3b3] font-medium">
                {generatedPlaylist.tracks.length} songs · {generatedPlaylist.tracks.filter(t => t.youtubeId).length} playable
                {generatedPlaylist.tracks.filter(t => !t.youtubeId).length > 0 &&
                  ` · ${generatedPlaylist.tracks.filter(t => !t.youtubeId).length} unavailable`}
              </p>
            </div>

            <div className="flex items-center gap-4 pb-1">
              <button
                type="button"
                onClick={activeTab === 'generate' ? handleGenerate : handleImport}
                className="text-sm font-bold text-[#b3b3b3] hover:text-white transition-colors uppercase tracking-widest"
              >
                Regenerate
              </button>
              
              <button
                type="button"
                onClick={() => {
                  onSavePlaylist(generatedPlaylist)
                  setSaved(true)
                }}
                disabled={saved}
                className={`flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold transition-all ${
                  saved
                    ? 'border border-[#b3b3b3] text-white cursor-default bg-transparent'
                    : 'bg-white text-black hover:scale-105'
                }`}
              >
                {saved ? 'Saved to Library' : 'Save Playlist'}
              </button>
            </div>
          </div>

          <div className="mt-8 rounded-lg">
            {/* Header Row for Tracks (Optional but adds to the premium feel) */}
            <div className="flex px-4 py-2 border-b border-white/10 mb-2 text-sm text-[#b3b3b3] font-medium">
              <div className="w-8 text-center">#</div>
              <div className="flex-1">Title</div>
              <div className="w-12 text-right">⌚</div>
            </div>

            <div className="flex flex-col">
              {generatedPlaylist.tracks.map((t, i) => (
                <TrackRow
                  key={t.id}
                  track={t}
                  index={i}
                  isActive={currentTrack?.id === t.id}
                  onPlay={tr => onPlay(tr, generatedPlaylist.tracks)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Spinner({ color = "border-white" }: { color?: string }) {
  return (
    <div className={`h-4 w-4 animate-spin rounded-full border-2 border-t-transparent ${color}`} />
  )
}
