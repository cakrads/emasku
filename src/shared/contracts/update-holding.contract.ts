/**
 * Update Holding Request Contract
 * 
 * Defines the request/response schema for updating existing portfolio holdings.
 */

import { z } from 'zod'

/**
 * Update Holding Request Body
 * PUT /api/v1/portfolio/{id}
 * 
 * Note: brandCode is immutable and cannot be changed after creation
 */
export const UpdateHoldingRequestSchema = z.object({
  denominationGram: z.number().positive('Weight must be greater than 0').optional(),
  quantity: z.number().int().positive('Quantity must be at least 1').optional(),
  buyPrice: z.number().int().nonnegative('Buy price cannot be negative').optional(),
  buyDate: z.string().datetime('Invalid date format').refine(
    // Allow a small buffer (24h) to account for timezone differences where local today might be UTC future
    (date) => new Date(date).getTime() <= new Date().getTime() + 86_400_000,
    'Buy date cannot be in the future'
  ).nullable().optional(),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
  goalId: z.string().nullable().optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  'At least one field must be provided for update'
)

export type UpdateHoldingRequest = z.infer<typeof UpdateHoldingRequestSchema>

/**
 * Update Holding Response
 */
export const UpdateHoldingResponseSchema = z.object({
  id: z.string(),
  brandCode: z.string(),
  brandName: z.string(),
  denominationGram: z.number().positive(),
  quantity: z.number().int().positive(),
  buyPrice: z.number().int().nonnegative(),
  buyDate: z.string().nullable(),
  notes: z.string().nullable().optional(),
  goalId: z.string().nullable().optional(),
  updatedAt: z.string(),
})

export type UpdateHoldingResponse = z.infer<typeof UpdateHoldingResponseSchema>
