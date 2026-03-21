import React, { useState } from 'react'
import type { Track, Playlist } from '../types'
import { useAuth } from '../hooks/useAuth'
import TrackRow from '../components/TrackRow'

interface ProfilePageProps {
  liked: Track[]
  playlists: Playlist[]
  onPlay: (track: Track, queue?: Track[]) => void
  currentTrack: Track | null
}

export default function ProfilePage({ liked, playlists, onPlay, currentTrack }: ProfilePageProps) {
  const { user, signOut } = useAuth()
  const [signingOut, setSigningOut] = useState(false)

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  const totalMins = liked.reduce((acc, t) => acc + (t.duration || 0), 0)
  const hours = Math.round(totalMins / 60)

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await signOut()
    } finally {
      setSigningOut(false)
    }
  }

  const statCards = [
    { v: liked.length, l: 'Liked Songs', c: '#FF4D6D', bg: 'rgba(255,77,109,.08)' },
    { v: playlists.length, l: 'Playlists', c: '#8B85FF', bg: 'rgba(108,99,255,.08)' },
    { v: `${hours}h`, l: 'Hours Listened', c: '#2DD881', bg: 'rgba(45,216,129,.08)' },
    { v: playlists.filter(p => p.id.startsWith('ai-')).length, l: 'AI Playlists', c: '#f5a623', bg: 'rgba(245,166,35,.08)' },
  ]

  return (
    <div className="px-4 pb-10 pt-4 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-3xl border border-white/10 bg-[linear-gradient(135deg,#141720,#0E1018)] p-5 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-indigo-500 font-serif text-3xl text-white">
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="truncate font-serif text-3xl text-[#EEF0FF]">
              {user?.name ?? 'User'}
            </h2>
            <p className="mt-1 truncate text-sm text-[#A0A3B1]">{user?.email}</p>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full border border-indigo-500/20 bg-[rgba(108,99,255,0.12)] px-3 py-1 text-xs font-bold text-[#8B85FF]">
                Free Plan
              </span>
              <span className="rounded-full border border-emerald-500/15 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                Ad-free
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:w-[160px]">
            <button
              type="button"
              className="rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-sm font-semibold text-[#A0A3B1] transition hover:bg-white/5 hover:text-[#EEF0FF]"
            >
              Edit Profile
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="rounded-2xl border border-rose-500/15 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-400 transition hover:bg-rose-500/15 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {signingOut ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map(({ v, l, c, bg }) => (
          <div key={l} className="rounded-3xl border border-white/10 bg-[#11131A] p-4 sm:p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl" style={{ background: bg }}>
              <div className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
            </div>
            <p className="font-serif text-3xl text-[#EEF0FF]">{v}</p>
            <p className="mt-1 text-xs font-semibold" style={{ color: c }}>
              {l}
            </p>
          </div>
        ))}
      </div>

      {liked.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-4 font-serif text-2xl text-[#EEF0FF]">Recently Liked</h3>
          <div className="space-y-2">
            {liked.slice(0, 6).map((t, i) => (
              <TrackRow
                key={t.id}
                track={t}
                index={i}
                isActive={currentTrack?.id === t.id}
                onPlay={tr => onPlay(tr, liked)}
              />
            ))}
          </div>
        </div>
      )}

      {playlists.length > 0 && (
        <div>
          <h3 className="mb-4 font-serif text-2xl text-[#EEF0FF]">Your Playlists</h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {playlists.map(pl => (
              <button
                key={pl.id}
                type="button"
                onClick={() => pl.tracks[0] && onPlay(pl.tracks[0], pl.tracks)}
                className="group rounded-3xl border border-white/10 bg-[#11131A] p-4 text-left transition hover:bg-[#171923]"
              >
                <div className="relative mb-3">
                  <img
                    src={pl.cover}
                    alt={pl.name}
                    className="aspect-square w-full rounded-2xl object-cover"
                  />
                  <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 opacity-0 shadow-lg transition group-hover:opacity-100">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                <p className="truncate text-sm font-semibold text-[#EEF0FF]">{pl.name}</p>
                <p className="mt-1 text-xs text-[#A0A3B1]">{pl.tracks.length} tracks</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
