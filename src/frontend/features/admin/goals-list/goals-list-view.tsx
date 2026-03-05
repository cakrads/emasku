'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Stack, Section } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { Button } from '@/frontend/components/ui/button'
import { StandardPageLayout } from '@/frontend/components/layout/standard-page-layout'
import { ErrorBoundary } from '@/frontend/components/fragments/admin/error-boundary'
import { Plus, Target, Trash2, Filter } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/frontend/config/routes'
import { fetchGoals, deleteGoal } from '@/frontend/services/goals/goals.api'
import { useLanguage } from '@/frontend/hooks/use-language'
import { toast } from 'sonner'
import { formatCurrency } from '@/frontend/utils/format'
import { cn } from '@/frontend/utils/cn'
import dynamic from 'next/dynamic'
import { GoalsListSkeleton } from './components/goals-list-skeleton'

const GoalFilterModal = dynamic(() => import('./components/goal-filter-modal'), { ssr: false })
import { useGoalsList, FilterType, GoalStatus } from './hooks/use-goals-list'

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
                    <Button variant="solid" color="primary" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">{t('goals.list.add')}</span>
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
    const [isFilterOpen, setIsFilterOpen] = useState(false)

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

    const { processedGoals, counts } = useGoalsList(data, activeFilter)

    if (isLoading) return <GoalsListSkeleton />

    if (error || !data) {
        throw error || new Error('Failed to load goals')
    }

    if (data.goals.length === 0) {
        return (
            <Stack direction="vertical" className="py-16 text-center border border-dashed border-border rounded-xl bg-surface/50">
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
            </Stack>
        )
    }

    const filters: { key: FilterType; label: string }[] = [
        { key: 'all', label: t('goals.filter.all') },
        { key: 'in-progress', label: t('goals.filter.inProgress') },
        { key: 'achieved', label: t('goals.filter.achieved') },
        { key: 'completed', label: t('goals.status.completed') },
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
        'completed': {
            label: t('goals.status.completed'),
            className: 'bg-green-100 text-green-700 ring-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20',
        },
    }

    return (
        <Stack gap="sm">
            {/* Filter Button */}
            <Stack direction="horizontal" className="items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFilterOpen(true)}
                    className="gap-2"
                >
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                    {activeFilter !== 'all' && (
                        <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
                            1
                        </span>
                    )}
                </Button>
                {activeFilter !== 'all' && (
                    <span className={cn(
                        'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
                        'bg-primary/10 text-primary ring-primary/20'
                    )}>
                        {filters.find(f => f.key === activeFilter)?.label}
                    </span>
                )}
            </Stack>

            {/* Goals Table */}
            <Section>
                {processedGoals.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="py-3 px-4 text-left whitespace-nowrap font-medium">
                                        <Typography variant="caption" className="font-semibold text-muted-foreground">
                                            {t('goals.table.name')}
                                        </Typography>
                                    </th>
                                    <th className="py-3 px-4 text-right whitespace-nowrap font-medium">
                                        <Typography variant="caption" className="font-semibold text-muted-foreground">
                                            {t('goals.table.currentValue')}
                                        </Typography>
                                    </th>
                                    <th className="py-3 px-4 text-right whitespace-nowrap font-medium">
                                        <Typography variant="caption" className="font-semibold text-muted-foreground">
                                            Target
                                        </Typography>
                                    </th>
                                    <th className="py-3 px-4 text-left whitespace-nowrap font-medium hidden sm:table-cell">
                                        <Typography variant="caption" className="font-semibold text-muted-foreground">
                                            {t('goals.form.targetDate')}
                                        </Typography>
                                    </th>
                                    <th className="py-3 px-4 text-right whitespace-nowrap font-medium hidden md:table-cell">
                                        <Typography variant="caption" className="font-semibold text-muted-foreground">
                                            Progress
                                        </Typography>
                                    </th>
                                    <th className="py-3 px-4 text-right whitespace-nowrap font-medium hidden lg:table-cell">
                                        <Typography variant="caption" className="font-semibold text-muted-foreground">
                                            {t('goals.table.remaining')}
                                        </Typography>
                                    </th>
                                    <th className="py-3 px-4 text-center whitespace-nowrap font-medium">
                                        <Typography variant="caption" className="font-semibold text-muted-foreground">
                                            Status
                                        </Typography>
                                    </th>
                                    <th className="py-3 px-4 text-right whitespace-nowrap font-medium">
                                        <Typography variant="caption" className="font-semibold text-muted-foreground">
                                            Actions
                                        </Typography>
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
                                            <td className="py-4 px-4 whitespace-nowrap">
                                                <Typography variant="body-sm" className="font-medium">
                                                    {goal.name}
                                                </Typography>
                                            </td>
                                            <td className="py-4 px-4 whitespace-nowrap text-right">
                                                <Typography variant="body-sm" className="financial-value font-semibold">
                                                    {formatCurrency(goal.totalCurrentValue, locale)}
                                                </Typography>
                                            </td>
                                            <td className="py-4 px-4 whitespace-nowrap text-right">
                                                <Typography variant="body-sm" className="financial-value">
                                                    {hasTarget ? formatCurrency(goal.targetAmount!, locale) : '—'}
                                                </Typography>
                                            </td>
                                            <td className="py-4 px-4 whitespace-nowrap text-left hidden sm:table-cell">
                                                <Typography variant="body-sm" className="text-muted-foreground">
                                                    {goal.targetDate ? new Date(goal.targetDate).toLocaleDateString(locale, { dateStyle: 'medium' }) : '—'}
                                                </Typography>
                                            </td>
                                            <td className="py-4 px-4 whitespace-nowrap text-right hidden md:table-cell">
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
                                                                    goal.status === 'completed' || goal.status === 'achieved' ? 'bg-green-500' : progress >= 75 ? 'bg-amber-500' : 'bg-primary'
                                                                )}
                                                                style={{ width: `${Math.min(progress, 100)}%` }}
                                                            />
                                                        </div>
                                                    </Stack>
                                                ) : (
                                                    <Typography variant="body-sm" className="text-muted-foreground">—</Typography>
                                                )}
                                            </td>
                                            <td className="py-4 px-4 whitespace-nowrap text-right hidden lg:table-cell">
                                                <Typography variant="body-sm" className={cn(
                                                    'financial-value',
                                                    remaining === 0 ? 'text-green-600 dark:text-green-400 font-medium' : ''
                                                )}>
                                                    {remaining != null ? formatCurrency(remaining, locale) : '—'}
                                                </Typography>
                                            </td>
                                            <td className="py-4 px-4 whitespace-nowrap text-center">
                                                <span className={cn(
                                                    'inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium ring-1 ring-inset',
                                                    badge.className
                                                )}>
                                                    {badge.label}
                                                </span>
                                            </td>
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
                                                    className="opacity-100 md:opacity-0 md:group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
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
                    <Stack direction="vertical" className="py-16 text-center border border-dashed border-border rounded-xl bg-surface/50">
                        <Typography variant="body" className="text-muted-foreground uppercase tracking-widest text-xs font-semibold">
                            {t('goals.list.empty')}
                        </Typography>
                    </Stack>
                )}
            </Section>

            <Stack className="h-8" />

            <GoalFilterModal
                open={isFilterOpen}
                onOpenChange={setIsFilterOpen}
                activeFilter={activeFilter}
                counts={counts}
                onApply={(filter) => setActiveFilter(filter)}
            />
        </Stack>
    )
}
