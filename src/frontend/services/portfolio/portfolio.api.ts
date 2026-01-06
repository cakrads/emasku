/**
 * Portfolio API Client
 * 
 * Fetches portfolio data from backend API.
 */

import { fetchJson } from '@/frontend/utils/api-client'
import {
  PortfolioSummary,
  PortfolioSummarySchema,
  PortfolioList,
  PortfolioListSchema,
  HoldingDetail,
  HoldingDetailSchema,
  PortfolioHistory,
  PortfolioHistorySchema,
} from '@/shared/contracts/portfolio.contract'

/**
 * Fetch portfolio summary
 */
export async function fetchPortfolioSummary(): Promise<PortfolioSummary> {
  const data = await fetchJson<any>('/api/v1/portfolio/summary')
  return PortfolioSummarySchema.parse(data)
}

/**
 * Fetch portfolio holdings list
 */
export async function fetchPortfolioList(): Promise<PortfolioList> {
  const data = await fetchJson<any>('/api/v1/portfolio')
  return PortfolioListSchema.parse(data)
}

/**
 * Fetch holding detail by ID
 */
export async function fetchHoldingDetail(id: string): Promise<HoldingDetail> {
  const data = await fetchJson<any>(`/api/v1/portfolio/${id}`)
  return HoldingDetailSchema.parse(data)
}

/**
 * Fetch portfolio history
 */
export async function fetchPortfolioHistory(): Promise<PortfolioHistory> {
  const data = await fetchJson<any>('/api/v1/portfolio/history')
  return PortfolioHistorySchema.parse(data)
}
