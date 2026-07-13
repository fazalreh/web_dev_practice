import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'

import { isSupabaseConfigured, supabase } from '../../lib/supabaseClient'
import {
  getSupabaseSetupMessage,
  supabaseEnvStatus,
} from '../../lib/supabaseConfig'

const MOCK_DATA_DELAY_MS = 160

const adminDashboardData = {
  updatedAt: 'Just now',
  stats: [
    {
      label: 'Customers',
      meta: '+12 this month',
      tone: 'success',
      value: '128',
    },
    {
      label: 'Approvals',
      meta: 'Needs review',
      tone: 'warning',
      value: '7',
    },
    {
      label: 'Records',
      meta: 'Synced today',
      tone: 'success',
      value: '342',
    },
  ],
  reviewQueue: [
    {
      title: 'Verify Waleed Khalid profile',
      owner: 'Customer onboarding',
      status: 'High',
      due: 'Today',
    },
    {
      title: 'Review customer document update',
      owner: 'Records team',
      status: 'Normal',
      due: 'Tomorrow',
    },
    {
      title: 'Approve admin role request',
      owner: 'Access control',
      status: 'High',
      due: 'Today',
    },
  ],
  activityItems: [
    {
      icon: 'check',
      title: 'Customer sync completed',
      meta: '342 records checked',
    },
    {
      icon: 'userCog',
      title: 'Role policy refreshed',
      meta: 'Admin and customer access active',
    },
    {
      icon: 'fileCheck',
      title: 'Profile queue updated',
      meta: '7 approvals waiting',
    },
  ],
  healthItems: [
    {
      icon: 'shield',
      label: 'Route guard',
      value: 'Active',
    },
    {
      icon: 'activity',
      label: 'Supabase auth',
      value: 'Connected',
    },
    {
      icon: 'clock',
      label: 'Last sync',
      value: 'Just now',
    },
  ],
}

const customerDashboardTemplate = {
  updatedAt: 'Just now',
  stats: [
    {
      label: 'Documents',
      meta: 'Ready to view',
      tone: 'success',
      value: '12',
    },
    {
      label: 'Messages',
      meta: 'Unread updates',
      tone: 'warning',
      value: '4',
    },
    {
      label: 'Requests',
      meta: 'In progress',
      value: '2',
    },
  ],
  nextActions: [
    {
      icon: 'upload',
      title: 'Upload profile proof',
      meta: 'Identity document waiting for review',
      status: 'Due today',
      tone: 'warning',
    },
    {
      icon: 'message',
      title: 'Reply to admin message',
      meta: 'Waleed Khalid requested one account detail',
      status: 'Open',
      tone: 'neutral',
    },
    {
      icon: 'calendar',
      title: 'Confirm service appointment',
      meta: 'Scheduled for the next available slot',
      status: 'New',
      tone: 'success',
    },
  ],
  records: [
    {
      title: 'Account verification',
      meta: 'Updated today',
      status: 'Pending',
      tone: 'warning',
    },
    {
      title: 'Billing profile',
      meta: 'Synced yesterday',
      status: 'Active',
      tone: 'success',
    },
    {
      title: 'Support history',
      meta: '6 conversations',
      status: 'Open',
      tone: 'neutral',
    },
  ],
  message: {
    icon: 'bell',
    title: 'Admin reviewed your request',
    body: 'Your profile proof is being checked. The next update will appear here.',
  },
  supportItems: [
    {
      icon: 'shield',
      label: 'Account status',
      value: 'Protected',
    },
    {
      icon: 'card',
      label: 'Plan billing',
      value: 'Current',
    },
    {
      icon: 'support',
      label: 'Support SLA',
      value: '24 hours',
    },
  ],
}

function cloneData(data) {
  return JSON.parse(JSON.stringify(data))
}

async function loadMockData(data) {
  await new Promise((resolve) => {
    globalThis.setTimeout(resolve, MOCK_DATA_DELAY_MS)
  })

  return cloneData(data)
}

function getCustomerDisplayName(customer) {
  if (customer?.fullName) {
    return customer.fullName
  }

  if (customer?.email) {
    return customer.email.split('@')[0]
  }

  return 'Customer'
}

function buildCustomerDashboard(customer = {}) {
  const dashboard = cloneData(customerDashboardTemplate)

  dashboard.profile = {
    name: getCustomerDisplayName(customer),
    email: customer.email ?? 'Signed-in customer',
    roleLabel: customer.roleLabel ?? 'Customer',
  }

  return dashboard
}

export const appApi = createApi({
  reducerPath: 'appApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Dashboard', 'Profile', 'Customer', 'Record', 'Message', 'Request'],
  endpoints: (builder) => ({
    healthCheck: builder.query({
      queryFn: async () => ({
        data: {
          service: 'Supabase',
          configured: isSupabaseConfigured,
          clientReady: Boolean(supabase),
          invalidKeys: supabaseEnvStatus.invalidKeys,
          message: getSupabaseSetupMessage(),
          missingKeys: supabaseEnvStatus.missingKeys,
          projectHost: supabaseEnvStatus.projectHost,
        },
      }),
    }),
    getAdminDashboard: builder.query({
      queryFn: async () => ({
        data: await loadMockData(adminDashboardData),
      }),
      providesTags: [
        { type: 'Dashboard', id: 'ADMIN' },
        { type: 'Customer', id: 'LIST' },
        { type: 'Record', id: 'ADMIN' },
      ],
    }),
    getCustomerDashboard: builder.query({
      queryFn: async (customer) => ({
        data: await loadMockData(buildCustomerDashboard(customer)),
      }),
      providesTags: (_result, _error, customer) => [
        { type: 'Dashboard', id: 'CUSTOMER' },
        { type: 'Profile', id: customer?.email ?? 'CURRENT' },
        { type: 'Message', id: 'CUSTOMER' },
        { type: 'Request', id: 'CUSTOMER' },
        { type: 'Record', id: 'CUSTOMER' },
      ],
    }),
  }),
})

export const {
  useGetAdminDashboardQuery,
  useGetCustomerDashboardQuery,
  useHealthCheckQuery,
} = appApi
