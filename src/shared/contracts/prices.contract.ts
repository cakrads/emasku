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
  sellPrice: z.number().int().nonnegative().nullable(),
  buybackPrice: z.number().int().nonnegative().nullable(),
  sellDelta: z.number().int().nullable().default(null),
  buybackDelta: z.number().int().nullable().default(null),
})

export type PriceEntry = z.infer<typeof PriceEntrySchema>

/**
 * Brand price group
 */
export const BrandPriceGroupSchema = z.object({
  brand: z.string().min(1),
  displayName: z.string().trim().min(1).optional(),
  prices: z.array(PriceEntrySchema).min(1),
})

export type BrandPriceGroup = z.infer<typeof BrandPriceGroupSchema>

/**
 * Today Prices Response
 * Matches GET /api/v1/prices/today
 */
export const PricesTodayResponseSchema = z.object({
  date: z.string(), // ISO datetime preferred for high-precision "Updated at"
  currency: z.literal('IDR'),
  brands: z.array(BrandPriceGroupSchema).min(1),
})

export type PricesTodayResponse = z.infer<typeof PricesTodayResponseSchema>

/**
 * Price Point for time series
 */
export const PricePointSchema = z.object({
  priceAt: z.string(), // ISO datetime
  price: z.number().int().positive(),
})

export type PricePoint = z.infer<typeof PricePointSchema>

/**
 * Spot Price Series Response
 * Matches GET /api/v1/prices/spot
 */
export const SpotPriceSeriesSchema = z.object({
  brand: z.string(),
  priceType: z.literal('SELL'),
  denominationGram: z.number().positive(),
  currency: z.literal('IDR'),
  series: z.array(PricePointSchema),
})

export type SpotPriceSeries = z.infer<typeof SpotPriceSeriesSchema>
