/**
 * Centralized Route Configuration
 * 
 * Defines all application routes to ensure consistency and type safety.
 * Use these constants instead of hardcoding strings in components.
 */

export const ROUTES = {
  // Auth
  LOGIN: '/login',

  // Main Navigation
  DASHBOARD: '/dashboard',
  PRICES: '/prices',
  PRICES_HISTORY: '/prices/history',
  HOLDINGS_LIST: '/holdings',

  // Deep Links / Future Placeholders
  HOLDING_DETAIL: (id: string) => `/holdings/${id}`,
  EDIT_HOLDING: (id: string) => `/holdings/${id}/edit`,
  BRAND_DETAIL: (code: string) => `/holdings?brand=${code}`,
  ADD_HOLDING: '/holdings/create',
  PROFILE: '/profile',
  PRIVACY_POLICY: '/privacy',
} as const

export type AppRoute = typeof ROUTES[keyof typeof ROUTES]
