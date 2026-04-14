import { useMemo } from 'react'
import { intervalToDuration } from 'date-fns'
import { GoalDetail } from '@/shared/contracts/goals.contract'

interface GoalDetailMetrics {
    displayValue: number
    progress: number
    hasTarget: boolean
    remaining: number | null
    invested: number
    profit: number
    profitPercent: number
    isPositive: boolean
    timeRemainingLabel: string
    isPastDue: boolean
    formattedDate: string
    holdingsSubtotal: number
    statusConfig: { label: string; className: string }
}

const EMPTY_METRICS: GoalDetailMetrics = {
    displayValue: 0, progress: 0, hasTarget: false, remaining: null,
    invested: 0, profit: 0, profitPercent: 0, isPositive: true,
    timeRemainingLabel: '', isPastDue: false, formattedDate: '',
    holdingsSubtotal: 0,
    statusConfig: { label: '', className: '' },
}

export function useGoalDetailMetrics(
    data: GoalDetail | undefined,
    locale: string,
    t: (key: string, params?: Record<string, string | number>) => string
): GoalDetailMetrics {
    return useMemo(() => {
        if (!data) return EMPTY_METRICS

        const displayValue = (data.lifecycleStatus === 'COMPLETED' && data.completedValue != null)
            ? data.completedValue
            : (data.totalCurrentValue || 0)

        const progress = data.progressPercentage ?? 0
        const hasTarget = data.targetAmount != null && data.targetAmount > 0
        const remaining = hasTarget ? Math.max(0, data.targetAmount! - displayValue) : null

        const invested = data.totalInvestedValue || 0
        const profit = displayValue - invested
        const profitPercent = invested > 0 ? (profit / invested) * 100 : 0
        const isPositive = profit >= 0

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
                    const unit = duration.years === 1 ? t('common.duration.year') : t('common.duration.years')
                    parts.push(`${duration.years} ${unit}`)
                }
                if (duration.months && duration.months > 0) {
                    const unit = duration.months === 1 ? t('common.duration.month') : t('common.duration.months')
                    parts.push(`${duration.months} ${unit}`)
                }
                if (parts.length === 0 && duration.days && duration.days > 0) {
                    const unit = duration.days === 1 ? t('common.duration.day') : t('common.duration.days')
                    parts.push(`${duration.days} ${unit}`)
                }
                timeRemainingLabel = parts.join(' ')
            } else {
                timeRemainingLabel = t('goals.detail.pastDue')
                isPastDue = true
            }
        }

        const holdingsSubtotal = data.holdings.reduce(
            (sum, h) => sum + (h.currentValue ?? 0),
            0
        )

        const statusConfig = data.lifecycleStatus === 'COMPLETED'
            ? { label: t('goals.status.completed'), className: 'text-positive' }
            : data.isAchieved
                ? { label: t('goals.status.achieved'), className: 'text-positive' }
                : hasTarget
                    ? { label: t('goals.status.inProgress'), className: 'text-primary' }
                    : { label: t('goals.status.noTarget'), className: 'text-muted-foreground' }

        return {
            displayValue, progress, hasTarget, remaining,
            invested, profit, profitPercent, isPositive,
            timeRemainingLabel, isPastDue, formattedDate,
            holdingsSubtotal, statusConfig,
        }
    }, [data, locale, t])
}
