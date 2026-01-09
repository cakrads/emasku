/**
 * Supported Brand Constants
 * 
 * Single source of truth for all gold brands in the system.
 * Prevents typos and ensures consistency.
 */

export const BRAND_CONFIG = [
  { code: 'ANTAM', name: 'Antam', isActive: true },
  { code: 'UBS', name: 'UBS Gold', isActive: true },
  { code: 'GALERI24', name: 'Galeri 24', isActive: true },
  { code: 'LOTUS_ARCHI', name: 'Lotus Archi', isActive: true },
  { code: 'OTHER', name: 'Custom Brand', isActive: true },
] as const

// Derived type for BrandCode (e.g., "ANTAM" | "UBS" | ...)
export type BrandCode = typeof BRAND_CONFIG[number]['code']

/**
 * Helper to get brand name by code
 */
export const getBrandName = (code: string): string => {
  const brand = BRAND_CONFIG.find(b => b.code === code)
  return brand ? brand.name : code
}

/**
 * Helper to check if a brand code is valid
 */
export const isValidBrand = (code: string): boolean => {
  return BRAND_CONFIG.some(b => b.code === code)
}
