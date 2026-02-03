/**
 * GET /api/v1/buyback/prices
 * 
 * Returns latest buyback prices for specified items.
 */

import { wrapController } from '@/applications/shared/lib/controller-wrapper'
import { BuybackController } from '@/applications/modules/prices/v1/delivery/http/buyback-controller'

export const GET = wrapController(async (req) => {
  const controller = new BuybackController()
  return controller.getLatestPrices(req)
})
