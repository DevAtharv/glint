import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Safe init — won't crash if keys are missing
const hasSupabase = supabaseUrl?.startsWith('https://') && supabaseAnonKey?.length > 10

export const supabase = hasSupabase
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export async function signUp(email: string, password: string, name: string) {
  if (!supabase) throw new Error('Supabase not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.')
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  })
  if (error) throw error
  return data
}

export async function signIn(email: string, password: string) {
  if (!supabase) throw new Error('Supabase not configured.')
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  await supabase?.auth.signOut()
}

export async function getSession() {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  return data.session
}

export async function savePlaylists(userId: string, playlists: unknown[]) {
  if (!supabase) return
  await supabase.from('glint_playlists').upsert({
    user_id: userId,
    data: playlists,
    updated_at: new Date().toISOString(),
  })
}

export async function loadPlaylists(userId: string) {
  if (!supabase) return []
  const { data } = await supabase
    .from('glint_playlists')
    .select('data')
    .eq('user_id', userId)
    .single()
  return (data?.data as unknown[]) ?? []
}

export async function saveLiked(userId: string, tracks: unknown[]) {
  if (!supabase) return
  await supabase.from('glint_liked').upsert({
    user_id: userId,
    data: tracks,
    updated_at: new Date().toISOString(),
  })
}

export async function loadLiked(userId: string) {
  if (!supabase) return []
  const { data } = await supabase
    .from('glint_liked')
    .select('data')
    .eq('user_id', userId)
    .single()
  return (data?.data as unknown[]) ?? []
}
