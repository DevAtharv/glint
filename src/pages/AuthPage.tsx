import React, { useState } from 'react'
import { signIn, signUp } from '../services/supabase'

interface Props {
  onAuth: () => void
  onGuest?: () => void // Added Guest handler
  isDemo?: boolean
}

export default function AuthPage({ onAuth, onGuest, isDemo }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'login') {
        await signIn(email, password)
        onAuth()
      } else {
        await signUp(email, password, name)
        setMode('login')
        setPassword('')
        setName('')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black p-4 font-sans tracking-wide overflow-hidden">
      
      {/* 🎵 CINEMATIC BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop" 
          alt="Concert Background" 
          className="w-full h-full object-cover opacity-40 grayscale-[0.3]"
        />
        {/* Dark gradient fade from bottom to top */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
      </div>

      {/* ✨ GLASSMORPHISM AUTH CARD */}
      <div className="relative z-10 w-full max-w-md bg-[#121212]/70 backdrop-blur-2xl border border-white/10 p-8 lg:p-10 rounded-[32px] shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Logo Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-[#00e628] flex items-center justify-center font-black text-black text-3xl shadow-[0_0_30px_rgba(0,230,40,0.3)] mb-4">
            G
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter">
            {mode === 'login' ? 'GLINT AUDIO' : 'JOIN GLINT'}
          </h2>
          <p className="text-white/50 text-xs font-bold uppercase tracking-[0.2em] mt-2">
            {mode === 'login' ? 'Enter the matrix' : 'Deploy your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-wide p-3 rounded-xl text-center">
              {error}
            </div>
          )}

          {mode === 'register' && (
            <div>
              <input
                type="text"
                required
                placeholder="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-5 py-4 bg-black/50 border border-white/10 rounded-2xl focus:outline-none focus:border-[#00e628] text-white font-bold transition-all placeholder:text-white/20"
              />
            </div>
          )}

          <div>
            <input
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-black/50 border border-white/10 rounded-2xl focus:outline-none focus:border-[#00e628] text-white font-bold transition-all placeholder:text-white/20"
            />
          </div>

          <div>
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-black/50 border border-white/10 rounded-2xl focus:outline-none focus:border-[#00e628] text-white font-bold transition-all placeholder:text-white/20"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-[#00e628] hover:bg-[#00e628]/90 text-black font-black uppercase tracking-widest py-4 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_30px_rgba(0,230,40,0.2)]"
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Initialize' : 'Create Profile'}
          </button>

          <p className="text-white/40 text-xs font-bold text-center mt-4 uppercase tracking-wider">
            {mode === 'login' ? "New to Glint?" : "Have an account?"}{' '}
            <button
              type="button"
              className="text-[#00e628] hover:text-white transition-colors"
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
            >
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </p>

          {/* 🎧 THE GUEST MODE BUTTON */}
          <div className="mt-4 pt-4 border-t border-white/10 flex flex-col items-center">
            <button 
              type="button"
              onClick={onGuest}
              className="w-full py-4 rounded-2xl border border-white/10 text-white/50 hover:text-white hover:bg-white/5 font-black uppercase tracking-widest text-[10px] transition-all"
            >
              Listen as Guest
            </button>
            <p className="text-[9px] text-white/20 uppercase tracking-widest mt-3 text-center">
              Guest data saves locally to your device
            </p>
          </div>

        </form>
      </div>
    </div>
  )
}