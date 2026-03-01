import { LandingView } from '@/frontend/features/public/landing/landing-view'
import { fetchTodayPrices } from '@/frontend/services/prices/prices.api'
import { PricesTodayResponse } from '@/shared/contracts/prices.contract'

export const revalidate = 60 // 60 seconds ISR

export default async function LandingPage() {
  let initialPricesData: PricesTodayResponse | undefined

  try {
    initialPricesData = await fetchTodayPrices()
  } catch (error) {
    console.error('[SSR] Failed to fetch prices via HTTP on LandingPage:', error)
  }

  return <LandingView initialPricesData={initialPricesData} />
}
