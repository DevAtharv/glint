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
        setSuccess('Account created. Check your email to confirm, then sign in.')
        setMode('login')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0D12] px-4 py-8 text-[#EEF0FF] sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md items-center justify-center">
        <div className="w-full">
          <div className="mb-8 text-center">
            <div className="mb-3 inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              </div>

              <span className="font-serif text-3xl text-[#EEF0FF]">
                Gl<em className="italic text-[#8B85FF]">i</em>nt
              </span>
            </div>

            <p className="text-sm text-[#A0A3B1]">Ad-free music powered by AI</p>
          </div>

          {isDemo && (
            <div className="mb-5 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-xs leading-5 text-amber-300">
              <strong className="block">Demo mode</strong>
              Supabase not configured yet.
              <button
                type="button"
                onClick={onAuth}
                className="mt-2 block text-left font-semibold underline underline-offset-2"
              >
                Continue as guest →
              </button>
            </div>
          )}

          <div className="rounded-3xl border border-white/10 bg-[#11131A] p-5 shadow-2xl sm:p-6">
            <h2 className="mb-6 text-center font-serif text-2xl text-[#EEF0FF]">
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h2>

            {error && (
              <div className="mb-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                {success}
              </div>
            )}

            <form onSubmit={handle} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="mb-2 block text-xs font-semibold text-[#A0A3B1]">Name</label>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-[#171923] px-4 py-3 text-sm text-[#EEF0FF] outline-none transition placeholder:text-[#6B6F85] focus:border-indigo-500/50"
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block text-xs font-semibold text-[#A0A3B1]">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-[#171923] px-4 py-3 text-sm text-[#EEF0FF] outline-none transition placeholder:text-[#6B6F85] focus:border-indigo-500/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-[#A0A3B1]">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full rounded-2xl border border-white/10 bg-[#171923] px-4 py-3 text-sm text-[#EEF0FF] outline-none transition placeholder:text-[#6B6F85] focus:border-indigo-500/50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-[#A0A3B1]">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login')
                  setError('')
                  setSuccess('')
                }}
                className="font-semibold text-[#8B85FF]"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>

            <div className="mt-5 border-t border-white/10 pt-4 text-center">
              <button
                type="button"
                onClick={onAuth}
                className="text-xs text-[#6B6F85] transition hover:text-[#A0A3B1]"
              >
                Continue without account →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
