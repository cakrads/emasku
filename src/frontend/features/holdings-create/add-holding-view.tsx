'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { id, enUS } from 'date-fns/locale'

import { ROUTES } from '@/frontend/config/routes'
import { createHolding } from '@/frontend/services/portfolio/portfolio.api'
import { useLanguage } from '@/frontend/hooks/use-language'
import { StandardPageLayout } from '@/frontend/components/layout/standard-page-layout'
import { ErrorBoundary } from '@/frontend/components/fragments/error-boundary'
import { StepHeader } from '@/frontend/components/fragments/step-header'
import { WizardFooter } from '@/frontend/components/fragments/wizard-footer'
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
}

const MOCK_OFFICIAL_PRICE = 1350000 // Keep matching existing logic for valuation

function AddHoldingContent() {
  const router = useRouter()
  const { t, language } = useLanguage()
  const queryClient = useQueryClient()
  const [step, setStep] = useState<Step>(1)
  const [state, setState] = useState<HoldingState>({
    brand: null,
    weight: '',
    purchaseDate: new Date(),
    purchasePrice: '', // This is now Price per Gram
    quantity: '1',
    notes: ''
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
      case 3: return !!state.purchasePrice && !!state.purchaseDate
      case 4: return true
      default: return false
    }
  }

  const handleSave = () => {
    if (!state.brand || !state.weight || !state.purchasePrice || !state.purchaseDate) return

    let isoDate: string | undefined
    const d = state.purchaseDate
    isoDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T00:00:00.000Z`

    // IMPORTANT: API expects TOTAL buy price. User inputs PRICE PER GRAM.
    const pricePerGram = parseFloat(state.purchasePrice)
    const weight = parseFloat(state.weight)
    const totalBuyPrice = Math.round(pricePerGram * weight)

    createMutation.mutate({
      brandCode: state.brand.id,
      denominationGram: weight,
      quantity: 1,
      buyPrice: totalBuyPrice,
      buyDate: isoDate,
      notes: state.brand.isCustom
        ? `[${state.brand.name}] ${state.notes}`.trim()
        : state.notes || undefined
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
            />
          )}

          {step === 3 && (
            <PurchaseForm
              purchaseDate={state.purchaseDate}
              purchasePrice={state.purchasePrice}
              quantity={state.quantity}
              notes={state.notes}
              onChange={updateState}
            />
          )}

          {step === 4 && <ReviewStep state={state} />}
        </Stack>
      </Section>

      <WizardFooter
        onNext={step === 4 ? handleSave : nextStep}
        nextLabel={step === 4 ? t('addHolding.actions.save') : t('addHolding.actions.continue')}
        disabled={!canProceed() || createMutation.isPending}
      />
    </div>
  )
}

function ReviewStep({ state }: { state: HoldingState }) {
  const { t, language } = useLanguage()
  const isOfficial = state.brand?.hasOfficialPrice
  const formatCurrency = (val: number) => new Intl.NumberFormat(language === 'id' ? 'id-ID' : 'en-US', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val)

  const weight = parseFloat(state.weight || '0')
  const pricePerGram = parseFloat(state.purchasePrice || '0')
  const totalBuyPrice = weight * pricePerGram
  const estimatedValue = isOfficial ? MOCK_OFFICIAL_PRICE * weight : 0

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
            <div className="grid grid-cols-2 gap-6 pb-4 mb-4 border-b border-border/50">
              <div>
                <dt className="text-text-secondary uppercase tracking-wider font-medium text-xs mb-1 block">{t('addHolding.details.purchasePrice')}</dt>
                <dd className="font-semibold tabular-nums text-lg text-foreground">
                  {formatCurrency(pricePerGram)}
                </dd>
              </div>
              <div className="text-right">
                <dt className="text-text-secondary uppercase tracking-wider font-medium text-xs mb-1 block">{t('addHolding.review.totalCost')}</dt>
                <dd className="font-bold tabular-nums text-xl text-foreground">
                  {formatCurrency(totalBuyPrice)}
                </dd>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <dt className="text-text-secondary uppercase tracking-wider font-medium text-xs mb-1 block">{t('addHolding.details.purchaseDate')}</dt>
                <dd className="font-medium text-foreground">
                  {state.purchaseDate ? format(state.purchaseDate, 'PPP', { locale: language === 'id' ? id : enUS }) : '—'}
                </dd>
              </div>
            </div>

            {state.notes && (
              <div className="mt-4 pt-4 border-t border-border">
                <dt className="text-text-secondary uppercase tracking-wider font-medium text-xs mb-2 block">{t('addHolding.details.notes')}</dt>
                <dd className="text-foreground leading-relaxed text-base">{state.notes}</dd>
              </div>
            )}
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
        { label: t('common.home'), href: ROUTES.DASHBOARD },
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
