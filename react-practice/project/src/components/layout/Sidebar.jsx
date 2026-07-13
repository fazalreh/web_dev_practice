import { X } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { navigationItems } from '../../routes/navigation'

function Sidebar({ isOpen, onClose }) {
  return (
    <aside className={isOpen ? 'sidebar open' : 'sidebar'}>
      <div className="sidebar-header">
        <NavLink className="brand-lockup" onClick={onClose} to="/">
          <span className="brand-mark">WF</span>
          <span>
            <strong>Waleed Fazal Sync</strong>
            <small>React practice</small>
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
          <strong>Demo mode</strong>
          <small>Supabase pending</small>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
