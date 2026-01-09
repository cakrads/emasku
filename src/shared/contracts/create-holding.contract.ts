/**
 * Create Holding Request Contract
 * 
 * Defines the request/response schema for creating new portfolio holdings.
 */

import { z } from 'zod'

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
    (date) => new Date(date) <= new Date(),
    'Buy date cannot be in the future'
  ).optional(),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
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
  buyDate: z.string(),
  notes: z.string().nullable().optional(),
  createdAt: z.string(),
})

export type CreateHoldingResponse = z.infer<typeof CreateHoldingResponseSchema>
