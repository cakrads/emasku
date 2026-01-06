/**
 * GET /api/v1/portfolio
 * 
 * Returns list of all portfolio holdings with valuations.
 */

import { wrapController } from '@/applications/shared/lib/controller-wrapper'
import { PortfolioController } from '@/applications/modules/portfolio/v1/delivery/http/portfolio-controller'

export const GET = wrapController(async () => {
  const controller = new PortfolioController()
  return controller.getPortfolioHoldings()
})
