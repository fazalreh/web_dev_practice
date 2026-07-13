import { Home, LogIn, ShieldCheck, UserRound, UserRoundPlus } from 'lucide-react'

export const navigationItems = [
  {
    to: '/',
    label: 'Overview',
    icon: Home,
    end: true,
  },
  {
    to: '/admin',
    label: 'Admin',
    icon: ShieldCheck,
  },
  {
    to: '/customer',
    label: 'Customer',
    icon: UserRound,
  },
  {
    to: '/login',
    label: 'Login',
    icon: LogIn,
  },
  {
    to: '/signup',
    label: 'Signup',
    icon: UserRoundPlus,
  },
]
