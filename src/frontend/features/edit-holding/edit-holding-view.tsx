'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/frontend/components/ui/input'
import { Label } from '@/frontend/components/ui/label'
import { Button } from '@/frontend/components/ui/button'
import { Typography } from '@/frontend/components/ui/typography'
import { Stack, Section } from '@/frontend/components/ui/layout'
import { DetailActions } from '@/frontend/components/fragments/detail-actions'
import { Holding } from '@/frontend/data/dummy-holdings'
import { ROUTES } from '@/frontend/config/routes'
import { DatePicker } from '@/frontend/components/ui/date-picker'
import Link from 'next/link'
import { holdingsRepository } from '@/frontend/utils/holdings-repository'
import { StandardPageLayout } from '@/frontend/components/layout/standard-page-layout'

interface EditHoldingViewProps {
  holdingId: string
}

export default function EditHoldingView({ holdingId }: EditHoldingViewProps) {
  const router = useRouter()
  const [holding, setHolding] = useState<Holding | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Form State
  const [weight, setWeight] = useState('')
  const [buyPrice, setBuyPrice] = useState('')
  const [buyDate, setBuyDate] = useState<Date | undefined>(undefined)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const h = holdingsRepository.getById(holdingId)
    if (h) {
      setHolding(h)
      setWeight(h.weight.toString())
      setBuyPrice(h.buyPrice.toString())
      setBuyDate(new Date(h.buyDate))
      setNotes(h.notes || '')
    }
    setIsLoading(false)
  }, [holdingId])

  const handleSave = () => {
    if (!holding) return

    const updated: Holding = {
      ...holding,
      weight: parseFloat(weight) || 0,
      buyPrice: parseFloat(buyPrice) || 0,
      buyDate: buyDate || new Date(),
      notes: notes
    }

    holdingsRepository.save(updated)
    router.push(ROUTES.HOLDINGS_LIST)
  }

  if (isLoading) {
    return (
      <StandardPageLayout
        title="Edit Holding"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Holdings', href: ROUTES.HOLDINGS_LIST },
          { label: 'Edit' }
        ]}
      >
        <Typography>Loading...</Typography>
      </StandardPageLayout>
    )
  }

  if (!holding) {
    return (
      <StandardPageLayout
        title="Holding Not Found"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Holdings', href: ROUTES.HOLDINGS_LIST },
          { label: 'Not Found' }
        ]}
      >
        <Stack gap="md">
          <Typography variant="body">
            No holding found with ID: {holdingId}
          </Typography>
          <Link href={ROUTES.HOLDINGS_LIST}>
            <Button variant="outline">Back to Holdings</Button>
          </Link>
        </Stack>
      </StandardPageLayout>
    )
  }

  return (
    <StandardPageLayout
      title="Edit Holding"
      breadcrumbs={[
        { label: 'Home', href: ROUTES.DASHBOARD },
        { label: 'Holdings', href: ROUTES.HOLDINGS_LIST },
        { label: 'Detail', href: ROUTES.HOLDING_DETAIL(holding.id) },
        { label: 'Edit' }
      ]}
    >
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
              <Label className="text-text-secondary font-medium uppercase tracking-wider">Buy Price (per gram)</Label>
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
              <DatePicker value={buyDate} onChange={setBuyDate} />
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
            { label: 'Cancel', variant: 'outline', onClick: () => router.push(ROUTES.HOLDING_DETAIL(holdingId)) },
            { label: 'Save Changes', variant: 'default', onClick: handleSave },
            {
              label: 'Delete Holding', variant: 'destructive', onClick: () => {
                if (confirm('Are you sure you want to delete this holding?')) {
                  holdingsRepository.delete(holdingId)
                  router.push(ROUTES.HOLDINGS_LIST)
                }
              }
            }
          ]}
        />
      </div>
    </StandardPageLayout>
  )
}
