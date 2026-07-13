import { createClient } from '@supabase/supabase-js'

import {
  getSupabaseSetupMessage,
  supabaseConfig,
  supabaseEnvStatus,
} from './supabaseConfig'

export const isSupabaseConfigured = supabaseEnvStatus.isConfigured

export const supabase = isSupabaseConfigured
  ? createClient(supabaseConfig.url, supabaseConfig.anonKey, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true,
      },
    })
  : null

export function getSupabaseClient() {
  if (!supabase) {
    throw new Error(getSupabaseSetupMessage())
  }

  return supabase
}
