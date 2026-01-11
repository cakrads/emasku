'use client'

/**
 * Auth Provider
 * 
 * React context provider that initializes auth and subscribes to changes.
 * Must be wrapped around the app to provide auth state.
 */

import { useEffect, createContext, useContext, type ReactNode } from 'react'
import { useAuthStore } from './auth.store'
import { getSession, onAuthStateChange } from '@/frontend/services/auth/auth.api'
import type { AuthSession } from '@/applications/shared/auth'

interface AuthContextValue {
  isInitialized: boolean
}

const AuthContext = createContext<AuthContextValue>({ isInitialized: false })

export function useAuthContext() {
  return useContext(AuthContext)
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const setSession = useAuthStore((state) => state.setSession)
  const setError = useAuthStore((state) => state.setError)
  const status = useAuthStore((state) => state.status)

  // Initialize auth state on mount
  useEffect(() => {
    let mounted = true

    async function initializeAuth() {
      const result = await getSession()

      if (!mounted) return

      if (result.success) {
        setSession(result.data)
      } else {
        setError(result.error)
        setSession(null)
      }
    }

    initializeAuth()

    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChange((session: AuthSession | null) => {
      if (mounted) {
        setSession(session)
      }
    })

    return () => {
      mounted = false
      unsubscribe()
    }
  }, [setSession, setError])

  const isInitialized = status !== 'loading'

  return (
    <AuthContext.Provider value={{ isInitialized }}>
      {children}
    </AuthContext.Provider>
  )
}
