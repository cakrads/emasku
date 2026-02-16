'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { id, enUS } from 'date-fns/locale'

import { ROUTES } from '@/frontend/config/routes'
import { GoalSummary } from '@/shared/contracts/goals.contract'
import { createHolding } from '@/frontend/services/portfolio/portfolio.api'
import { fetchTodayPrices } from '@/frontend/services/prices/prices.api'
import { transformTodayPrices } from '@/frontend/view-model/prices.vm'
import { useLanguage } from '@/frontend/hooks/use-language'
import { StandardPageLayout } from '@/frontend/components/layout/standard-page-layout'
import { ErrorBoundary } from '@/frontend/components/fragments/admin/error-boundary'
import { StepHeader } from '@/frontend/components/fragments/admin/step-header'
import { WizardFooter } from '@/frontend/components/fragments/admin/wizard-footer'
import { Stack, Section } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { Card } from '@/frontend/components/ui/card'
import { Info } from 'lucide-react'

// Modular Components
import { BrandSelector, Brand } from './components/brand-selector'
import { WeightSelector } from './components/weight-selector'
import { PurchaseForm } from './components/purchase-form'

// --- Types ---

type Step = 1 | 2 | 3 | 4

interface HoldingState {
  brand: Brand | null
  weight: string
  purchaseDate: Date | undefined
  purchasePrice: string
  quantity: string
  notes: string
  goalId: string | null
}


function AddHoldingContent() {
  const router = useRouter()
  const { t, language } = useLanguage()
  const queryClient = useQueryClient()
  const [step, setStep] = useState<Step>(1)

  const { data: pricesToday, isLoading: isLoadingPrices } = useQuery({
    queryKey: ['prices', 'today'],
    queryFn: fetchTodayPrices,
  })
  const [state, setState] = useState<HoldingState>({
    brand: null,
    weight: '',
    purchaseDate: undefined,
    purchasePrice: '', // This is Total Price
    quantity: '1',
    notes: '',
    goalId: null
  })

  const createMutation = useMutation({
    mutationFn: createHolding,
    onSuccess: () => {
      toast.success(t('addHolding.messages.success'), {
        description: t('addHolding.messages.successDetail')
          .replace('{weight}', state.weight)
          .replace('{brand}', state.brand?.name || '')
      })
      queryClient.invalidateQueries({ queryKey: ['portfolio'] })
      queryClient.invalidateQueries({ queryKey: ['holdings'] })
      router.push(ROUTES.HOLDINGS_LIST)
    },
    onError: (error: unknown) => {
      const apiError = error as { message?: string, details?: { errors?: Record<string, string | string[]> } }
      toast.error(t('common.errorTitle'), {
        description: apiError?.message || t('addHolding.messages.error')
      })
    }
  })

  const updateState = (updates: Partial<HoldingState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4) as Step)
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1) as Step)

  const handleBrandSelect = (brand: Brand, autoAdvance?: boolean) => {
    updateState({ brand })
    if (autoAdvance) setStep(2)
  }

  const handleWeightSelect = (weight: string, autoAdvance?: boolean) => {
    updateState({ weight })
    if (autoAdvance) setStep(3)
  }

  const canProceed = () => {
    switch (step) {
      case 1: return !!state.brand && (!state.brand.isCustom || !!state.brand.name)
      case 2: return !!state.weight && parseFloat(state.weight) > 0
      case 3: return !!state.purchasePrice
      case 4: return true
      default: return false
    }
  }

  const handleSave = () => {
    if (!state.brand || !state.weight || !state.purchasePrice) return

    let isoDate: string | undefined
    if (state.purchaseDate) {
      const d = state.purchaseDate
      isoDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T00:00:00.000Z`
    }

    // IMPORTANT: API expects TOTAL PRICE per Unit. User inputs TOTAL PRICE.
    const totalPrice = parseFloat(state.purchasePrice)
    const weight = parseFloat(state.weight)

    // Correct Logic:
    // User inputs Total Price. Backend now expects Total Price per Unit.
    // We send straight Total Price.

    // const pricePerGram = Math.round(totalPrice / weight) - REVERTED

    createMutation.mutate({
      brandCode: state.brand.id,
      denominationGram: weight,
      quantity: 1,
      buyPrice: totalPrice,
      buyDate: isoDate,
      notes: state.brand.isCustom
        ? `[${state.brand.name}] ${state.notes}`.trim()
        : state.notes || undefined,
      goalId: state.goalId || undefined
    })
  }

  return (
    <div className="flex flex-col relative max-w-lg mx-auto">
      <StepHeader
        title={t('addHolding.title')}
        currentStep={step}
        totalSteps={4}
        onBack={step > 1 ? prevStep : () => router.push(ROUTES.HOLDINGS_LIST)}
        className="px-0 pt-0 static bg-transparent"
      />

      {/* Progress Bar */}
      <Section className="px-0 py-2 mb-4">
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-accent-gold transition-all duration-300 ease-out"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </Section>

      {/* Step Content */}
      <Section as="main" className="flex-1 px-0 pb-44 overflow-y-auto pt-0">
        <Stack gap="lg" className="p-1">
          {step === 1 && (
            <BrandSelector
              selected={state.brand}
              onSelect={handleBrandSelect}
            />
          )}

          {step === 2 && state.brand && (
            <WeightSelector
              brand={state.brand}
              selectedWeight={state.weight}
              onSelect={handleWeightSelect}
              data={pricesToday}
              isLoading={isLoadingPrices}
            />
          )}

          {step === 3 && (
            <PurchaseForm
              brand={state.brand}
              weight={state.weight}
              pricesData={pricesToday}
              purchaseDate={state.purchaseDate}
              purchasePrice={state.purchasePrice}
              quantity={state.quantity}
              notes={state.notes}
              goalId={state.goalId}
              onChange={updateState}
            />
          )}

          {step === 4 && <ReviewStep state={state} pricesData={pricesToday} />}
        </Stack>
      </Section>

      <WizardFooter
        onNext={step === 4 ? handleSave : nextStep}
        nextLabel={step === 4 ? (createMutation.isPending ? t('addHolding.actions.saving') : t('addHolding.actions.save')) : t('addHolding.actions.continue')}
        disabled={!canProceed() || createMutation.isPending}
      />
    </div>
  )
}

import { fetchGoals } from '@/frontend/services/goals/goals.api'

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

function ReviewStep({ state, pricesData }: { state: HoldingState, pricesData?: any }) {
  const { t, language } = useLanguage()
  const isOfficial = state.brand?.hasOfficialPrice
  const formatCurrency = (val: number) => new Intl.NumberFormat(language === 'id' ? 'id-ID' : 'en-US', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val)

  const viewModel = pricesData ? transformTodayPrices(pricesData, language === 'id' ? 'id-ID' : 'en-US') : null

  const weightNum = parseFloat(state.weight || '0')
  const brandPrices = viewModel?.brands.find(b => b.brandName.toUpperCase() === state.brand?.name.toUpperCase())
  const specificPrice = brandPrices?.prices.find(p => p.denominationGram === weightNum)

  // Use specific denomination buyback price if available, otherwise calculate using 1g price as reference
  const estimatedValue = specificPrice?.buybackPrice
    ? specificPrice.buybackPrice
    : (brandPrices?.prices.find(p => p.denominationGram === 1)?.buybackPrice || 0) * weightNum

  // Review display:
  // state.purchasePrice is now TOTAL Price.
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
                <dt className="text-text-secondary uppercase tracking-wider font-medium text-xs mb-1 block">{t('addHolding.brandSelection.brandName')}</dt>
                <dd className="text-2xl font-semibold leading-tight text-foreground">{state.brand?.name}</dd>
                {state.brand?.isCustom && <dd className="text-text-secondary text-xs mt-1 block">{t('addHolding.review.customBrandLabel')}</dd>}
              </div>
              <div className="text-right">
                <dt className="text-text-secondary uppercase tracking-wider font-medium text-xs mb-1 block">{t('addHolding.details.weight')}</dt>
                <dd className="text-2xl font-semibold leading-tight text-foreground">{state.weight}g</dd>
              </div>
            </div>
          </div>

          <div className="p-6 bg-surface-elevated">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <dt className="text-text-secondary uppercase tracking-wider font-medium text-xs mb-1 block">{t('addHolding.details.purchasePrice')}</dt>
                <dd className="font-semibold tabular-nums text-lg text-foreground">
                  {formatCurrency(totalPurchasePrice)}
                </dd>
              </div>
              <div className="text-right">
                <dt className="text-text-secondary uppercase tracking-wider font-medium text-xs mb-1 block">{t('addHolding.review.purchaseDate')}</dt>
                <dd className="font-medium text-foreground tabular-nums">
                  {state.purchaseDate
                    ? format(state.purchaseDate, 'PPP', { locale: language === 'id' ? id : enUS })
                    : '—'}
                </dd>
              </div>
            </div>

            {state.notes && (
              <div className="mt-4 pt-4 border-t border-border">
                <dt className="text-text-secondary uppercase tracking-wider font-medium text-xs mb-2 block">{t('addHolding.details.notes')}</dt>
                <dd className="text-foreground leading-relaxed text-base">{state.notes}</dd>
              </div>
            )}

            {state.goalId && <GoalReviewItem goalId={state.goalId} />}
          </div>
        </dl>

        <footer className="p-6 bg-surface border-t border-border">
          <Stack gap="sm">
            <span className="text-text-secondary uppercase tracking-wider font-medium text-xs mb-1">{t('addHolding.review.currentValue')}</span>
            <span className="text-3xl font-bold tracking-tight text-foreground">{isOfficial ? formatCurrency(estimatedValue) : '—'}</span>
            <div className="flex items-center mt-2 gap-2 text-text-secondary">
              <Info className="h-4 w-4 shrink-0" />
              <span className="text-xs leading-snug">
                {isOfficial ? t('addHolding.review.valuationNote') : t('addHolding.review.customNote')}
              </span>
            </div>
          </Stack>
        </footer>
      </Card >
    </Stack >
  )
}

export default function AddHoldingView() {
  const { t } = useLanguage()
  return (
    <StandardPageLayout
      title={t('addHolding.title')}
      breadcrumbs={[
        { label: t('navbar.dashboard'), href: ROUTES.DASHBOARD },
        { label: t('navbar.holdings'), href: ROUTES.HOLDINGS_LIST },
        { label: t('addHolding.breadcrumbs.add') }
      ]}
    >
      <ErrorBoundary>
        <AddHoldingContent />
      </ErrorBoundary>
    </StandardPageLayout>
  )
}
