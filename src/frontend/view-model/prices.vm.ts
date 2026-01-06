/**
 * Prices View Model
 * 
 * Transforms API contract data into UI-friendly shapes.
 * ALL formatting and UI logic happens here.
 * 
 * MUST NOT mutate API types.
 */

import { PricesTodayResponse } from '@/shared/contracts/prices.contract'

/**
 * UI-friendly price entry
 */
export interface PriceEntryVM {
  denominationGram: number
  sellPrice: number
  buybackPrice: number
  sellPriceFormatted: string
  buybackPriceFormatted: string
  weightLabel: string
}

/**
 * UI-friendly brand price group
 */
export interface BrandPriceGroupVM {
  brandName: string
  prices: PriceEntryVM[]
}

/**
 * UI-friendly today prices
 */
export interface TodayPricesVM {
  lastUpdated: string // Formatted date
  brands: BrandPriceGroupVM[]
}

/**
 * Format IDR currency
 */
function formatIDR(value: number): string {
  if (value === 0) return '-'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Format date for display
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
  }).format(date)
}

/**
 * Transform API response to view model
 */
export function transformTodayPrices(apiData: PricesTodayResponse): TodayPricesVM {
  return {
    lastUpdated: formatDate(apiData.date),
    brands: apiData.brands.map((brandGroup) => ({
      brandName: brandGroup.brand,
      prices: brandGroup.prices
        .map((price) => ({
          denominationGram: price.denominationGram,
          sellPrice: price.sellPrice,
          buybackPrice: price.buybackPrice,
          sellPriceFormatted: formatIDR(price.sellPrice),
          buybackPriceFormatted: formatIDR(price.buybackPrice),
          weightLabel: `${price.denominationGram} g`,
        }))
        // Sort by weight ascending
        .sort((a, b) => a.denominationGram - b.denominationGram),
    })),
  }
}
