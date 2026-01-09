/**
 * Get Portfolio Holdings Usecase
 * 
 * Business logic to fetch all holdings with valuations.
 * Implements BUYBACK → SPOT → NULL fallback logic.
 */

import Decimal from 'decimal.js'
import { PrismaPortfolioRepository } from '@/applications/shared/persistence/repositories/prisma-portfolio-repository'
import { PrismaPriceRepository } from '@/applications/shared/persistence/repositories/prisma-price-repository'
import { ValuatedHoldingDomain } from '../domain/portfolio.domain'
import { logger } from '@/applications/shared/lib/logger'

export class GetPortfolioHoldingsUsecase {
  private portfolioRepo = new PrismaPortfolioRepository()
  private priceRepo = new PrismaPriceRepository()

  async execute(userId: string = 'default-user-id', filter: { status?: 'active' | 'sold' | 'all' } = { status: 'active' }): Promise<ValuatedHoldingDomain[]> {
    logger.info('Fetching portfolio holdings', { userId, filter })

    const holdings = await this.portfolioRepo.findAllByUserId(userId, filter)

    const valuatedHoldings = await Promise.all(
      holdings.map(async (holding) => {
        // Try BUYBACK first, fallback to SPOT
        let priceResult = await this.priceRepo.getLatestBuybackPrice(
          holding.brandCode,
          holding.denominationGram
        )
        let source: 'BUYBACK' | 'SPOT' | 'NONE' = 'BUYBACK'

        if (!priceResult) {
          priceResult = await this.priceRepo.getLatestSpotPrice(
            holding.brandCode,
            holding.denominationGram
          )
          source = priceResult ? 'SPOT' : 'NONE'
        }

        const buyValue = new Decimal(holding.buyPrice)
          .times(holding.quantity)
          .times(holding.denominationGram)

        if (!priceResult) {
          return {
            ...holding,
            currentPrice: null,
            currentValue: null,
            unrealizedPnL: null,
            pnlPercentage: null,
            valuationSource: 'NONE' as const,
            priceAsOf: null
          }
        }

        const currentValue = new Decimal(priceResult.price)
          .times(holding.quantity)
          .times(holding.denominationGram)

        const unrealizedPnL = currentValue.minus(buyValue)
        const pnlPercentage = buyValue.greaterThan(0)
          ? unrealizedPnL.dividedBy(buyValue).times(100)
          : new Decimal(0)

        return {
          ...holding,
          currentPrice: priceResult.price,
          currentValue: currentValue.toNumber(),
          unrealizedPnL: unrealizedPnL.toNumber(),
          pnlPercentage: pnlPercentage.toNumber(),
          valuationSource: source,
          priceAsOf: priceResult.priceAt
        }
      })
    )

    logger.info('Portfolio holdings fetched', { count: valuatedHoldings.length })
    return valuatedHoldings
  }
}
