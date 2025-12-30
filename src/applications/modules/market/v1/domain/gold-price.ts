/**
 * Gold Price Domain Model
 * 
 * Represents a single price record from the database,
 * converted to domain-friendly types (BigInt → number).
 */

import { PriceType } from '@prisma/client'
import { Decimal } from 'decimal.js'

export interface GoldPriceRecord {
  id: string
  brandCode: string
  priceType: PriceType
  denominationGram: Decimal
  price: number  // Converted from BigInt
  priceAt: Date
  source: string | null
}

/**
 * Today's price group for a specific brand and denomination
 */
export interface TodayPriceGroup {
  brand: string
  denominationGram: number
  sellPrice: number | null
  buybackPrice: number | null
}

export interface CreatePriceInput {
  brandCode: string
  priceType: PriceType
  denominationGram: Decimal | number
  price: number
  priceAt: Date
  source: string
  rawPayload: any
}
