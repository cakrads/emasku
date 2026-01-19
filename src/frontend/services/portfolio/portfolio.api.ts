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
 * Holdings filter parameters
 */
export interface HoldingsFilter {
  status?: 'active' | 'sold' | 'all'
  brandCodes?: string[]
  dateFrom?: string
  dateTo?: string
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number
  pageSize?: number
}

/**
 * Build query string from filter and pagination params
 */
function buildQueryString(filter?: HoldingsFilter, pagination?: PaginationParams): string {
  const params = new URLSearchParams()

  if (filter?.status) params.set('status', filter.status)
  if (filter?.brandCodes?.length) params.set('brandCodes', filter.brandCodes.join(','))
  if (filter?.dateFrom) params.set('dateFrom', filter.dateFrom)
  if (filter?.dateTo) params.set('dateTo', filter.dateTo)
  if (pagination?.page) params.set('page', pagination.page.toString())
  if (pagination?.pageSize) params.set('pageSize', pagination.pageSize.toString())

  const query = params.toString()
  return query ? `?${query}` : ''
}

/**
 * Fetch portfolio summary (optionally filtered)
 */
export async function fetchPortfolioSummary(filter?: HoldingsFilter): Promise<PortfolioSummary> {
  const query = buildQueryString(filter)
  const data = await fetchJson<unknown>(`/api/v1/portfolio/summary${query}`)
  return PortfolioSummarySchema.parse(data)
}

/**
 * Fetch portfolio holdings list with filters and pagination
 */
export async function fetchPortfolioList(
  filter?: HoldingsFilter,
  pagination?: PaginationParams
): Promise<PortfolioList> {
  const query = buildQueryString(filter, pagination)
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
 * Mark a holding as sold (optimistic locking enabled)
 */
export async function sellHolding(id: string): Promise<void> {
  await fetchJson<unknown>(`/api/v1/portfolio/${id}/sell`, {
    method: 'POST',
  })
}

/**
 * Delete a holding (mark as sold or permanent delete)
 */
export async function deleteHolding(id: string, options?: { hard?: boolean }): Promise<void> {
  const query = options?.hard ? '?hard=true' : ''
  await fetchJson<unknown>(`/api/v1/portfolio/${id}${query}`, {
    method: 'DELETE',
  })
}
