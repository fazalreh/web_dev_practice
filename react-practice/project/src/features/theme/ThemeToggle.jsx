import { Moon, Sun } from 'lucide-react'

import { useTheme } from './useTheme'

function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme()
  const label = isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
  const Icon = isDarkMode ? Sun : Moon

  return (
    <button
      aria-label={label}
      className="icon-button theme-toggle"
      onClick={toggleTheme}
      title={label}
      type="button"
    >
      <Icon aria-hidden="true" size={19} />
    </button>
  )
}

export default ThemeToggle
