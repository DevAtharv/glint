import { BrowserRouter, Routes, Route } from "react-router-dom"
import Sidebar from "./components/Sidebar"
import PlayerBar from "./components/PlayerBar"

import HomePage from "./pages/HomePage"
import SearchPage from "./pages/SearchPage"
import LibraryPage from "./pages/LibraryPage"
import ImportPage from "./pages/ImportPage"
import AuthPage from "./pages/AuthPage"

const [currentTrack, setCurrentTrack] = useState(null)
const [isPlaying, setIsPlaying] = useState(false)

const handlePlay = (track) => {
  setCurrentTrack(track)
  setIsPlaying(true)
}

const togglePlay = () => {
  setIsPlaying(prev => !prev)
}
export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gradient-to-b from-[#0a0a0a] to-black text-white overflow-hidden">
        <Sidebar />

        <div className="flex flex-col flex-1 min-w-0">
          <div className="h-16 px-6 flex items-center justify-between border-b border-zinc-800 bg-black/40 backdrop-blur-md">
            <input
              placeholder="Search anything..."
              className="bg-zinc-900 px-4 py-2 rounded-full w-80 max-w-full outline-none border border-zinc-800 focus:border-green-500"
            />
            <div className="flex gap-4 text-zinc-400">
              <span>🔔</span>
              <span>⚙️</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 pb-28 space-y-10">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/import" element={<ImportPage />} />
              <Route path="/auth" element={<AuthPage />} />
            </Routes>
          </div>
        </div>

        <PlayerBar />
      </div>
    </BrowserRouter>
  )
}
