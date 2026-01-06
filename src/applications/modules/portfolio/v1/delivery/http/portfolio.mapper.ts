/**
 * Portfolio Mapper
 * 
 * Maps domain models to API contract types.
 */

import { PortfolioSummaryDomain, HoldingDomain } from '../../domain/portfolio.domain'
import { PortfolioSummary, BrandAllocation, HoldingItem, PortfolioList, PortfolioSummarySchema, PortfolioHistoryPointSchema, PortfolioHistorySchema } from '@/shared/contracts/portfolio.contract'

export class PortfolioMapper {
  /**
   * Map domain summary to API contract
   */
  static toPortfolioSummaryResponse(domain: PortfolioSummaryDomain): PortfolioSummary {
    return {
      totalBuyValue: Math.round(domain.totalBuyValue),
      totalCurrentValue: Math.round(domain.totalCurrentValue),
      totalPnL: Math.round(domain.totalPnL),
      pnlPercentage: Number(domain.pnlPercentage.toFixed(2)),
      totalWeightGram: Number(domain.totalWeightGram.toFixed(2)),
      brandAllocation: domain.brandAllocation.map(b => ({
        brandCode: b.brandCode,
        brandName: b.brandName,
        totalGrams: Number(b.totalGrams.toFixed(3)),
        currentValue: Math.round(b.currentValue),
        valuationSource: b.valuationSource,
        deltaValue: Math.round(b.deltaValue),
        deltaPercentage: Number(b.deltaPercentage.toFixed(2)),
      })),
      disclaimer: domain.disclaimer,
      excludedCount: domain.excludedCount,
    }
  }

  /**
   * Map domain holding to API contract
   */
  static toHoldingItem(domain: HoldingDomain): HoldingItem {
    return {
      id: domain.id,
      brand: domain.brandCode,
      brandName: domain.brandName,
      denominationGram: domain.denominationGram,
      quantity: domain.quantity,
      buyDate: domain.buyDate.toISOString().split('T')[0], // YYYY-MM-DD
      avgBuyPrice: Math.round(domain.avgBuyPrice),
      currentBuybackPrice: Math.round(domain.currentBuybackPrice),
      totalBuyValue: Math.round(domain.totalBuyValue),
      currentValue: Math.round(domain.currentValue),
      unrealizedPnL: Math.round(domain.unrealizedPnL),
      pnlPercentage: Number(domain.pnlPercentage.toFixed(2)),
      notes: domain.notes,
    }
  }

  /**
   * Map domain holdings to portfolio list
   */
  static toPortfolioListResponse(holdings: HoldingDomain[]): PortfolioList {
    return {
      currency: 'IDR',
      items: holdings.map((h) => this.toHoldingItem(h)),
    }
  }

  /**
   * Map domain history to API contract
   */
  static toPortfolioHistoryResponse(domain: { series: { date: Date; value: number }[] }): { series: { date: string; value: number }[] } {
    return {
      series: domain.series.map(point => ({
        date: point.date.toISOString().split('T')[0],
        value: Math.round(point.value)
      }))
    }
  }
}
