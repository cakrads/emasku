/**
 * Centralized Route Configuration
 * 
 * Defines all application routes to ensure consistency and type safety.
 * Use these constants instead of hardcoding strings in components.
 */

export const ROUTES = {
  // Main Navigation
  DASHBOARD: '/',
  PRICES: '/prices',
  PRICES_HISTORY: '/prices/history',
  HOLDINGS: '/holdings',

  // Deep Links / Future Placeholders
  HOLDINGS_DETAIL: (id: string) => `/holdings/${id}`,
  BRAND_DETAIL: (id: string) => `/holdings/brands/${id}`,
  ADD_HOLDING: '/add-holding',
} as const

export type AppRoute = typeof ROUTES[keyof typeof ROUTES]
