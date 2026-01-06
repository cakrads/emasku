/**
 * Market API Client
 */

import { fetchJson } from '@/frontend/utils/api-client'
import { MarketOverview, MarketOverviewSchema, SpotPriceSeries, SpotPriceSeriesSchema } from '@/shared/contracts/market.contract'

export async function fetchMarketOverview(): Promise<MarketOverview> {
  const data = await fetchJson<any>('/api/v1/market/overview')
  return MarketOverviewSchema.parse(data)
}

export async function fetchSpotPriceSeries(params: {
  brand: string
  from: string
  to: string
  denomination?: number
}): Promise<SpotPriceSeries> {
  const searchParams = new URLSearchParams({
    brand: params.brand,
    from: params.from,
    to: params.to,
    ...(params.denomination && { denomination: params.denomination.toString() }),
  })

  const data = await fetchJson<any>(`/api/v1/price/spot?${searchParams}`)
  return SpotPriceSeriesSchema.parse(data)
}
