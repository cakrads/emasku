/**
 * Sell Holding API Contracts
 * 
 * Shared contracts between frontend and backend for sell holding APIs.
 */

import { z } from 'zod'

/**
 * Single Sell Holding Request
 * POST /api/v1/portfolio/{id}/sell
 */
export const SellHoldingRequestSchema = z.object({
    sellPrice: z.number().positive('Sell price must be greater than 0'),
    sellDate: z.string().min(1, 'Sell date is required'), // ISO date string YYYY-MM-DD
    notes: z.string().optional(),
})

export type SellHoldingRequest = z.infer<typeof SellHoldingRequestSchema>

/**
 * Single Sell Holding Response
 */
export const SellHoldingResponseSchema = z.object({
    id: z.string(),
    realizedPnL: z.number(),
    realizedPnLPercentage: z.number(),
    status: z.literal('SOLD'),
})

export type SellHoldingResponse = z.infer<typeof SellHoldingResponseSchema>

/**
 * Bulk Sell Holdings Request
 * POST /api/v1/portfolio/bulk-sell
 */
export const BulkSellHoldingRequestSchema = z.object({
    items: z.array(z.object({
        id: z.string(),
        sellPrice: z.number().positive('Sell price must be greater than 0'),
    })).min(1, 'At least one holding must be selected'),
    sellDate: z.string().min(1, 'Sell date is required'),
    notes: z.string().optional(),
})

export type BulkSellHoldingRequest = z.infer<typeof BulkSellHoldingRequestSchema>

/**
 * Bulk Sell Holdings Response
 */
export const BulkSellResultItemSchema = z.object({
    id: z.string(),
    status: z.enum(['SOLD', 'FAILED']),
    realizedPnL: z.number().optional(),
    error: z.string().optional(),
})

export const BulkSellHoldingResponseSchema = z.object({
    results: z.array(BulkSellResultItemSchema),
})

export type BulkSellHoldingResponse = z.infer<typeof BulkSellHoldingResponseSchema>
