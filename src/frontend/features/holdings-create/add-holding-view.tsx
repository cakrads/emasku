'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/frontend/components/ui/input'
import { Label } from '@/frontend/components/ui/label'
import { Card } from '@/frontend/components/ui/card'
import { DatePicker } from '@/frontend/components/ui/date-picker'
import { Stack, Section } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { StepHeader } from '@/frontend/components/fragments/step-header'
import { WizardFooter } from '@/frontend/components/fragments/wizard-footer'
import { Button } from '@/frontend/components/ui/button'
import { format } from 'date-fns'
import { id, enUS } from 'date-fns/locale'
import { Info, Check } from 'lucide-react'

import { cn } from '@/frontend/utils/cn'
import { ROUTES } from '@/frontend/config/routes'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchBrands } from '@/frontend/services/brands/brands.api'
import { createHolding } from '@/frontend/services/portfolio/portfolio.api'
import { Skeleton } from '@/frontend/components/ui/skeleton'
import { toast } from 'sonner'
import { useLanguage } from '@/frontend/hooks/use-language'

// --- Types ---

type Step = 1 | 2 | 3
interface Brand {
  id: string
  name: string
  hasOfficialPrice: boolean
  isCustom?: boolean
}

interface HoldingState {
  brand: Brand | null
  weight: string
  purchaseDate: Date | undefined
  purchasePrice: string
  purity: string
  type: string
  notes: string
}

// --- Constants ---

const MOCK_OFFICIAL_PRICE = 1350000 // Fixed for demo

// KNOWN_BRANDS removed, fetching from API

// --- Main Orchestrator ---

import { StandardPageLayout } from '@/frontend/components/layout/standard-page-layout'

import { ErrorBoundary } from '@/frontend/components/fragments/error-boundary'

function AddHoldingContent() {
  const router = useRouter()
  const { t } = useLanguage()
  const queryClient = useQueryClient()
  const [step, setStep] = useState<Step>(1)
  const [state, setState] = useState<HoldingState>({
    brand: null,
    weight: '',
    purchaseDate: undefined,
    purchasePrice: '',
    purity: '',
    type: 'Gold Bar',
    notes: ''
  })

  // Mutation for creating holding
  const createMutation = useMutation({
    mutationFn: createHolding,
    onSuccess: () => {
      toast.success(t('addHolding.messages.success'), {
        description: t('addHolding.messages.successDetail')
          .replace('{weight}', state.weight)
          .replace('{brand}', state.brand?.name || '')
      })
      // Invalidate portfolio queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['portfolio'] })
      queryClient.invalidateQueries({ queryKey: ['holdings'] })
      router.push(ROUTES.HOLDINGS_LIST)
    },
    onError: (error: unknown) => {
      const apiError = error as { message?: string, details?: { errors?: Record<string, string | string[]> } }
      const errorMessage = apiError?.message || t('addHolding.messages.error')
      const errorDetails = apiError?.details?.errors

      if (errorDetails) {
        // Show field-specific errors
        const fieldErrors = Object.entries(errorDetails)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('\n')
        toast.error(t('addHolding.messages.validationError'), {
          description: fieldErrors
        })
      } else {
        toast.error(t('common.errorTitle'), {
          description: errorMessage
        })
      }
    }
  })

  const updateState = (updates: Partial<HoldingState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3) as Step)
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1) as Step)

  const canProceed = () => {
    switch (step) {
      case 1: return !!state.brand
      case 2: return !!state.weight && parseFloat(state.weight) > 0
      case 3: return true
      default: return false
    }
  }

  const handleSave = () => {
    if (!state.brand || !state.weight) {
      toast.error(t('addHolding.messages.missingFields'), {
        description: t('addHolding.messages.missingFieldsDetail')
      })
      return
    }

    if (createMutation.isPending) return

    // Format date as YYYY-MM-DD in local timezone to avoid timezone issues (only if provided)
    let localDateString: string | undefined
    if (state.purchaseDate) {
      const year = state.purchaseDate.getFullYear()
      const month = String(state.purchaseDate.getMonth() + 1).padStart(2, '0')
      const day = String(state.purchaseDate.getDate()).padStart(2, '0')
      localDateString = `${year}-${month}-${day}T00:00:00.000Z`
    }

    createMutation.mutate({
      brandCode: state.brand.id, // Already the correct brand code
      denominationGram: parseFloat(state.weight),
      quantity: 1,
      buyPrice: state.purchasePrice ? Math.round(parseFloat(state.purchasePrice)) : undefined,
      buyDate: localDateString,
      notes: state.brand.isCustom
        ? `[Custom Brand: ${state.brand.name}] ${state.notes || ''}`.trim()
        : (state.notes || undefined),
    })
  }

  return (
    <div className="flex flex-col relative max-w-lg mx-auto">
      <StepHeader
        title="Setup Wizard"
        currentStep={step}
        totalSteps={3}
        onBack={step > 1 ? prevStep : () => router.push(ROUTES.HOLDINGS_LIST)}
        className="px-0 pt-0 static bg-transparent"
      />

      {/* Progress Bar */}
      <Section className="px-0 py-2 mb-4">
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-accent-gold transition-all duration-300 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </Section>

      {/* Step Content */}
      <Section as="main" className="flex-1 px-0 pb-44 overflow-y-auto pt-0">
        <Stack gap="lg" className="p-1">
          {step === 1 && (
            <ErrorBoundary>
              <BrandSelectionStepWrapper
                selected={state.brand}
                onSelect={(b) => updateState({ brand: b })}
              />
            </ErrorBoundary>
          )}
          {step === 2 && <GoldDetailsStep state={state} onChange={updateState} />}
          {step === 3 && <ReviewStep state={state} />}
        </Stack>
      </Section>

      <WizardFooter
        onNext={step === 3 ? handleSave : nextStep}
        nextLabel={step === 3 ? t('addHolding.actions.save') : t('addHolding.actions.continue')}
        disabled={!canProceed() || createMutation.isPending}
      />
    </div>
  )
}

export default function AddHoldingView() {
  const { t } = useLanguage()
  return (
    <StandardPageLayout
      title={t('addHolding.title')}
      breadcrumbs={[
        { label: 'Home', href: ROUTES.DASHBOARD },
        { label: 'Holdings', href: ROUTES.HOLDINGS_LIST },
        { label: t('addHolding.breadcrumbs.add') }
      ]}
    >
      <ErrorBoundary>
        <AddHoldingContent />
      </ErrorBoundary>
    </StandardPageLayout>
  )
}

// --- Step 1: Brand Selection ---

function BrandSelectionStep({
  selected,
  onSelect,
  brands
}: {
  selected: Brand | null,
  onSelect: (b: Brand) => void,
  brands: Brand[]
}) {
  const { t } = useLanguage()
  const [isCustomMode, setIsCustomMode] = useState(false)
  const [customName, setCustomName] = useState('')

  if (isCustomMode) {
    return (
      <Stack gap="lg" className="animate-in fade-in slide-in-from-right-4 duration-300">
        <Stack gap="xs">
          <Typography as="h2" variant="h1">{t('addHolding.brandSelection.customBrand.title')}</Typography>
          <Typography variant="body-sm">{t('addHolding.brandSelection.customBrand.subtitle')}</Typography>
        </Stack>

        <Section className="p-4 rounded-xl border border-border bg-surface-elevated py-4">
          <Stack direction="horizontal" gap="md" className="items-start text-text-secondary">
            <Info className="h-5 w-5 shrink-0 mt-0.5 text-foreground" />
            <Typography variant="caption" className="text-text-secondary leading-relaxed" dangerouslySetInnerHTML={{ __html: t('addHolding.brandSelection.customBrand.warning') }} />
          </Stack>
        </Section>

        <Stack gap="md">
          <Stack gap="sm">
            <Label className="uppercase text-text-secondary font-medium tracking-wider">{t('addHolding.brandSelection.brandName')}</Label>
            <Input
              autoFocus
              value={customName}
              onChange={(e) => {
                setCustomName(e.target.value)
                const name = e.target.value
                const b = name ? { id: 'OTHER', name, hasOfficialPrice: false, isCustom: true } : null
                if (b) onSelect(b)
              }}
              className="p-4 rounded-xl bg-surface-elevated border-border text-foreground text-lg font-semibold h-14"
              placeholder={t('addHolding.brandSelection.customBrand.placeholder')}
            />
          </Stack>
          <Button
            variant="ghost"
            className="text-sm font-medium text-text-secondary hover:text-foreground transition-colors py-2 h-auto justify-start"

            onClick={() => setIsCustomMode(false)}
          >
            {t('addHolding.brandSelection.customBrand.back')}
          </Button>
        </Stack>
      </Stack>
    )
  }

  return (
    <Stack gap="lg" className="animate-in fade-in slide-in-from-right-4 duration-300">
      <Stack gap="xs">
        <Typography as="h2" variant="h1">{t('addHolding.brandSelection.title')}</Typography>
        <Typography variant="body-sm">{t('addHolding.brandSelection.subtitle')}</Typography>
      </Stack>

      <Stack gap="sm">
        {brands.map(brand => (
          <Button
            variant="ghost"
            key={brand.id}
            onClick={() => onSelect(brand)}
            className={cn(
              "w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between h-auto hover:bg-transparent",
              selected?.id === brand.id
                ? "bg-surface-elevated border-foreground ring-1 ring-foreground"
                : "bg-surface-elevated border-border hover:border-text-secondary"
            )}
          >
            <Typography variant="body" className="font-semibold">{brand.name}</Typography>
            {selected?.id === brand.id && <Check className="h-5 w-5 text-foreground" />}
          </Button>
        ))}

        <Button
          variant="ghost"
          onClick={() => setIsCustomMode(true)}
          className="w-full text-left p-4 rounded-xl border border-dashed border-border hover:bg-surface-elevated hover:border-text-secondary transition-all flex items-center gap-3 text-text-secondary mt-2 h-auto justify-start"
        >
          <div className="h-8 w-8 rounded-full bg-surface flex items-center justify-center">
            <Typography variant="h3" className="font-light">+</Typography>
          </div>
          <Typography variant="body" className="font-medium">{t('addHolding.brandSelection.customBrand.button')}</Typography>
        </Button>
      </Stack>
    </Stack>
  )
}

function BrandSelectionStepWrapper({ selected, onSelect }: { selected: Brand | null, onSelect: (b: Brand) => void }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['brands'],
    queryFn: fetchBrands,
  })

  if (isLoading) {
    return <BrandSelectionSkeleton />
  }

  if (error) {
    throw error
  }

  const brands: Brand[] = (data?.items || [])
    .filter(item => item.code !== 'OTHER')
    .map(item => ({
      id: item.code, // Use actual brand code as ID
      name: item.name,
      hasOfficialPrice: ['ANTAM', 'GALERI24'].includes(item.code.toUpperCase())
    }))

  return <BrandSelectionStep selected={selected} onSelect={onSelect} brands={brands} />
}

function BrandSelectionSkeleton() {
  return (
    <Stack gap="lg" className="animate-pulse">
      <Stack gap="xs">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-64" />
      </Stack>

      <Stack gap="sm">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-[60px] w-full rounded-xl" />
        ))}
        <Skeleton className="h-[60px] w-full rounded-xl border-dashed" />
      </Stack>
    </Stack>
  )
}

// --- Step 2: Gold Details ---

function GoldDetailsStep({ state, onChange }: { state: HoldingState, onChange: (u: Partial<HoldingState>) => void }) {
  const { t } = useLanguage()
  return (
    <Stack gap="lg" className="animate-in fade-in slide-in-from-right-4 duration-300">
      <Stack gap="xs">
        <Typography as="h2" variant="h1">{t('addHolding.details.title')}</Typography>
        <Typography variant="body-sm">{t('addHolding.details.subtitle')}</Typography>
      </Stack>

      <Stack gap="xl">
        {/* Weight */}
        <Stack gap="sm">
          <Label className="uppercase text-text-secondary font-medium tracking-wider">
            {t('addHolding.details.weight')} <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            inputMode="decimal"
            autoFocus
            value={state.weight}
            onChange={(e) => onChange({ weight: e.target.value })}
            className="p-4 rounded-xl bg-surface-elevated border-border text-foreground text-lg font-semibold h-14"
            placeholder="0.00"
          />
        </Stack>

        {/* Purchase Info Section */}
        <Stack gap="lg" className="pt-6 border-t border-border">
          <Typography variant="h4">{t('addHolding.details.purchaseHistory')}</Typography>

          <Stack gap="lg">
            <Stack gap="xs">
              <Label className="text-text-secondary font-medium">{t('addHolding.details.purchasePrice')}</Label>
              <Input
                type="number"
                inputMode="decimal"
                value={state.purchasePrice}
                onChange={(e) => onChange({ purchasePrice: e.target.value })}
                className={cn(
                  "flex w-full shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 p-4 rounded-xl bg-surface-elevated border-border text-foreground text-lg font-semibold h-14 justify-start text-left",
                  !state.purchasePrice && "text-muted-foreground"
                )}
                placeholder="e.g. 5,000,000"
              />
              <Typography variant="caption">{t('addHolding.details.priceHelp')}</Typography>
            </Stack>

            <Stack gap="sm">
              <Label className="text-text-secondary font-medium">{t('addHolding.details.purchaseDate')}</Label>
              <DatePicker
                value={state.purchaseDate}
                onChange={(date) => onChange({ purchaseDate: date })}
                disabled={(date) => date > new Date()}
              />
            </Stack>

            <Stack gap="sm">
              <Label className="text-text-secondary font-medium">{t('addHolding.details.notes')}</Label>
              <Input
                value={state.notes}
                onChange={(e) => onChange({ notes: e.target.value })}
                className="p-4 rounded-xl bg-surface-elevated border-border text-foreground text-lg font-semibold h-14"
                placeholder={t('addHolding.details.notesPlaceholder')}
              />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}

// --- Step 3: Review ---

function ReviewStep({ state }: { state: HoldingState }) {
  const { t, language } = useLanguage()
  const isOfficial = state.brand?.hasOfficialPrice

  const formatCurrency = (val: number) => new Intl.NumberFormat(language === 'id' ? 'id-ID' : 'en-US', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val)
  const estimatedValue = isOfficial ? MOCK_OFFICIAL_PRICE * parseFloat(state.weight || '0') : 0

  return (
    <Stack gap="lg" className="animate-in fade-in slide-in-from-right-4 duration-300">
      <Stack gap="xs">
        <Typography as="h2" variant="h1">{t('addHolding.review.title')}</Typography>
        <Typography variant="body-sm">{t('addHolding.review.subtitle')}</Typography>
      </Stack>

      <Card className="overflow-hidden bg-surface-elevated border-border">
        <dl className="m-0">
          {/* Header / Main Info */}
          <div className="p-6 border-b border-border">
            <div className="flex justify-between items-start">
              <div>
                <dt className="text-text-secondary uppercase tracking-wider font-medium text-xs mb-1 block">{t('addHolding.brandSelection.brandName')}</dt>
                <dd className="text-2xl font-semibold leading-tight text-foreground">{state.brand?.name}</dd>
                {!isOfficial && <dd className="text-text-secondary text-xs mt-1 block">{t('addHolding.review.customBrandLabel')}</dd>}
              </div>
              <div className="text-right">
                <dt className="text-text-secondary uppercase tracking-wider font-medium text-xs mb-1 block">{t('addHolding.details.weight')}</dt>
                <dd className="text-2xl font-semibold leading-tight text-foreground">{state.weight}g</dd>
              </div>
            </div>
          </div>

          {/* Details Section */}
          {(state.purchasePrice || state.purchaseDate || state.notes) && (
            <div className="p-6 bg-surface-elevated">
              {/* Purchase Grid */}
              {(state.purchasePrice || state.purchaseDate) && (
                <div className="grid grid-cols-2 gap-6">
                  {state.purchasePrice && (
                    <div>
                      <dt className="text-text-secondary uppercase tracking-wider font-medium text-xs mb-1 block">{t('addHolding.details.purchasePrice')}</dt>
                      <dd className="font-semibold tabular-nums text-lg text-foreground">
                        {formatCurrency(parseFloat(state.purchasePrice))}
                      </dd>
                    </div>
                  )}
                  {state.purchaseDate && (
                    <div className={state.purchasePrice ? "text-right" : ""}>
                      <dt className="text-text-secondary uppercase tracking-wider font-medium text-xs mb-1 block">{t('addHolding.details.purchaseDate')}</dt>
                      <dd className="font-semibold text-lg text-foreground">
                        {state.purchaseDate instanceof Date
                          ? format(state.purchaseDate, 'PPP', { locale: language === 'id' ? id : enUS })
                          : state.purchaseDate}
                      </dd>
                    </div>
                  )}
                </div>
              )}

              {/* Notes */}
              {state.notes && (
                <div className={(state.purchasePrice || state.purchaseDate) ? "mt-4 pt-4 border-t border-border" : ""}>
                  <dt className="text-text-secondary uppercase tracking-wider font-medium text-xs mb-2 block">{t('addHolding.details.notes')}</dt>
                  <dd className="text-foreground leading-relaxed text-base">
                    {state.notes}
                  </dd>
                </div>
              )}
            </div>
          )}
        </dl>

        {/* Valuation Footer */}
        <footer className="p-6 bg-surface border-t border-border">
          <Stack gap="sm">
            <div className="flex justify-between items-end">
              <span className="text-text-secondary uppercase tracking-wider font-medium text-xs mb-1">{t('addHolding.review.currentValue')}</span>
            </div>

            <div className="flex justify-between items-center">
              {isOfficial ? (
                <span className="text-3xl font-bold tracking-tight text-foreground">{formatCurrency(estimatedValue)}</span>
              ) : (
                <span className="text-3xl text-text-secondary font-bold">—</span>
              )}
            </div>

            <div className="flex items-center mt-2 gap-2 text-text-secondary">
              <Info className="h-4 w-4 shrink-0" />
              <span className="text-xs leading-snug">
                {isOfficial
                  ? t('addHolding.review.valuationNote')
                  : t('addHolding.review.customNote')}
              </span>
            </div>
          </Stack>
        </footer>
      </Card>
    </Stack>
  )
}
