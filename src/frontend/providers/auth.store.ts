/**
 * Auth Store
 * 
 * Zustand store for reactive auth state.
 * No API calls here - state only.
 */

import { create } from 'zustand'
import type { AuthUser, AuthSession, AuthStatus, AuthError } from '@/applications/shared/auth'

interface AuthStoreState {
  status: AuthStatus
  user: AuthUser | null
  session: AuthSession | null
  error: AuthError | null
}

interface AuthStoreActions {
  setSession: (session: AuthSession | null) => void
  setError: (error: AuthError | null) => void
  setLoading: () => void
  reset: () => void
}

type AuthStore = AuthStoreState & AuthStoreActions

const initialState: AuthStoreState = {
  status: 'loading',
  user: null,
  session: null,
  error: null,
}

export const useAuthStore = create<AuthStore>((set) => ({
  ...initialState,

  setSession: (session) => set({
    status: session ? 'authenticated' : 'unauthenticated',
    user: session?.user ?? null,
    session,
    error: null,
  }),

  setError: (error) => set({
    error,
  }),

  setLoading: () => set({
    status: 'loading',
    error: null,
  }),

  reset: () => set(initialState),
}))

/**
 * Selectors for common auth state queries
 */
export const selectIsAuthenticated = (state: AuthStore) =>
  state.status === 'authenticated'

export const selectIsLoading = (state: AuthStore) =>
  state.status === 'loading'

export const selectIsGuest = (state: AuthStore) =>
  state.user?.isGuest ?? false

export const selectUser = (state: AuthStore) =>
  state.user

export const selectError = (state: AuthStore) =>
  state.error
