/**
 * Today Prices Page
 * Route: /prices
 */

import { PricesListView } from '@/frontend/features/public/prices-list/prices-list-view'
import { fetchTodayPrices } from '@/frontend/services/prices/prices.api'
import { PricesTodayResponse } from '@/shared/contracts/prices.contract'

export const revalidate = 60 // 60 seconds ISR

export default async function PricesPage() {
  let initialData: PricesTodayResponse | undefined = undefined

  try {
    // Fetch data server-side via HTTP internal request to `/api/v1/...`
    // This allows SSR while maintaining strict isolation between frontend and app layers.
    initialData = await fetchTodayPrices()
  } catch (error) {
    // If server fetch fails (e.g. timeout during build/render),
    // gracefully fallback to client-side fetch via React Query
    console.error('[SSR] Failed to fetch prices via HTTP:', error)
  }

  return <PricesListView initialData={initialData} />
}
