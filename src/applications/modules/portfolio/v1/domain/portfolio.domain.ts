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
  boughtAt: Date
  soldAt?: Date | null
  notes?: string
}

/**
 * Holding enriched with current market valuation.
 * Projection for display purposes.
 * Includes fallback valuation logic (BUYBACK → SPOT → NONE).
 */
export interface ValuatedHoldingDomain extends PortfolioHoldingDomain {
  currentPrice: number | null
  currentValue: number | null
  unrealizedPnL: number | null
  pnlPercentage: number | null
  valuationSource: 'BUYBACK' | 'SPOT' | 'NONE'
  priceAsOf: Date | null
}

/**
 * Brand-level allocation in portfolio summary.
 */
export interface BrandAllocationDomain {
  brandCode: string
  brandName: string
  totalGrams: number
  currentValue: number
  valuationSource: 'BUYBACK' | 'SPOT' | 'MIXED' | 'NONE'
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
  date: Date
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
