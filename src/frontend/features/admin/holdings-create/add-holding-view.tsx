'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { ROUTES } from '@/frontend/config/routes'
import { createHolding } from '@/frontend/services/portfolio/portfolio.api'
import { fetchTodayPrices } from '@/frontend/services/prices/prices.api'
import { useLanguage } from '@/frontend/hooks/use-language'
import { StandardPageLayout } from '@/frontend/components/layout/standard-page-layout'
import { ErrorBoundary } from '@/frontend/components/fragments/admin/error-boundary'
import { StepHeader } from '@/frontend/components/fragments/admin/step-header'
import { WizardFooter } from '@/frontend/components/fragments/admin/wizard-footer'
import { Stack, Section } from '@/frontend/components/ui/layout'

// Modular Components
import { BrandSelector, Brand } from './components/brand-selector'
import { WeightSelector } from './components/weight-selector'
import { PurchaseForm } from './components/purchase-form'
import { ReviewStep } from './components/review-step'

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
  const { t } = useLanguage()
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
    purchasePrice: '',
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
      const apiError = error as { message?: string; details?: { errors?: Record<string, string | string[]> } }
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

    const totalPrice = parseFloat(state.purchasePrice)
    const weight = parseFloat(state.weight)

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
    <Stack className="relative w-full max-w-lg mx-auto sm:min-w-[500px]">
      <StepHeader
        title={t('addHolding.title')}
        currentStep={step}
        totalSteps={4}
        onBack={step > 1 ? prevStep : () => router.push(ROUTES.HOLDINGS_LIST)}
        className="px-0 pt-0 static bg-transparent"
        stepProgressLabel={t('addHolding.stepProgress').replace('{current}', String(step)).replace('{total}', '4')}
        stepLabels={[
          t('addHolding.steps.brand'),
          t('addHolding.steps.weight'),
          t('addHolding.steps.details'),
          t('addHolding.steps.review'),
        ]}
      />

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
    </Stack>
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
