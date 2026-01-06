/**
 * Brands API Contract
 * 
 * Shared contract for brands master data.
 */

import { z } from 'zod'

/**
 * Brand Item
 */
export const BrandItemSchema = z.object({
  code: z.string(),
  name: z.string(),
  isActive: z.boolean(),
})

export type BrandItem = z.infer<typeof BrandItemSchema>

/**
 * Brands List Response
 * GET /api/v1/brands
 */
export const BrandsListSchema = z.object({
  items: z.array(BrandItemSchema),
})

export type BrandsList = z.infer<typeof BrandsListSchema>
