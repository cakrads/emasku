'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Stack, Section, Grid } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { Button } from '@/frontend/components/ui/button'
import { Card, CardContent } from '@/frontend/components/ui/card'
import { StandardPageLayout } from '@/frontend/components/layout/standard-page-layout'
import { ErrorBoundary } from '@/frontend/components/fragments/admin/error-boundary'
import { Plus, Target, Trash2, Calendar } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/frontend/config/routes'
import { fetchGoals, deleteGoal } from '@/frontend/services/goals/goals.api'
import { useLanguage } from '@/frontend/hooks/use-language'
import { toast } from 'sonner'
import { formatCurrency } from '@/frontend/utils/format'
import { cn } from '@/frontend/utils/cn'
import { GoalsListSkeleton } from './components/goals-list-skeleton'
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
            className: 'bg-positive/10 text-positive ring-positive/20',
        },
        'in-progress': {
            label: t('goals.status.inProgress'),
            className: 'bg-primary/10 text-primary ring-primary/20',
        },
        'no-target': {
            label: t('goals.status.noTarget'),
            className: 'bg-muted text-muted-foreground ring-border',
        },
        'completed': {
            label: t('goals.status.completed'),
            className: 'bg-positive/10 text-positive ring-positive/20',
        },
    }

    return (
        <Stack gap="sm">
            {/* Filter Chips */}
            <Stack direction="horizontal" className="flex-wrap items-center gap-2">
                {filters.map((f) => (
                    <Button
                        key={f.key}
                        variant={activeFilter === f.key ? 'solid' : 'outline'}
                        color={activeFilter === f.key ? 'primary' : undefined}
                        size="sm"
                        rounded="full"
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
            </Stack>

            {processedGoals.length > 0 ? (
                <>
                    {/* Mobile: 2-Column Card Grid */}
                    <Grid className="grid-cols-2 gap-3 md:hidden">
                        {processedGoals.map((goal) => {
                            const badge = statusBadge[goal.status]
                            const progress = goal.progressPercentage ?? 0
                            const hasTarget = goal.targetAmount != null && goal.targetAmount > 0

                            return (
                                <Card
                                    key={goal.id}
                                    className="cursor-pointer hover:border-primary/40 transition-colors active:scale-[0.99]"
                                    onClick={() => router.push(ROUTES.GOAL_DETAIL(goal.id))}
                                >
                                    <CardContent className="p-4">
                                        <Stack gap="sm">
                                            <Stack gap="xs">
                                                <Typography variant="body-sm" className="font-semibold leading-tight line-clamp-2">
                                                    {goal.name}
                                                </Typography>
                                                <span className={cn(
                                                    'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset w-fit',
                                                    badge.className
                                                )}>
                                                    {badge.label}
                                                </span>
                                            </Stack>

                                            {hasTarget && (
                                                <Stack gap="xs">
                                                    <Typography variant="caption" className="text-muted-foreground">
                                                        {progress.toFixed(0)}%
                                                    </Typography>
                                                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                                                        <div
                                                            className={cn(
                                                                'h-full rounded-full transition-all',
                                                                goal.status === 'completed' || goal.status === 'achieved'
                                                                    ? 'bg-positive'
                                                                    : 'bg-accent-gold'
                                                            )}
                                                            style={{ width: `${Math.min(progress, 100)}%` }}
                                                        />
                                                    </div>
                                                </Stack>
                                            )}

                                            <Stack gap="xs">
                                                <Typography variant="caption" className="financial-value font-semibold text-foreground">
                                                    {formatCurrency(goal.totalCurrentValue, locale)}
                                                </Typography>
                                                {hasTarget && (
                                                    <Typography variant="caption" className="text-muted-foreground">
                                                        / {formatCurrency(goal.targetAmount!, locale)}
                                                    </Typography>
                                                )}
                                                {goal.targetDate && (
                                                    <Stack direction="horizontal" className="items-center gap-1 text-muted-foreground">
                                                        <Calendar className="h-3 w-3" />
                                                        <Typography variant="caption">
                                                            {new Date(goal.targetDate).toLocaleDateString(locale, { month: 'short', year: 'numeric' })}
                                                        </Typography>
                                                    </Stack>
                                                )}
                                            </Stack>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </Grid>

                    {/* Desktop: Table */}
                    <Section className="hidden md:block">
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
                                        <th className="py-3 px-4 text-right whitespace-nowrap font-medium">
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
                                                <td className="py-4 px-4 whitespace-nowrap text-right">
                                                    {hasTarget ? (
                                                        <Stack gap="xs" className="items-end">
                                                            <Typography variant="body-sm" className={cn(
                                                                'font-semibold',
                                                                goal.status === 'achieved' ? 'text-positive' : ''
                                                            )}>
                                                                {progress.toFixed(1)}%
                                                            </Typography>
                                                            <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                                                                <div
                                                                    className={cn(
                                                                        'h-full rounded-full transition-all',
                                                                        goal.status === 'completed' || goal.status === 'achieved'
                                                                            ? 'bg-positive'
                                                                            : 'bg-accent-gold'
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
                                                        remaining === 0 ? 'text-positive font-medium' : ''
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
                    </Section>
                </>
            ) : (
                <Stack direction="vertical" className="py-16 text-center border border-dashed border-border rounded-xl bg-surface/50">
                    <Typography variant="body" className="text-muted-foreground uppercase tracking-widest text-xs font-semibold">
                        {t('goals.list.empty')}
                    </Typography>
                </Stack>
            )}
        </Stack>
    )
}
