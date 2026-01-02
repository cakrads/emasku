'use client'

import { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/frontend/components/ui/card'
import { Button } from '@/frontend/components/ui/button'
import { PageWrapper, Container, Stack, Section } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { DetailHeader } from '@/frontend/components/fragments/detail-header'
import { DetailActions } from '@/frontend/components/fragments/detail-actions'
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/frontend/utils/cn'
import { DUMMY_HOLDINGS } from '@/frontend/data/dummy-holdings'
import { holdingsRepository } from '@/frontend/utils/holdings-repository'
import { calculateHoldingValue, formatCurrency, formatWeight, formatDate } from '@/frontend/utils/aggregations'
import { ROUTES } from '@/frontend/config/routes'
import Link from 'next/link'

interface HoldingDetailViewProps {
  holdingId: string
  backUrl?: string
}

export default function HoldingDetailView({ holdingId, backUrl }: HoldingDetailViewProps) {
  const router = useRouter()
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
      <PageWrapper>
        <Container className="max-w-7xl md:p-8 p-4">
          <Stack gap="lg">
            <Link
              href={ROUTES.HOLDINGS_LIST}
              className="flex items-center gap-2 text-(--foreground-muted) hover:text-foreground transition-colors w-fit"
            >
              <ArrowLeft className="w-4 h-4" />
              <Typography variant="body-sm">Back to Holdings</Typography>
            </Link>
            <Typography variant="h2">Holding not found</Typography>
            <Typography variant="body">
              No holding found with ID: {holdingId}
            </Typography>
          </Stack>
        </Container>
      </PageWrapper>
    )
  }

  // Calculate values
  const { totalBuyValue, totalCurrentValue, profitLoss, profitLossPercentage } =
    calculateHoldingValue(holding)

  const hasValue = holding.currentPrice > 0
  const isPositive = profitLoss >= 0

  return (
    <PageWrapper>
      <Container className="flex flex-col relative p-0 max-w-7xl md:p-8">
        <Container className="max-w-md mx-auto w-full p-0 pb-44 px-0">

          {/* Back Button */}
          <div className="px-6 pt-6 pb-2">
            <Link
              href={backLink}
              className="flex items-center gap-2 text-(--foreground-muted) hover:text-foreground transition-colors w-fit"
            >
              <ArrowLeft className="w-5 h-5" />
              <Typography variant="body-sm">Back</Typography>
            </Link>
          </div>

          {/* Header */}
          <DetailHeader
            badgeLabel={hasValue ? undefined : 'Unvalued'}
            badgeColor={hasValue ? undefined : 'text-(--badge-unvalued) bg-(--badge-unvalued-bg)'}
            title={holding.brandName}
            subtitle={`Gold Bar • 99.99%`}
            value={formatWeight(holding.weight)}
            valueLabel="Weight"
          />

          {/* Current Value Section (Hero) */}
          <Section className="px-6 text-center">
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
          <Section className="px-4">
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
            <Section className="px-4">
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

          <DetailActions
            actions={[
              { label: 'Close', variant: 'outline', onClick: () => router.push(ROUTES.HOLDINGS_LIST) },
              { label: hasValue ? 'Edit Holding' : 'Add Price', variant: 'default', onClick: () => router.push(ROUTES.EDIT_HOLDING(holding.id)) }
            ]}
          />
        </Container>
      </Container>
    </PageWrapper>
  )
}
