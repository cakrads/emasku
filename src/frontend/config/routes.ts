/**
 * Centralized route configuration
 * This ensures consistency across the application
 */

export const ROUTES = {
  DASHBOARD: '/',
  BRANDS_LIST: '/brands', // If we ever have a brand list page
  BRAND_DETAIL: (brandId: string) => `/brands/${brandId}`,
  HOLDINGS_LIST: '/holdings',
  HOLDING_DETAIL: (holdingId: string) => `/holdings/${holdingId}`,
  EDIT_HOLDING: (holdingId: string) => `/holdings/${holdingId}/edit`,
}
