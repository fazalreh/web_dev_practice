import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'

import { isSupabaseConfigured, supabase } from '../../lib/supabaseClient'
import {
  getSupabaseSetupMessage,
  supabaseEnvStatus,
} from '../../lib/supabaseConfig'
import { USER_ROLES } from '../../lib/roles'

const MOCK_DATA_DELAY_MS = 160

let nextServiceRequestId = 104

let serviceRequests = [
  {
    id: 'req-101',
    title: 'Verify profile details',
    category: 'Profile',
    details: 'Customer uploaded a profile proof and needs admin review.',
    priority: 'high',
    status: 'in_review',
    ownerEmail: 'waleed@example.com',
    ownerName: 'Waleed Khalid',
    updatedAt: 'Today',
  },
  {
    id: 'req-102',
    title: 'Update billing email',
    category: 'Billing',
    details: 'Customer wants the monthly statement sent to a new email address.',
    priority: 'normal',
    status: 'open',
    ownerEmail: 'customer@example.com',
    ownerName: 'Practice Customer',
    updatedAt: 'Yesterday',
  },
  {
    id: 'req-103',
    title: 'Close old support thread',
    category: 'Support',
    details: 'Previous support case has been resolved and can be archived.',
    priority: 'low',
    status: 'resolved',
    ownerEmail: 'waleed@example.com',
    ownerName: 'Waleed Khalid',
    updatedAt: 'Last week',
  },
]

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

function getApiError(message, status = 400) {
  return {
    error: {
      status,
      data: {
        message,
      },
    },
  }
}

async function loadMockData(data) {
  await new Promise((resolve) => {
    globalThis.setTimeout(resolve, MOCK_DATA_DELAY_MS)
  })

  return cloneData(data)
}

async function waitForMockData() {
  await new Promise((resolve) => {
    globalThis.setTimeout(resolve, MOCK_DATA_DELAY_MS)
  })
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
  const visibleRequests = getVisibleServiceRequests({
    role: USER_ROLES.CUSTOMER,
    email: customer.email,
    name: customer.fullName,
  })
  const activeRequests = visibleRequests.filter((request) => request.status !== 'resolved')
  const requestsStat = dashboard.stats.find((stat) => stat.label === 'Requests')

  if (requestsStat) {
    requestsStat.value = String(activeRequests.length)
    requestsStat.meta = activeRequests.length === 1 ? '1 active request' : `${activeRequests.length} active requests`
  }

  dashboard.profile = {
    name: getCustomerDisplayName(customer),
    email: customer.email ?? 'Signed-in customer',
    roleLabel: customer.roleLabel ?? 'Customer',
  }

  return dashboard
}

function buildAdminDashboard() {
  const dashboard = cloneData(adminDashboardData)
  const approvalsStat = dashboard.stats.find((stat) => stat.label === 'Approvals')

  if (approvalsStat) {
    approvalsStat.value = String(
      serviceRequests.filter((request) => request.status === 'in_review').length,
    )
  }

  return dashboard
}

function makeServiceRequestId() {
  const id = `req-${nextServiceRequestId}`
  nextServiceRequestId += 1

  return id
}

function normalizeServiceRequestText(value) {
  return String(value ?? '').trim()
}

function getRequestOwnerName(actor = {}) {
  return actor.name || getCustomerDisplayName({ email: actor.email })
}

function ensureCustomerServiceRequest(actor = {}) {
  if (actor.role !== USER_ROLES.CUSTOMER || !actor.email) {
    return
  }

  const hasExistingRequest = serviceRequests.some(
    (request) => request.ownerEmail === actor.email,
  )

  if (hasExistingRequest) {
    return
  }

  serviceRequests = [
    {
      id: makeServiceRequestId(),
      title: 'Confirm account details',
      category: 'Profile',
      details: 'Review the account profile and send the first support request.',
      priority: 'normal',
      status: 'open',
      ownerEmail: actor.email,
      ownerName: getRequestOwnerName(actor),
      updatedAt: 'Just now',
    },
    ...serviceRequests,
  ]
}

function getVisibleServiceRequests(actor = {}) {
  ensureCustomerServiceRequest(actor)

  if (actor.role === USER_ROLES.ADMIN) {
    return serviceRequests
  }

  if (actor.role === USER_ROLES.CUSTOMER && actor.email) {
    return serviceRequests.filter((request) => request.ownerEmail === actor.email)
  }

  return []
}

function isCustomerOwnedOpenRequest(request, actor = {}) {
  return (
    actor.role === USER_ROLES.CUSTOMER &&
    request.ownerEmail === actor.email &&
    request.status === 'open'
  )
}

function canChangeServiceRequest(request, actor = {}) {
  return actor.role === USER_ROLES.ADMIN || isCustomerOwnedOpenRequest(request, actor)
}

function canDeleteServiceRequest(request, actor = {}) {
  return actor.role === USER_ROLES.ADMIN || isCustomerOwnedOpenRequest(request, actor)
}

function getServiceRequestTags(actor = {}) {
  const tags = [
    { type: 'Request', id: 'LIST' },
    { type: 'Dashboard', id: 'ADMIN' },
    { type: 'Dashboard', id: 'CUSTOMER' },
  ]

  if (actor.email) {
    tags.push({ type: 'Request', id: `USER-${actor.email}` })
  }

  return tags
}

function buildServiceRequest(input = {}, actor = {}) {
  return {
    id: makeServiceRequestId(),
    title: normalizeServiceRequestText(input.title),
    category: normalizeServiceRequestText(input.category) || 'General',
    details: normalizeServiceRequestText(input.details),
    priority: input.priority || 'normal',
    status: 'open',
    ownerEmail: actor.email,
    ownerName: getRequestOwnerName(actor),
    updatedAt: 'Just now',
  }
}

function getEditableServiceRequestFields(changes = {}, actor = {}) {
  const allowedFields =
    actor.role === USER_ROLES.ADMIN
      ? ['title', 'category', 'details', 'priority', 'status']
      : ['title', 'category', 'details', 'priority']

  return Object.fromEntries(
    allowedFields
      .filter((field) => Object.hasOwn(changes, field))
      .map((field) => [field, normalizeServiceRequestText(changes[field]) || changes[field]]),
  )
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
        data: await loadMockData(buildAdminDashboard()),
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
    getServiceRequests: builder.query({
      queryFn: async (actor) => ({
        data: {
          items: await loadMockData(getVisibleServiceRequests(actor)),
        },
      }),
      providesTags: (result, _error, actor) => [
        ...getServiceRequestTags(actor),
        ...(result?.items?.map((request) => ({
          type: 'Request',
          id: request.id,
        })) ?? []),
      ],
    }),
    createServiceRequest: builder.mutation({
      queryFn: async ({ actor, request }) => {
        await waitForMockData()

        if (actor?.role !== USER_ROLES.CUSTOMER) {
          return getApiError('Only customers can create service requests.', 403)
        }

        if (!actor?.email) {
          return getApiError('A signed-in customer is required.', 401)
        }

        const nextRequest = buildServiceRequest(request, actor)

        if (!nextRequest.title || !nextRequest.details) {
          return getApiError('Request title and details are required.')
        }

        serviceRequests = [nextRequest, ...serviceRequests]

        return {
          data: cloneData(nextRequest),
        }
      },
      invalidatesTags: (_result, _error, { actor }) => getServiceRequestTags(actor),
    }),
    updateServiceRequest: builder.mutation({
      queryFn: async ({ actor, changes, id }) => {
        await waitForMockData()

        const request = serviceRequests.find((item) => item.id === id)

        if (!request) {
          return getApiError('Service request was not found.', 404)
        }

        if (!canChangeServiceRequest(request, actor)) {
          return getApiError('This role cannot update that service request.', 403)
        }

        const nextChanges = getEditableServiceRequestFields(changes, actor)

        if (Object.hasOwn(nextChanges, 'title') && !nextChanges.title) {
          return getApiError('Request title is required.')
        }

        if (Object.hasOwn(nextChanges, 'details') && !nextChanges.details) {
          return getApiError('Request details are required.')
        }

        const updatedRequest = {
          ...request,
          ...nextChanges,
          updatedAt: 'Just now',
        }

        serviceRequests = serviceRequests.map((item) =>
          item.id === id ? updatedRequest : item,
        )

        return {
          data: cloneData(updatedRequest),
        }
      },
      invalidatesTags: (_result, _error, { actor, id }) => [
        ...getServiceRequestTags(actor),
        { type: 'Request', id },
      ],
    }),
    deleteServiceRequest: builder.mutation({
      queryFn: async ({ actor, id }) => {
        await waitForMockData()

        const request = serviceRequests.find((item) => item.id === id)

        if (!request) {
          return getApiError('Service request was not found.', 404)
        }

        if (!canDeleteServiceRequest(request, actor)) {
          return getApiError('This role cannot delete that service request.', 403)
        }

        serviceRequests = serviceRequests.filter((item) => item.id !== id)

        return {
          data: cloneData(request),
        }
      },
      invalidatesTags: (_result, _error, { actor, id }) => [
        ...getServiceRequestTags(actor),
        { type: 'Request', id },
      ],
    }),
  }),
})

export const {
  useCreateServiceRequestMutation,
  useDeleteServiceRequestMutation,
  useGetAdminDashboardQuery,
  useGetCustomerDashboardQuery,
  useGetServiceRequestsQuery,
  useHealthCheckQuery,
  useUpdateServiceRequestMutation,
} = appApi
