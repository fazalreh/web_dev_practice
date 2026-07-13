import { createSlice } from '@reduxjs/toolkit'

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
      state.role = action.payload?.role ?? null
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
export const selectUserEmail = (state) => state.auth.user?.email ?? null

export default authSlice.reducer
