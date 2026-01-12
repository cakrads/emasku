/**
 * Portfolio View Model
 * 
 * Transforms API contract data into UI-friendly shapes.
 */

import { PortfolioSummary, HoldingItem, PortfolioList, HoldingDetail, BrandAllocation, PortfolioHistory } from '@/shared/contracts/portfolio.contract'

/**
 * UI-friendly portfolio summary
 */
export interface PortfolioSummaryVM {
  totalBuyValue: string // Formatted IDR
  totalCurrentValue: string // Formatted IDR
  totalPnL: string // Formatted IDR
  pnlPercentage: string // Formatted percentage
  totalWeightGram: string // Formatted weight
  pnlColor: 'positive' | 'negative' | 'neutral'
  pnlSign: '+' | '-' | ''
  brandAllocation: BrandData[]
  disclaimer?: string
  excludedCount: number
}

export interface BrandData {
  brandCode: string
  brandName: string
  totalGrams: number
  currentValue: number
  deltaValue: number
  deltaPercentage: number
  valuationSource: 'BUYBACK' | 'SPOT' | 'USER' | 'NONE' | 'MIXED'
}

/**
 * UI-friendly holding item
 */
export interface HoldingItemVM {
  id: string
  brand: string
  brandName: string
  weight: string // e.g., "10 g"
  quantity: number
  buyDate: string // Formatted date
  avgBuyPrice: string // Formatted IDR
  currentPrice: string // Formatted IDR
  totalBuyValue: string // Formatted IDR
  totalValue: string // Formatted IDR
  pnl: string // Formatted IDR
  pnlPercentage: string // Formatted percentage
  pnlColor: 'positive' | 'negative' | 'neutral'
  isSold: boolean
  soldAt?: string
  notes?: string
}

/**
 * Format IDR currency
 */
function formatIDR(value: number, locale: string = 'id-ID'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Format percentage
 */
function formatPercentage(value: number): string {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

/**
 * Format date
 */
function formatDate(dateString: string, locale: string = 'id-ID'): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

/**
 * Get PnL color
 */
function getPnLColor(value: number): 'positive' | 'negative' | 'neutral' {
  if (value > 0) return 'positive'
  if (value < 0) return 'negative'
  return 'neutral'
}

/**
 * Transform portfolio summary to view model
 */
export function transformPortfolioSummary(api: PortfolioSummary, locale: string = 'id-ID'): PortfolioSummaryVM {
  return {
    totalBuyValue: formatIDR(api.totalBuyValue, locale),
    totalCurrentValue: formatIDR(api.totalCurrentValue, locale),
    totalPnL: formatIDR(Math.abs(api.totalPnL), locale),
    pnlPercentage: formatPercentage(api.pnlPercentage),
    totalWeightGram: `${api.totalWeightGram.toFixed(2)} g`,
    pnlColor: getPnLColor(api.totalPnL),
    pnlSign: api.totalPnL > 0 ? '+' : api.totalPnL < 0 ? '-' : '',
    brandAllocation: api.brandAllocation.map((b: BrandAllocation) => ({
      brandCode: b.brandCode,
      brandName: b.brandName,
      totalGrams: b.totalGrams,
      currentValue: b.currentValue,
      deltaValue: b.deltaValue,
      deltaPercentage: b.deltaPercentage,
      valuationSource: b.valuationSource
    })),
    disclaimer: api.disclaimer,
    excludedCount: api.excludedCount,
  }
}

/**
 * Transform holding item to view model
 */
export function transformHoldingItem(api: HoldingItem, locale: string = 'id-ID'): HoldingItemVM {
  return {
    id: api.id,
    brand: api.brand,
    brandName: api.brandName,
    weight: `${api.denominationGram} g`,
    quantity: api.quantity,
    buyDate: formatDate(api.buyDate, locale),
    avgBuyPrice: formatIDR(api.avgBuyPrice, locale),
    currentPrice: api.currentBuybackPrice ? formatIDR(api.currentBuybackPrice, locale) : '-',
    totalBuyValue: formatIDR(api.totalBuyValue, locale),
    totalValue: api.currentValue ? formatIDR(api.currentValue, locale) : '-',
    pnl: api.unrealizedPnL ? formatIDR(Math.abs(api.unrealizedPnL), locale) : '-',
    pnlPercentage: api.pnlPercentage ? formatPercentage(api.pnlPercentage) : '0.00%',
    pnlColor: api.unrealizedPnL ? getPnLColor(api.unrealizedPnL) : 'neutral',
    isSold: !!api.soldAt,
    soldAt: api.soldAt ? formatDate(api.soldAt, locale) : undefined,
    notes: api.notes || undefined,
  }
}

/**
 * Transform portfolio list to view model
 */
export function transformPortfolioList(api: PortfolioList, locale: string = 'id-ID'): HoldingItemVM[] {
  return api.items.map(item => transformHoldingItem(item, locale))
}

/**
 * Transform holding detail to view model
 */
export function transformHoldingDetail(api: HoldingDetail, locale: string = 'id-ID'): HoldingItemVM {
  return transformHoldingItem(api, locale)
}

/**
 * UI-friendly portfolio history point
 */
export interface PortfolioHistoryPointVM {
  date: string // YYYY-MM-DD
  value: number
}

export type PortfolioHistoryVM = PortfolioHistoryPointVM[]

/**
 * Transform portfolio history to view model
 */
export function transformPortfolioHistory(api: PortfolioHistory): PortfolioHistoryVM {
  const items = api.timeline || []
  return items.map(element => ({
    date: element.date,
    value: element.buyValue
  }))
}
