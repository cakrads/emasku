import { z } from 'zod'

/**
 * Zod Schema to validate deserialized gold price items from Galeri24.
 * This ensures that even if the upstream source format changes (e.g., negative prices, missing fields),
 * we catch it early before polluting the database.
 */
export const GoldPriceItemSchema = z.object({
  id: z.string().min(1),
  price: z.number().nonnegative("Price must be non-negative"),
  sellingPrice: z.number().nonnegative("Selling price must be non-negative"),
  buybackPrice: z.number().nonnegative("Buyback price must be non-negative"),
  description: z.string().nullable().optional(),
  vendorCode: z.string(),
  date: z.string().optional(),
  denomination: z.number().positive("Denomination must be positive"),
  status: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  vendorName: z.string().min(1, "Vendor name is required"),
})

export type ValidatedGoldPriceItem = z.infer<typeof GoldPriceItemSchema>
