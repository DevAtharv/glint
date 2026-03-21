import React from 'react'
import type { Playlist, Track } from '../types'

interface Props {
  playlists: Playlist[]
  liked: Track[]
  onPlayPlaylist: (p: Playlist) => void
  onPlayTrack: (t: Track, queue?: Track[]) => void
}

export default function LibraryPage({
  playlists,
  liked,
  onPlayPlaylist,
  onPlayTrack,
}: Props) {
  return (
    <div className="px-4 pb-10 pt-4 sm:px-6 lg:px-8">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Your Library</h1>
        <p className="text-gray-400 text-sm mt-1">
          Your playlists and liked songs
        </p>
      </div>

      {/* LIKED SONGS */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-white mb-4">
          Liked Songs
        </h2>

        {liked.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-[#181818] p-6 text-gray-400">
            You haven’t liked any songs yet
          </div>
        ) : (
          <div className="space-y-2">
            {liked.map((track, i) => (
              <div
                key={track.id}
                onClick={() => onPlayTrack(track, liked)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#242424] cursor-pointer"
              >
                <img
                  src={track.albumArt}
                  className="w-12 h-12 rounded-md object-cover"
                />

                <div className="flex-1">
                  <p className="text-white text-sm font-semibold truncate">
                    {track.title}
                  </p>
                  <p className="text-gray-400 text-xs truncate">
                    {track.artist}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PLAYLISTS */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">
          Your Playlists
        </h2>

        {playlists.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-[#181818] p-6 text-gray-400">
            No playlists yet — import or create one
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {playlists.map((pl) => (
              <button
                key={pl.id}
                onClick={() => onPlayPlaylist(pl)}
                className="rounded-xl border border-white/10 bg-[#181818] p-3 text-left hover:bg-[#242424] transition"
              >
                <img
                  src={pl.cover}
                  className="w-full aspect-square rounded-lg object-cover mb-3"
                />

                <p className="text-white text-sm font-semibold truncate">
                  {pl.name}
                </p>
                <p className="text-gray-400 text-xs">
                  {pl.tracks.length} songs
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
