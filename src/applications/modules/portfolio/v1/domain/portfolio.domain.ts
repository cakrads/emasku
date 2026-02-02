/**
 * Portfolio Domain Models
 * 
 * Spec-compliant domain representation for portfolio data.
 * Separates raw factual data from enriched valuations.
 */

/**
 * Raw portfolio holding (factual data from database).
 * NO valuation, NO current prices.
 * This represents the immutable purchase record.
 */
export interface PortfolioHoldingDomain {
  id: string
  brandCode: string
  brandName: string
  denominationGram: number
  quantity: number
  buyPrice: number
  boughtAt: Date | null
  soldAt?: Date | null
  createdAt: Date
  notes?: string
}

/**
 * Holding enriched with current market valuation.
 * Projection for display purposes.
 * Includes fallback valuation logic (BUYBACK → NONE).
 */
export interface ValuatedHoldingDomain extends PortfolioHoldingDomain {
  currentPrice: number | null
  currentValue: number | null
  unrealizedPnL: number | null
  pnlPercentage: number | null
  valuationSource: 'BUYBACK' | 'NONE'
  priceAsOf: Date | null
}

/**
 * Brand-level allocation in portfolio summary.
 */
export interface BrandAllocationDomain {
  brandCode: string
  brandName: string
  totalGrams: number
  totalBuyValue: number
  currentValue: number
  valuationSource: 'BUYBACK' | 'MIXED' | 'NONE'
  deltaValue: number
  deltaPercentage: number
}

/**
 * Portfolio summary aggregate.
 * Includes valuation coverage metrics.
 */
export interface PortfolioSummaryDomain {
  totalBuyValue: number
  totalCurrentValue: number
  totalPnL: number
  pnlPercentage: number
  totalDailyPnL: number | null          // Change vs yesterday close
  totalDailyPnLPercentage: number | null
  totalWeeklyPnL: number | null         // Change vs 7 days ago close
  totalWeeklyPnLPercentage: number | null
  totalMonthlyPnL: number | null        // Change vs 30 days ago close
  totalMonthlyPnLPercentage: number | null
  totalYearlyPnL: number | null         // Change vs 365 days ago close
  totalYearlyPnLPercentage: number | null
  totalWeightGram: number
  holdingCount: number
  lastUpdated: Date
  brandAllocation: BrandAllocationDomain[]
  disclaimer: string
  excludedCount: number
  valuationCoverage: number
}

/**
 * Portfolio history entry (purchase timeline).
 * NOT market price history - represents individual purchases.
 */
export interface HistoryEntryDomain {
  date: Date | null
  brandCode: string
  brandName: string
  denominationGram: number
  quantity: number
  buyValue: number
  notes?: string
}

/**
 * Portfolio history (chronological purchase timeline).
 */
export interface PortfolioHistoryDomain {
  timeline: HistoryEntryDomain[]
}
