/**
 * Market Snapshot Domain Entity
 * 
 * Pure domain model representing the current state of the gold market.
 * Used for the homepage overview.
 * 
 * IMPORTANT: This is a pure TypeScript object with no framework dependencies.
 */

export interface MarketSnapshot {
  /**
   * Reference brand for market overview (typically ANTAM)
   */
  referenceBrand: string

  /**
   * Latest spot price in IDR (per gram)
   */
  spotPrice: number

  /**
   * Price change in last 24 hours (IDR)
   * Null if no historical data available
   */
  delta24h: number | null

  /**
   * Percentage change in last 24 hours
   * Null if no historical data available
   */
  deltaPercentage: number | null

  /**
   * Timestamp of the latest price
   */
  lastUpdated: Date

  /**
   * Detailed price list for today (SELL/BUYBACK by brand/denom)
   */
  details?: import('./gold-price').TodayPriceGroup[]
}
