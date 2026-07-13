import { NavLink, Outlet } from 'react-router-dom'

import './App.css'

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/admin', label: 'Admin' },
  { to: '/customer', label: 'Customer' },
]

function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/">
          Waleed Fazal Sync
        </a>
        <nav className="nav-links" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <NavLink
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
              end={link.end}
              key={link.to}
              to={link.to}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default App
