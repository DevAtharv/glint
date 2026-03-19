import React, { useState } from 'react'
import { signIn, signUp } from '../services/supabase'

interface AuthPageProps {
  onAuth: () => void
  isDemo?: boolean
}

export default function AuthPage({ onAuth, isDemo }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const handle = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await signIn(email, password)
        onAuth()
      } else {
        await signUp(email, password, name)
        setSuccess('Account created! Check your email to confirm, then log in.')
        setMode('login')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#080A0F',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Manrope', sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: 400, padding: '0 24px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: '#6C63FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
            </div>
            <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, color: '#EEF0FF' }}>
              Gl<em style={{ fontStyle: 'italic', color: '#8B85FF' }}>i</em>nt
            </span>
          </div>
          <p style={{ fontSize: 13, color: '#8B8FA8' }}>Ad-free music powered by AI</p>
        </div>

        {/* Demo mode banner */}
        {isDemo && (
          <div style={{ background: 'rgba(245,166,35,.08)', border: '1px solid rgba(245,166,35,.2)', borderRadius: 12, padding: '12px 16px', marginBottom: 20, fontSize: 12, color: '#f5a623', lineHeight: 1.5 }}>
            <strong>Demo mode</strong> — Supabase not configured yet.<br/>
            Add your keys to <code style={{ background: 'rgba(0,0,0,.3)', padding: '1px 6px', borderRadius: 4 }}>.env</code> to enable real auth.{' '}
            <span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={onAuth}>
              Continue as guest →
            </span>
          </div>
        )}

        {/* Card */}
        <div style={{ background: '#0E1018', border: '1px solid rgba(255,255,255,.06)', borderRadius: 20, padding: 32 }}>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, color: '#EEF0FF', marginBottom: 24, textAlign: 'center' }}>
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>

          {error && (
            <div style={{ background: 'rgba(255,77,109,.1)', border: '1px solid rgba(255,77,109,.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#FF4D6D' }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ background: 'rgba(45,216,129,.1)', border: '1px solid rgba(45,216,129,.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#2DD881' }}>
              {success}
            </div>
          )}

          <form onSubmit={handle}>
            {mode === 'register' && (
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, color: '#8B8FA8', marginBottom: 6, fontWeight: 600 }}>Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required
                  style={{ width: '100%', background: '#141720', border: '1px solid rgba(255,255,255,.06)', borderRadius: 10, padding: '11px 14px', color: '#EEF0FF', fontSize: 14, fontFamily: "'Manrope',sans-serif", outline: 'none' }}
                />
              </div>
            )}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#8B8FA8', marginBottom: 6, fontWeight: 600 }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required
                style={{ width: '100%', background: '#141720', border: '1px solid rgba(255,255,255,.06)', borderRadius: 10, padding: '11px 14px', color: '#EEF0FF', fontSize: 14, fontFamily: "'Manrope',sans-serif", outline: 'none' }}
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#8B8FA8', marginBottom: 6, fontWeight: 600 }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6}
                style={{ width: '100%', background: '#141720', border: '1px solid rgba(255,255,255,.06)', borderRadius: 10, padding: '11px 14px', color: '#EEF0FF', fontSize: 14, fontFamily: "'Manrope',sans-serif", outline: 'none' }}
              />
            </div>
            <button type="submit" disabled={loading}
              style={{ width: '100%', background: loading ? '#4a42cc' : '#6C63FF', border: 'none', borderRadius: 10, padding: '13px', color: '#fff', fontSize: 14, fontWeight: 700, fontFamily: "'Manrope',sans-serif", cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, color: '#8B8FA8', marginTop: 20 }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <span onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setSuccess('') }}
              style={{ color: '#8B85FF', cursor: 'pointer', fontWeight: 600 }}>
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </span>
          </p>

          {/* Always show guest option */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,.06)', marginTop: 20, paddingTop: 16, textAlign: 'center' }}>
            <button onClick={onAuth}
              style={{ background: 'none', border: 'none', color: '#494D66', fontSize: 12, cursor: 'pointer', fontFamily: "'Manrope',sans-serif" }}>
              Continue without account →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
