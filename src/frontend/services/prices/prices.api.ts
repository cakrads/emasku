/**
 * Prices API Client
 * 
 * Fetches price data from backend API.
 * MUST ONLY import from shared/contracts.
 */

import { fetchJson } from '@/frontend/utils/api-client'
import { PricesTodayResponse, PricesTodayResponseSchema } from '@/shared/contracts/prices.contract'

/**
 * Fetch today's prices from API
 */
export async function fetchTodayPrices(): Promise<PricesTodayResponse> {
  const data = await fetchJson<any>('/api/v1/prices/today')
  return PricesTodayResponseSchema.parse(data)
}
