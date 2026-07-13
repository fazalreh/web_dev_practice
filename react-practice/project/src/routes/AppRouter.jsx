import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import App from '../App'
import ProtectedRoute from '../features/auth/ProtectedRoute'
import PublicOnlyRoute from '../features/auth/PublicOnlyRoute'
import { USER_ROLES } from '../lib/roles'
import AdminPage from '../pages/AdminPage'
import CustomerPage from '../pages/CustomerPage'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import NotFoundPage from '../pages/NotFoundPage'
import SignupPage from '../pages/SignupPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            <AdminPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'customer',
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.CUSTOMER]}>
            <CustomerPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'login',
        element: (
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        ),
      },
      {
        path: 'signup',
        element: (
          <PublicOnlyRoute>
            <SignupPage />
          </PublicOnlyRoute>
        ),
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
