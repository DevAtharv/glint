import { useState, useEffect, createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { supabase } from '../services/supabase'
import type { User as AppUser } from '../types'
import type { Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: AppUser | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
  isDemo: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
  isDemo: false,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  const isDemo = !supabase

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return

      setSession(data.session)
      if (data.session?.user) {
        setUser({
          id: data.session.user.id,
          email: data.session.user.email ?? '',
          name: data.session.user.user_metadata?.['name'] ?? 'User',
          memberType: 'Free',
        })
      }

      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      if (!mounted) return

      setSession(s)
      if (s?.user) {
        setUser({
          id: s.user.id,
          email: s.user.email ?? '',
          name: s.user.user_metadata?.['name'] ?? 'User',
          memberType: 'Free',
        })
      } else {
        setUser(null)
      }
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    await supabase?.auth.signOut()
    setUser(null)
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, isDemo }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
function AuthPage(...) {
  ...
}

export default AuthPage
