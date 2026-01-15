/**
 * Portfolio API Contracts
 * 
 * Shared contracts between frontend and backend for portfolio-related APIs.
 * This is the SINGLE SOURCE OF TRUTH for portfolio API shapes.
 */

import { z } from 'zod'

export const BrandAllocationSchema = z.object({
  brandCode: z.string(),
  brandName: z.string(),
  totalGrams: z.number().positive(),
  currentValue: z.number().int().nonnegative(),
  valuationSource: z.enum(['BUYBACK', 'SPOT', 'USER', 'NONE', 'MIXED']),
  // We can add delta if needed, for now optional or derived
  deltaValue: z.number().int().default(0),
  deltaPercentage: z.number().default(0),
})

export type BrandAllocation = z.infer<typeof BrandAllocationSchema>

/**
 * Portfolio Summary Response
 * GET /api/v1/portfolio/summary
 */
export const PortfolioSummarySchema = z.object({
  totalBuyValue: z.number().int().nonnegative(),
  totalCurrentValue: z.number().int().nonnegative(),
  totalPnL: z.number().int(),
  pnlPercentage: z.number(),
  totalDailyPnL: z.number().int(),
  totalDailyPnLPercentage: z.number(),
  totalWeightGram: z.number().nonnegative(),
  brandAllocation: z.array(BrandAllocationSchema),
  disclaimer: z.string().optional(),
  excludedCount: z.number().int().default(0),
  lastUpdated: z.string().optional(), // ISO datetime
})

export type PortfolioSummary = z.infer<typeof PortfolioSummarySchema>

/**
 * Holding Item in Portfolio List
 */
export const HoldingItemSchema = z.object({
  id: z.string(),
  brand: z.string(),
  brandName: z.string(),
  denominationGram: z.number().positive(),
  quantity: z.number().int().positive(),
  buyDate: z.string(), // ISO date
  avgBuyPrice: z.number().int().nonnegative(),
  currentBuybackPrice: z.number().int().nonnegative().nullable(),
  totalBuyValue: z.number().int().nonnegative(),
  currentValue: z.number().int().nonnegative().nullable(),
  unrealizedPnL: z.number().int().nullable(),
  pnlPercentage: z.number().nullable(),
  valuationSource: z.enum(['BUYBACK', 'SPOT', 'USER', 'NONE', 'MIXED']),
  priceAsOf: z.string().nullable(), // ISO datetime
  soldAt: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
})

export type HoldingItem = z.infer<typeof HoldingItemSchema>

/**
 * Portfolio List Response
 * GET /api/v1/portfolio
 */
export const PortfolioListSchema = z.object({
  currency: z.literal('IDR'),
  items: z.array(HoldingItemSchema),
})

export type PortfolioList = z.infer<typeof PortfolioListSchema>

/**
 * Holding Detail Response
 * GET /api/v1/portfolio/{id}
 */
export const HoldingDetailSchema = HoldingItemSchema

export type HoldingDetail = z.infer<typeof HoldingDetailSchema>

/**
 * Portfolio History Response
 * GET /api/v1/portfolio/history
 */
/**
 * Portfolio History Item
 */
export const HistoryItemSchema = z.object({
  date: z.string(),
  brandCode: z.string(),
  brandName: z.string(),
  denominationGram: z.number().positive(),
  quantity: z.number().int().positive(),
  buyValue: z.number().int().nonnegative(),
  notes: z.string().nullable().optional(),
})

export const PortfolioHistorySchema = z.object({
  timeline: z.array(HistoryItemSchema),
})

export type PortfolioHistory = z.infer<typeof PortfolioHistorySchema>
