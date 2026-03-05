'use client'

import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { id, enUS } from 'date-fns/locale'
import { Info } from 'lucide-react'
import { Stack } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { Card } from '@/frontend/components/ui/card'
import { fetchGoals } from '@/frontend/services/goals/goals.api'
import { transformTodayPrices } from '@/frontend/view-model/prices.vm'
import { useLanguage } from '@/frontend/hooks/use-language'
import { GoalSummary } from '@/shared/contracts/goals.contract'
import type { Brand } from './brand-selector'

export interface ReviewState {
    brand: Brand | null
    weight: string
    purchaseDate: Date | undefined
    purchasePrice: string
    quantity: string
    notes: string
    goalId: string | null
}

interface ReviewStepProps {
    state: ReviewState
    // Raw API response from fetchTodayPrices
    pricesData?: any
}

function GoalReviewItem({ goalId }: { goalId: string }) {
    const { t } = useLanguage()
    const { data } = useQuery({
        queryKey: ['goals', 'list'],
        queryFn: fetchGoals,
    })

    const goal = data?.goals.find((g: GoalSummary) => g.id === goalId)
    if (!goal) return null

    return (
        <Stack gap="xs" className="mt-4 pt-4 border-t border-border">
            <Typography variant="detail" as="span">
                {t('goals.title')}
            </Typography>
            <Typography variant="body" className="font-medium leading-relaxed">
                {goal.name}
            </Typography>
        </Stack>
    )
}

export function ReviewStep({ state, pricesData }: ReviewStepProps) {
    const { t, language } = useLanguage()
    const locale = language === 'id' ? 'id-ID' : 'en-US'

    const isOfficial = state.brand?.hasOfficialPrice
    const formatCurrency = (val: number) =>
        new Intl.NumberFormat(locale, {
            style: 'currency', currency: 'IDR', maximumFractionDigits: 0
        }).format(val)

    const viewModel = pricesData ? transformTodayPrices(pricesData, locale) : null
    const weightNum = parseFloat(state.weight || '0')
    const brandPrices = viewModel?.brands.find(b => b.brandName.toUpperCase() === state.brand?.name.toUpperCase())
    const specificPrice = brandPrices?.prices.find(p => p.denominationGram === weightNum)
    const estimatedValue = specificPrice?.buybackPrice
        ? specificPrice.buybackPrice
        : (brandPrices?.prices.find(p => p.denominationGram === 1)?.buybackPrice || 0) * weightNum

    const totalPurchasePrice = parseFloat(state.purchasePrice || '0')

    return (
        <Stack gap="lg" className="animate-in fade-in slide-in-from-right-4 duration-300">
            <Stack gap="xs">
                <Typography as="h2" variant="h1">{t('addHolding.review.title')}</Typography>
                <Typography variant="body-sm">{t('addHolding.review.subtitle')}</Typography>
            </Stack>

            <Card className="overflow-hidden bg-surface-elevated border-border">
                    <Stack className="p-6 border-b border-border">
                        <Stack direction="horizontal" className="justify-between items-start">
                            <Stack gap="xs">
                                <Typography variant="detail" as="span">
                                    {t('addHolding.brandSelection.brandName')}
                                </Typography>
                                <Typography variant="h2" className="leading-tight">{state.brand?.name}</Typography>
                                {state.brand?.isCustom && (
                                    <Typography variant="caption" className="text-text-secondary mt-1">{t('addHolding.review.customBrandLabel')}</Typography>
                                )}
                            </Stack>
                            <Stack gap="xs" className="text-right">
                                <Typography variant="detail" as="span">
                                    {t('addHolding.details.weight')}
                                </Typography>
                                <Typography variant="h2" className="leading-tight">{state.weight}g</Typography>
                            </Stack>
                        </Stack>
                    </Stack>

                    <Stack className="p-6 bg-surface-elevated">
                        <Stack direction="horizontal" gap="lg">
                            <Stack gap="xs">
                                <Typography variant="detail" as="span">
                                    {t('addHolding.details.purchasePrice')}
                                </Typography>
                                <Typography variant="body" className="font-semibold tabular-nums text-lg">
                                    {formatCurrency(totalPurchasePrice)}
                                </Typography>
                            </Stack>
                            <Stack gap="xs" className="text-right">
                                <Typography variant="detail" as="span">
                                    {t('addHolding.review.purchaseDate')}
                                </Typography>
                                <Typography variant="body" className="font-medium tabular-nums">
                                    {state.purchaseDate
                                        ? format(state.purchaseDate, 'PPP', { locale: language === 'id' ? id : enUS })
                                        : '—'}
                                </Typography>
                            </Stack>
                        </Stack>

                        {state.notes && (
                            <Stack gap="xs" className="mt-4 pt-4 border-t border-border">
                                <Typography variant="detail" as="span">
                                    {t('addHolding.details.notes')}
                                </Typography>
                                <Typography variant="body" className="leading-relaxed">{state.notes}</Typography>
                            </Stack>
                        )}

                        {state.goalId && <GoalReviewItem goalId={state.goalId} />}
                    </Stack>

                    <Stack gap="sm" className="p-6 bg-surface border-t border-border">
                    <Typography variant="detail" as="span">
                        {t('addHolding.review.currentValue')}
                    </Typography>
                    <Typography variant="h1" className="text-3xl font-bold tracking-tight">
                        {isOfficial ? formatCurrency(estimatedValue) : '—'}
                    </Typography>
                    <Stack direction="horizontal" gap="sm" className="items-center mt-2 text-text-secondary">
                        <Info className="h-4 w-4 shrink-0" />
                        <Typography variant="caption" className="leading-snug">
                            {isOfficial ? t('addHolding.review.valuationNote') : t('addHolding.review.customNote')}
                        </Typography>
                    </Stack>
                </Stack>
            </Card>
        </Stack>
    )
}
