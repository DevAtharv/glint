import { NavLink } from "react-router-dom"

export default function Sidebar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
      isActive
        ? "bg-zinc-800 text-white"
        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
    }`

  return (
    <div className="w-64 bg-black border-r border-zinc-900 p-5 flex flex-col shrink-0">
      <h1 className="text-2xl font-bold text-green-500 mb-8">Glint</h1>

      <nav className="space-y-2">
        <NavLink to="/" className={linkClass}>🏠 Home</NavLink>
        <NavLink to="/search" className={linkClass}>🔍 Search</NavLink>
        <NavLink to="/library" className={linkClass}>📚 Library</NavLink>
        <NavLink to="/import" className={linkClass}>⬇ Import</NavLink>
      </nav>
    </div>
  )
}
