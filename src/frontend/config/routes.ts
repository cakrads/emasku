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
  DASHBOARD: '/',
  PRICES: '/prices',
  PRICES_HISTORY: '/prices/history',
  HOLDINGS_LIST: '/holdings',

  // Deep Links / Future Placeholders
  HOLDING_DETAIL: (id: string) => `/holdings/${id}`,
  EDIT_HOLDING: (id: string) => `/holdings/${id}/edit`,
  BRAND_DETAIL: (id: string) => `/holdings/brands/${id}`,
  ADD_HOLDING: '/add-holding',
} as const

export type AppRoute = typeof ROUTES[keyof typeof ROUTES]
