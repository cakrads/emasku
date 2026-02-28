/**
 * POST /api/v1/portfolio/bulk-sell
 * 
 * Sells multiple holdings with a single sell price.
 * Requires authentication.
 */

import { NextRequest } from 'next/server'
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

export const POST = async (req: NextRequest) => {
    return wrapController(async () => {
        return controller.bulkSellHoldings(req)
    })(req)
}
