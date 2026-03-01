/**
 * Price History Page
 * Route: /prices/history
 */

import { PricesHistoryView } from '@/frontend/features/public/prices-history/prices-history-view'
import { fetchSpotPriceSeries } from '@/frontend/services/prices/prices.api'
import { SpotPriceSeries } from '@/shared/contracts/prices.contract'

export const revalidate = 900 // 15 minutes ISR

export default async function PriceHistoryPage() {
  let initialData: SpotPriceSeries | undefined

  try {
    initialData = await fetchSpotPriceSeries({ brand: 'ANTAM', range: '5y', denomination: 1 })
  } catch (error) {
    console.error('[SSR] Failed to fetch price history via HTTP:', error)
  }

  return <PricesHistoryView initialData={initialData} />
}
