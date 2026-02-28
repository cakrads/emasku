/**
 * Get Portfolio History Usecase
 * 
 * Returns chronological purchase timeline.
 * NOT market price history - represents individual purchases over time.
 */

import Decimal from 'decimal.js'
import { ValidationError } from '@/applications/shared/lib/errors'
import { PrismaPortfolioRepository } from '@/applications/shared/persistence/repositories/prisma-portfolio-repository'
import { PortfolioHistoryDomain, HistoryEntryDomain } from '../domain/portfolio.domain'
import { logger } from '@/applications/shared/lib/logger'

export class GetPortfolioHistoryUsecase {
  constructor(private portfolioRepo: PrismaPortfolioRepository = new PrismaPortfolioRepository()) { }

  async execute(userId: string): Promise<PortfolioHistoryDomain> {
    if (!userId) {
      throw new ValidationError('userId is required')
    }
    logger.info('Fetching portfolio history', { userId })

    const { items: holdings } = await this.portfolioRepo.findAllByUserId(userId)

    const timeline: HistoryEntryDomain[] = holdings.map((holding) => {
      const buyValue = new Decimal(holding.buyPrice)
        .times(holding.quantity)
        .times(holding.denominationGram)
        .toNumber()

      return {
        date: holding.boughtAt,
        brandCode: holding.brandCode,
        brandName: holding.brandName,
        denominationGram: holding.denominationGram,
        quantity: holding.quantity,
        buyValue,
        notes: holding.notes
      }
    })

    // Sort by date ascending (purchase timeline)
    timeline.sort((a, b) => {
      const dateA = a.date?.getTime() ?? 0
      const dateB = b.date?.getTime() ?? 0
      return dateA - dateB
    })

    logger.info('Portfolio history fetched', { entries: timeline.length })

    return { timeline }
  }
}
