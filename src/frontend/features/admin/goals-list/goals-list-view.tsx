'use client'

import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Stack, Section } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { Button } from '@/frontend/components/ui/button'
import { StandardPageLayout } from '@/frontend/components/layout/standard-page-layout'
import { ErrorBoundary } from '@/frontend/components/fragments/admin/error-boundary'
import { Plus, Target, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/frontend/config/routes'
import { fetchGoals, deleteGoal } from '@/frontend/services/goals/goals.api'
import { GoalSummary } from '@/shared/contracts/goals.contract'
import { useLanguage } from '@/frontend/hooks/use-language'
import { toast } from 'sonner'
import { formatCurrency } from '@/frontend/utils/format'
import { cn } from '@/frontend/utils/cn'
import { Skeleton } from '@/frontend/components/ui/skeleton'

type GoalStatus = 'achieved' | 'in-progress' | 'no-target'
type FilterType = 'all' | 'achieved' | 'in-progress' | 'no-target'

function deriveStatus(goal: GoalSummary): GoalStatus {
    if (goal.targetAmount == null) return 'no-target'
    if (goal.isAchieved) return 'achieved'
    return 'in-progress'
}

export default function GoalsListView() {
    const { t } = useLanguage()
    return (
        <StandardPageLayout
            title={t('goals.title')}
            description={t('goals.list.description')}
            breadcrumbs={[
                { label: t('navbar.dashboard'), href: ROUTES.DASHBOARD },
                { label: t('goals.title') },
            ]}
            action={
                <Link href={ROUTES.ADD_GOAL}>
                    <Button variant="solid" color="primary" className="hidden md:flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        <span>{t('goals.list.add')}</span>
                    </Button>
                </Link>
            }
        >
            <ErrorBoundary>
                <GoalsListContent />
            </ErrorBoundary>
        </StandardPageLayout>
    )
}

function GoalsListContent() {
    const { t, language } = useLanguage()
    const locale = language === 'id' ? 'id-ID' : 'en-US'
    const router = useRouter()
    const queryClient = useQueryClient()
    const [activeFilter, setActiveFilter] = useState<FilterType>('all')

    const { data, isLoading, error } = useQuery({
        queryKey: ['goals'],
        queryFn: fetchGoals,
    })

    const deleteMutation = useMutation({
        mutationFn: deleteGoal,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['goals'] })
            toast.success(t('goals.messages.deleteSuccess'))
        },
        onError: (err) => {
            toast.error(err.message || 'Failed to delete goal')
        },
    })

    // Derive status, filter, sort
    const processedGoals = useMemo(() => {
        if (!data?.goals) return []

        const withStatus = data.goals.map((goal) => ({
            ...goal,
            status: deriveStatus(goal),
        }))

        const filtered = activeFilter === 'all'
            ? withStatus
            : withStatus.filter((g) => g.status === activeFilter)

        // Sort: in-progress first (ascending by progress%), then achieved, then no-target
        return filtered.sort((a, b) => {
            const statusOrder: Record<GoalStatus, number> = { 'in-progress': 0, 'achieved': 1, 'no-target': 2 }
            const orderDiff = statusOrder[a.status] - statusOrder[b.status]
            if (orderDiff !== 0) return orderDiff
            // Within in-progress, sort ascending by progress %
            if (a.status === 'in-progress' && b.status === 'in-progress') {
                return (a.progressPercentage ?? 0) - (b.progressPercentage ?? 0)
            }
            return 0
        })
    }, [data, activeFilter])

    // Count per filter
    const counts = useMemo(() => {
        if (!data?.goals) return { all: 0, achieved: 0, 'in-progress': 0, 'no-target': 0 }
        const goals = data.goals
        return {
            all: goals.length,
            achieved: goals.filter((g) => deriveStatus(g) === 'achieved').length,
            'in-progress': goals.filter((g) => deriveStatus(g) === 'in-progress').length,
            'no-target': goals.filter((g) => deriveStatus(g) === 'no-target').length,
        }
    }, [data])

    // Loading skeleton
    if (isLoading) {
        return (
            <Stack gap="sm">
                {/* Filter Tabs Skeleton */}
                <div className="flex flex-wrap items-center gap-2">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-8 w-24 rounded-lg" />
                    ))}
                </div>

                {/* Goals Table Skeleton */}
                <Section>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="py-3 px-4 text-left whitespace-nowrap font-medium">
                                        <Skeleton className="h-4 w-20" />
                                    </th>
                                    <th className="py-3 px-4 text-right whitespace-nowrap font-medium">
                                        <Skeleton className="h-4 w-24 ml-auto" />
                                    </th>
                                    <th className="py-3 px-4 text-right whitespace-nowrap font-medium">
                                        <Skeleton className="h-4 w-24 ml-auto" />
                                    </th>
                                    <th className="py-3 px-4 text-right whitespace-nowrap font-medium">
                                        <Skeleton className="h-4 w-20 ml-auto" />
                                    </th>
                                    <th className="py-3 px-4 text-right whitespace-nowrap font-medium">
                                        <Skeleton className="h-4 w-24 ml-auto" />
                                    </th>
                                    <th className="py-3 px-4 text-left whitespace-nowrap font-medium">
                                        <Skeleton className="h-4 w-16" />
                                    </th>
                                    <th className="py-3 px-4 text-right whitespace-nowrap font-medium">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <tr key={i} className="border-b border-border">
                                        <td className="py-4 px-4">
                                            <Skeleton className="h-5 w-40" />
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <Skeleton className="h-5 w-28 ml-auto" />
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <Skeleton className="h-5 w-28 ml-auto" />
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <div className="flex flex-col items-end gap-2">
                                                <Skeleton className="h-5 w-12" />
                                                <Skeleton className="h-1.5 w-16 rounded-full" />
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <Skeleton className="h-5 w-28 ml-auto" />
                                        </td>
                                        <td className="py-4 px-4">
                                            <Skeleton className="h-6 w-20 rounded-md" />
                                        </td>
                                        <td className="py-4 px-4"></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Section>
            </Stack>
        )
    }

    if (error || !data) {
        throw error || new Error('Failed to load goals')
    }

    if (data.goals.length === 0) {
        return (
            <div className="py-16 text-center border border-dashed border-border rounded-xl bg-surface/50">
                <Target className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                <Typography variant="h3" className="mb-2">{t('goals.list.empty')}</Typography>
                <Typography variant="body" className="text-muted-foreground mb-6">
                    {t('goals.list.emptyDesc')}
                </Typography>
                <Link href={ROUTES.ADD_GOAL}>
                    <Button variant="solid" color="primary" className="gap-2">
                        <Plus className="h-4 w-4" />
                        {t('goals.list.add')}
                    </Button>
                </Link>
            </div>
        )
    }

    const filters: { key: FilterType; label: string }[] = [
        { key: 'all', label: t('goals.filter.all') },
        { key: 'in-progress', label: t('goals.filter.inProgress') },
        { key: 'achieved', label: t('goals.filter.achieved') },
        { key: 'no-target', label: t('goals.filter.noTarget') },
    ]

    const statusBadge: Record<GoalStatus, { label: string; className: string }> = {
        'achieved': {
            label: t('goals.status.achieved'),
            className: 'bg-green-100 text-green-700 ring-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20',
        },
        'in-progress': {
            label: t('goals.status.inProgress'),
            className: 'bg-blue-100 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20',
        },
        'no-target': {
            label: t('goals.status.noTarget'),
            className: 'bg-gray-100 text-gray-600 ring-gray-500/20 dark:bg-gray-500/10 dark:text-gray-400 dark:ring-gray-500/20',
        },
    }

    return (
        <Stack gap="sm">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
                {filters.map((f) => (
                    <Button
                        key={f.key}
                        variant={activeFilter === f.key ? 'solid' : 'outline'}
                        color={activeFilter === f.key ? 'primary' : undefined}
                        size="sm"
                        onClick={() => setActiveFilter(f.key)}
                        className="gap-1.5"
                    >
                        <span>{f.label}</span>
                        {counts[f.key] > 0 && (
                            <span className={cn(
                                'px-1.5 py-0.5 text-xs rounded-full',
                                activeFilter === f.key
                                    ? 'bg-white/20 text-primary-foreground'
                                    : 'bg-muted text-muted-foreground'
                            )}>
                                {counts[f.key]}
                            </span>
                        )}
                    </Button>
                ))}
            </div>

            {/* Goals Table */}
            <Section>
                {processedGoals.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="py-3 px-4 text-left whitespace-nowrap font-medium">
                                        <Typography variant="caption" className="font-semibold text-(--foreground-muted)">
                                            {t('goals.table.name')}
                                        </Typography>
                                    </th>
                                    <th className="py-3 px-4 text-right whitespace-nowrap font-medium">
                                        <Typography variant="caption" className="font-semibold text-(--foreground-muted)">
                                            {t('goals.table.currentValue')}
                                        </Typography>
                                    </th>
                                    <th className="py-3 px-4 text-right whitespace-nowrap font-medium">
                                        <Typography variant="caption" className="font-semibold text-(--foreground-muted)">
                                            Target
                                        </Typography>
                                    </th>
                                    <th className="py-3 px-4 text-left whitespace-nowrap font-medium">
                                        <Typography variant="caption" className="font-semibold text-(--foreground-muted)">
                                            {t('goals.form.targetDate')}
                                        </Typography>
                                    </th>
                                    <th className="py-3 px-4 text-right whitespace-nowrap font-medium">
                                        <Typography variant="caption" className="font-semibold text-(--foreground-muted)">
                                            Progress
                                        </Typography>
                                    </th>
                                    <th className="py-3 px-4 text-right whitespace-nowrap font-medium">
                                        <Typography variant="caption" className="font-semibold text-(--foreground-muted)">
                                            {t('goals.table.remaining')}
                                        </Typography>
                                    </th>
                                    <th className="py-3 px-4 text-center whitespace-nowrap font-medium">
                                        <Typography variant="caption" className="font-semibold text-(--foreground-muted)">
                                            Status
                                        </Typography>
                                    </th>
                                    <th className="py-3 px-4 text-right whitespace-nowrap font-medium">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {processedGoals.map((goal) => {
                                    const badge = statusBadge[goal.status]
                                    const progress = goal.progressPercentage ?? 0
                                    const hasTarget = goal.targetAmount != null && goal.targetAmount > 0
                                    const remaining = hasTarget
                                        ? Math.max(0, goal.targetAmount! - goal.totalCurrentValue)
                                        : null

                                    return (
                                        <tr
                                            key={goal.id}
                                            onClick={() => router.push(ROUTES.GOAL_DETAIL(goal.id))}
                                            className="border-b border-border hover:bg-muted/50 cursor-pointer transition-colors group"
                                        >
                                            {/* Goal Name */}
                                            <td className="py-4 px-4 whitespace-nowrap">
                                                <Typography variant="body-sm" className="font-medium">
                                                    {goal.name}
                                                </Typography>
                                            </td>

                                            {/* Current Value */}
                                            <td className="py-4 px-4 whitespace-nowrap text-right">
                                                <Typography variant="body-sm" className="financial-value font-semibold">
                                                    {formatCurrency(goal.totalCurrentValue, locale)}
                                                </Typography>
                                            </td>

                                            {/* Target */}
                                            <td className="py-4 px-4 whitespace-nowrap text-right">
                                                <Typography variant="body-sm" className="financial-value">
                                                    {hasTarget ? formatCurrency(goal.targetAmount!, locale) : '—'}
                                                </Typography>
                                            </td>

                                            {/* Target Date */}
                                            <td className="py-4 px-4 whitespace-nowrap text-left">
                                                <Typography variant="body-sm" className="text-muted-foreground">
                                                    {goal.targetDate ? new Date(goal.targetDate).toLocaleDateString(locale, { dateStyle: 'medium' }) : '—'}
                                                </Typography>
                                            </td>

                                            {/* Progress */}
                                            <td className="py-4 px-4 whitespace-nowrap text-right">
                                                {hasTarget ? (
                                                    <Stack gap="xs" className="items-end">
                                                        <Typography variant="body-sm" className={cn(
                                                            'font-semibold',
                                                            goal.status === 'achieved' ? 'text-green-600 dark:text-green-400' : ''
                                                        )}>
                                                            {progress.toFixed(1)}%
                                                        </Typography>
                                                        <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                                                            <div
                                                                className={cn(
                                                                    'h-full rounded-full transition-all',
                                                                    goal.status === 'achieved' ? 'bg-green-500' : progress >= 75 ? 'bg-amber-500' : 'bg-primary'
                                                                )}
                                                                style={{ width: `${Math.min(progress, 100)}%` }}
                                                            />
                                                        </div>
                                                    </Stack>
                                                ) : (
                                                    <Typography variant="body-sm" className="text-muted-foreground">—</Typography>
                                                )}
                                            </td>

                                            {/* Remaining */}
                                            <td className="py-4 px-4 whitespace-nowrap text-right">
                                                <Typography variant="body-sm" className={cn(
                                                    'financial-value',
                                                    remaining === 0 ? 'text-green-600 dark:text-green-400 font-medium' : ''
                                                )}>
                                                    {remaining != null ? formatCurrency(remaining, locale) : '—'}
                                                </Typography>
                                            </td>

                                            {/* Status */}
                                            <td className="py-4 px-4 whitespace-nowrap text-center">
                                                <span className={cn(
                                                    'inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium ring-1 ring-inset',
                                                    badge.className
                                                )}>
                                                    {badge.label}
                                                </span>
                                            </td>

                                            {/* Delete */}
                                            <td className="py-4 px-4 whitespace-nowrap text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        if (confirm(t('goals.messages.deleteConfirm'))) {
                                                            deleteMutation.mutate(goal.id)
                                                        }
                                                    }}
                                                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-16 text-center border border-dashed border-border rounded-xl bg-surface/50">
                        <Typography variant="body" className="text-muted-foreground uppercase tracking-widest text-xs font-semibold">
                            {t('goals.list.empty')}
                        </Typography>
                    </div>
                )}
            </Section>

            <div className="h-8" />
        </Stack>
    )
}
