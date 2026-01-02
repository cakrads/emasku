'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/frontend/components/ui/input'
import { Label } from '@/frontend/components/ui/label'
import { Button } from '@/frontend/components/ui/button'
import { Typography } from '@/frontend/components/ui/typography'
import { PageWrapper, Container, Stack, Section } from '@/frontend/components/ui/layout'
import { DetailHeader } from '@/frontend/components/fragments/detail-header'
import { DetailActions } from '@/frontend/components/fragments/detail-actions'
import { ArrowLeft } from 'lucide-react'
import { DUMMY_HOLDINGS, Holding } from '@/frontend/data/dummy-holdings'
import { ROUTES } from '@/frontend/config/routes'
import { DatePicker } from '@/frontend/components/ui/date-picker'
import Link from 'next/link'
import { holdingsRepository } from '@/frontend/utils/holdings-repository'

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
    router.push(ROUTES.HOLDING_DETAIL(holdingId))
  }

  if (isLoading) {
    return (
      <PageWrapper>
        <Container className="p-8">
          <Typography>Loading...</Typography>
        </Container>
      </PageWrapper>
    )
  }

  if (!holding) {
    return (
      <PageWrapper>
        <Container className="p-8">
          <Stack gap="md">
            <Typography variant="h2">Holding not found</Typography>
            <Link href={ROUTES.HOLDINGS_LIST}>
              <Button variant="outline">Back to Holdings</Button>
            </Link>
          </Stack>
        </Container>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <Container className="flex flex-col relative p-0 max-w-7xl md:p-8">
        <Container className="max-w-md mx-auto w-full p-0 pb-44 px-0">

          {/* Back / Cancel Button (Optional, since we have it in footer now, but good for top-level exit) */}
          <div className="px-6 pt-6 pb-2">
            <Link
              href={ROUTES.HOLDING_DETAIL(holdingId)}
              className="flex items-center gap-2 text-(--foreground-muted) hover:text-foreground transition-colors w-fit"
            >
              <ArrowLeft className="w-5 h-5" />
              <Typography variant="body-sm">Back</Typography>
            </Link>
          </div>

          {/* Header Title */}
          <Section className="px-6 pt-8 pb-6">
            <Typography variant="h1">Edit Holding</Typography>
          </Section>

          {/* Form */}
          <Section className="px-6">
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
              { label: 'Save Changes', variant: 'default', onClick: handleSave }
            ]}
          />

        </Container>
      </Container>
    </PageWrapper>
  )
}
