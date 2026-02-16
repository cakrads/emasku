'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/frontend/components/ui/card'
import { Stack, Section } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { Button, buttonVariants } from '@/frontend/components/ui/button'
import { StandardPageLayout } from '@/frontend/components/layout/standard-page-layout'
import { ErrorBoundary } from '@/frontend/components/fragments/admin/error-boundary'
import { Skeleton } from '@/frontend/components/ui/skeleton'
import { Pencil, Trash2, ExternalLink, TrendingUp, TrendingDown, Calendar } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/frontend/config/routes'
import { fetchGoalDetail, deleteGoal } from '@/frontend/services/goals/goals.api'
import { useLanguage } from '@/frontend/hooks/use-language'
import { toast } from 'sonner'
import { formatCurrency } from '@/frontend/utils/format'
import { cn } from '@/frontend/utils/cn'
import { intervalToDuration } from 'date-fns'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/frontend/components/ui/alert-dialog'

export default function GoalDetailView({ goalId }: { goalId: string }) {
    return (
        <ErrorBoundary>
            <GoalDetailContent goalId={goalId} />
        </ErrorBoundary>
    )
}

function GoalDetailContent({ goalId }: { goalId: string }) {
    const { t, language } = useLanguage()
    const locale = language === 'id' ? 'id-ID' : 'en-US'
    const router = useRouter()
    const queryClient = useQueryClient()
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    const { data, isLoading, error } = useQuery({
        queryKey: ['goals', goalId],
        queryFn: () => fetchGoalDetail(goalId),
    })

    const deleteMutation = useMutation({
        mutationFn: deleteGoal,
        onSuccess: () => {
            toast.success(t('goals.messages.deleteSuccess'))
            queryClient.invalidateQueries({ queryKey: ['goals'] })
            router.push(ROUTES.GOALS_LIST)
        },
        onError: () => {
            toast.error(t('goals.messages.deleteError'))
        },
    })

    const breadcrumbs = [
        { label: t('navbar.dashboard'), href: ROUTES.DASHBOARD },
        { label: t('goals.title'), href: ROUTES.GOALS_LIST },
        { label: t('goals.detail.breadcrumb'), href: '#' },
    ]

    if (isLoading) {
        return (
            <StandardPageLayout
                title={t('common.loading')}
                breadcrumbs={breadcrumbs}
            >
                <div className="max-w-xl mx-auto pb-24">
                    {/* Header Skeleton (Matches Centered Hero) */}
                    <Section className="py-6 px-6 text-center mb-6">
                        <Stack gap="xs" className="items-center">
                            <Skeleton className="h-12 w-64" /> {/* Name */}
                            <Skeleton className="h-5 w-24 rounded-md mt-2" /> {/* Status */}
                            <Skeleton className="h-4 w-40 mt-3" /> {/* Date */}
                        </Stack>
                    </Section>

                    {/* Summary Card Skeleton (Detailed) */}
                    <Section className="px-0 mb-6">
                        <Card className="bg-surface-elevated border-border shadow-sm">
                            <CardContent className="p-5">
                                <Stack gap="md">
                                    <div className="flex justify-between items-center">
                                        <Skeleton className="h-5 w-32" />
                                        <Skeleton className="h-5 w-12" />
                                    </div>

                                    {/* Progress Bar Placeholder */}
                                    <Skeleton className="h-2.5 w-full rounded-full opacity-50" />

                                    <Stack gap="md" className="mt-2">
                                        {/* Detail Rows */}
                                        <div className="flex justify-between items-start">
                                            <Skeleton className="h-4 w-32 mt-1" />
                                            <div className="text-right flex flex-col items-end gap-1.5">
                                                <Skeleton className="h-6 w-40" />
                                                <Skeleton className="h-4 w-24 opacity-60" />
                                            </div>
                                        </div>
                                        <div className="h-px bg-border w-full opacity-50" />
                                        <div className="flex justify-between items-center">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-5 w-28" />
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <Skeleton className="h-4 w-28" />
                                            <Skeleton className="h-5 w-24" />
                                        </div>
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Section>

                    {/* Holdings List Skeleton (Table Style) */}
                    <Section className="px-0 mt-6">
                        <Card className="bg-surface-elevated border-border shadow-sm">
                            <CardContent className="p-5">
                                <Stack gap="md">
                                    <Skeleton className="h-5 w-48 mb-2" />
                                    <div className="space-y-4">
                                        {/* Table Header Placeholder */}
                                        <div className="flex justify-between border-b border-border pb-2">
                                            <Skeleton className="h-3 w-16 opacity-40" />
                                            <Skeleton className="h-3 w-16 opacity-40" />
                                            <Skeleton className="h-3 w-16 opacity-40" />
                                        </div>
                                        {/* Row Placeholders */}
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="flex justify-between items-center py-1">
                                                <Skeleton className="h-5 w-40" />
                                                <Skeleton className="h-5 w-12" />
                                                <Skeleton className="h-5 w-28" />
                                            </div>
                                        ))}
                                    </div>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Section>
                </div>
            </StandardPageLayout>
        )
    }

    if (error || !data) {
        throw error || new Error('Failed to load goal')
    }

    const progress = data.progressPercentage ?? 0
    const hasTarget = data.targetAmount != null && data.targetAmount > 0
    const remaining = hasTarget ? Math.max(0, data.targetAmount! - data.totalCurrentValue) : null

    // Profit/Loss Calculation
    const invested = data.totalInvestedValue || 0
    const currentValue = data.totalCurrentValue || 0
    const profit = currentValue - invested
    const profitPercent = invested > 0 ? (profit / invested) * 100 : 0
    const isPositive = profit >= 0

    // Compute time remaining if targetDate exists
    let timeRemainingLabel = ''
    let isPastDue = false
    let formattedDate = ''
    if (data.targetDate) {
        const targetDate = new Date(data.targetDate)
        formattedDate = targetDate.toLocaleDateString(locale, {
            day: 'numeric', month: 'long', year: 'numeric'
        })
        const now = new Date()
        if (targetDate > now) {
            const duration = intervalToDuration({ start: now, end: targetDate })
            const parts: string[] = []
            if (duration.years && duration.years > 0) {
                const unit = duration.years === 1
                    ? t('common.duration.year')
                    : t('common.duration.years')
                parts.push(`${duration.years} ${unit}`)
            }
            if (duration.months && duration.months > 0) {
                const unit = duration.months === 1
                    ? t('common.duration.month')
                    : t('common.duration.months')
                parts.push(`${duration.months} ${unit}`)
            }
            if (parts.length === 0 && duration.days && duration.days > 0) {
                const unit = duration.days === 1
                    ? t('common.duration.day')
                    : t('common.duration.days')
                parts.push(`${duration.days} ${unit}`)
            }
            timeRemainingLabel = parts.join(' ')
        } else {
            timeRemainingLabel = t('goals.detail.pastDue')
            isPastDue = true
        }
    }

    // Holdings subtotal
    const holdingsSubtotal = data.holdings.reduce(
        (sum, h) => sum + (h.currentValue ?? 0),
        0
    )

    // Status config
    const statusConfig = data.isAchieved
        ? { label: t('goals.status.achieved'), className: 'text-green-600 dark:text-green-400' }
        : hasTarget
            ? { label: t('goals.status.inProgress'), className: 'text-blue-600 dark:text-blue-400' }
            : { label: t('goals.status.noTarget'), className: 'text-gray-500 dark:text-gray-400' }

    return (
        <StandardPageLayout
            title={t('goals.detail.title')}
            breadcrumbs={breadcrumbs}
            action={
                <Link href={ROUTES.GOAL_EDIT(goalId)}>
                    <Button variant="outline" className="gap-2">
                        <Pencil className="h-4 w-4" />
                        {t('goals.detail.edit')}
                    </Button>
                </Link>
            }
        >
            <div className="max-w-xl mx-auto pb-24">

                {/* HERO SECTION: Goal Name (Large), Status (PnL style), Date */}
                <Section className="py-6 px-6 text-center mb-6">
                    <div className="flex flex-col items-center gap-2">
                        <Typography variant="h2" className="text-4xl font-bold tracking-tight">
                            {data.name}
                        </Typography>

                        <div className="flex flex-col items-center gap-1">
                            <span className={cn(
                                'text-base font-semibold',
                                statusConfig.className
                            )}>
                                {statusConfig.label}
                            </span>

                            {data.targetDate && (
                                <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-sm font-medium">
                                        {formattedDate}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </Section>

                {/* SECTION: SUMMARY CARD (Clean Layout) */}
                <Section className="px-0 mb-6">
                    <Card className="bg-surface-elevated border-border shadow-sm">
                        <CardContent className="p-5">
                            <Stack gap="md">
                                <Stack direction="horizontal" className="justify-between items-center">
                                    <Typography variant="h3" className="text-sm">{t('goals.detail.summary')}</Typography>
                                    {hasTarget && (
                                        <Typography variant="body" className="font-semibold text-primary">
                                            {progress.toFixed(1)}%
                                        </Typography>
                                    )}
                                </Stack>

                                {/* Progress Bar */}
                                {hasTarget && (
                                    <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                                        <div
                                            className={cn('h-full rounded-full transition-all', data.isAchieved ? 'bg-green-500' : 'bg-primary')}
                                            style={{ width: `${Math.min(progress, 100)}%` }}
                                        />
                                    </div>
                                )}

                                <Stack gap="md" className="mt-2">
                                    {/* Current Value & PnL Combined */}
                                    <Stack direction="horizontal" className="justify-between items-start">
                                        <Typography variant="body-sm" className="pt-1">{t('goals.detail.currentValue')}</Typography>
                                        <div className="text-right">
                                            <Typography variant="body" className="font-medium financial-value text-lg">
                                                {formatCurrency(currentValue, locale)}
                                            </Typography>
                                            {invested > 0 && (
                                                <div className="flex items-center justify-end gap-1 mt-0.5">
                                                    {isPositive ? (
                                                        <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />
                                                    ) : (
                                                        <TrendingDown className="w-3 h-3 text-red-600 dark:text-red-400" />
                                                    )}
                                                    <Typography variant="caption" className={cn(
                                                        "font-medium",
                                                        isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                                                    )}>
                                                        {formatCurrency(profit, locale)} ({isPositive ? '+' : ''}{profitPercent.toFixed(2)}%)
                                                    </Typography>
                                                </div>
                                            )}
                                        </div>
                                    </Stack>

                                    <div className="h-px bg-border w-full" />

                                    {/* Target Amount */}
                                    <Stack direction="horizontal" className="justify-between items-center">
                                        <Typography variant="body-sm">{t('goals.detail.targetAmount')}</Typography>
                                        <Typography variant="body" className="font-medium financial-value">
                                            {hasTarget ? formatCurrency(data.targetAmount!, locale) : '—'}
                                        </Typography>
                                    </Stack>

                                    {/* Remaining Amount */}
                                    <Stack direction="horizontal" className="justify-between items-center">
                                        <Typography variant="body-sm">{t('goals.detail.remaining')}</Typography>
                                        <Typography variant="body" className={cn(
                                            'font-medium financial-value',
                                            remaining === 0 ? 'text-green-600 dark:text-green-400' : ''
                                        )}>
                                            {formatCurrency(remaining!, locale)}
                                        </Typography>
                                    </Stack>

                                    {/* Time Remaining */}
                                    {data.targetDate && timeRemainingLabel && (
                                        <Stack direction="horizontal" className="justify-between items-center">
                                            <Typography variant="body-sm">{t('goals.detail.timeRemaining')}</Typography>
                                            <Typography variant="body" className={cn(
                                                'font-medium',
                                                isPastDue && 'text-red-600 dark:text-red-400 font-semibold'
                                            )}>
                                                {timeRemainingLabel}
                                            </Typography>
                                        </Stack>
                                    )}
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                </Section>

                {/* SECTION: HOLDINGS CONTRIBUTION */}
                <Section className="px-0 mt-6">
                    <Card className="bg-surface-elevated border-border shadow-sm">
                        <CardContent className="p-5">
                            <Stack gap="md">
                                <Typography variant="h3" className="text-sm font-medium">
                                    {t('goals.detail.linkedHoldings')} ({data.holdingCount})
                                </Typography>

                                {data.holdings.length === 0 ? (
                                    <div className="py-8 text-center border border-dashed border-border rounded-xl bg-surface/50">
                                        <Typography variant="body" className="text-muted-foreground">
                                            {t('goals.detail.noHoldings')}
                                        </Typography>
                                        <Typography variant="body-sm" className="text-muted-foreground mt-1">
                                            {t('goals.detail.noHoldingsDesc')}
                                        </Typography>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="py-2 px-3 text-left">
                                                        <Typography variant="caption" className="font-semibold text-muted-foreground">
                                                            Holding
                                                        </Typography>
                                                    </th>
                                                    <th className="py-2 px-3 text-right">
                                                        <Typography variant="caption" className="font-semibold text-muted-foreground">
                                                            {t('holdings.table.weight')}
                                                        </Typography>
                                                    </th>
                                                    <th className="py-2 px-3 text-right">
                                                        <Typography variant="caption" className="font-semibold text-muted-foreground">
                                                            {t('goals.detail.currentValue')}
                                                        </Typography>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.holdings.map((holding) => (
                                                    <tr
                                                        key={holding.id}
                                                        onClick={() => router.push(ROUTES.HOLDING_DETAIL(holding.id))}
                                                        className="border-b border-border hover:bg-muted/50 cursor-pointer transition-colors group"
                                                    >
                                                        <td className="py-3 px-3">
                                                            <Stack direction="horizontal" gap="xs" className="items-center">
                                                                <Typography variant="body-sm" className="font-medium">
                                                                    {holding.brandName} {holding.denominationGram}g
                                                                </Typography>
                                                                <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            </Stack>
                                                        </td>
                                                        <td className="py-3 px-3 text-right">
                                                            <Typography variant="body-sm">
                                                                {holding.denominationGram}g
                                                            </Typography>
                                                        </td>
                                                        <td className="py-3 px-3 text-right">
                                                            <Typography variant="body-sm" className="financial-value font-medium">
                                                                {holding.currentValue != null
                                                                    ? formatCurrency(holding.currentValue, locale)
                                                                    : '—'}
                                                            </Typography>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            {/* Subtotal */}
                                            <tfoot>
                                                <tr className="border-t-2 border-border">
                                                    <td colSpan={2} className="py-3 px-3 text-right">
                                                        <Typography variant="body-sm" className="font-semibold">
                                                            Subtotal
                                                        </Typography>
                                                    </td>
                                                    <td className="py-3 px-3 text-right">
                                                        <Typography variant="body-sm" className="financial-value font-semibold">
                                                            {formatCurrency(holdingsSubtotal, locale)}
                                                        </Typography>
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                )}
                            </Stack>
                        </CardContent>
                    </Card>
                </Section>

                {/* Delete Action */}
                <Section className="px-0 mt-8">
                    <Button
                        variant="outline"
                        color="destructive"
                        size="lg"
                        className="w-full rounded-xl h-14"
                        onClick={() => setShowDeleteDialog(true)}
                    >
                        <Trash2 className="w-5 h-5 mr-2" />
                        {t('goals.detail.delete')}
                    </Button>
                </Section>

                {/* Delete Dialog */}
                <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-destructive">
                                {t('goals.detail.deleteTitle')}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                {t('goals.messages.deleteConfirm')}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>{t('goals.form.cancel')}</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => deleteMutation.mutate(goalId)}
                                className={buttonVariants({ variant: 'solid', color: 'destructive' })}
                            >
                                {deleteMutation.isPending ? '...' : t('goals.detail.delete')}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </StandardPageLayout>
    )
}
