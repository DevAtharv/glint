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
    <div className="px-4 pb-20 pt-8 sm:px-6 lg:px-8 max-w-[1400px] mx-auto font-sans bg-[#121212] min-h-screen text-white">
      
      {/* HEADER SECTION */}
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-white/10 pb-8">
        
        <div className="flex items-center gap-6 flex-1 min-w-0">
          {/* Back Button */}
          <button
            type="button"
            onClick={onBack}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#181818] text-[#b3b3b3] transition-all hover:bg-[#282828] hover:text-white hover:scale-105"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
            </svg>
          </button>

          {/* Title Area */}
          <div className="min-w-0 flex-1">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[#b3b3b3]">
              Playlist
            </p>
            {editing ? (
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-transparent text-5xl sm:text-7xl font-bold tracking-tighter text-white outline-none border-b border-[#1ed760] focus:border-[#3be477] transition-colors pb-2"
                autoFocus
                placeholder="Playlist Name"
              />
            ) : (
              <h1 className="truncate text-5xl sm:text-7xl font-bold tracking-tighter text-white pb-2">
                {name}
              </h1>
            )}
            <p className="mt-2 text-sm font-medium text-[#b3b3b3]">
              {tracks.length} {tracks.length === 1 ? 'song' : 'songs'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex shrink-0 items-center gap-3 pb-2">
          {editing ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setName(playlist.name)
                  setTracks([...playlist.tracks])
                  setEditing(false)
                }}
                className="rounded-full px-6 py-3 text-sm font-bold text-white hover:scale-105 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="rounded-full bg-white px-8 py-3 text-sm font-bold text-black hover:scale-105 transition-all"
              >
                Save
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="rounded-full border border-[#727272] bg-transparent px-8 py-3 text-sm font-bold text-white transition-all hover:scale-105 hover:border-white"
            >
              Edit Details
            </button>
          )}
        </div>
      </div>

      {/* PLAY BUTTON (Spotify Style) */}
      <div className="mb-8">
        <button
          type="button"
          onClick={() => tracks.length > 0 && onPlay(tracks[0], tracks)}
          disabled={tracks.length === 0}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1ed760] text-black shadow-lg transition-all hover:scale-105 hover:bg-[#3be477] disabled:opacity-50 disabled:hover:scale-100"
        >
          <svg className="ml-1 h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>

      {/* TRACKS LIST */}
      <div className="mt-2">
        {tracks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg className="mb-4 h-16 w-16 text-[#b3b3b3]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
            <h3 className="mb-2 text-xl font-bold tracking-tight text-white">It's a bit empty here...</h3>
            <p className="text-sm font-medium text-[#b3b3b3]">Find more songs to add to your playlist.</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {/* Table Header Row */}
            <div className="flex px-4 py-2 border-b border-white/10 mb-2 text-[11px] uppercase text-[#b3b3b3] font-bold tracking-widest">
              <div className="w-10 text-center">#</div>
              <div className="flex-1">Title</div>
              {editing && <div className="w-24 text-right">Controls</div>}
            </div>

            {tracks.map((track, index) => {
              const isPlaying = currentTrack?.id === track.id
              return (
                <div
                  key={`${track.id}-${index}`}
                  className={`group flex items-center gap-3 rounded-md px-4 py-2 transition-colors duration-200 ${
                    isPlaying ? 'bg-[#282828]' : 'hover:bg-[#2a2a2a]'
                  }`}
                >
                  <div className="w-10 shrink-0 text-center flex items-center justify-center">
                    {editing ? (
                      <span className="text-base text-[#b3b3b3]">{index + 1}</span>
                    ) : (
                      <div className="relative flex h-8 w-8 items-center justify-center">
                        {isPlaying ? (
                          <div className="flex gap-1 items-center justify-center">
                            <div className="w-1 h-3 bg-[#1ed760] animate-pulse rounded-full" />
                            <div className="w-1 h-3 bg-[#1ed760] animate-pulse rounded-full delay-75" />
                          </div>
                        ) : (
                          <>
                            <span className="text-base text-[#b3b3b3] group-hover:hidden">{index + 1}</span>
                            <button
                              onClick={() => onPlay(track, tracks)}
                              className="hidden h-8 w-8 items-center justify-center text-white group-hover:flex"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <img
                    src={track.albumArt || `https://picsum.photos/seed/${index}/120/120`}
                    alt={track.title}
                    className="h-10 w-10 shrink-0 rounded-md object-cover shadow-sm"
                  />

                  <div className="min-w-0 flex-1 pl-2">
                    <p className={`truncate text-base font-medium tracking-tight ${isPlaying ? 'text-[#1ed760]' : 'text-white'}`}>
                      {track.title}
                    </p>
                    <p className="truncate text-sm text-[#b3b3b3] hover:underline cursor-pointer inline-block">
                      {track.artist}
                    </p>
                  </div>

                  {editing && (
                    <div className="flex shrink-0 items-center gap-2 pr-2">
                      <button
                        type="button"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="text-[#b3b3b3] hover:text-white disabled:opacity-30 disabled:hover:text-[#b3b3b3] transition-colors p-1"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === tracks.length - 1}
                        className="text-[#b3b3b3] hover:text-white disabled:opacity-30 disabled:hover:text-[#b3b3b3] transition-colors p-1"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveTrack(index)}
                        className="ml-2 text-[#b3b3b3] hover:text-rose-500 transition-colors p-1"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {editing && tracks.length > 0 && (
        <div className="mt-6 flex items-center justify-center">
           <p className="text-xs font-bold uppercase tracking-widest text-[#b3b3b3]">
            Edit Mode Active
          </p>
        </div>
      )}
    </div>
  )
}
