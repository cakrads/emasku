'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/frontend/components/ui/input'
import { Label } from '@/frontend/components/ui/label'
import { Typography } from '@/frontend/components/ui/typography'
import { Stack, Section } from '@/frontend/components/ui/layout'
import { DetailActions } from '@/frontend/components/fragments/detail-actions'
import { ROUTES } from '@/frontend/config/routes'
import { DatePicker } from '@/frontend/components/ui/date-picker'
import { StandardPageLayout } from '@/frontend/components/layout/standard-page-layout'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchHoldingDetail, updateHolding } from '@/frontend/services/portfolio/portfolio.api'
import { fetchTodayPrices } from '@/frontend/services/prices/prices.api'
import { UpdateHoldingRequest } from '@/shared/contracts/update-holding.contract'
import { toast } from 'sonner'
import { Skeleton } from '@/frontend/components/ui/skeleton'
import { ErrorBoundary } from '@/frontend/components/fragments/error-boundary'
import { useLanguage } from '@/frontend/hooks/use-language'
import { WeightSelector } from '../holdings-create/components/weight-selector'
import { CurrencyInput } from '@/frontend/components/ui/currency-input'

interface EditHoldingViewProps {
  holdingId: string
}

function EditHoldingContent({ holdingId }: EditHoldingViewProps) {
  const router = useRouter()
  const { t } = useLanguage()
  const queryClient = useQueryClient()

  // Fetch holding data
  const { data: holding, isLoading: isLoadingHolding, error } = useQuery({
    queryKey: ['holding', holdingId],
    queryFn: () => fetchHoldingDetail(holdingId),
  })

  // Fetch prices for weight selector
  const { data: pricesToday, isLoading: isLoadingPrices } = useQuery({
    queryKey: ['prices', 'today'],
    queryFn: fetchTodayPrices,
  })

  // Form State
  const [weight, setWeight] = useState('')
  const [buyPrice, setBuyPrice] = useState('')
  const [buyDate, setBuyDate] = useState<Date | undefined>(undefined)
  const [notes, setNotes] = useState('')

  // Initialize form when data loads
  useEffect(() => {
    if (holding) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWeight(holding.denominationGram.toString())
      setBuyPrice(holding.avgBuyPrice.toString())
      setBuyDate(new Date(holding.buyDate))
      setNotes(holding.notes || '')
    }
  }, [holding])


  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateHoldingRequest) => updateHolding(holdingId, data),
    onSuccess: () => {
      toast.success(t('editHolding.messages.success'), {
        description: t('editHolding.messages.successDetail')
      })
      queryClient.invalidateQueries({ queryKey: ['holding', holdingId] })
      queryClient.invalidateQueries({ queryKey: ['portfolio'] })
      queryClient.invalidateQueries({ queryKey: ['holdings'] })
      router.push(ROUTES.HOLDING_DETAIL(holdingId))
    },
    onError: (error: unknown) => {
      console.error('Update holding error:', error)
      const apiError = error as { message?: string, details?: { errors?: Record<string, string | string[]> } }

      if (apiError?.details?.errors) {
        const fieldErrors = Object.entries(apiError.details.errors)
          .map(([field, messages]) => {
            const msgArray = Array.isArray(messages) ? messages : [messages]
            return `${field}: ${msgArray.join(', ')}`
          })
          .join('\n')

        toast.error(t('editHolding.messages.validationError'), {
          description: fieldErrors,
          duration: 5000,
        })
      } else {
        toast.error(t('editHolding.messages.error'), {
          description: apiError?.message || 'Failed to update holding',
          duration: 4000,
        })
      }
    }
  })

  const handleSave = () => {
    if (!weight) {
      toast.error(t('editHolding.messages.missingWeight'), {
        description: t('addHolding.messages.missingFieldsDetail')
      })
      return
    }

    if (updateMutation.isPending) return

    // Format date if provided
    let localDateString: string | undefined
    if (buyDate) {
      const year = buyDate.getFullYear()
      const month = String(buyDate.getMonth() + 1).padStart(2, '0')
      const day = String(buyDate.getDate()).padStart(2, '0')
      localDateString = `${year}-${month}-${day}T00:00:00.000Z`
    }

    updateMutation.mutate({
      denominationGram: parseFloat(weight),
      buyPrice: buyPrice ? Math.round(parseFloat(buyPrice)) : undefined,
      buyDate: localDateString,
      notes: notes || undefined,
    })
  }

  const isLoading = isLoadingHolding || isLoadingPrices

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto pb-44">
        <Section className="px-0">
          <Stack gap="xl">
            <Stack gap="sm">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-14 w-full rounded-xl" />
            </Stack>
            <Stack gap="sm">
              <Skeleton className="h-4 w-24" />
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
              </div>
            </Stack>
            {[1, 2].map(i => (
              <Stack key={i} gap="sm">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-14 w-full rounded-xl" />
              </Stack>
            ))}
          </Stack>
        </Section>
      </div>
    )
  }

  if (error || !holding) {
    throw new Error(`Holding with ID "${holdingId}" not found`)
  }

  return (
    <div className="max-w-lg mx-auto pb-44">
      {/* Form */}
      <Section className="px-0">
        <Stack gap="xl">
          <Stack gap="sm">
            <Label className="text-text-secondary font-medium uppercase tracking-wider">{t('editHolding.brand.label')}</Label>
            <Input value={holding.brandName} disabled className="p-4 rounded-xl bg-muted border-border text-foreground text-lg font-semibold h-14 opacity-100" />
            <Typography variant="caption" className="text-muted-foreground">{t('editHolding.brand.locked')}</Typography>
          </Stack>

          <WeightSelector
            brand={{
              id: holding.brand,
              name: holding.brandName,
              hasOfficialPrice: true, // We assume true for selector context if it exists in DB
              isCustom: holding.brand === 'OTHER'
            }}
            selectedWeight={weight}
            onSelect={(w) => setWeight(w)}
            data={pricesToday}
            isLoading={isLoadingPrices}
          />

          <Stack gap="sm">
            <Label className="text-text-secondary font-medium uppercase tracking-wider">{t('editHolding.form.buyPrice')}</Label>
            <CurrencyInput
              value={buyPrice}
              onChange={setBuyPrice}
              className="p-4 rounded-xl bg-surface-elevated border-border text-foreground text-lg font-semibold h-14"
              placeholder="e.g. 1.300.000"
            />
          </Stack>

          <Stack gap="sm">
            <Label className="text-text-secondary font-medium uppercase tracking-wider">{t('editHolding.form.purchaseDate')}</Label>
            <DatePicker
              value={buyDate}
              onChange={setBuyDate}
              disabled={(date) => date > new Date()}
            />
          </Stack>

          <Stack gap="sm">
            <Label className="text-text-secondary font-medium uppercase tracking-wider">{t('editHolding.form.notes')}</Label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="p-4 rounded-xl bg-surface-elevated border-border text-foreground text-lg font-semibold h-14"
              placeholder={t('editHolding.form.notesPlaceholder')}
            />
          </Stack>
        </Stack>
      </Section>


      <DetailActions
        actions={[
          {
            label: t('editHolding.actions.cancel'),
            variant: 'outline',
            onClick: () => router.push(ROUTES.HOLDING_DETAIL(holdingId)),
            disabled: updateMutation.isPending
          },
          {
            label: updateMutation.isPending ? t('editHolding.actions.saving') : t('editHolding.actions.save'),
            variant: 'default',
            onClick: handleSave,
            disabled: updateMutation.isPending
          },
        ]}
      />

    </div>
  )
}

export default function EditHoldingView({ holdingId }: EditHoldingViewProps) {
  const { t } = useLanguage()
  return (
    <StandardPageLayout
      title={t('editHolding.title')}
      breadcrumbs={[
        { label: 'Home', href: ROUTES.DASHBOARD },
        { label: 'Holdings', href: ROUTES.HOLDINGS_LIST },
        { label: t('editHolding.breadcrumbs.edit') }
      ]}
    >
      <ErrorBoundary>
        <EditHoldingContent holdingId={holdingId} />
      </ErrorBoundary>
    </StandardPageLayout>
  )
}
