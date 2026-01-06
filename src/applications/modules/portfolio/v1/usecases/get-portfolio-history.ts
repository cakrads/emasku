/**
 * Get Portfolio History Usecase
 * 
 * Business logic to compute portfolio value history.
 * Currently simulates history based on holdings and random fluctuation.
 */

import { logger } from '@/applications/shared/lib/logger'
import { PortfolioHistoryDomain, PortfolioHistoryPointDomain } from '../domain/portfolio.domain'

export class GetPortfolioHistoryUsecase {
  async execute(): Promise<PortfolioHistoryDomain> {
    logger.info('Computing portfolio history')

    // Simulate 30 days of history
    const days = 30
    const series: PortfolioHistoryPointDomain[] = []
    const now = new Date()

    // Base value (approximate current value from summary)
    // In a real app, this would query historical prices for every holding daily.
    let currentValue = 53000000 // Start base

    for (let i = days; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)

      // Random daily fluctuation (-1% to +1%)
      const fluctuation = 1 + (Math.random() * 0.02 - 0.01)
      currentValue = Math.round(currentValue * fluctuation)

      // Ensure trend is somewhat realistic (upwards for gold usually)
      if (i % 5 === 0) currentValue += 500000

      series.push({
        date,
        value: currentValue
      })
    }

    return {
      series
    }
  }
}
