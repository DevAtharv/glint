import React, { useState } from 'react'
import type { Track, Playlist } from '../types'

interface EditPlaylistPageProps {
  playlist: Playlist
  onSave: (playlist: Playlist) => void
  onBack: () => void
  onPlay: (track: Track, queue?: Track[]) => void
  currentTrack: Track | null
}

export default function EditPlaylistPage({ playlist, onSave, onBack, onPlay, currentTrack }: EditPlaylistPageProps) {
  const [name, setName] = useState(playlist.name)
  const [tracks, setTracks] = useState<Track[]>([...playlist.tracks])
  const [editing, setEditing] = useState(false)

  const handleSave = () => {
    onSave({
      ...playlist,
      name,
      tracks,
    })
    setEditing(false)
  }

  const handleRemoveTrack = (index: number) => {
    setTracks(prev => prev.filter((_, i) => i !== index))
  }

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    setTracks(prev => {
      const newTracks = [...prev]
      const temp = newTracks[index]
      newTracks[index] = newTracks[index - 1]
      newTracks[index - 1] = temp
      return newTracks
    })
  }

  const handleMoveDown = (index: number) => {
    if (index === tracks.length - 1) return
    setTracks(prev => {
      const newTracks = [...prev]
      const temp = newTracks[index]
      newTracks[index] = newTracks[index + 1]
      newTracks[index + 1] = temp
      return newTracks
    })
  }

  return (
    <div className="px-4 pb-10 pt-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition hover:bg-white/10"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#A0A3B1">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </button>

        <div className="min-w-0 flex-1">
          {editing ? (
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border-b-2 border-indigo-500 bg-transparent pb-1 font-serif text-3xl text-[#EEF0FF] outline-none"
              autoFocus
            />
          ) : (
            <h2 className="font-serif text-3xl text-[#EEF0FF]">{name}</h2>
          )}
          <p className="mt-1 text-sm text-[#A0A3B1]">{tracks.length} tracks</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {editing ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setName(playlist.name)
                  setTracks([...playlist.tracks])
                  setEditing(false)
                }}
                className="rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-sm font-semibold text-[#A0A3B1] transition hover:bg-white/5 hover:text-[#EEF0FF]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600"
              >
                Save Changes
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
              </svg>
              Edit Playlist
            </button>
          )}
        </div>
      </div>

      <div className="mb-5">
        <button
          type="button"
          onClick={() => tracks.length > 0 && onPlay(tracks[0], tracks)}
          className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-600"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M8 5v14l11-7z" />
          </svg>
          Play All
        </button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#11131A]">
        {tracks.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <p className="text-sm text-[#A0A3B1]">No tracks in this playlist</p>
            <p className="mt-2 text-xs text-[#6B6F85]">Import songs from Spotify to add tracks</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {tracks.map((track, index) => (
              <div
                key={`${track.id}-${index}`}
                className={`flex items-center gap-3 px-4 py-3 transition ${
                  currentTrack?.id === track.id ? 'bg-[rgba(108,99,255,0.08)]' : 'hover:bg-white/5'
                }`}
              >
                <div className="w-8 shrink-0 text-center">
                  {editing ? (
                    <span className="text-xs text-[#6B6F85]">{index + 1}</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onPlay(track, tracks)}
                      className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-white/5"
                    >
                      {currentTrack?.id === track.id ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#8B85FF">
                          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#6B6F85">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </button>
                  )}
                </div>

                <img
                  src={track.albumArt || `https://picsum.photos/seed/${index}/120/120`}
                  alt={track.title}
                  className="h-10 w-10 shrink-0 rounded-lg object-cover"
                />

                <div className="min-w-0 flex-1">
                  <p className={`truncate text-sm font-semibold ${currentTrack?.id === track.id ? 'text-[#8B85FF]' : 'text-[#EEF0FF]'}`}>
                    {track.title}
                  </p>
                  <p className="truncate text-xs text-[#A0A3B1]">{track.artist}</p>
                </div>

                {editing && (
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="#A0A3B1">
                        <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === tracks.length - 1}
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="#A0A3B1">
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveTrack(index)}
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 transition hover:bg-rose-500/15"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="#FF4D6D">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {editing && (
        <div className="mt-4 rounded-2xl border border-indigo-500/20 bg-[rgba(108,99,255,0.08)] px-4 py-3">
          <p className="text-xs leading-5 text-[#8B85FF]">
            Use the arrow buttons to reorder tracks. Click the X to remove a track.
          </p>
        </div>
      )}
    </div>
  )
}
