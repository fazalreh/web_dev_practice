import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import { store } from './app/store'
import AuthProvider from './features/auth/AuthProvider'
import { ThemeProvider } from './features/theme/ThemeProvider'
import { AppRouter } from './routes/AppRouter'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
