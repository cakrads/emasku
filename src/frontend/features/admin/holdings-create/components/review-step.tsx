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
        <div className="mt-4 pt-4 border-t border-border">
            <dt className="text-text-secondary uppercase tracking-wider font-medium text-xs mb-2 block">
                {t('goals.title')}
            </dt>
            <dd className="text-foreground leading-relaxed text-base font-medium">
                {goal.name}
            </dd>
        </div>
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
                <dl className="m-0">
                    <div className="p-6 border-b border-border">
                        <div className="flex justify-between items-start">
                            <div>
                                <dt className="text-text-secondary uppercase tracking-wider font-medium text-xs mb-1 block">
                                    {t('addHolding.brandSelection.brandName')}
                                </dt>
                                <dd className="text-2xl font-semibold leading-tight text-foreground">{state.brand?.name}</dd>
                                {state.brand?.isCustom && (
                                    <dd className="text-text-secondary text-xs mt-1 block">{t('addHolding.review.customBrandLabel')}</dd>
                                )}
                            </div>
                            <div className="text-right">
                                <dt className="text-text-secondary uppercase tracking-wider font-medium text-xs mb-1 block">
                                    {t('addHolding.details.weight')}
                                </dt>
                                <dd className="text-2xl font-semibold leading-tight text-foreground">{state.weight}g</dd>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-surface-elevated">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <dt className="text-text-secondary uppercase tracking-wider font-medium text-xs mb-1 block">
                                    {t('addHolding.details.purchasePrice')}
                                </dt>
                                <dd className="font-semibold tabular-nums text-lg text-foreground">
                                    {formatCurrency(totalPurchasePrice)}
                                </dd>
                            </div>
                            <div className="text-right">
                                <dt className="text-text-secondary uppercase tracking-wider font-medium text-xs mb-1 block">
                                    {t('addHolding.review.purchaseDate')}
                                </dt>
                                <dd className="font-medium text-foreground tabular-nums">
                                    {state.purchaseDate
                                        ? format(state.purchaseDate, 'PPP', { locale: language === 'id' ? id : enUS })
                                        : '—'}
                                </dd>
                            </div>
                        </div>

                        {state.notes && (
                            <div className="mt-4 pt-4 border-t border-border">
                                <dt className="text-text-secondary uppercase tracking-wider font-medium text-xs mb-2 block">
                                    {t('addHolding.details.notes')}
                                </dt>
                                <dd className="text-foreground leading-relaxed text-base">{state.notes}</dd>
                            </div>
                        )}

                        {state.goalId && <GoalReviewItem goalId={state.goalId} />}
                    </div>
                </dl>

                <footer className="p-6 bg-surface border-t border-border">
                    <Stack gap="sm">
                        <span className="text-text-secondary uppercase tracking-wider font-medium text-xs mb-1">
                            {t('addHolding.review.currentValue')}
                        </span>
                        <span className="text-3xl font-bold tracking-tight text-foreground">
                            {isOfficial ? formatCurrency(estimatedValue) : '—'}
                        </span>
                        <div className="flex items-center mt-2 gap-2 text-text-secondary">
                            <Info className="h-4 w-4 shrink-0" />
                            <span className="text-xs leading-snug">
                                {isOfficial ? t('addHolding.review.valuationNote') : t('addHolding.review.customNote')}
                            </span>
                        </div>
                    </Stack>
                </footer>
            </Card>
        </Stack>
    )
}
