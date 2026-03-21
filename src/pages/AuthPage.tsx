import { useState } from 'react'
import { signIn, signUp } from '../services/supabase'

interface Props {
  onAuth: () => void
  isDemo?: boolean
}

export default function AuthPage({ onAuth }: Props) {
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
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-[#121212] text-white">
      <form onSubmit={handleSubmit} className="bg-[#181818] p-6 rounded-xl w-full max-w-sm">

        <h2 className="text-xl mb-4">
          {mode === 'login' ? 'Login' : 'Register'}
        </h2>

        {mode === 'register' && (
          <input
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full mb-3 p-2 bg-black border border-gray-700 rounded"
          />
        )}

        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-3 p-2 bg-black border border-gray-700 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-3 p-2 bg-black border border-gray-700 rounded"
        />

        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

        <button className="w-full bg-green-500 text-black p-2 rounded">
          {loading ? 'Loading...' : mode === 'login' ? 'Login' : 'Register'}
        </button>

        <p className="text-sm mt-3">
          {mode === 'login' ? 'No account?' : 'Already have an account?'}{' '}
          <span
            className="text-green-400 cursor-pointer"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login' ? 'Register' : 'Login'}
          </span>
        </p>

      </form>
    </div>
  )
}