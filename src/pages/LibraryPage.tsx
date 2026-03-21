import React, { useState } from 'react'
import type { Track, Playlist } from '../types'
import TrackRow from '../components/TrackRow'

interface LibraryPageProps {
  liked: Track[]
  playlists: Playlist[]
  onPlay: (track: Track, queue?: Track[]) => void
  currentTrack: Track | null
  onLike: (track: Track) => void
  onEditPlaylist?: (playlist: Playlist) => void
}

export default function LibraryPage({
  liked,
  playlists,
  onPlay,
  currentTrack,
  onLike,
  onEditPlaylist,
}: LibraryPageProps) {
  const [tab, setTab] = useState<'liked' | 'playlists' | 'albums'>('liked')

  return (
    <div className="px-4 pb-10 pt-4 sm:px-6 lg:px-8">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-serif text-2xl text-[#EEF0FF]">Your Library</h2>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-600"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          New Playlist
        </button>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        <TabButton active={tab === 'liked'} onClick={() => setTab('liked')}>
          Liked Songs
        </TabButton>
        <TabButton active={tab === 'playlists'} onClick={() => setTab('playlists')}>
          Playlists
        </TabButton>
        <TabButton active={tab === 'albums'} onClick={() => setTab('albums')}>
          Albums
        </TabButton>
      </div>

      {tab === 'liked' &&
        (liked.length === 0 ? (
          <Empty icon="❤️" label="No liked songs yet" sub="Heart a song while it plays to save it here" />
        ) : (
          <div className="space-y-2">
            {liked.map((t, i) => (
              <div key={t.id} className="relative">
                <TrackRow
                  track={t}
                  index={i}
                  isActive={currentTrack?.id === t.id}
                  onPlay={tr => onPlay(tr, liked)}
                />
                <button
                  type="button"
                  onClick={() => onLike(t)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-3 py-2 text-xs font-semibold text-rose-400 transition hover:bg-white/5"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ))}

      {tab === 'playlists' &&
        (playlists.length === 0 ? (
          <Empty icon="🎵" label="No playlists yet" sub="Use AI Import to create your first playlist" />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {playlists.map(pl => (
              <div
                key={pl.id}
                className="rounded-3xl border border-white/10 bg-[#11131A] p-4 transition hover:bg-[#171923]"
              >
                <button
                  type="button"
                  onClick={() => pl.tracks[0] && onPlay(pl.tracks[0], pl.tracks)}
                  className="group relative block w-full text-left"
                >
                  <img
                    src={pl.cover}
                    alt={pl.name}
                    className="mb-3 aspect-square w-full rounded-2xl object-cover"
                  />

                  <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 opacity-0 shadow-lg transition group-hover:opacity-100">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#EEF0FF]">{pl.name}</p>
                      <p className="text-xs text-[#A0A3B1]">{pl.tracks.length} tracks</p>
                    </div>

                    {onEditPlaylist && (
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation()
                          onEditPlaylist(pl)
                        }}
                        className="inline-flex items-center gap-1 rounded-xl border border-indigo-500/20 bg-[rgba(108,99,255,0.12)] px-3 py-2 text-xs font-semibold text-[#8B85FF] transition hover:bg-[rgba(108,99,255,0.18)]"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                        </svg>
                        Edit
                      </button>
                    )}
                  </div>
                </button>
              </div>
            ))}
          </div>
        ))}

      {tab === 'albums' && (
        <Empty icon="💿" label="No saved albums" sub="Albums you save will appear here" />
      )}
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-2xl px-4 py-2 text-sm font-semibold transition ${
        active
          ? 'bg-indigo-500 text-white'
          : 'border border-white/10 bg-transparent text-[#A0A3B1] hover:bg-white/5 hover:text-[#EEF0FF]'
      }`}
    >
      {children}
    </button>
  )
}

function Empty({ icon, label, sub }: { icon: string; label: string; sub: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 text-5xl">{icon}</div>
      <p className="mb-1 text-base font-semibold text-[#A0A3B1]">{label}</p>
      <p className="text-sm text-[#6B6F85]">{sub}</p>
    </div>
  )
}
