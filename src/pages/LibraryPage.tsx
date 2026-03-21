import React from 'react'
import type { Playlist, Track } from '../types'
import TrackRow from '../components/TrackRow'

interface Props {
  playlists: Playlist[]
  liked: Track[]
  onPlayPlaylist: (p: Playlist) => void
  onPlayTrack: (t: Track, queue?: Track[]) => void
  currentTrack?: Track | null // Added this so Liked Songs can show the playing animation!
}

export default function LibraryPage({
  playlists,
  liked,
  onPlayPlaylist,
  onPlayTrack,
  currentTrack
}: Props) {
  return (
    <div className="px-4 pb-16 pt-8 sm:px-6 lg:px-8 max-w-[1400px] mx-auto font-sans bg-[#121212] min-h-screen text-white">

      {/* HEADER */}
      <div className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter text-white mb-2">
          Your Library
        </h1>
        <p className="text-sm font-medium text-[#b3b3b3]">
          All your saved playlists and favorite tracks in one place.
        </p>
      </div>

      {/* LIKED SONGS */}
      <div className="mb-14">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-white hover:underline cursor-pointer inline-block">
            Liked Songs
          </h2>
          <p className="text-sm font-bold tracking-widest text-[#b3b3b3] uppercase">
            {liked.length} {liked.length === 1 ? 'Song' : 'Songs'}
          </p>
        </div>

        {liked.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-white/5 bg-[#181818] py-16 px-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#242424]">
              <svg className="h-8 w-8 text-[#b3b3b3]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-white tracking-tight">Songs you like will appear here</h3>
            <p className="text-sm text-[#b3b3b3]">Save songs by tapping the heart icon.</p>
          </div>
        ) : (
          <div className="mt-2 rounded-lg">
            {/* Table Header Row */}
            <div className="flex px-4 py-2 border-b border-white/10 mb-2 text-sm text-[#b3b3b3] font-medium tracking-wide">
              <div className="w-8 text-center">#</div>
              <div className="flex-1">Title</div>
              <div className="w-12 text-right">⌚</div>
            </div>

            <div className="flex flex-col">
              {liked.map((track, i) => (
                <TrackRow
                  key={track.id}
                  track={track}
                  index={i}
                  isActive={currentTrack?.id === track.id}
                  onPlay={t => onPlayTrack(t, liked)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* PLAYLISTS */}
      <div>
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-white hover:underline cursor-pointer inline-block">
          Your Playlists
        </h2>

        {playlists.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-white/5 bg-[#181818] py-16 px-6 text-center">
             <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#242424]">
              <svg className="h-8 w-8 text-[#b3b3b3]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-white tracking-tight">No playlists yet</h3>
            <p className="text-sm text-[#b3b3b3]">Create one or import your library from another platform.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {playlists.map((pl) => (
              <div
                key={pl.id}
                onClick={() => onPlayPlaylist(pl)}
                className="group relative cursor-pointer rounded-md bg-[#181818] p-4 transition-all duration-300 hover:bg-[#282828]"
              >
                <div className="relative mb-4">
                  <img
                    src={pl.cover}
                    alt={pl.name}
                    className="aspect-square w-full rounded-md object-cover shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
                  />
                  
                  {/* Floating Play Overlay (Spotify Style) */}
                  <div className="absolute bottom-2 right-2 flex items-center justify-center shadow-xl transition-all duration-300 ease-in-out translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1ed760] text-black hover:bg-[#3be477] hover:scale-105 transition-all">
                      <svg className="ml-1 h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <p className="mb-1 truncate text-base font-bold tracking-tight text-white">
                  {pl.name}
                </p>
                <p className="truncate text-sm font-medium text-[#b3b3b3]">
                  {pl.tracks.length} {pl.tracks.length === 1 ? 'song' : 'songs'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
