import GoalDetailView from '@/frontend/features/admin/goals-detail/goal-detail-view'
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getQueryClient } from "@/frontend/utils/get-query-client"
import { fetchGoalDetail } from "@/frontend/services/goals/goals.api"
import { cookies } from "next/headers"

export default async function Page({ params }: { params: Promise<{ goalId: string }> }) {
    const { goalId } = await params
    const queryClient = getQueryClient()
    const cookieStore = await cookies()
    const options = { headers: { cookie: cookieStore.toString() } }

    try {
        await queryClient.prefetchQuery({
            queryKey: ['goals', goalId],
            queryFn: () => fetchGoalDetail(goalId, options),
        })
    } catch (error) {
        console.error(`[SSR] Failed to prefetch goal detail ${goalId}:`, error)
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <GoalDetailView goalId={goalId} />
        </HydrationBoundary>
    )
}
