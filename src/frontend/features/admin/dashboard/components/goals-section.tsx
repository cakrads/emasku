'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Stack, Section } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { SectionHeader } from '@/frontend/components/ui/section-header'
import { fetchGoals } from '@/frontend/services/goals/goals.api'
import { formatCurrency } from '@/frontend/utils/format'
import { useLanguage } from '@/frontend/hooks/use-language'
import Link from 'next/link'
import { ROUTES } from '@/frontend/config/routes'
import { Target } from 'lucide-react'
import { Skeleton } from '@/frontend/components/ui/skeleton'

export default function GoalsSection() {
    const { t, language } = useLanguage()
    const locale = language === 'id' ? 'id-ID' : 'en-US'

    const { data, isLoading } = useQuery({
        queryKey: ['goals', 'list'], // Match key used in list view
        queryFn: fetchGoals,
    })

    // If no goals, don't show section? Or show empty state?
    // User request: "Update dashboard — add 'Tujuan Saya' section"
    // Showing empty state encourages usage.
    const goals = data?.goals ?? []

    // Calculate aggregate metrics (memoized to avoid re-running on every render)
    const totalGoalsValue = useMemo(
        () => goals.reduce((sum, goal) => sum + (goal.totalCurrentValue || 0), 0),
        [goals]
    )
    const activeGoalsCount = useMemo(
        () => goals.filter(g => !g.isAchieved && (g.targetAmount == null || g.targetAmount > 0)).length,
        [goals]
    )

    if (isLoading) {
        return <GoalsSectionSkeleton />
    }

    if (goals.length === 0) {
        return (
            <Section title={t('goals.title')}>
                <Stack className="rounded-xl border border-dashed border-border bg-surface/50 p-6 text-center items-center">
                    <Target className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
                    <Typography variant="body" className="text-muted-foreground mb-4">
                        {t('goals.list.emptyDesc')}
                    </Typography>
                    <Link href={ROUTES.ADD_GOAL} className="text-sm font-medium text-primary hover:underline">
                        {t('goals.list.add')} →
                    </Link>
                </Stack>
            </Section>
        )
    }

    // Show top 3 goals? or all? Horizontal scroll or grid?
    // Let's do a grid of up to 4 cards.
    const displayedGoals = goals.slice(0, 4)

    return (
        <Stack gap="md">
            <SectionHeader
                title={t('goals.title')}
                actionLabel={t('common.viewAll')}
                href={ROUTES.GOALS_LIST}
            />

            {/* Mobile-only summary line */}


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {displayedGoals.map((goal) => {
                    const progress = goal.progressPercentage ?? 0

                    return (
                        <Link
                            key={goal.id}
                            href={ROUTES.GOAL_DETAIL(goal.id)}
                            className="group block rounded-xl border border-border bg-surface p-4 hover:border-accent-gold/50 hover:bg-accent-gold/5 hover:shadow-sm transition-all"
                        >
                            <Stack className="mb-3">
                                <Typography variant="body" className="font-semibold truncate group-hover:text-accent-gold transition-colors">
                                    {goal.name}
                                </Typography>
                                {/* goal.description && <Typography variant="caption" className="text-muted-foreground line-clamp-1">{goal.description}</Typography> */}
                            </Stack>

                            {goal.targetAmount != null && goal.targetAmount > 0 ? (
                                <Stack gap="xs">
                                    <Stack direction="horizontal" gap="xs" className="justify-between text-xs text-muted-foreground mb-1.5">
                                        <span className="group-hover:text-accent-gold/80 transition-colors">{formatCurrency(goal.totalCurrentValue, locale)}</span>
                                        <span className="group-hover:text-accent-gold/80 transition-colors">{progress.toFixed(0)}%</span>
                                    </Stack>
                                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-accent-gold transition-all"
                                            style={{ width: `${Math.min(progress, 100)}%` }}
                                        />
                                    </div>
                                </Stack>
                            ) : (
                                <Stack className="mt-4">
                                    <Typography variant="caption" className="text-muted-foreground group-hover:text-accent-gold/80 transition-colors">
                                        {formatCurrency(goal.totalCurrentValue, locale)} collected
                                    </Typography>
                                </Stack>
                            )}
                        </Link>
                    )
                })}
            </div>
        </Stack>
    )
}

function GoalsSectionSkeleton() {
    return (
        <Stack gap="md">
            {/* Header Skeleton */}
            <Stack direction="horizontal" gap="md" className="items-center justify-between">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-20" />
            </Stack>

            {/* Cards Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <Stack
                        key={i}
                        className="rounded-xl border border-border bg-surface p-4 min-h-[120px]"
                    >
                        <Skeleton className="h-5 w-3/4 mb-4" />
                        <Stack gap="xs" className="mt-4">
                            <Stack direction="horizontal" gap="md" className="justify-between">
                                <Skeleton className="h-3 w-20 opacity-70" />
                                <Skeleton className="h-3 w-8 opacity-70" />
                            </Stack>
                            <Skeleton className="h-1.5 w-full rounded-full opacity-50" />
                        </Stack>
                    </Stack>
                ))}
            </div>
        </Stack>
    )
}
