import DashboardView from "@/frontend/features/admin/dashboard/dashboard-view";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/frontend/utils/get-query-client";
import { fetchPortfolioSummary, fetchPortfolioList } from "@/frontend/services/portfolio/portfolio.api";
import { fetchGoals } from "@/frontend/services/goals/goals.api";
import { fetchTodayPrices } from "@/frontend/services/prices/prices.api";
import { cookies } from "next/headers";

export default async function DashboardPage() {
  const queryClient = getQueryClient();
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const options = { headers: { cookie: cookieHeader } };

  try {
    // Prefetch all 4 queries used in the dashboard
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: ['portfolio', 'summary'],
        queryFn: () => fetchPortfolioSummary(undefined, options),
      }),
      queryClient.prefetchQuery({
        queryKey: ['portfolio', 'list', 'preview'],
        queryFn: () => fetchPortfolioList({ status: 'active' }, { page: 1, pageSize: 5 }, options),
      }),
      queryClient.prefetchQuery({
        queryKey: ['goals', 'list'],
        queryFn: () => fetchGoals(options),
      }),
      queryClient.prefetchQuery({
        queryKey: ['prices', 'today'],
        queryFn: () => fetchTodayPrices(),
      }),
    ]);
  } catch (error) {
    console.error("[SSR] Dashboard prefetch failed:", error);
  }

  return (
    <main>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <DashboardView />
      </HydrationBoundary>
    </main>
  );
}
