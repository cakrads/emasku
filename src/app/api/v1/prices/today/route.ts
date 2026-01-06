/**
 * GET /api/v1/prices/today
 * 
 * Returns current sell and buyback prices for all brands.
 */

import { wrapController } from '@/applications/shared/lib/controller-wrapper'
import { PricesController } from '@/applications/modules/prices/v1/delivery/http/prices-controller'

export const GET = wrapController(async () => {
  const controller = new PricesController()
  return controller.getTodayPrices()
})
