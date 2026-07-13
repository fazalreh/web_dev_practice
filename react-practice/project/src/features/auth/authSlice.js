import { createSlice } from '@reduxjs/toolkit'

import { getRoleLabel, normalizeUserRole } from '../../lib/roles'

const initialState = {
  user: null,
  role: null,
  status: 'checking',
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthChecking(state) {
      state.status = 'checking'
      state.error = null
    },
    setSessionUser(state, action) {
      state.user = action.payload?.user ?? null
      state.role = state.user
        ? normalizeUserRole(action.payload?.role ?? state.user.user_metadata?.role)
        : null
      state.status = state.user ? 'authenticated' : 'guest'
      state.error = null
    },
    setAuthError(state, action) {
      state.error = action.payload ?? 'Authentication failed.'
      state.status = state.user ? 'authenticated' : 'guest'
    },
    clearSession(state) {
      state.user = null
      state.role = null
      state.status = 'guest'
      state.error = null
    },
  },
})

export const { clearSession, setAuthChecking, setAuthError, setSessionUser } =
  authSlice.actions

export const selectAuth = (state) => state.auth
export const selectIsAuthenticated = (state) =>
  state.auth.status === 'authenticated'
export const selectUserRole = (state) => state.auth.role
export const selectUserRoleLabel = (state) =>
  state.auth.role ? getRoleLabel(state.auth.role) : null
export const selectUserEmail = (state) => state.auth.user?.email ?? null

export default authSlice.reducer
