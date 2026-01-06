/**
 * Market API Contracts
 * 
 * Shared contracts for market-related APIs.
 */

import { z } from 'zod'

/**
 * Market Overview Response
 * GET /api/v1/market/overview
 */
export const MarketOverviewSchema = z.object({
  referenceBrand: z.string(),
  spotPrice: z.number().int().positive(),
  delta24h: z.number().int(),
  deltaPercentage: z.number(),
  lastUpdated: z.string(), // ISO datetime
})

export type MarketOverview = z.infer<typeof MarketOverviewSchema>

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
 * GET /api/v1/price/spot
 */
export const SpotPriceSeriesSchema = z.object({
  brand: z.string(),
  priceType: z.literal('SPOT'),
  denominationGram: z.number().positive(),
  currency: z.literal('IDR'),
  series: z.array(PricePointSchema),
})

export type SpotPriceSeries = z.infer<typeof SpotPriceSeriesSchema>
