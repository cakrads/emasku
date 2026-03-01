import HoldingDetailView from '@/frontend/features/admin/holdings-detail/holding-detail-view'
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getQueryClient } from "@/frontend/utils/get-query-client"
import { fetchHoldingDetail } from "@/frontend/services/portfolio/portfolio.api"
import { cookies } from "next/headers"

interface PageProps {
  params: Promise<{ holdingId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ params, searchParams }: PageProps) {
  const { holdingId } = await params
  const { backUrl } = await searchParams

  const queryClient = getQueryClient()
  const cookieStore = await cookies()
  const options = { headers: { cookie: cookieStore.toString() } }

  try {
    await queryClient.prefetchQuery({
      queryKey: ['portfolio', 'holding', holdingId],
      queryFn: () => fetchHoldingDetail(holdingId, options),
    })
  } catch (error) {
    console.error(`[SSR] Failed to prefetch holding detail ${holdingId}:`, error)
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HoldingDetailView holdingId={holdingId} backUrl={backUrl as string} />
    </HydrationBoundary>
  )
}
