import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom"

function Page({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-zinc-400 text-sm">{subtitle}</p>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-zinc-950 text-white flex">
        <aside className="w-64 border-r border-zinc-800 p-4 shrink-0">
          <div className="text-xl font-bold mb-6">Glint</div>

          <nav className="flex flex-col gap-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md ${isActive ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/search"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md ${isActive ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"}`
              }
            >
              Search
            </NavLink>
            <NavLink
              to="/library"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md ${isActive ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"}`
              }
            >
              Library
            </NavLink>
            <NavLink
              to="/import"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md ${isActive ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"}`
              }
            >
              Import
            </NavLink>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Page title="Home" subtitle="A simple place for your playlists and recent tracks." />} />
            <Route path="/search" element={<Page title="Search" subtitle="Search songs and artists." />} />
            <Route path="/library" element={<Page title="Library" subtitle="Your saved playlists will appear here." />} />
            <Route path="/import" element={<Page title="Import" subtitle="Paste a playlist link to import tracks." />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
