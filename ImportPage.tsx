import React, { useState } from 'react'
import type { Playlist, Track } from '../types'
import { generatePlaylistFromPrompt, importPlaylistFromUrl } from '../services/groq'
import { importFromBackend, generateFromBackend, hasBackend } from '../services/importApi'
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

  const useBackend = hasBackend()
  const hasGroqKey = !!import.meta.env.VITE_GROQ_API_KEY?.trim()
  const hasYtKey = !!import.meta.env.VITE_YOUTUBE_API_KEY?.trim()

  const addStatus = (msg: string, type: 'info' | 'ok' | 'err' = 'info') =>
    setStatusLines(prev => [...prev, { msg, type }])

  const reset = () => { setStatusLines([]); setGeneratedPlaylist(null); setSaved(false) }

  const handleGenerate = async () => {
    const fullPrompt = prompt.trim() || selectedMoods.join(', ') + ' music'
    reset()
    setLoading(true)
    try {
      addStatus(`Generating: "${fullPrompt}"`)
      const pl = useBackend
        ? await generateFromBackend(fullPrompt, msg => addStatus(msg))
        : await generatePlaylistFromPrompt(fullPrompt, msg => addStatus(msg))

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
    if (!url) { addStatus('Please paste a playlist URL', 'err'); return }
    if (!url.startsWith('http')) { addStatus('URL must start with http://', 'err'); return }
    reset()
    setLoading(true)
    try {
      addStatus(`Importing: ${url.slice(0, 60)}...`)
      const pl = useBackend
        ? await importFromBackend(url, msg => addStatus(msg))
        : await importPlaylistFromUrl(url, msg => addStatus(msg))

      if (pl.tracks.length === 0) {
        addStatus('No tracks found', 'err')
      } else {
        addStatus(`Done! ${pl.tracks.length} tracks ready`, 'ok')
        setGeneratedPlaylist(pl)
      }
    } catch (e: unknown) {
      addStatus(e instanceof Error ? e.message : 'Import failed', 'err')
    } finally {
      setLoading(false)
    }
  }

  const chip = (label: string, active: boolean, onClick: () => void) => (
    <span key={label} onClick={onClick} style={{
      display: 'inline-flex', padding: '5px 13px', borderRadius: 20,
      fontSize: 12, fontWeight: 600, cursor: 'pointer',
      marginRight: 6, marginBottom: 6, userSelect: 'none' as const,
      background: active ? 'rgba(108,99,255,.15)' : '#141720',
      color: active ? '#8B85FF' : '#8B8FA8',
      border: active ? '1px solid rgba(108,99,255,.3)' : '1px solid rgba(255,255,255,.06)',
    }}>{label}</span>
  )

  const inp: React.CSSProperties = {
    width: '100%', background: '#141720',
    border: '1px solid rgba(255,255,255,.06)', borderRadius: 10,
    padding: '11px 14px', color: '#EEF0FF', fontSize: 13,
    fontFamily: "'Manrope',sans-serif", outline: 'none',
  }

  const StatusDot = ({ ok }: { ok: boolean }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, background: ok ? 'rgba(45,216,129,.08)' : 'rgba(255,77,109,.08)', border: `1px solid ${ok ? 'rgba(45,216,129,.2)' : 'rgba(255,77,109,.2)'}` }}>
      <div style={{ width: 7, height: 7, borderRadius: '50%', background: ok ? '#2DD881' : '#FF4D6D' }} />
      <span style={{ fontSize: 11, fontWeight: 600, color: ok ? '#2DD881' : '#FF4D6D' }}>
        {ok ? '✓' : '✗'}
      </span>
    </div>
  )

  return (
    <div style={{ padding: '0 32px 40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#6C63FF,#FF4D6D)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        </div>
        <div>
          <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 22, color: '#EEF0FF' }}>AI Playlist Import</h2>
          <p style={{ fontSize: 12, color: '#8B8FA8', marginTop: 2 }}>Generate playlists with AI or import from Spotify, Apple Music & more</p>
        </div>
      </div>

      {/* Status indicators */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, background: useBackend ? 'rgba(45,216,129,.08)' : 'rgba(245,166,35,.08)', border: `1px solid ${useBackend ? 'rgba(45,216,129,.2)' : 'rgba(245,166,35,.2)'}` }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: useBackend ? '#2DD881' : '#f5a623' }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: useBackend ? '#2DD881' : '#f5a623' }}>
            {useBackend ? `Backend: ${import.meta.env.VITE_BACKEND_URL}` : 'Backend: not connected (using browser AI)'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, background: hasGroqKey ? 'rgba(45,216,129,.08)' : 'rgba(255,77,109,.08)', border: `1px solid ${hasGroqKey ? 'rgba(45,216,129,.2)' : 'rgba(255,77,109,.2)'}` }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: hasGroqKey ? '#2DD881' : '#FF4D6D' }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: hasGroqKey ? '#2DD881' : '#FF4D6D' }}>
            Groq AI: {hasGroqKey ? 'Connected' : 'No key'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, background: hasYtKey ? 'rgba(45,216,129,.08)' : 'rgba(245,166,35,.08)', border: `1px solid ${hasYtKey ? 'rgba(45,216,129,.2)' : 'rgba(245,166,35,.2)'}` }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: hasYtKey ? '#2DD881' : '#f5a623' }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: hasYtKey ? '#2DD881' : '#f5a623' }}>
            YouTube: {hasYtKey ? 'Connected' : 'Mock tracks'}
          </span>
        </div>
      </div>

      {/* Backend setup hint */}
      {!useBackend && (
        <div style={{ background: 'rgba(245,166,35,.06)', border: '1px solid rgba(245,166,35,.15)', borderRadius: 12, padding: '12px 16px', marginBottom: 20, fontSize: 12, color: '#f5a623', lineHeight: 1.6 }}>
          <strong>For exact Spotify import:</strong> Start the Glint backend server and add{' '}
          <code style={{ background: 'rgba(0,0,0,.3)', padding: '1px 6px', borderRadius: 4 }}>VITE_BACKEND_URL=http://localhost:3001</code>{' '}
          to your frontend <code style={{ background: 'rgba(0,0,0,.3)', padding: '1px 6px', borderRadius: 4 }}>.env</code>.
          Without it, AI generates similar tracks instead of your exact playlist.
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {(['generate', 'import'] as const).map(t => (
          <button key={t} onClick={() => { setActiveTab(t); reset() }} style={{
            padding: '9px 20px', borderRadius: 9, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', fontFamily: "'Manrope',sans-serif",
            background: activeTab === t ? '#6C63FF' : 'transparent',
            color: activeTab === t ? '#fff' : '#8B8FA8',
            border: activeTab === t ? 'none' : '1px solid rgba(255,255,255,.08)',
          }}>
            {t === 'generate' ? '✦ Generate with AI' : '⬇ Import from Platform'}
          </button>
        ))}
      </div>

      {/* GENERATE */}
      {activeTab === 'generate' && (
        <div style={{ background: '#0E1018', border: '1px solid rgba(255,255,255,.06)', borderRadius: 16, padding: 24, marginBottom: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#EEF0FF', marginBottom: 4 }}>Describe your playlist</p>
          <p style={{ fontSize: 11, color: '#8B8FA8', marginBottom: 14 }}>
            {hasGroqKey ? 'Groq AI will build a custom playlist from your description' : 'Uses curated fallback tracks — add VITE_GROQ_API_KEY for real AI'}
          </p>
          <textarea
            value={prompt} onChange={e => setPrompt(e.target.value)}
            placeholder="e.g. late night coding lofi, aggressive gym hip-hop, sad indie for a rainy day..."
            rows={3} style={{ ...inp, resize: 'none', marginBottom: 14 }}
          />
          <p style={{ fontSize: 11, color: '#494D66', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Quick moods</p>
          <div style={{ marginBottom: 18 }}>
            {MOODS.map(m => chip(m, selectedMoods.includes(m), () =>
              setSelectedMoods(p => p.includes(m) ? p.filter(x => x !== m) : [...p, m])
            ))}
          </div>
          <button onClick={handleGenerate} disabled={loading} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', padding: 12, background: loading ? '#4a42cc' : '#6C63FF',
            border: 'none', borderRadius: 10, color: '#fff', fontSize: 13,
            fontWeight: 700, fontFamily: "'Manrope',sans-serif", cursor: loading ? 'not-allowed' : 'pointer',
          }}>
            {loading ? <><Spinner /> Generating...</> : <>✦ Generate Playlist</>}
          </button>
        </div>
      )}

      {/* IMPORT */}
      {activeTab === 'import' && (
        <div style={{ background: '#0E1018', border: '1px solid rgba(255,255,255,.06)', borderRadius: 16, padding: 24, marginBottom: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#EEF0FF', marginBottom: 4 }}>Import from another platform</p>
          <p style={{ fontSize: 11, color: '#8B8FA8', marginBottom: 14 }}>
            {useBackend
              ? 'Backend will scrape the exact tracks and match them on YouTube'
              : 'AI will generate equivalent tracks (add backend for exact imports)'}
          </p>
          <div style={{ marginBottom: 12 }}>
            {PLATFORMS.map(p => chip(p, selectedPlatform === p, () => setSelectedPlatform(p)))}
          </div>
          <input
            value={importUrl} onChange={e => setImportUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleImport()}
            placeholder={
              selectedPlatform === 'Spotify' ? 'https://open.spotify.com/playlist/...' :
              selectedPlatform === 'Apple Music' ? 'https://music.apple.com/playlist/...' :
              selectedPlatform === 'YouTube Music' ? 'https://music.youtube.com/playlist?list=...' :
              'https://soundcloud.com/user/sets/...'
            }
            style={{ ...inp, marginBottom: 8 }}
          />
          <p style={{ fontSize: 11, color: '#494D66', marginBottom: 14 }}>⚠ Only public playlists work.</p>
          <button onClick={handleImport} disabled={loading || !importUrl.trim()} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', padding: 12,
            background: loading || !importUrl.trim() ? '#1F2233' : '#6C63FF',
            border: 'none', borderRadius: 10,
            color: loading || !importUrl.trim() ? '#494D66' : '#fff',
            fontSize: 13, fontWeight: 700, fontFamily: "'Manrope',sans-serif",
            cursor: loading || !importUrl.trim() ? 'not-allowed' : 'pointer',
          }}>
            {loading ? <><Spinner /> Importing...</> : '⬇ Import Playlist'}
          </button>
        </div>
      )}

      {/* Status log */}
      {statusLines.length > 0 && (
        <div style={{ background: '#0E1018', border: '1px solid rgba(255,255,255,.06)', borderRadius: 12, padding: '14px 18px', marginBottom: 16 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#494D66', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>Status</p>
          {statusLines.map((line, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 13, flexShrink: 0, marginTop: 1 }}>
                {line.type === 'ok' ? '✓' : line.type === 'err' ? '✕' : '›'}
              </span>
              <p style={{ fontSize: 12, lineHeight: 1.5, color: line.type === 'ok' ? '#2DD881' : line.type === 'err' ? '#FF4D6D' : i === statusLines.length - 1 ? '#8B85FF' : '#494D66' }}>
                {line.msg}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Result */}
      {generatedPlaylist && !loading && (
        <div style={{ background: '#0E1018', border: '1px solid rgba(255,255,255,.06)', borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <h3 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 18, color: '#EEF0FF' }}>{generatedPlaylist.name}</h3>
                <span style={{ fontSize: 10, fontWeight: 700, background: 'rgba(45,216,129,.1)', color: '#2DD881', padding: '2px 8px', borderRadius: 20, border: '1px solid rgba(45,216,129,.2)' }}>
                  {generatedPlaylist.tracks.length} tracks
                </span>
              </div>
              <p style={{ fontSize: 12, color: '#8B8FA8' }}>
                {generatedPlaylist.tracks.filter(t => t.youtubeId).length} playable on YouTube
                {generatedPlaylist.tracks.filter(t => !t.youtubeId).length > 0 &&
                  ` · ${generatedPlaylist.tracks.filter(t => !t.youtubeId).length} not found`}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => { onSavePlaylist(generatedPlaylist); setSaved(true) }} disabled={saved}
                style={{ padding: '8px 16px', background: saved ? 'rgba(45,216,129,.1)' : '#6C63FF', border: saved ? '1px solid rgba(45,216,129,.2)' : 'none', borderRadius: 9, color: saved ? '#2DD881' : '#fff', fontSize: 12, fontWeight: 700, fontFamily: "'Manrope',sans-serif", cursor: saved ? 'default' : 'pointer' }}>
                {saved ? '✓ Saved' : 'Save to Library'}
              </button>
              <button onClick={activeTab === 'generate' ? handleGenerate : handleImport}
                style={{ padding: '8px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,.1)', borderRadius: 9, color: '#8B8FA8', fontSize: 12, fontWeight: 600, fontFamily: "'Manrope',sans-serif", cursor: 'pointer' }}>
                Regenerate
              </button>
            </div>
          </div>
          {generatedPlaylist.tracks.map((t, i) => (
            <TrackRow key={t.id} track={t} index={i} isActive={currentTrack?.id === t.id}
              onPlay={tr => onPlay(tr, generatedPlaylist.tracks)} />
          ))}
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

function Spinner() {
  return <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite', flexShrink: 0 }} />
}
