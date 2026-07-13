import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'

import { isSupabaseConfigured, supabase } from '../../lib/supabaseClient'

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
        },
      }),
    }),
  }),
})

export const { useHealthCheckQuery } = appApi
