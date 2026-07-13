import { Bell, Menu, Search } from 'lucide-react'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import AuthControls from '../../features/auth/AuthControls'
import ThemeToggle from '../../features/theme/ThemeToggle'
import Sidebar from './Sidebar'

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  function closeSidebar() {
    setIsSidebarOpen(false)
  }

  return (
    <div className="app-layout">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {isSidebarOpen && (
        <button
          aria-label="Close navigation"
          className="mobile-overlay"
          onClick={closeSidebar}
          type="button"
        />
      )}

      <div className="workspace-shell">
        <header className="workspace-topbar">
          <button
            aria-label="Open navigation"
            className="icon-button mobile-menu-button"
            onClick={() => setIsSidebarOpen(true)}
            type="button"
          >
            <Menu aria-hidden="true" size={20} />
          </button>

          <label className="workspace-search">
            <Search aria-hidden="true" size={18} />
            <input aria-label="Search workspace" placeholder="Search workspace" />
          </label>

          <div className="topbar-actions">
            <span className="environment-pill">Practice</span>
            <AuthControls />
            <ThemeToggle />
            <button aria-label="Notifications" className="icon-button" type="button">
              <Bell aria-hidden="true" size={19} />
            </button>
          </div>
        </header>

        <main className="workspace-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
