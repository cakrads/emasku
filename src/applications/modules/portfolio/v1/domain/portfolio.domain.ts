/**
 * Portfolio Domain Models
 * 
 * Spec-compliant domain representation for portfolio data.
 * Separates raw factual data from enriched valuations.
 */

/**
 * Transaction record associated with a holding.
 */
export interface HoldingTransactionDomain {
  id: string
  holdingId: string
  type: 'BUY' | 'SELL'
  price: number
  transactionDate: Date
  notes?: string
  createdAt: Date
}

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
  status: 'ACTIVE' | 'SOLD'
  createdAt: Date
  notes?: string
  goalId?: string | null
  goalName?: string | null
  // Sell transaction data (populated when status = SOLD)
  sellPrice?: number | null
  sellDate?: Date | null
  sellNotes?: string | null
  realizedPnL?: number | null
  realizedPnLPercentage?: number | null
  holdingDurationDays?: number | null
}

/**
 * Holding enriched with current market valuation.
 * Projection for display purposes.
 * For ACTIVE: includes market-driven valuation.
 * For SOLD: includes realized P/L from sell transaction.
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
