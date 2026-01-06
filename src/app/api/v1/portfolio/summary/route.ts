/**
 * GET /api/v1/portfolio/summary
 * 
 * Returns portfolio aggregate metrics (PNL, total value, total weight).
 */

import { wrapController } from '@/applications/shared/lib/controller-wrapper'
import { PortfolioController } from '@/applications/modules/portfolio/v1/delivery/http/portfolio-controller'

export const GET = wrapController(async () => {
  const controller = new PortfolioController()
  return controller.getPortfolioSummary()
})
