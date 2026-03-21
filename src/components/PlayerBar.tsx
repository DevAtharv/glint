export default function PlayerBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between px-6">

      <div className="text-sm">
        <p className="font-medium">No track playing</p>
        <p className="text-zinc-400 text-xs">Select a track</p>
      </div>

      <button className="bg-green-500 w-12 h-12 rounded-full text-black text-lg">
        ▶
      </button>

      <div className="w-32 text-right text-xs text-zinc-400">
        0:00 / 0:00
      </div>

    </div>
  )
}
