/**
 * GET /api/v1/portfolio
 * 
 * Returns list of all portfolio holdings with valuations.
 */

import { wrapController } from '@/applications/shared/lib/controller-wrapper'
import { PortfolioController } from '@/applications/modules/portfolio/v1/delivery/http/portfolio-controller'
import { PrismaPortfolioRepository } from '@/applications/shared/persistence/repositories/prisma-portfolio-repository'
import { PrismaGoalRepository } from '@/applications/shared/persistence/repositories/prisma-goal-repository'
import { PrismaPriceRepository } from '@/applications/shared/persistence/repositories/prisma-price-repository'
import { prisma } from '@/applications/shared/persistence/prisma-client'

const portfolioRepo = new PrismaPortfolioRepository(prisma)
const goalRepo = new PrismaGoalRepository(prisma)
const priceRepo = new PrismaPriceRepository(prisma)
const controller = new PortfolioController(portfolioRepo, goalRepo, priceRepo, prisma)

export const GET = wrapController(async (req) => {
  return controller.getPortfolioHoldings(req)
})

export const POST = wrapController(async (req) => {
  return controller.createHolding(req)
})
