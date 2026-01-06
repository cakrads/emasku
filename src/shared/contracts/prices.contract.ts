/**
 * Prices API Contract
 * 
 * Shared contract between frontend and backend for price-related APIs.
 * This is the SINGLE SOURCE OF TRUTH for API shapes.
 * 
 * Rules:
 * - MUST NOT import Prisma types
 * - MUST NOT import frontend code
 * - MUST NOT include UI formatting logic
 * - MUST NOT include database concerns
 */

import { z } from 'zod'

/**
 * Price entry for a specific denomination
 */
export const PriceEntrySchema = z.object({
  denominationGram: z.number().positive(),
  sellPrice: z.number().int().nonnegative(),
  buybackPrice: z.number().int().nonnegative(),
})

export type PriceEntry = z.infer<typeof PriceEntrySchema>

/**
 * Brand price group
 */
export const BrandPriceGroupSchema = z.object({
  brand: z.string().min(1),
  prices: z.array(PriceEntrySchema).min(1),
})

export type BrandPriceGroup = z.infer<typeof BrandPriceGroupSchema>

/**
 * Today Prices Response
 * Matches GET /api/v1/price/today
 */
export const PricesTodayResponseSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  currency: z.literal('IDR'),
  brands: z.array(BrandPriceGroupSchema).min(1),
})

export type PricesTodayResponse = z.infer<typeof PricesTodayResponseSchema>
