/**
 * Portfolio Mapper
 * 
 * Maps domain models to API contract types.
 * Never exposes Prisma models directly.
 */

import {
  PortfolioSummaryDomain,
  ValuatedHoldingDomain,
  PortfolioHistoryDomain
} from '../../domain/portfolio.domain'

export class PortfolioMapper {
  /**
   * Map domain summary to API contract.
   * Includes currency and valuation metadata.
   */
  static toPortfolioSummaryResponse(domain: PortfolioSummaryDomain) {
    return {
      totalBuyValue: Math.round(domain.totalBuyValue),
      totalCurrentValue: Math.round(domain.totalCurrentValue),
      totalPnL: Math.round(domain.totalPnL),
      pnlPercentage: Number(domain.pnlPercentage.toFixed(2)),
      totalDailyPnL: domain.totalDailyPnL !== null ? Math.round(domain.totalDailyPnL) : null,
      totalDailyPnLPercentage: domain.totalDailyPnLPercentage !== null ? Number(domain.totalDailyPnLPercentage.toFixed(2)) : null,
      totalWeeklyPnL: domain.totalWeeklyPnL !== null ? Math.round(domain.totalWeeklyPnL) : null,
      totalWeeklyPnLPercentage: domain.totalWeeklyPnLPercentage !== null ? Number(domain.totalWeeklyPnLPercentage.toFixed(2)) : null,
      totalMonthlyPnL: domain.totalMonthlyPnL !== null ? Math.round(domain.totalMonthlyPnL) : null,
      totalMonthlyPnLPercentage: domain.totalMonthlyPnLPercentage !== null ? Number(domain.totalMonthlyPnLPercentage.toFixed(2)) : null,
      totalYearlyPnL: domain.totalYearlyPnL !== null ? Math.round(domain.totalYearlyPnL) : null,
      totalYearlyPnLPercentage: domain.totalYearlyPnLPercentage !== null ? Number(domain.totalYearlyPnLPercentage.toFixed(2)) : null,
      totalWeightGram: Number(domain.totalWeightGram.toFixed(2)),
      brandAllocation: domain.brandAllocation.map(b => ({
        brandCode: b.brandCode,
        brandName: b.brandName,
        totalGrams: Number(b.totalGrams.toFixed(3)),
        totalBuyValue: Math.round(b.totalBuyValue),
        currentValue: Math.round(b.currentValue),
        valuationSource: b.valuationSource,
        deltaValue: Math.round(b.deltaValue),
        deltaPercentage: Number(b.deltaPercentage.toFixed(2)),
      })),
      disclaimer: domain.disclaimer,
      excludedCount: domain.excludedCount,
      lastUpdated: domain.lastUpdated.toISOString(),
    }
  }

  /**
   * Map valuated holding to API contract.
   * Includes valuation source and price timestamp.
   */
  static toHoldingItem(domain: ValuatedHoldingDomain) {
    return {
      id: domain.id,
      brand: domain.brandCode,
      brandName: domain.brandName,
      denominationGram: domain.denominationGram,
      quantity: domain.quantity,
      buyDate: domain.boughtAt ? domain.boughtAt.toISOString().split('T')[0] : null, // YYYY-MM-DD
      avgBuyPrice: Math.round(domain.buyPrice),
      currentBuybackPrice: domain.currentPrice ? Math.round(domain.currentPrice) : null,
      // Total Value = Price * Quantity (since Price is now per-unit)
      totalBuyValue: Math.round(domain.buyPrice * domain.quantity),
      currentValue: domain.currentValue ? Math.round(domain.currentValue) : null,
      unrealizedPnL: domain.unrealizedPnL ? Math.round(domain.unrealizedPnL) : null,
      pnlPercentage: domain.pnlPercentage ? Number(domain.pnlPercentage.toFixed(2)) : null,
      valuationSource: domain.valuationSource,
      priceAsOf: domain.priceAsOf ? domain.priceAsOf.toISOString() : null,
      createdAt: domain.createdAt.toISOString(),
      soldAt: domain.soldAt ? domain.soldAt.toISOString() : null,
      notes: domain.notes,
    }
  }

  /**
   * Map domain holdings to portfolio list.
   * Always includes currency.
   */
  static toPortfolioListResponse(holdings: ValuatedHoldingDomain[]) {
    return {
      currency: 'IDR',
      items: holdings.map((h) => this.toHoldingItem(h)),
    }
  }

  /**
   * Map domain history to API contract.
   * Represents purchase timeline, not market price history.
   */
  static toPortfolioHistoryResponse(domain: PortfolioHistoryDomain) {
    return {
      timeline: domain.timeline.map(entry => ({
        date: entry.date ? entry.date.toISOString().split('T')[0] : null,
        brandCode: entry.brandCode,
        brandName: entry.brandName,
        denominationGram: entry.denominationGram,
        quantity: entry.quantity,
        buyValue: Math.round(entry.buyValue),
        notes: entry.notes
      }))
    }
  }
}

