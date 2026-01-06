/**
 * Get Holding Detail Usecase
 * 
 * Business logic to fetch a single holding by ID.
 */

import { logger } from '@/applications/shared/lib/logger'
import { HoldingDomain } from '../domain/portfolio.domain'

export class GetHoldingDetailUsecase {
  async execute(id: string): Promise<HoldingDomain | null> {
    logger.info('Fetching holding detail', { id })

    // Dummy holdings data (same as list)
    const holdings: HoldingDomain[] = [
      {
        id: 'h1',
        brandCode: 'ANTAM',
        brandName: 'ANTAM',
        denominationGram: 10,
        quantity: 1,
        buyDate: new Date('2024-01-15'),
        avgBuyPrice: 1264300,
        currentBuybackPrice: 1180000,
        totalBuyValue: 12643000,
        currentValue: 11800000,
        unrealizedPnL: -843000,
        pnlPercentage: -6.67,
        notes: 'First purchase - 10g bar',
      },
      {
        id: 'h2',
        brandCode: 'ANTAM',
        brandName: 'ANTAM',
        denominationGram: 25,
        quantity: 1,
        buyDate: new Date('2024-02-20'),
        avgBuyPrice: 1260000,
        currentBuybackPrice: 1180000,
        totalBuyValue: 31500000,
        currentValue: 29500000,
        unrealizedPnL: -2000000,
        pnlPercentage: -6.35,
        notes: '25g bar',
      },
    ]

    const holding = holdings.find((h) => h.id === id)

    if (!holding) {
      logger.warn('Holding not found', { id })
      return null
    }

    logger.info('Holding detail fetched', { id })

    return holding
  }
}
