/**
 * GET /api/v1/portfolio/[id]
 * 
 * Returns detail of a specific holding.
 */

import { NextRequest } from 'next/server'
import { wrapController } from '@/applications/shared/lib/controller-wrapper'
import { PortfolioController } from '@/applications/modules/portfolio/v1/delivery/http/portfolio-controller'

export const GET = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  const { id } = await context.params

  return wrapController(async () => {
    const controller = new PortfolioController()
    return controller.getHoldingDetail(req, id)
  })(req)
}

export const PUT = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  const { id } = await context.params

  return wrapController(async () => {
    const controller = new PortfolioController()
    return controller.updateHolding(req, id)
  })(req)
}

export const DELETE = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  const { id } = await context.params

  return wrapController(async () => {
    const controller = new PortfolioController()
    return controller.deleteHolding(req, id)
  })(req)
}
