import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom"

function HomePage() {
  return <div className="p-6 text-white">Home</div>
}

function SearchPage() {
  return <div className="p-6 text-white">Search</div>
}

function LibraryPage() {
  return <div className="p-6 text-white">Library</div>
}

function ImportPage() {
  return <div className="p-6 text-white">Import</div>
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-zinc-950 text-white flex">
        <aside className="w-64 border-r border-zinc-800 p-4">
          <div className="text-2xl font-bold text-green-400 mb-8">Glint</div>

          <nav className="flex flex-col gap-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 ${isActive ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-900"}`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/search"
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 ${isActive ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-900"}`
              }
            >
              Search
            </NavLink>

            <NavLink
              to="/library"
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 ${isActive ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-900"}`
              }
            >
              Library
            </NavLink>

            <NavLink
              to="/import"
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 ${isActive ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-900"}`
              }
            >
              Import
            </NavLink>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/import" element={<ImportPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
