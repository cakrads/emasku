/**
 * Prices View Model
 * 
 * Transforms API contract data into UI-friendly shapes.
 * ALL formatting and UI logic happens here.
 * 
 * MUST NOT mutate API types.
 */

import { PricesTodayResponse, SpotPriceSeries } from '@/shared/contracts/prices.contract'

// ... (other VM interfaces)

/**
 * UI-friendly spot price series
 */
export interface PricePointVM {
  date: string // Formatted date
  price: number
  priceFormatted: string
}

export interface SpotPriceSeriesVM {
  brand: string
  weight: string
  points: PricePointVM[]
}

/**
 * Transform API spot series to view model
 */
export function transformSpotPriceSeries(api: SpotPriceSeries, locale: string = 'id-ID'): SpotPriceSeriesVM {
  return {
    brand: api.brand,
    weight: `${api.denominationGram} g`,
    points: api.series.map((point) => ({
      date: formatDate(point.priceAt, locale),
      price: point.price,
      priceFormatted: formatIDR(point.price, locale),
    })),
  }
}

/**
 * UI-friendly price entry
 */
export interface PriceEntryVM {
  denominationGram: number
  sellPrice: number | null
  buybackPrice: number | null
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
function formatIDR(value: number | null, locale: string = 'id-ID'): string {
  if (value === null || value === 0) return '-'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Format date for display
 */
function formatDate(dateString: string, locale: string = 'en-US'): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'full',
  }).format(date)
}

/**
 * Transform API response to view model
 */
export function transformTodayPrices(apiData: PricesTodayResponse, locale: string = 'id-ID'): TodayPricesVM {
  return {
    lastUpdated: formatDate(apiData.date, locale),
    brands: apiData.brands.map((brandGroup) => ({
      brandName: brandGroup.brand,
      prices: brandGroup.prices
        .map((price) => ({
          denominationGram: price.denominationGram,
          sellPrice: price.sellPrice,
          buybackPrice: price.buybackPrice,
          sellPriceFormatted: formatIDR(price.sellPrice, locale),
          buybackPriceFormatted: formatIDR(price.buybackPrice, locale),
          weightLabel: `${price.denominationGram} g`,
        }))
        // Sort by weight ascending
        .sort((a, b) => a.denominationGram - b.denominationGram),
    })),
  }
}
