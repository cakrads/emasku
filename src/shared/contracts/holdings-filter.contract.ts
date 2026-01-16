/**
 * Holdings Filter Contract
 * 
 * Shared filter parameters used by both Holdings List and Portfolio Summary APIs.
 * This ensures consistent data context across the Holdings page.
 */

import { z } from 'zod'

/**
 * Filter schema for holdings queries.
 * All parameters are optional and composable.
 */
export const HoldingsFilterSchema = z.object({
  status: z.enum(['active', 'sold', 'all']).optional().default('active'),
  brandCodes: z.array(z.string()).optional(),
  dateFrom: z.string().optional(), // ISO date string
  dateTo: z.string().optional(),   // ISO date string
})

export type HoldingsFilter = z.infer<typeof HoldingsFilterSchema>

/**
 * Pagination request schema.
 */
export const PaginationRequestSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().max(100).optional().default(20),
})

export type PaginationRequest = z.infer<typeof PaginationRequestSchema>

/**
 * Pagination metadata in responses.
 */
export const PaginationMetaSchema = z.object({
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  totalItems: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
})

export type PaginationMeta = z.infer<typeof PaginationMetaSchema>
