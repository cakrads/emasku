/**
 * Get Holding Detail Usecase
 * 
 * Business logic to fetch single holding with valuation.
 * Implements BUYBACK → SPOT → NULL fallback logic.
 */

import Decimal from 'decimal.js'
import { PrismaPortfolioRepository } from '@/applications/shared/persistence/repositories/prisma-portfolio-repository'
import { PrismaPriceRepository } from '@/applications/shared/persistence/repositories/prisma-price-repository'
import { ValuatedHoldingDomain } from '../domain/portfolio.domain'
import { logger } from '@/applications/shared/lib/logger'

export class GetHoldingDetailUsecase {
  private portfolioRepo = new PrismaPortfolioRepository()
  private priceRepo = new PrismaPriceRepository()

  async execute(id: string): Promise<ValuatedHoldingDomain | null> {
    logger.info('Fetching holding detail', { id })

    const holding = await this.portfolioRepo.findById(id)
    if (!holding) return null

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
        valuationSource: 'NONE',
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
  }
}
