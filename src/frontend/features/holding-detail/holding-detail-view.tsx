'use client'

import { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/frontend/components/ui/card'
import { Button } from '@/frontend/components/ui/button'
import { Stack, Section } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { DetailActions } from '@/frontend/components/fragments/detail-actions'
import { TrendingUp, TrendingDown, Pencil } from 'lucide-react'
import { cn } from '@/frontend/utils/cn'
import { DUMMY_HOLDINGS } from '@/frontend/data/dummy-holdings'
import { holdingsRepository } from '@/frontend/utils/holdings-repository'
import { calculateHoldingValue, formatCurrency, formatWeight, formatDate } from '@/frontend/utils/aggregations'
import { ROUTES } from '@/frontend/config/routes'
import { StandardPageLayout } from '@/frontend/components/layout/standard-page-layout'
import Link from 'next/link'

interface HoldingDetailViewProps {
  holdingId: string
  backUrl?: string
}

export default function HoldingDetailView({ holdingId, backUrl }: HoldingDetailViewProps) {
  const router = useRouter()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const backLink = backUrl || ROUTES.HOLDINGS_LIST

  // Find the holding from repository (with local override support)
  // Initialize with DUMMY to avoid hydration mismatch, then update
  const [holding, setHolding] = useState(DUMMY_HOLDINGS.find((h) => h.id === holdingId))

  useEffect(() => {
    const fresh = holdingsRepository.getById(holdingId)
    setHolding(fresh)
  }, [holdingId])

  // If holding not found
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
        <Stack gap="lg">
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

  // Calculate values
  const { totalBuyValue, totalCurrentValue, profitLoss, profitLossPercentage } =
    calculateHoldingValue(holding)

  const hasValue = holding.currentPrice > 0
  const isPositive = profitLoss >= 0

  return (
    <StandardPageLayout
      title={holding.brandName}
      description={`Gold Bar · ${formatWeight(holding.weight)} · 99.99%`}
      breadcrumbs={[
        { label: 'Home', href: ROUTES.DASHBOARD },
        { label: 'Holdings', href: ROUTES.HOLDINGS_LIST },
        { label: 'Detail' }
      ]}
      action={
        <Link href={ROUTES.EDIT_HOLDING(holding.id)}>
          <Button variant="outline" size="sm">
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </Link>
      }
    >
      <div className="max-w-xl mx-auto pb-24">
        {/* Current Value Section (Hero) */}
        <Section className="px-6 text-center mb-8">
          <Stack gap="sm">
            {hasValue ? (
              <>
                <Typography variant="h4">Current Value</Typography>
                <Typography variant="h1" className="text-4xl financial-value">
                  {formatCurrency(totalCurrentValue)}
                </Typography>
                <Stack direction="horizontal" gap="xs" className="justify-center items-center mt-2">
                  {isPositive ? (
                    <TrendingUp className="w-4 h-4 text-(--positive)" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-(--negative)" />
                  )}
                  <Typography
                    variant="body"
                    className={cn(
                      'font-semibold',
                      isPositive ? 'text-(--positive)' : 'text-(--negative)'
                    )}
                  >
                    {formatCurrency(Math.abs(profitLoss))} ({profitLossPercentage >= 0 ? '+' : ''}{profitLossPercentage.toFixed(2)}%)
                  </Typography>
                </Stack>
              </>
            ) : (
              <>
                <Typography className="text-4xl font-light text-(--text-muted)">—</Typography>
                <Typography variant="body-sm">
                  This holding does not currently have a valuation
                </Typography>
              </>
            )}
          </Stack>
        </Section>

        {/* Purchase Details Card */}
        <Section className="px-0">
          <Card className="bg-(--surface-elevated) border-(--border) shadow-(--shadow-sm)">
            <CardContent className="p-5">
              <Stack gap="md">
                <Typography variant="h3" className="text-sm">Purchase Details</Typography>

                <Stack gap="md">
                  <Stack direction="horizontal" className="justify-between items-center">
                    <Typography variant="body-sm">Purchase Date</Typography>
                    <Typography variant="body" className="font-medium">{formatDate(holding.buyDate)}</Typography>
                  </Stack>
                  <Stack direction="horizontal" className="justify-between items-center">
                    <Typography variant="body-sm">Weight</Typography>
                    <Typography variant="body" className="font-medium">{formatWeight(holding.weight)}</Typography>
                  </Stack>
                  <Stack direction="horizontal" className="justify-between items-center">
                    <Typography variant="body-sm">Buy Price (per gram)</Typography>
                    <Typography variant="body" className="font-medium">{formatCurrency(holding.buyPrice)}</Typography>
                  </Stack>

                  <div className="h-px bg-(--border) w-full" />

                  <Stack direction="horizontal" className="justify-between items-center">
                    <Typography variant="h3" className="text-sm">Total Buy Value</Typography>
                    <Typography variant="h2" className="financial-value">{formatCurrency(totalBuyValue)}</Typography>
                  </Stack>
                </Stack>

                {holding.notes && (
                  <Stack gap="xs" className="mt-2 pt-3 border-t border-(--border)">
                    <Typography variant="caption">Notes</Typography>
                    <Typography variant="body-sm">
                      {holding.notes}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Section>

        {/* Current Valuation Card */}
        {hasValue && (
          <Section className="px-0 mt-6">
            <Card className="bg-(--surface-elevated) border-(--border) shadow-(--shadow-sm)">
              <CardContent className="p-5">
                <Stack gap="md">
                  <Typography variant="h3" className="text-sm">Current Valuation</Typography>

                  <Stack gap="md">
                    <Stack direction="horizontal" className="justify-between items-center">
                      <Typography variant="body-sm">Current Price (per gram)</Typography>
                      <Typography variant="body" className="font-medium">{formatCurrency(holding.currentPrice)}</Typography>
                    </Stack>
                    <Stack direction="horizontal" className="justify-between items-center">
                      <Typography variant="body-sm">Weight</Typography>
                      <Typography variant="body" className="font-medium">{formatWeight(holding.weight)}</Typography>
                    </Stack>

                    <div className="h-px bg-(--border) w-full" />

                    <Stack direction="horizontal" className="justify-between items-center">
                      <Typography variant="h3" className="text-sm">Total Current Value</Typography>
                      <Typography variant="h2" className="financial-value">{formatCurrency(totalCurrentValue)}</Typography>
                    </Stack>

                    <Stack direction="horizontal" className="justify-between items-center">
                      <Typography variant="body-sm">Profit/Loss</Typography>
                      <Typography
                        variant="body"
                        className={cn(
                          'font-semibold',
                          isPositive ? 'text-(--positive)' : 'text-(--negative)'
                        )}
                      >
                        {formatCurrency(Math.abs(profitLoss))} ({profitLossPercentage >= 0 ? '+' : ''}{profitLossPercentage.toFixed(2)}%)
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Section>
        )}

      </div>
    </StandardPageLayout>
  )
}
