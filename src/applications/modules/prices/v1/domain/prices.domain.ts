/**
 * Prices Domain Model
 * 
 * Internal domain representation for prices.
 * This is separate from the API contract and can evolve independently.
 */

import { Decimal } from 'decimal.js'

/**
 * Internal price record from database
 */
export interface PriceRecord {
  id: string
  brandCode: string
  priceType: 'SELL' | 'BUYBACK' | 'SPOT'
  denominationGram: Decimal
  price: number // Converted from BigInt
  priceAt: Date
  source: string | null
}

/**
 * Grouped price for a specific brand and denomination
 */
export interface BrandDenominationPrice {
  brand: string
  denominationGram: number
  sellPrice: number | null
  buybackPrice: number | null
}
