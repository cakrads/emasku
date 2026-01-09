/**
 * Spot Price Series Route
 * GET /api/v1/prices/spot
 * 
 * Thin routing layer - delegates to controller
 */

import { wrapController } from '@/applications/shared/lib/controller-wrapper'
import { PricesController } from '@/applications/modules/prices/v1/delivery/http/prices-controller'

export const GET = wrapController(async (req) => {
  const controller = new PricesController()
  return controller.getSpotSeries(req)
})
