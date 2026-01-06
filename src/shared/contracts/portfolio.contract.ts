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
  valuationSource: z.enum(['OFFICIAL', 'SPOT', 'USER', 'UNVALUED']),
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
  totalWeightGram: z.number().positive(),
  brandAllocation: z.array(BrandAllocationSchema),
  disclaimer: z.string().optional(),
  excludedCount: z.number().int().default(0),
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
  currentBuybackPrice: z.number().int().nonnegative(),
  totalBuyValue: z.number().int().nonnegative(),
  currentValue: z.number().int().nonnegative(),
  unrealizedPnL: z.number().int(),
  pnlPercentage: z.number(),
  notes: z.string().optional(),
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
export const PortfolioHistoryPointSchema = z.object({
  date: z.string(), // ISO Date YYYY-MM-DD
  value: z.number().int().nonnegative(),
})

export const PortfolioHistorySchema = z.object({
  brandBreakdown: z.array(z.string()).optional(), // Optional: if we want multi-line chart later
  series: z.array(PortfolioHistoryPointSchema),
})

export type PortfolioHistory = z.infer<typeof PortfolioHistorySchema>
