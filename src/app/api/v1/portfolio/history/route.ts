import { wrapController } from '@/applications/shared/lib/controller-wrapper'
import { PortfolioController } from '@/applications/modules/portfolio/v1/delivery/http/portfolio-controller'

export const GET = wrapController(async (req) => {
  const controller = new PortfolioController()
  return controller.getPortfolioHistory(req)
})
