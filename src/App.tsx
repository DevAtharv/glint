import { BrowserRouter, Routes, Route } from "react-router-dom"
import Sidebar from "./components/Sidebar"
import PlayerBar from "./components/PlayerBar"

import HomePage from "./pages/HomePage"
import SearchPage from "./pages/SearchPage"
import LibraryPage from "./pages/LibraryPage"
import ImportPage from "./pages/ImportPage"
import AuthPage from "./pages/AuthPage"
<div className="flex h-screen bg-gradient-to-b from-[#0a0a0a] to-black text-white">
export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">

        {/* Sidebar */}
        <Sidebar />

        {/* Main */}
        <div className="flex flex-col flex-1">

          {/* Top bar */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-zinc-800 bg-[#0a0a0a]">
            <input
              placeholder="Search anything..."
              className="bg-zinc-900 px-4 py-2 rounded-full w-80 outline-none focus:ring-2 ring-green-500"
            />
            <div className="flex gap-4 text-zinc-400">
              <span>🔔</span>
              <span>⚙️</span>
            </div>
          </div>

          {/* Pages */}
          <div className="flex-1 overflow-y-auto p-6">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/import" element={<ImportPage />} />
              <Route path="/auth" element={<AuthPage />} />
            </Routes>
          </div>

        </div>

        {/* Player */}
        <PlayerBar />
      </div>
    </BrowserRouter>
  )
}
