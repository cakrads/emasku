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
import { UpdateHoldingRequest } from '@/shared/contracts/update-holding.contract'
import { toast } from 'sonner'
import { Skeleton } from '@/frontend/components/ui/skeleton'
import { ErrorBoundary } from '@/frontend/components/fragments/error-boundary'

interface EditHoldingViewProps {
  holdingId: string
}

function EditHoldingContent({ holdingId }: EditHoldingViewProps) {
  const router = useRouter()
  const queryClient = useQueryClient()

  // Fetch holding data
  const { data: holding, isLoading, error } = useQuery({
    queryKey: ['holding', holdingId],
    queryFn: () => fetchHoldingDetail(holdingId),
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
      toast.success('Holding updated successfully!', {
        description: 'Your changes have been saved.'
      })
      queryClient.invalidateQueries({ queryKey: ['holding', holdingId] })
      queryClient.invalidateQueries({ queryKey: ['portfolio'] })
      queryClient.invalidateQueries({ queryKey: ['holdings'] })
      router.push(ROUTES.HOLDINGS_LIST)
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

        toast.error('Validation Failed', {
          description: fieldErrors,
          duration: 5000,
        })
      } else {
        toast.error('Error Updating Holding', {
          description: apiError?.message || 'Failed to update holding',
          duration: 4000,
        })
      }
    }
  })

  const handleSave = () => {
    if (!weight) {
      toast.error('Missing required fields', {
        description: 'Please fill in weight.'
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

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto pb-44">
        <Section className="px-0">
          <Stack gap="xl">
            {[1, 2, 3, 4].map(i => (
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
            <Label className="text-text-secondary font-medium uppercase tracking-wider">Brand</Label>
            <Input value={holding.brandName} disabled className="p-4 rounded-xl bg-muted border-border text-foreground text-lg font-semibold h-14 opacity-100" />
            <Typography variant="caption" className="text-muted-foreground">Brand cannot be changed.</Typography>
          </Stack>

          <Stack gap="sm">
            <Label className="text-text-secondary font-medium uppercase tracking-wider">Weight (g)</Label>
            <Input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="p-4 rounded-xl bg-surface-elevated border-border text-foreground text-lg font-semibold h-14"
              inputMode="decimal"
            />
          </Stack>

          <Stack gap="sm">
            <Label className="text-text-secondary font-medium uppercase tracking-wider">Buy Price (Total IDR)</Label>
            <Input
              type="number"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              className="p-4 rounded-xl bg-surface-elevated border-border text-foreground text-lg font-semibold h-14"
              inputMode="decimal"
            />
          </Stack>

          <Stack gap="sm">
            <Label className="text-text-secondary font-medium uppercase tracking-wider">Purchase Date</Label>
            <DatePicker
              value={buyDate}
              onChange={setBuyDate}
              disabled={(date) => date > new Date()}
            />
          </Stack>

          <Stack gap="sm">
            <Label className="text-text-secondary font-medium uppercase tracking-wider">Notes</Label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="p-4 rounded-xl bg-surface-elevated border-border text-foreground text-lg font-semibold h-14"
              placeholder="Optional notes..."
            />
          </Stack>
        </Stack>
      </Section>

      <DetailActions
        actions={[
          {
            label: 'Cancel',
            variant: 'outline',
            onClick: () => router.push(ROUTES.HOLDINGS_LIST),
            disabled: updateMutation.isPending
          },
          {
            label: updateMutation.isPending ? 'Saving...' : 'Save Changes',
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
  return (
    <StandardPageLayout
      title="Edit Holding"
      breadcrumbs={[
        { label: 'Home', href: ROUTES.DASHBOARD },
        { label: 'Holdings', href: ROUTES.HOLDINGS_LIST },
        { label: 'Edit' }
      ]}
    >
      <ErrorBoundary>
        <EditHoldingContent holdingId={holdingId} />
      </ErrorBoundary>
    </StandardPageLayout>
  )
}
