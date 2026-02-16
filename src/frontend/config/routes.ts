/**
 * Centralized Route Configuration
 * 
 * Defines all application routes to ensure consistency and type safety.
 * Use these constants instead of hardcoding strings in components.
 */

export const ROUTES = {
  HOME: '/',

  // Auth
  LOGIN: '/login',

  // Main Navigation
  DASHBOARD: '/dashboard',
  PRICES: '/prices',
  PRICES_HISTORY: '/prices/history',
  HOLDINGS_LIST: '/holdings',
  BUYBACK_SIMULATION: '/buyback-simulation',

  // Goals
  GOALS_LIST: '/goals',
  GOAL_DETAIL: (id: string) => `/goals/${id}`,
  GOAL_EDIT: (id: string) => `/goals/${id}/edit`,
  ADD_GOAL: '/goals/create',

  // Deep Links / Future Placeholders
  HOLDING_DETAIL: (id: string) => `/holdings/${id}`,
  EDIT_HOLDING: (id: string) => `/holdings/${id}/edit`,
  BRAND_DETAIL: (code: string) => `/holdings?brand=${code}`,
  ADD_HOLDING: '/holdings/create',
  PROFILE: '/profile',
  PRIVACY_POLICY: '/privacy',
} as const

export type AppRoute = typeof ROUTES[keyof typeof ROUTES]
