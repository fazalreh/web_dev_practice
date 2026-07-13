import { Home, ShieldCheck, UserRound } from 'lucide-react'

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
]
