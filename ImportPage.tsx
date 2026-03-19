import React, { useState } from 'react'
import type { Playlist, Track } from '../types'
import { generatePlaylistFromPrompt, importPlaylistFromUrl } from '../services/groq'
import TrackRow from '../components/TrackRow'

interface ImportPageProps {
  onSavePlaylist: (pl: Playlist) => void
  onPlay: (track: Track, queue?: Track[]) => void
  currentTrack: Track | null
}

const MOODS = ['Chill', 'Energetic', 'Focus', 'Happy', 'Melancholy', 'Late Night', 'Workout', 'Party']
const BACKEND = import.meta.env.VITE_BACKEND_URL?.trim() || ''

export default function ImportPage({ onSavePlaylist, onPlay, currentTrack }: ImportPageProps) {
  const [tab, setTab] = useState<'spotify' | 'ai'>('spotify')
  const [spotifyUrl, setSpotifyUrl] = useState('')
  const [prompt, setPrompt] = useState('')
  const [moods, setMoods] = useState<string[]>(['Chill'])
  const [log, setLog] = useState<{ msg: string; type: 'info' | 'ok' | 'err' }[]>([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Playlist | null>(null)
  const [saved, setSaved] = useState(false)

  const addLog = (msg: string, type: 'info' | 'ok' | 'err' = 'info') =>
    setLog(prev => [...prev, { msg, type }])

  const reset = () => { setLog([]); setResult(null); setSaved(false) }

  const handleSpotifyImport = async () => {
    const url = spotifyUrl.trim()
    if (!url) { addLog('Paste a Spotify playlist URL first', 'err'); return }
    if (!url.includes('spotify.com/playlist')) {
      addLog('That doesn\'t look like a Spotify playlist URL', 'err')
      return
    }
    if (!BACKEND) {
      addLog('Backend not running. Start glint-backend then add VITE_BACKEND_URL=http://localhost:3001 to your .env', 'err')
      return
    }
    reset()
    setLoading(true)
    try {
      const pl = await importPlaylistFromUrl(url, msg => addLog(msg))
      addLog(`${pl.tracks.filter(t => t.youtubeId).length} of ${pl.tracks.length} tracks playable`, 'ok')
      setResult(pl)
    } catch (e: unknown) {
      addLog(e instanceof Error ? e.message : 'Import failed', 'err')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    const fullPrompt = prompt.trim() || moods.join(', ') + ' music'
    reset()
    setLoading(true)
    try {
      const pl = await generatePlaylistFromPrompt(fullPrompt, msg => addLog(msg))
      addLog(`${pl.tracks.length} tracks ready`, 'ok')
      setResult(pl)
    } catch (e: unknown) {
      addLog(e instanceof Error ? e.message : 'Failed', 'err')
    } finally {
      setLoading(false)
    }
  }

  const inp: React.CSSProperties = {
    width: '100%', background: '#141720',
    border: '1px solid rgba(255,255,255,.06)', borderRadius: 10,
    padding: '11px 14px', color: '#EEF0FF', fontSize: 13,
    fontFamily: "'Manrope',sans-serif", outline: 'none',
  }

  return (
    <div style={{ padding: '0 32px 40px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#1DB954,#6C63FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.623.623 0 01-.857.207c-2.348-1.435-5.304-1.76-8.785-.964a.623.623 0 11-.277-1.215c3.809-.87 7.076-.496 9.712 1.115a.623.623 0 01.207.857zm1.223-2.722a.78.78 0 01-1.072.257c-2.687-1.652-6.785-2.131-9.965-1.166a.78.78 0 01-.973-.517.779.779 0 01.517-.972c3.632-1.102 8.147-.568 11.236 1.328a.78.78 0 01.257 1.07zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71a.935.935 0 11-.543-1.79c3.532-1.072 9.404-.865 13.115 1.338a.935.935 0 01-.955 1.609z"/></svg>
        </div>
        <div>
          <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 22, color: '#EEF0FF' }}>Import & Generate</h2>
          <p style={{ fontSize: 12, color: '#8B8FA8', marginTop: 2 }}>Import your Spotify playlist or generate one with AI</p>
        </div>
      </div>

      {/* Backend status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, marginBottom: 20, background: BACKEND ? 'rgba(29,185,84,.06)' : 'rgba(245,166,35,.06)', border: `1px solid ${BACKEND ? 'rgba(29,185,84,.2)' : 'rgba(245,166,35,.2)'}` }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: BACKEND ? '#1DB954' : '#f5a623', flexShrink: 0 }} />
        <p style={{ fontSize: 11, fontWeight: 600, color: BACKEND ? '#1DB954' : '#f5a623' }}>
          {BACKEND
            ? `Backend connected: ${BACKEND}`
            : 'Backend not set — Spotify import needs backend. AI generate works without it.'}
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button onClick={() => { setTab('spotify'); reset() }} style={{
          padding: '9px 20px', borderRadius: 9, fontSize: 13, fontWeight: 600,
          cursor: 'pointer', fontFamily: "'Manrope',sans-serif",
          background: tab === 'spotify' ? '#1DB954' : 'transparent',
          color: tab === 'spotify' ? '#fff' : '#8B8FA8',
          border: tab === 'spotify' ? 'none' : '1px solid rgba(255,255,255,.08)',
        }}>
          Spotify Import
        </button>
        <button onClick={() => { setTab('ai'); reset() }} style={{
          padding: '9px 20px', borderRadius: 9, fontSize: 13, fontWeight: 600,
          cursor: 'pointer', fontFamily: "'Manrope',sans-serif",
          background: tab === 'ai' ? '#6C63FF' : 'transparent',
          color: tab === 'ai' ? '#fff' : '#8B8FA8',
          border: tab === 'ai' ? 'none' : '1px solid rgba(255,255,255,.08)',
        }}>
          ✦ AI Generate
        </button>
      </div>

      {/* SPOTIFY TAB */}
      {tab === 'spotify' && (
        <div style={{ background: '#0E1018', border: '1px solid rgba(255,255,255,.06)', borderRadius: 16, padding: 24, marginBottom: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#EEF0FF', marginBottom: 4 }}>Paste Spotify playlist URL</p>
          <p style={{ fontSize: 11, color: '#8B8FA8', marginBottom: 14 }}>
            Open any public playlist in Spotify → ··· → Share → Copy link
          </p>
          <input
            value={spotifyUrl}
            onChange={e => setSpotifyUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSpotifyImport()}
            placeholder="https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M"
            style={{ ...inp, marginBottom: 16 }}
          />
          <button onClick={handleSpotifyImport} disabled={loading || !spotifyUrl.trim()} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', padding: 12,
            background: loading || !spotifyUrl.trim() ? '#1F2233' : '#1DB954',
            border: 'none', borderRadius: 10,
            color: loading || !spotifyUrl.trim() ? '#494D66' : '#fff',
            fontSize: 13, fontWeight: 700, fontFamily: "'Manrope',sans-serif",
            cursor: loading || !spotifyUrl.trim() ? 'not-allowed' : 'pointer',
          }}>
            {loading ? <><Spin /> Importing...</> : 'Import from Spotify'}
          </button>
        </div>
      )}

      {/* AI TAB */}
      {tab === 'ai' && (
        <div style={{ background: '#0E1018', border: '1px solid rgba(255,255,255,.06)', borderRadius: 16, padding: 24, marginBottom: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#EEF0FF', marginBottom: 4 }}>Describe your playlist</p>
          <p style={{ fontSize: 11, color: '#8B8FA8', marginBottom: 14 }}>
            {BACKEND ? 'AI (via backend) builds a playlist and finds each track on YouTube' : 'Uses curated fallback tracks — connect backend for real AI'}
          </p>
          <textarea
            value={prompt} onChange={e => setPrompt(e.target.value)}
            placeholder="e.g. late night coding lofi, aggressive gym hip-hop, sad indie for a rainy day..."
            rows={3} style={{ ...inp, resize: 'none', marginBottom: 14 }}
          />
          <p style={{ fontSize: 11, color: '#494D66', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Quick moods</p>
          <div style={{ marginBottom: 18 }}>
            {MOODS.map(m => (
              <span key={m} onClick={() => setMoods(p => p.includes(m) ? p.filter(x => x !== m) : [...p, m])}
                style={{
                  display: 'inline-flex', padding: '5px 13px', borderRadius: 20,
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  marginRight: 6, marginBottom: 6, userSelect: 'none',
                  background: moods.includes(m) ? 'rgba(108,99,255,.15)' : '#141720',
                  color: moods.includes(m) ? '#8B85FF' : '#8B8FA8',
                  border: moods.includes(m) ? '1px solid rgba(108,99,255,.3)' : '1px solid rgba(255,255,255,.06)',
                }}>
                {m}
              </span>
            ))}
          </div>
          <button onClick={handleGenerate} disabled={loading} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', padding: 12, background: loading ? '#4a42cc' : '#6C63FF',
            border: 'none', borderRadius: 10, color: '#fff', fontSize: 13,
            fontWeight: 700, fontFamily: "'Manrope',sans-serif", cursor: loading ? 'not-allowed' : 'pointer',
          }}>
            {loading ? <><Spin /> Generating...</> : '✦ Generate Playlist'}
          </button>
        </div>
      )}

      {/* Log */}
      {log.length > 0 && (
        <div style={{ background: '#0E1018', border: '1px solid rgba(255,255,255,.06)', borderRadius: 12, padding: '14px 18px', marginBottom: 16 }}>
          {log.map((line, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 5 }}>
              <span style={{ fontSize: 13, flexShrink: 0, color: line.type === 'ok' ? '#1DB954' : line.type === 'err' ? '#FF4D6D' : '#6C63FF' }}>
                {line.type === 'ok' ? '✓' : line.type === 'err' ? '✕' : '›'}
              </span>
              <p style={{ fontSize: 12, lineHeight: 1.5, color: line.type === 'ok' ? '#1DB954' : line.type === 'err' ? '#FF4D6D' : i === log.length - 1 && loading ? '#8B85FF' : '#494D66' }}>
                {line.msg}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div style={{ background: '#0E1018', border: '1px solid rgba(255,255,255,.06)', borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            {result.cover && (
              <img src={result.cover} alt={result.name} style={{ width: 60, height: 60, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
            )}
            <div style={{ flex: 1 }}>
              <h3 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 18, color: '#EEF0FF', marginBottom: 4 }}>{result.name}</h3>
              <p style={{ fontSize: 12, color: '#8B8FA8' }}>
                {result.tracks.filter(t => t.youtubeId).length} of {result.tracks.length} tracks playable
              </p>
            </div>
            <button onClick={() => { onSavePlaylist(result); setSaved(true) }} disabled={saved}
              style={{ padding: '8px 16px', background: saved ? 'rgba(29,185,84,.1)' : '#1DB954', border: saved ? '1px solid rgba(29,185,84,.2)' : 'none', borderRadius: 9, color: saved ? '#1DB954' : '#fff', fontSize: 12, fontWeight: 700, fontFamily: "'Manrope',sans-serif", cursor: saved ? 'default' : 'pointer', flexShrink: 0 }}>
              {saved ? '✓ Saved' : 'Save to Library'}
            </button>
          </div>
          {result.tracks.map((t, i) => (
            <TrackRow key={t.id} track={t} index={i}
              isActive={currentTrack?.id === t.id}
              onPlay={tr => onPlay(tr, result.tracks)} />
          ))}
        </div>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

function Spin() {
  return <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite', flexShrink: 0 }} />
}
