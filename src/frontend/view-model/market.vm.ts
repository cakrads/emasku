/**
 * Market View Model
 */

import { MarketOverview, SpotPriceSeries, PricePoint } from '@/shared/contracts/market.contract'

export interface MarketOverviewVM {
  brand: string
  spotPrice: string // Formatted IDR
  delta24h: string // Formatted IDR
  deltaPercentage: string // Formatted percentage
  deltaColor: 'positive' | 'negative' | 'neutral'
  deltaSign: '+' | '-' | ''
  lastUpdated: string // Formatted datetime
}

export interface PricePointVM {
  date: string // Formatted date
  price: number
  priceFormatted: string
}

export interface SpotPriceSeriesVM {
  brand: string
  weight: string
  points: PricePointVM[]
}

function formatIDR(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatPercentage(value: number): string {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

function formatDateTime(isoString: string): string {
  const date = new Date(isoString)
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function formatDate(isoString: string): string {
  const date = new Date(isoString)
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export function transformMarketOverview(api: MarketOverview): MarketOverviewVM {
  const deltaColor = api.delta24h > 0 ? 'positive' : api.delta24h < 0 ? 'negative' : 'neutral'
  const deltaSign = api.delta24h > 0 ? '+' : api.delta24h < 0 ? '-' : ''

  return {
    brand: api.referenceBrand,
    spotPrice: formatIDR(api.spotPrice),
    delta24h: formatIDR(Math.abs(api.delta24h)),
    deltaPercentage: formatPercentage(api.deltaPercentage),
    deltaColor,
    deltaSign,
    lastUpdated: formatDateTime(api.lastUpdated),
  }
}

export function transformSpotPriceSeries(api: SpotPriceSeries): SpotPriceSeriesVM {
  return {
    brand: api.brand,
    weight: `${api.denominationGram} g`,
    points: api.series.map((point) => ({
      date: formatDate(point.priceAt),
      price: point.price,
      priceFormatted: formatIDR(point.price),
    })),
  }
}
