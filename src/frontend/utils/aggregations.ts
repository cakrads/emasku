/**
 * Pure aggregation functions for holdings data
 * Following domain rule: Brand is a category/grouping lens, NOT an entity
 * All brand data is DERIVED from holdings
 */

import { Holding } from '../data/dummy-holdings'

export interface BrandSummary {
  brandCode: string
  brandName: string
  totalWeight: number
  totalBuyValue: number
  totalCurrentValue: number
  unrealizedPL: number
  unrealizedPLPercentage: number
  holdingsCount: number
}

export interface HoldingWithCalculations extends Holding {
  totalBuyValue: number
  totalCurrentValue: number
  profitLoss: number
  profitLossPercentage: number
}

/**
 * Aggregate holdings by brand
 * Returns brand summaries derived from holdings data
 */
export function aggregateHoldingsByBrand(holdings: Holding[]): BrandSummary[] {
  // Group holdings by brand code
  const grouped = holdings.reduce((acc, holding) => {
    if (!acc[holding.brandCode]) {
      acc[holding.brandCode] = []
    }
    acc[holding.brandCode].push(holding)
    return acc
  }, {} as Record<string, Holding[]>)

  // Calculate aggregated data for each brand
  return Object.entries(grouped).map(([brandCode, brandHoldings]) => {
    const totalWeight = brandHoldings.reduce((sum, h) => sum + h.weight, 0)
    const totalBuyValue = brandHoldings.reduce(
      (sum, h) => sum + h.buyPrice * h.weight,
      0
    )
    const totalCurrentValue = brandHoldings.reduce(
      (sum, h) => sum + h.currentPrice * h.weight,
      0
    )
    const unrealizedPL = totalCurrentValue - totalBuyValue

    return {
      brandCode,
      brandName: brandHoldings[0].brandName,
      totalWeight,
      totalBuyValue,
      totalCurrentValue,
      unrealizedPL,
      unrealizedPLPercentage:
        totalBuyValue > 0 ? (unrealizedPL / totalBuyValue) * 100 : 0,
      holdingsCount: brandHoldings.length,
    }
  })
}

/**
 * Calculate values for a single holding
 */
export function calculateHoldingValue(holding: Holding): {
  totalBuyValue: number
  totalCurrentValue: number
  profitLoss: number
  profitLossPercentage: number
} {
  const totalBuyValue = holding.buyPrice * holding.weight
  const totalCurrentValue = holding.currentPrice * holding.weight
  const profitLoss = totalCurrentValue - totalBuyValue

  return {
    totalBuyValue,
    totalCurrentValue,
    profitLoss,
    profitLossPercentage:
      totalBuyValue > 0 ? (profitLoss / totalBuyValue) * 100 : 0,
  }
}

/**
 * Add calculations to holdings
 */
export function enrichHoldingsWithCalculations(
  holdings: Holding[]
): HoldingWithCalculations[] {
  return holdings.map((holding) => ({
    ...holding,
    ...calculateHoldingValue(holding),
  }))
}

/**
 * Filter holdings by brand code
 */
export function filterHoldingsByBrand(
  holdings: Holding[],
  brandCode: string
): Holding[] {
  return holdings.filter((h) => h.brandCode === brandCode)
}

/**
 * Sort holdings by date or value
 */
export function sortHoldings(
  holdings: Holding[],
  sortBy: 'date' | 'value',
  order: 'asc' | 'desc' = 'desc'
): Holding[] {
  const sorted = [...holdings].sort((a, b) => {
    if (sortBy === 'date') {
      return a.buyDate.getTime() - b.buyDate.getTime()
    } else {
      const aValue = a.currentPrice * a.weight
      const bValue = b.currentPrice * b.weight
      return aValue - bValue
    }
  })

  return order === 'desc' ? sorted.reverse() : sorted
}

/**
 * Format currency in IDR
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Format weight in grams
 */
export function formatWeight(grams: number): string {
  return `${grams.toFixed(2)}g`
}

/**
 * Format date
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

/**
 * Format percentage
 */
export function formatPercentage(value: number): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}
