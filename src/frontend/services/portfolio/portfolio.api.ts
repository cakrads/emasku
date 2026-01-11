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
import {
  CreateHoldingRequest,
  CreateHoldingResponse,
  CreateHoldingResponseSchema,
} from '@/shared/contracts/create-holding.contract'
import {
  UpdateHoldingRequest,
  UpdateHoldingResponse,
  UpdateHoldingResponseSchema,
} from '@/shared/contracts/update-holding.contract'

/**
 * Fetch portfolio summary
 */
export async function fetchPortfolioSummary(): Promise<PortfolioSummary> {
  const data = await fetchJson<unknown>('/api/v1/portfolio/summary')
  return PortfolioSummarySchema.parse(data)
}

/**
 * Fetch portfolio holdings list
 */
export async function fetchPortfolioList(filter?: { status?: 'active' | 'sold' | 'all' }): Promise<PortfolioList> {
  const query = filter?.status ? `?status=${filter.status}` : ''
  const data = await fetchJson<unknown>(`/api/v1/portfolio${query}`)
  return PortfolioListSchema.parse(data)
}

/**
 * Fetch holding detail by ID
 */
export async function fetchHoldingDetail(id: string): Promise<HoldingDetail> {
  const data = await fetchJson<unknown>(`/api/v1/portfolio/${id}`)
  return HoldingDetailSchema.parse(data)
}

/**
 * Fetch portfolio history
 */
export async function fetchPortfolioHistory(): Promise<PortfolioHistory> {
  const data = await fetchJson<unknown>('/api/v1/portfolio/history')
  return PortfolioHistorySchema.parse(data)
}

/**
 * Create a new holding
 */
export async function createHolding(request: CreateHoldingRequest): Promise<CreateHoldingResponse> {
  const data = await fetchJson<unknown>('/api/v1/portfolio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  return CreateHoldingResponseSchema.parse(data)
}

/**
 * Update an existing holding
 */
export async function updateHolding(id: string, request: UpdateHoldingRequest): Promise<UpdateHoldingResponse> {
  const data = await fetchJson<unknown>(`/api/v1/portfolio/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  return UpdateHoldingResponseSchema.parse(data)
}

/**
 * Delete a holding (mark as sold)
 */
export async function deleteHolding(id: string): Promise<void> {
  await fetchJson<unknown>(`/api/v1/portfolio/${id}`, {
    method: 'DELETE',
  })
}
