'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/frontend/components/ui/card'
import { Stack, Section, Divider } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { Button, buttonVariants } from '@/frontend/components/ui/button'
import { StandardPageLayout } from '@/frontend/components/layout/standard-page-layout'
import { ErrorBoundary } from '@/frontend/components/fragments/admin/error-boundary'
import { Pencil, Trash2, ExternalLink, TrendingUp, TrendingDown, Calendar, CheckCircle2, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/frontend/config/routes'
import { fetchGoalDetail, deleteGoal, updateGoal } from '@/frontend/services/goals/goals.api'
import { useLanguage } from '@/frontend/hooks/use-language'
import { toast } from 'sonner'
import { formatCurrency } from '@/frontend/utils/format'
import { cn } from '@/frontend/utils/cn'
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
import { GoalDetailSkeleton } from './components/goal-detail-skeleton'
import { useGoalDetailMetrics } from './hooks/use-goal-detail-metrics'
import { Skeleton } from '@/frontend/components/ui/skeleton'

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
    const [showCompleteDialog, setShowCompleteDialog] = useState(false)
    const [showReopenDialog, setShowReopenDialog] = useState(false)

    const { data, isLoading, error } = useQuery({
        queryKey: ['goals', goalId],
        queryFn: () => fetchGoalDetail(goalId),
    })

    // Metrics hook is called unconditionally — handles undefined data internally
    const metrics = useGoalDetailMetrics(data, locale, t)

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

    const updateMutation = useMutation({
        mutationFn: ({ id, data: updateData }: { id: string; data: any }) => updateGoal(id, updateData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['goals', goalId] })
            queryClient.invalidateQueries({ queryKey: ['goals'] })
            setShowCompleteDialog(false)
            setShowReopenDialog(false)
        },
        onError: () => {
            toast.error(t('goals.messages.updateError'))
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
                title={t('goals.detail.title')}
                breadcrumbs={breadcrumbs}
                action={
                    <Stack direction="horizontal" gap="sm">
                        <Skeleton className="h-11 w-9 sm:w-36" />
                        <Skeleton className="h-11 w-9 sm:w-20" />
                    </Stack>
                }
            >
                <GoalDetailSkeleton />
            </StandardPageLayout>
        )
    }

    if (error || !data) {
        throw error || new Error('Failed to load goal')
    }

    const {
        displayValue, progress, hasTarget, remaining,
        invested, profit, profitPercent, isPositive,
        timeRemainingLabel, isPastDue, formattedDate,
        holdingsSubtotal, statusConfig,
    } = metrics

    return (
        <StandardPageLayout
            title={t('goals.detail.title')}
            breadcrumbs={breadcrumbs}
            action={
                <Stack direction="horizontal" gap="sm">
                    {data.lifecycleStatus === 'ACTIVE' && (
                        <Button variant="solid" color="primary" className="gap-2" onClick={() => setShowCompleteDialog(true)}>
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="hidden sm:inline">{t('goals.detail.markAsCompleted')}</span>
                        </Button>
                    )}
                    {data.lifecycleStatus === 'COMPLETED' && (
                        <Button variant="outline" className="gap-2" onClick={() => setShowReopenDialog(true)}>
                            <RotateCcw className="h-4 w-4" />
                            <span className="hidden sm:inline">{t('goals.detail.reopenGoal')}</span>
                        </Button>
                    )}
                    <Link href={ROUTES.GOAL_EDIT(goalId)}>
                        <Button variant="outline" className="gap-2">
                            <Pencil className="h-4 w-4" />
                            <span className="hidden sm:inline">{t('goals.detail.edit')}</span>
                        </Button>
                    </Link>
                </Stack>
            }
        >
            <div className="w-full max-w-xl mx-auto pb-24 sm:min-w-[500px]">

                {/* HERO: Goal Name, Status, Date */}
                <Section className="py-6 px-6 text-center mb-6">
                    <Stack direction="vertical" className="items-center gap-2">
                        <Typography variant="h2" className="text-4xl font-bold tracking-tight">
                            {data.name}
                        </Typography>
                        <Stack direction="vertical" className="items-center gap-1">
                            <Typography variant="body" className={cn('text-base font-semibold', statusConfig.className)}>
                                {statusConfig.label}
                            </Typography>
                            {data.targetDate && (
                                <Stack direction="horizontal" className="items-center gap-1.5 text-muted-foreground mt-1">
                                    <Calendar className="w-4 h-4" />
                                    <Typography variant="body-sm" className="font-medium">{formattedDate}</Typography>
                                </Stack>
                            )}
                        </Stack>
                    </Stack>
                </Section>

                {/* SUMMARY CARD */}
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

                                {hasTarget && (
                                    <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                                        <div
                                            className={cn(
                                                'h-full rounded-full transition-all',
                                                data.lifecycleStatus === 'COMPLETED' || data.isAchieved ? 'bg-green-500' : 'bg-primary'
                                            )}
                                            style={{ width: `${Math.min(progress, 100)}%` }}
                                        />
                                    </div>
                                )}

                                <Stack gap="md" className="mt-2">
                                    <Stack direction="horizontal" className="justify-between items-start">
                                        <Typography variant="body-sm" className="pt-1">
                                            {data.lifecycleStatus === 'COMPLETED' ? t('goals.detail.finishedWithValue') : t('goals.detail.currentValue')}
                                        </Typography>
                                        <Stack direction="vertical" className="text-right items-end">
                                            <Typography variant="body" className="font-medium financial-value text-lg">
                                                {formatCurrency(displayValue, locale)}
                                            </Typography>
                                            {invested > 0 && (
                                                <Stack direction="horizontal" className="items-center justify-end gap-1 mt-1">
                                                    {isPositive
                                                        ? <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />
                                                        : <TrendingDown className="w-3 h-3 text-red-600 dark:text-red-400" />
                                                    }
                                                    <Typography variant="caption" className={cn(
                                                        'font-medium',
                                                        isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                                    )}>
                                                        {formatCurrency(profit, locale)} ({isPositive ? '+' : ''}{profitPercent.toFixed(2)}%)
                                                    </Typography>
                                                </Stack>
                                            )}
                                            {data.lifecycleStatus === 'COMPLETED' && (
                                                <Typography variant="caption" className="text-muted-foreground mt-0.5 max-w-[200px] leading-tight">
                                                    {t('goals.detail.finishedValueDisclaimer')}
                                                </Typography>
                                            )}
                                        </Stack>
                                    </Stack>

                                    <Divider className="mt-2" />

                                    <Stack direction="horizontal" className="justify-between items-center">
                                        <Typography variant="body-sm">{t('goals.detail.targetAmount')}</Typography>
                                        <Typography variant="body" className="font-medium financial-value">
                                            {hasTarget ? formatCurrency(data.targetAmount!, locale) : '—'}
                                        </Typography>
                                    </Stack>

                                    <Stack direction="horizontal" className="justify-between items-center">
                                        <Typography variant="body-sm">{t('goals.detail.remaining')}</Typography>
                                        <Typography variant="body" className={cn(
                                            'font-medium financial-value',
                                            remaining === 0 ? 'text-green-600 dark:text-green-400' : ''
                                        )}>
                                            {formatCurrency(remaining!, locale)}
                                        </Typography>
                                    </Stack>

                                    {data.targetDate && timeRemainingLabel && data.lifecycleStatus === 'ACTIVE' && (
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

                                    {data.completedAt && (
                                        <Stack direction="horizontal" className="justify-between items-center">
                                            <Typography variant="body-sm">{t('goals.detail.completedAt')}</Typography>
                                            <Typography variant="body" className="font-medium">
                                                {new Date(data.completedAt).toLocaleDateString(locale, { dateStyle: 'long' })}
                                            </Typography>
                                        </Stack>
                                    )}
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                </Section>

                {/* HOLDINGS CONTRIBUTION */}
                <Section className="px-0 mt-6">
                    <Card className="bg-surface-elevated border-border shadow-sm">
                        <CardContent className="p-5">
                            <Stack gap="md">
                                <Typography variant="h3" className="text-sm font-medium">
                                    {t('goals.detail.linkedHoldings')} ({data.holdingCount})
                                </Typography>

                                {data.holdings.length === 0 ? (
                                    <Stack direction="vertical" className="py-8 text-center border border-dashed border-border rounded-xl bg-surface/50">
                                        <Typography variant="body" className="text-muted-foreground">
                                            {t('goals.detail.noHoldings')}
                                        </Typography>
                                        <Typography variant="body-sm" className="text-muted-foreground mt-1">
                                            {t('goals.detail.noHoldingsDesc')}
                                        </Typography>
                                    </Stack>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="py-2 px-2 text-left">
                                                        <Typography variant="caption" className="font-semibold text-muted-foreground">Holding</Typography>
                                                    </th>
                                                    <th className="py-2 px-2 text-right">
                                                        <Typography variant="caption" className="font-semibold text-muted-foreground">
                                                            {data.lifecycleStatus === 'COMPLETED' ? t('goals.detail.holdingValueLabel') : t('goals.detail.currentValue')}
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
                                                        <td className="py-3 px-2">
                                                            <Stack gap="xs">
                                                                <Stack direction="horizontal" gap="xs" className="items-center">
                                                                    <Typography variant="body-sm" className="font-medium">{holding.brandName}</Typography>
                                                                    <Typography variant="body-sm" className="text-muted-foreground font-medium">{holding.denominationGram}g</Typography>
                                                                    <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                                                                </Stack>
                                                            </Stack>
                                                        </td>
                                                        <td className="py-3 px-2 text-right">
                                                            <Stack gap="xs" className="items-end">
                                                                <Typography variant="body-sm" className="financial-value font-medium">
                                                                    {holding.currentValue != null ? formatCurrency(holding.currentValue, locale) : '—'}
                                                                </Typography>
                                                                {(holding.status === 'SOLD' || holding.isSold) ? (
                                                                    <Typography variant="caption" className="text-muted-foreground/70 text-[10px] flex gap-1 items-center">
                                                                        {holding.soldDate
                                                                            ? t('goals.detail.soldValueWithDate', {
                                                                                date: new Date(holding.soldDate).toLocaleDateString(locale, {
                                                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                                                })
                                                                            })
                                                                            : t('goals.detail.soldValueWithDate', { date: '—' }).split(' \u2022 ')[0]
                                                                        }
                                                                    </Typography>
                                                                ) : (
                                                                    <Typography variant="caption" className="text-muted-foreground/70 text-[10px]">
                                                                        {t('goals.detail.currentValue')}
                                                                    </Typography>
                                                                )}
                                                            </Stack>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            {data.lifecycleStatus !== 'COMPLETED' && (
                                                <tfoot>
                                                    <tr className="border-t-2 border-border">
                                                        <td className="py-3 px-2 text-right">
                                                            <Typography variant="body-sm" className="font-semibold">Subtotal</Typography>
                                                        </td>
                                                        <td className="py-3 px-2 text-right">
                                                            <Typography variant="body-sm" className="financial-value font-semibold">
                                                                {formatCurrency(holdingsSubtotal, locale)}
                                                            </Typography>
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            )}
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

                {/* Dialogs */}
                <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-destructive">{t('goals.detail.deleteTitle')}</AlertDialogTitle>
                            <AlertDialogDescription>{t('goals.messages.deleteConfirm')}</AlertDialogDescription>
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

                <AlertDialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{t('goals.detail.completionDialog.title')}</AlertDialogTitle>
                            <AlertDialogDescription>
                                {progress < 100 ? t('goals.detail.completionDialog.warning') : t('goals.detail.completionDialog.description')}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>{t('goals.form.cancel')}</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => updateMutation.mutate({ id: goalId, data: { lifecycleStatus: 'COMPLETED' } })}
                                className={buttonVariants({ variant: 'solid', color: 'primary' })}
                            >
                                {updateMutation.isPending ? '...' : t('goals.detail.completionDialog.confirm')}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <AlertDialog open={showReopenDialog} onOpenChange={setShowReopenDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{t('goals.detail.reopenDialog.title')}</AlertDialogTitle>
                            <AlertDialogDescription>{t('goals.detail.reopenDialog.description')}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>{t('goals.form.cancel')}</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => updateMutation.mutate({ id: goalId, data: { lifecycleStatus: 'ACTIVE' } })}
                                className={buttonVariants({ variant: 'solid', color: 'primary' })}
                            >
                                {updateMutation.isPending ? '...' : t('goals.detail.reopenDialog.confirm')}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </StandardPageLayout>
    )
}
