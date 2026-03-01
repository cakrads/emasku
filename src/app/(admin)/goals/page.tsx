import { Suspense } from 'react'
import GoalsListView from '@/frontend/features/admin/goals-list/goals-list-view'
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getQueryClient } from "@/frontend/utils/get-query-client"
import { fetchGoals } from "@/frontend/services/goals/goals.api"
import { cookies } from "next/headers"

export default async function Page() {
    const queryClient = getQueryClient()
    const cookieStore = await cookies()
    const options = { headers: { cookie: cookieStore.toString() } }

    try {
        await queryClient.prefetchQuery({
            queryKey: ['goals'],
            queryFn: () => fetchGoals(options),
        })
    } catch (error) {
        console.error("[SSR] Goals list prefetch failed:", error)
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <GoalsListView />
        </HydrationBoundary>
    )
}
