/**
 * POST /api/v1/portfolio/[id]/sell
 * 
 * Marks a holding as sold (soft close).
 * Requires authentication.
 */

import { NextRequest } from 'next/server'
import { wrapController } from '@/applications/shared/lib/controller-wrapper'
import { PortfolioController } from '@/applications/modules/portfolio/v1/delivery/http/portfolio-controller'

export const POST = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  const { id } = await context.params

  return wrapController(async () => {
    const controller = new PortfolioController()
    return controller.sellHolding(req, id)
  })(req)
}
