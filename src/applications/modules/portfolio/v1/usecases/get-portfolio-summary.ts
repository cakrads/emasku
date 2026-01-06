/**
 * Get Portfolio Summary Usecase
 * 
 * Business logic to compute portfolio aggregates.
 */

import { logger } from '@/applications/shared/lib/logger'
import { PortfolioSummaryDomain, HoldingDomain, BrandAllocationDomain } from '../domain/portfolio.domain'

export class GetPortfolioSummaryUsecase {
  async execute(): Promise<PortfolioSummaryDomain> {
    logger.info('Computing portfolio summary')

    // Dummy holdings data
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
      },
      {
        id: 'h3',
        brandCode: 'UBS',
        brandName: 'UBS',
        denominationGram: 10,
        quantity: 1,
        buyDate: new Date('2024-05-15'),
        avgBuyPrice: 1278000,
        currentBuybackPrice: 1185000,
        totalBuyValue: 12780000,
        currentValue: 11850000,
        unrealizedPnL: -930000,
        pnlPercentage: -7.28,
      },
    ]

    // Calculate aggregates
    const totalBuyValue = holdings.reduce((sum, h) => sum + h.totalBuyValue, 0)
    const totalCurrentValue = holdings.reduce((sum, h) => sum + h.currentValue, 0)
    const totalPnL = totalCurrentValue - totalBuyValue
    const pnlPercentage = totalBuyValue > 0 ? (totalPnL / totalBuyValue) * 100 : 0
    const totalWeightGram = holdings.reduce((sum, h) => sum + h.denominationGram * h.quantity, 0)

    // Group by Brand
    const brandMap = new Map<string, BrandAllocationDomain>()

    for (const h of holdings) {
      const existing = brandMap.get(h.brandCode)
      if (existing) {
        existing.totalGrams += h.denominationGram * h.quantity
        existing.currentValue += h.currentValue
        // Weight-adjusted calc or simple sum for delta? Simple sum for now.
        existing.deltaValue += h.unrealizedPnL // Assuming unrealizedPnL is delta value
      } else {
        brandMap.set(h.brandCode, {
          brandCode: h.brandCode,
          brandName: h.brandName,
          totalGrams: h.denominationGram * h.quantity,
          currentValue: h.currentValue,
          valuationSource: 'OFFICIAL', // Default for now
          deltaValue: h.unrealizedPnL,
          deltaPercentage: 0 // Will calc after
        })
      }
    }

    const brandAllocation = Array.from(brandMap.values()).map(b => {
      // Recalculate percentage based on total buy value for that brand? 
      // Or just re-use PnL percentage formula? 
      // We don't have totalBuyValue per brand easily here without another map. 
      // Let's assume simpler: deltaPercentage = (current - buy) / buy
      // But we only have deltaValue (PnL) and currentValue.
      // BuyValue = Current - PnL
      const buyValue = b.currentValue - b.deltaValue
      b.deltaPercentage = buyValue > 0 ? (b.deltaValue / buyValue) * 100 : 0
      return b
    })

    const summary: PortfolioSummaryDomain = {
      totalBuyValue,
      totalCurrentValue,
      totalPnL,
      pnlPercentage,
      totalWeightGram,
      holdingCount: holdings.length,
      lastUpdated: new Date(),
      brandAllocation,
      disclaimer: 'Calculated based on current buyback prices',
      excludedCount: 0 // Default for now
    }

    logger.info('Portfolio summary computed', { holdingCount: summary.holdingCount })

    return summary
  }
}
