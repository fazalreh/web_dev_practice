import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  role: null,
  status: 'guest',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSessionUser(state, action) {
      state.user = action.payload?.user ?? null
      state.role = action.payload?.role ?? null
      state.status = state.user ? 'authenticated' : 'guest'
    },
    clearSession(state) {
      state.user = null
      state.role = null
      state.status = 'guest'
    },
  },
})

export const { setSessionUser, clearSession } = authSlice.actions

export const selectAuth = (state) => state.auth

export default authSlice.reducer
