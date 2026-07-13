import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import App from '../App'
import AdminPage from '../pages/AdminPage'
import CustomerPage from '../pages/CustomerPage'
import HomePage from '../pages/HomePage'

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
        element: <AdminPage />,
      },
      {
        path: 'customer',
        element: <CustomerPage />,
      },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
