'use client'

/**
 * Auth Hook
 * 
 * Consumes auth store and provides convenient auth methods.
 * No business logic here - just state access and actions.
 */

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore, selectIsAuthenticated, selectIsLoading, selectIsGuest, selectUser, selectError } from '@/frontend/providers/auth.store'
import { signOut as apiSignOut } from '@/frontend/services/auth/auth.api'
import { ROUTES } from '@/frontend/config/routes'

export function useAuth() {
  const router = useRouter()

  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const isLoading = useAuthStore(selectIsLoading)
  const isGuest = useAuthStore(selectIsGuest)
  const user = useAuthStore(selectUser)
  const error = useAuthStore(selectError)
  const setSession = useAuthStore((state) => state.setSession)

  const logout = useCallback(async () => {
    const result = await apiSignOut()

    if (result.success) {
      setSession(null)
      router.push(ROUTES.LOGIN)
    }

    return result
  }, [setSession, router])

  return {
    // State
    isAuthenticated,
    isLoading,
    isGuest,
    user,
    error,

    // Actions
    logout,
  }
}
