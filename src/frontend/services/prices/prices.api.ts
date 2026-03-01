/**
 * Prices API Client
 * 
 * Fetches price data from backend API.
 * MUST ONLY import from shared/contracts.
 */

import { fetchJson } from '@/frontend/utils/api-client'
import { getBaseUrl } from '@/frontend/utils/get-base-url'
import {
  PricesTodayResponse,
  PricesTodayResponseSchema,
  SpotPriceSeries,
  SpotPriceSeriesSchema
} from '@/shared/contracts/prices.contract'

/**
 * Fetch today's prices from API
 */
export async function fetchTodayPrices(options?: RequestInit): Promise<PricesTodayResponse> {
  const url = `${getBaseUrl()}/api/v1/prices/today`
  try {
    const data = await fetchJson<unknown>(url, options)
    return PricesTodayResponseSchema.parse(data)
  } catch (error) {
    console.error(`[fetchTodayPrices] Error fetching from ${url}:`, error)
    throw error
  }
}

/**
 * Allowed spot price ranges (anti-scraping)
 */
export type SpotPriceRange = '3d' | '1w' | '7d' | '1m' | '30d' | '90d' | '1y' | '5y' | 'all'

/**
 * Fetch spot price series
 */
export async function fetchSpotPriceSeries(params: {
  brand: string
  range?: SpotPriceRange
  denomination?: number
}, options?: RequestInit): Promise<SpotPriceSeries> {
  const searchParams = new URLSearchParams({
    brand: params.brand,
    range: params.range || '30d',
    ...(params.denomination && { denomination: params.denomination.toString() }),
  })

  const url = `${getBaseUrl()}/api/v1/prices/spot?${searchParams}`
  try {
    const data = await fetchJson<unknown>(url, options)
    return SpotPriceSeriesSchema.parse(data)
  } catch (error) {
    console.error(`[fetchSpotPriceSeries] Error fetching from ${url}:`, error)
    throw error
  }
}

export interface BuybackPrice {
  brandCode: string
  denominationGram: number
  price: number
  closeDate: string
}

export interface BuybackPricesResponse {
  prices: BuybackPrice[]
  currency: string
}

/**
 * Fetch buyback prices for simulation
 */
export async function fetchBuybackPrices(items: { brandCode: string; denominationGram: number }[]): Promise<BuybackPricesResponse> {
  if (items.length === 0) return { prices: [], currency: 'IDR' }

  // Dedup items to reduce URL length
  const uniqueKeys = new Set<string>()
  const uniqueItems = items.filter(item => {
    const key = `${item.brandCode}:${item.denominationGram}`
    if (uniqueKeys.has(key)) return false
    uniqueKeys.add(key)
    return true
  })

  const itemsParam = uniqueItems.map(i => `${i.brandCode}:${i.denominationGram}`).join(',')
  const searchParams = new URLSearchParams({ items: itemsParam })
  return fetchJson<BuybackPricesResponse>(`${getBaseUrl()}/api/v1/buyback/prices?${searchParams}`)
}
