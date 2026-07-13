import { X } from 'lucide-react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

import { selectAuth } from '../../features/auth/authSlice'
import { getRoleLabel } from '../../lib/roles'
import { navigationItems } from '../../routes/navigation'

function Sidebar({ isOpen, onClose }) {
  const auth = useSelector(selectAuth)
  const sessionLabel =
    auth.status === 'authenticated'
      ? `${getRoleLabel(auth.role)} - ${auth.user?.email}`
      : auth.status === 'checking'
        ? 'Checking session'
        : 'Not signed in'

  return (
    <aside className={isOpen ? 'sidebar open' : 'sidebar'}>
      <div className="sidebar-header">
        <NavLink className="brand-lockup" onClick={onClose} to="/">
          <span className="brand-mark">AI</span>
          <span>
            <strong>Arbisoft internship 2026</strong>
            <small>React practice portal</small>
          </span>
        </NavLink>

        <button
          aria-label="Close navigation"
          className="icon-button sidebar-close"
          onClick={onClose}
          type="button"
        >
          <X aria-hidden="true" size={19} />
        </button>
      </div>

      <nav className="sidebar-nav" aria-label="Workspace navigation">
        {navigationItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              className={({ isActive }) =>
                isActive ? 'sidebar-link active' : 'sidebar-link'
              }
              end={item.end}
              key={item.to}
              onClick={onClose}
              to={item.to}
            >
              <Icon aria-hidden="true" size={19} />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <span className="status-dot"></span>
        <div>
          <strong>{auth.status}</strong>
          <small>{sessionLabel}</small>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
