import { useState } from 'react'
import { signIn, signUp } from '../services/supabase'

interface Props {
  onAuth: () => void
  isDemo?: boolean
}

export default function AuthPage({ onAuth, isDemo }: Props) {
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
        // Optional: clear password/name after successful registration
        setPassword('')
        setName('')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Optional helper for the demo prop you defined
  const handleDemoLogin = async () => {
    setEmail('demo@example.com')
    setPassword('demo123')
    // You can trigger handleSubmit here if you want it to auto-login
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] p-4 text-zinc-100 font-sans tracking-wide">
      <div className="w-full max-w-md bg-[#121212] border border-zinc-800/60 p-8 rounded-2xl shadow-2xl">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            {mode === 'login' ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="text-zinc-400 text-sm">
            {mode === 'login' 
              ? 'Enter your details to access your account' 
              : 'Sign up to get started with our platform'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="sr-only" htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                required
                placeholder="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-zinc-600"
              />
            </div>
          )}

          <div>
            <label className="sr-only" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-zinc-600"
            />
          </div>

          <div>
            <label className="sr-only" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-zinc-600"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="mt-2 w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-3 px-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex justify-center items-center gap-2"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-zinc-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : mode === 'login' ? 'Log in' : 'Sign up'}
          </button>

          {isDemo && mode === 'login' && (
            <button 
              type="button"
              onClick={handleDemoLogin}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-3 px-4 rounded-xl transition-all"
            >
              Try Demo Login
            </button>
          )}

          <p className="text-zinc-400 text-sm text-center mt-4">
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              type="button"
              className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors focus:outline-none focus:underline"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login')
                setError('') // Clear errors when switching modes
              }}
            >
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </p>

        </form>
      </div>
    </div>
  )
}
