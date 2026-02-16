'use client'

import { useQuery } from '@tanstack/react-query'
import { Stack, Section } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { fetchGoals } from '@/frontend/services/goals/goals.api'
import { formatCurrency } from '@/frontend/utils/format'
import { useLanguage } from '@/frontend/hooks/use-language'
import Link from 'next/link'
import { ROUTES } from '@/frontend/config/routes'
import { ArrowRight, Target } from 'lucide-react'
import { Skeleton } from '@/frontend/components/ui/skeleton'

export default function GoalsSection() {
    const { t, language } = useLanguage()
    const locale = language === 'id' ? 'id-ID' : 'en-US'

    const { data, isLoading } = useQuery({
        queryKey: ['goals', 'list'], // Match key used in list view
        queryFn: fetchGoals,
    })

    if (isLoading) {
        return <GoalsSectionSkeleton />
    }

    // If no goals, don't show section? Or show empty state?
    // User request: "Update dashboard — add 'Tujuan Saya' section"
    // Showing empty state encourages usage.
    const goals = data?.goals || []

    // Calculate aggregate metrics
    const totalGoalsValue = goals.reduce((sum, goal) => sum + (goal.totalCurrentValue || 0), 0)
    const activeGoalsCount = goals.filter(g => !g.isAchieved && (g.targetAmount == null || g.targetAmount > 0)).length

    if (goals.length === 0) {
        return (
            <Section title={t('goals.title')}>
                <div className="rounded-xl border border-dashed border-border bg-surface/50 p-6 text-center">
                    <Target className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
                    <Typography variant="body" className="text-muted-foreground mb-4">
                        {t('goals.list.emptyDesc')}
                    </Typography>
                    <Link href={ROUTES.ADD_GOAL} className="text-sm font-medium text-primary hover:underline">
                        {t('goals.list.add')} →
                    </Link>
                </div>
            </Section>
        )
    }

    // Show top 3 goals? or all? Horizontal scroll or grid?
    // Let's do a grid of up to 4 cards.
    const displayedGoals = goals.slice(0, 4)

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-3">
                    <Typography variant="h3">{t('goals.title')}</Typography>
                    <div className="hidden sm:flex items-baseline gap-2 text-sm text-muted-foreground">
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span>{t('dashboard.goals.activeCount', { count: activeGoalsCount })}</span>
                    </div>
                </div>
                <Link href={ROUTES.GOALS_LIST} className="text-sm text-accent-gold hover:text-accent-gold/80 transition-colors flex items-center gap-1">
                    {t('common.viewAll') || 'View All'} <ArrowRight className="h-4 w-4" />
                </Link>
            </div>

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
                            <div className="mb-3">
                                <Typography variant="body" className="font-semibold truncate group-hover:text-accent-gold transition-colors">
                                    {goal.name}
                                </Typography>
                                {/* goal.description && <Typography variant="caption" className="text-muted-foreground line-clamp-1">{goal.description}</Typography> */}
                            </div>

                            {goal.targetAmount != null && goal.targetAmount > 0 ? (
                                <div>
                                    <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                                        <span className="group-hover:text-accent-gold/80 transition-colors">{formatCurrency(goal.totalCurrentValue, locale)}</span>
                                        <span className="group-hover:text-accent-gold/80 transition-colors">{progress.toFixed(0)}%</span>
                                    </div>
                                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-accent-gold transition-all"
                                            style={{ width: `${Math.min(progress, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-4">
                                    <Typography variant="caption" className="text-muted-foreground group-hover:text-accent-gold/80 transition-colors">
                                        {formatCurrency(goal.totalCurrentValue, locale)} collected
                                    </Typography>
                                </div>
                            )}
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

function GoalsSectionSkeleton() {
    return (
        <div className="flex flex-col gap-4">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-3">
                    <Skeleton className="h-8 w-24" />
                    <div className="hidden sm:flex items-baseline gap-2">
                        <Skeleton className="w-1 h-1 rounded-full opacity-50" />
                        <Skeleton className="h-4 w-24 opacity-60" />
                    </div>
                </div>
                <Skeleton className="h-5 w-20 opacity-80" />
            </div>

            {/* Cards Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="rounded-xl border border-border bg-surface p-4 min-h-[120px]"
                    >
                        <Skeleton className="h-5 w-3/4 mb-4" />
                        <div className="space-y-2 mt-4">
                            <div className="flex justify-between">
                                <Skeleton className="h-3 w-20 opacity-70" />
                                <Skeleton className="h-3 w-8 opacity-70" />
                            </div>
                            <Skeleton className="h-1.5 w-full rounded-full opacity-50" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
