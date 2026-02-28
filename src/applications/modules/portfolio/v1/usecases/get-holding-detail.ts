/**
 * Get Holding Detail Usecase
 * 
 * Business logic to fetch single holding with valuation.
 * Implements BUYBACK → NULL fallback logic.
 */

import Decimal from 'decimal.js'
import { IPortfolioRepository } from '../domain/repository'
import { IPriceRepository } from '@/applications/shared/domain/price.contract'
import { ValuatedHoldingDomain } from '../domain/portfolio.domain'
import { logger } from '@/applications/shared/lib/logger'

export class GetHoldingDetailUsecase {
  constructor(
    private readonly portfolioRepo: IPortfolioRepository,
    private readonly priceRepo: IPriceRepository
  ) { }

  async execute(id: string, userId: string): Promise<ValuatedHoldingDomain | null> {
    logger.info('Fetching holding detail', { id, userId })

    const holding = await this.portfolioRepo.findById(id)
    if (!holding || holding.userId !== userId) return null

    // Try BUYBACK first
    let priceResult = await this.priceRepo.getLatestBuybackPrice(
      holding.brandCode,
      holding.denominationGram
    )
    let source: 'BUYBACK' | 'NONE' = 'BUYBACK'

    if (!priceResult) {
      source = 'NONE'
    }

    const buyValue = new Decimal(holding.buyPrice)
      .times(holding.quantity)
    // .times(holding.denominationGram) // REMOVED: buyPrice is per-piece

    if (!priceResult) {
      return new ValuatedHoldingDomain(
        holding,
        null,
        null,
        null,
        null,
        'NONE',
        null
      )
    }

    const currentValue = new Decimal(priceResult.price.toString())
      .times(holding.quantity)

    const unrealizedPnL = currentValue.minus(buyValue)
    const pnlPercentage = buyValue.greaterThan(0)
      ? unrealizedPnL.dividedBy(buyValue).times(100)
      : new Decimal(0)

    const currentPricePerGram = holding.denominationGram > 0
      ? new Decimal(priceResult.price.toString()).dividedBy(holding.denominationGram)
      : null

    return new ValuatedHoldingDomain(
      holding,
      currentPricePerGram?.toNumber() ?? null,
      currentValue.toNumber(),
      unrealizedPnL.toNumber(),
      pnlPercentage.toNumber(),
      source,
      priceResult.priceAt
    )
  }
}
