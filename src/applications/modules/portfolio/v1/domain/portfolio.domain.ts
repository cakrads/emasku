/**
 * Portfolio Domain Models
 * 
 * Internal domain representation for portfolio data.
 */

import { Decimal } from 'decimal.js'

export interface BrandAllocationDomain {
  brandCode: string
  brandName: string
  totalGrams: number
  currentValue: number
  valuationSource: 'OFFICIAL' | 'SPOT' | 'USER' | 'UNVALUED'
  deltaValue: number
  deltaPercentage: number
}

/**
 * Portfolio summary aggregate
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
  disclaimer?: string
  excludedCount: number
}

/**
 * Individual holding record
 */
export interface HoldingDomain {
  id: string
  brandCode: string
  brandName: string
  denominationGram: number
  quantity: number
  buyDate: Date
  avgBuyPrice: number
  currentBuybackPrice: number
  totalBuyValue: number
  currentValue: number
  unrealizedPnL: number
  pnlPercentage: number
  notes?: string
}

/**
 * Portfolio history data point
 */
export interface PortfolioHistoryPointDomain {
  date: Date
  value: number
}

export interface PortfolioHistoryDomain {
  series: PortfolioHistoryPointDomain[]
}
