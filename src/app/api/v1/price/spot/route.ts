/**
 * Spot Price Series Route
 * GET /api/v1/price/spot
 * 
 * Thin routing layer - delegates to controller
 */

import { wrapController } from '@/applications/shared/lib/controller-wrapper'
import { MarketController } from '@/applications/modules/market/v1/delivery/http/market-controller'

export const GET = wrapController(async (req) => {
  const controller = new MarketController()
  return controller.getSpotSeries(req)
})
