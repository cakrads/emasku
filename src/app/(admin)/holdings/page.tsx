import { Suspense } from 'react'
import HoldingsListView from '@/frontend/features/admin/holdings-list/holdings-list-view'
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getQueryClient } from "@/frontend/utils/get-query-client"
import { fetchPortfolioSummary, fetchPortfolioList } from "@/frontend/services/portfolio/portfolio.api"
import { fetchBrands } from "@/frontend/services/brands/brands.api"
import { fetchGoals } from "@/frontend/services/goals/goals.api"
import { cookies } from "next/headers"

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function Page(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams
  const queryClient = getQueryClient()
  const cookieStore = await cookies()
  const options = { headers: { cookie: cookieStore.toString() } }

  // Extract initial filters from searchParams matching `useUrlFilters` defaults
  const brandFilter = typeof searchParams.brand === 'string' ? searchParams.brand : null
  const statusFilter = typeof searchParams.status === 'string' ? searchParams.status : 'active'
  const goalId = typeof searchParams.goalId === 'string' ? searchParams.goalId : null
  const sortBy = typeof searchParams.sortBy === 'string' ? searchParams.sortBy : 'date'
  const sortOrder = typeof searchParams.sortOrder === 'string' ? searchParams.sortOrder : 'desc'
  const pageIndex = 0
  const pageSize = 10

  // Build API filters matching useUrlFilters
  const apiFilter = {
    status: statusFilter as any,
    brandCodes: brandFilter ? [brandFilter] : undefined,
    goalId: goalId || undefined,
  }

  try {
    await Promise.all([
      // 1. Filtered Holdings List
      queryClient.prefetchQuery({
        queryKey: ['portfolio', 'list', statusFilter, brandFilter, goalId, sortBy, sortOrder, pageIndex, pageSize],
        queryFn: () => fetchPortfolioList(apiFilter, { page: pageIndex + 1, pageSize }, options),
      }),
      // 2. All Count (Status = "all" without brand filter)
      queryClient.prefetchQuery({
        queryKey: ['portfolio', 'list', 'all-count'],
        queryFn: () => fetchPortfolioList({ status: 'all' }, undefined, options),
      }),
      // 3. Portfolio Summary (with filters)
      queryClient.prefetchQuery({
        queryKey: ['portfolio', 'summary', statusFilter, brandFilter, goalId],
        queryFn: () => fetchPortfolioSummary(apiFilter, options),
      }),
      // 4. Brands
      queryClient.prefetchQuery({
        queryKey: ['brands'],
        queryFn: () => fetchBrands(options),
      }),
      // 5. Goals
      queryClient.prefetchQuery({
        queryKey: ['goals'],
        queryFn: () => fetchGoals(options),
      })
    ])
  } catch (error) {
    console.error("[SSR] Holdings list prefetch failed:", error)
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HoldingsListView />
    </HydrationBoundary>
  )
}
