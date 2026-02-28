/**
 * Create Holding Request Contract
 * 
 * Defines the request/response schema for creating new portfolio holdings.
 */

import { z } from 'zod'
import { ONE_DAY_MS } from '@/applications/shared/lib/constants'

/**
 * Create Holding Request Body
 * POST /api/v1/portfolio
 */
export const CreateHoldingRequestSchema = z.object({
  brandCode: z.string().min(1, 'Brand code is required'),
  denominationGram: z.number().positive('Weight must be greater than 0'),
  quantity: z.number().int().positive('Quantity must be at least 1').default(1),
  buyPrice: z.number().int().nonnegative('Buy price cannot be negative').optional(),
  buyDate: z.string().datetime('Invalid date format').refine(
    // Allow a small buffer (24h) to account for timezone differences where local today might be UTC future
    (date) => new Date(date).getTime() <= new Date().getTime() + ONE_DAY_MS,
    'Buy date cannot be in the future'
  ).nullable().optional(),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
  goalId: z.string().optional(),
})

export type CreateHoldingRequest = z.infer<typeof CreateHoldingRequestSchema>

/**
 * Create Holding Response
 */
export const CreateHoldingResponseSchema = z.object({
  id: z.string(),
  brandCode: z.string(),
  brandName: z.string(),
  denominationGram: z.number().positive(),
  quantity: z.number().int().positive(),
  buyPrice: z.number().int().nonnegative(),
  buyDate: z.string().nullable(),
  notes: z.string().nullable().optional(),
  goalId: z.string().nullable().optional(),
  createdAt: z.string(),
})

export type CreateHoldingResponse = z.infer<typeof CreateHoldingResponseSchema>
