import { NavLink } from "react-router-dom"

export default function Sidebar() {
  return (
    <div className="w-64 bg-black border-r border-zinc-900 p-5 flex flex-col">

      <h1 className="text-2xl font-bold text-green-500 mb-8">Glint</h1>

      <nav className="space-y-2">
        <NavLink to="/" className="link">🏠 Home</NavLink>
        <NavLink to="/search" className="link">🔍 Search</NavLink>
        <NavLink to="/library" className="link">📚 Library</NavLink>
        <NavLink to="/import" className="link">⬇ Import</NavLink>
      </nav>

    </div>
  )
}
