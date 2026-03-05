/**
 * Price Repository Interface (Port)
 * 
 * Defines the contract for price data access.
 * Usecases depend on this interface, NOT on Prisma directly.
 * This enables testability and swappable implementations.
 */

import { Decimal } from 'decimal.js'
import { GoldPriceRecord, TodayPriceGroup, CreatePriceInput } from '../domain/gold-price'

export interface IPriceRepository {

  /**
   * Get a price at or before a specific timestamp
   */
  getPriceAt(
    brandCode: string,
    denominationGram: Decimal,
    timestamp: Date
  ): Promise<GoldPriceRecord | null>

  /**
   * Get time-series spot prices for charting
   */
  getSpotPriceSeries(
    brandCode: string,
    from: Date,
    to: Date,
    denominationGram: Decimal
  ): Promise<GoldPriceRecord[]>

  /**
   * Get today's sell and buyback prices grouped by brand and denomination
   */
  getTodayPrices(
    brandCode?: string,
    denominationGram?: Decimal
  ): Promise<TodayPriceGroup[]>

  /**
   * Persist multiple price records with insert-only + skipDuplicates strategy
   */
  saveBatch(prices: CreatePriceInput[]): Promise<{
    inserted: number
    skipped: number
  }>

  /**
   * Get all active brand/gram combinations
   */
  getActiveBrandGramCombinations(): Promise<Array<{ brandCode: string, denominationGram: Decimal }>>

  /**
   * Get the latest price for specific types within a date range
   */
  findLatestPriceForTypes(
    brandCode: string,
    denominationGram: Decimal,
    candidateTypes: string[],
    start: Date,
    end: Date
  ): Promise<{ price: number, priceAt: Date } | null>
}
