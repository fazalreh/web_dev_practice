import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'

import { isSupabaseConfigured, supabase } from '../../lib/supabaseClient'
import {
  getSupabaseSetupMessage,
  supabaseEnvStatus,
} from '../../lib/supabaseConfig'

export const appApi = createApi({
  reducerPath: 'appApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Profile', 'Customer', 'Record'],
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
  }),
})

export const { useHealthCheckQuery } = appApi
