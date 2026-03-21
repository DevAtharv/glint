import type { Track } from "../types"

interface Props {
  currentTrack: Track | null
  isPlaying: boolean
  onToggle: () => void
}

export default function PlayerBar({ currentTrack, isPlaying, onToggle }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-20 bg-zinc-900/80 backdrop-blur-md border-t border-zinc-800 flex items-center justify-between px-6">

      {/* Left */}
      <div className="text-sm">
        <p className="font-medium">
          {currentTrack ? currentTrack.title : "No track playing"}
        </p>
        <p className="text-zinc-400 text-xs">
          {currentTrack ? currentTrack.artist : "Select a track"}
        </p>
      </div>

      {/* Center */}
      <button
        onClick={onToggle}
        className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center text-black text-lg shadow-lg hover:scale-110 transition"
      >
        {isPlaying ? "❚❚" : "▶"}
      </button>

      {/* Right */}
      <div className="w-32 text-right text-xs text-zinc-400">
        0:00 / 0:00
      </div>

    </div>
  )
}
