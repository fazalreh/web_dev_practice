import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { isSupabaseConfigured, supabase } from '../../lib/supabaseClient'
import {
  clearSession,
  setAuthChecking,
  setAuthError,
  setSessionUser,
} from './authSlice'

function getSessionPayload(session) {
  const user = session?.user ?? null

  return {
    user,
    role: user?.user_metadata?.role ?? null,
  }
}

function AuthProvider({ children }) {
  const dispatch = useDispatch()

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      dispatch(clearSession())
      return undefined
    }

    let isMounted = true

    async function loadSession() {
      dispatch(setAuthChecking())

      const { data, error } = await supabase.auth.getSession()

      if (!isMounted) {
        return
      }

      if (error) {
        dispatch(setAuthError(error.message))
        return
      }

      dispatch(setSessionUser(getSessionPayload(data.session)))
    }

    loadSession()

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setSessionUser(getSessionPayload(session)))
    })

    return () => {
      isMounted = false
      data.subscription.unsubscribe()
    }
  }, [dispatch])

  return children
}

export default AuthProvider
