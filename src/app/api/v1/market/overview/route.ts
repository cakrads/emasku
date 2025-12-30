/**
 * Market Overview Route
 * GET /api/v1/market/overview
 * 
 * Thin routing layer - delegates to controller
 */

import { wrapController } from '@/applications/shared/lib/controller-wrapper'
import { MarketController } from '@/applications/modules/market/v1/delivery/http/market-controller'

export const GET = wrapController(async () => {
  const controller = new MarketController()
  return controller.getOverview()
})
