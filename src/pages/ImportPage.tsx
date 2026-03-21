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

  const chip = (label: string, active: boolean, onClick: () => void) => (
    <button
      type="button"
      onClick={onClick}
      className={`mb-2 mr-2 inline-flex select-none items-center rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
        active
          ? 'border-indigo-500/30 bg-[rgba(108,99,255,0.15)] text-[#8B85FF]'
          : 'border-white/10 bg-[#171923] text-[#A0A3B1] hover:bg-white/5 hover:text-[#EEF0FF]'
      }`}
    >
      {label}
    </button>
  )

  const inp =
    'w-full rounded-2xl border border-white/10 bg-[#171923] px-4 py-3 text-sm text-[#EEF0FF] outline-none transition placeholder:text-[#6B6F85] focus:border-indigo-500/40'

  return (
    <div className="px-4 pb-10 pt-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#6C63FF,#FF4D6D)]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
        <div>
          <h2 className="font-serif text-2xl text-[#EEF0FF]">AI Playlist Import</h2>
          <p className="mt-1 text-xs text-[#A0A3B1] sm:text-sm">
            Generate playlists with AI or import from Spotify, Apple Music and more
          </p>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <div
          className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold ${
            BACKEND
              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
              : 'border-amber-500/20 bg-amber-500/10 text-amber-300'
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${BACKEND ? 'bg-emerald-400' : 'bg-amber-400'}`} />
          Backend: {BACKEND ? 'Connected' : 'Not set'}
        </div>

        <div
          className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold ${
            hasGroqKey
              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
              : 'border-rose-500/20 bg-rose-500/10 text-rose-400'
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${hasGroqKey ? 'bg-emerald-400' : 'bg-rose-400'}`} />
          Groq AI: {hasGroqKey ? 'Connected' : 'No key'}
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          YouTube: Connected
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {(['generate', 'import'] as const).map(t => (
          <button
            key={t}
            type="button"
            onClick={() => {
              setActiveTab(t)
              reset()
            }}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
              activeTab === t
                ? 'bg-indigo-500 text-white'
                : 'border border-white/10 bg-transparent text-[#A0A3B1] hover:bg-white/5 hover:text-[#EEF0FF]'
            }`}
          >
            {t === 'generate' ? '✦ Generate with AI' : '⬇ Import from Platform'}
          </button>
        ))}
      </div>

      {activeTab === 'generate' && (
        <div className="mb-4 rounded-3xl border border-white/10 bg-[#11131A] p-5 sm:p-6">
          <p className="mb-1 text-sm font-bold text-[#EEF0FF]">Describe your playlist</p>
          <p className="mb-4 text-xs text-[#A0A3B1]">
            {hasGroqKey
              ? 'Groq AI will generate a custom tracklist based on your description'
              : 'Will use curated fallback tracks'}
          </p>

          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="e.g. late night coding lofi, aggressive gym hip-hop, sad indie rainy day..."
            rows={3}
            className={`${inp} mb-4 resize-none`}
          />

          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.08em] text-[#6B6F85]">
            Quick moods
          </p>

          <div className="mb-5">
            {MOODS.map(m => chip(m, selectedMoods.includes(m), () =>
              setSelectedMoods(p => p.includes(m) ? p.filter(x => x !== m) : [...p, m])
            ))}
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? <Spinner /> : <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>}
            {loading ? 'Generating...' : 'Generate Playlist'}
          </button>
        </div>
      )}

      {activeTab === 'import' && (
        <div className="mb-4 rounded-3xl border border-white/10 bg-[#11131A] p-5 sm:p-6">
          <p className="mb-1 text-sm font-bold text-[#EEF0FF]">Import from another platform</p>
          <p className="mb-4 text-xs text-[#A0A3B1]">
            Paste a public playlist URL — AI generates equivalent tracks and finds them on YouTube
          </p>

          <div className="mb-4 flex flex-wrap gap-2">
            {PLATFORMS.map(p => chip(p, selectedPlatform === p, () => setSelectedPlatform(p)))}
          </div>

          <input
            value={importUrl}
            onChange={e => setImportUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleImport()}
            placeholder={
              selectedPlatform === 'Spotify'
                ? 'https://open.spotify.com/playlist/...'
                : selectedPlatform === 'Apple Music'
                  ? 'https://music.apple.com/playlist/...'
                  : selectedPlatform === 'YouTube Music'
                    ? 'https://music.youtube.com/playlist?list=...'
                    : 'https://soundcloud.com/user/sets/...'
            }
            className={`${inp} mb-3`}
          />

          <p className="mb-4 text-xs text-[#6B6F85]">
            Only public playlists work. Private playlists cannot be read.
          </p>

          <button
            type="button"
            onClick={handleImport}
            disabled={loading || !importUrl.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? <Spinner /> : '⬇ Import Playlist'}
          </button>
        </div>
      )}

      {statusLines.length > 0 && (
        <div className="mb-4 rounded-2xl border border-white/10 bg-[#11131A] p-4">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#6B6F85]">
            Status Log
          </p>
          <div className="space-y-2">
            {statusLines.map((line, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="mt-[1px] text-sm leading-none">
                  {line.type === 'ok' ? '✓' : line.type === 'err' ? '✕' : '›'}
                </span>
                <p
                  className={`text-xs leading-5 ${
                    line.type === 'ok'
                      ? 'text-emerald-400'
                      : line.type === 'err'
                        ? 'text-rose-400'
                        : i === statusLines.length - 1
                          ? 'text-[#8B85FF]'
                          : 'text-[#6B6F85]'
                  }`}
                >
                  {line.msg}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {generatedPlaylist && !loading && (
        <div className="rounded-3xl border border-white/10 bg-[#11131A] p-5 sm:p-6">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <h3 className="font-serif text-2xl text-[#EEF0FF]">{generatedPlaylist.name}</h3>
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  {generatedPlaylist.tracks.length} tracks
                </span>
              </div>
              <p className="text-xs text-[#A0A3B1]">
                {generatedPlaylist.tracks.filter(t => t.youtubeId).length} playable on YouTube
                {generatedPlaylist.tracks.filter(t => !t.youtubeId).length > 0 &&
                  ` · ${generatedPlaylist.tracks.filter(t => !t.youtubeId).length} not found`}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  onSavePlaylist(generatedPlaylist)
                  setSaved(true)
                }}
                disabled={saved}
                className={`rounded-2xl px-4 py-2 text-xs font-bold transition ${
                  saved
                    ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                    : 'bg-indigo-500 text-white hover:bg-indigo-600'
                }`}
              >
                {saved ? '✓ Saved' : 'Save to Library'}
              </button>

              <button
                type="button"
                onClick={activeTab === 'generate' ? handleGenerate : handleImport}
                className="rounded-2xl border border-white/10 bg-transparent px-4 py-2 text-xs font-semibold text-[#A0A3B1] transition hover:bg-white/5 hover:text-[#EEF0FF]"
              >
                Regenerate
              </button>
            </div>
          </div>

          <div className="space-y-2">
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
      )}
    </div>
  )
}

function Spinner() {
  return (
    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
  )
}
