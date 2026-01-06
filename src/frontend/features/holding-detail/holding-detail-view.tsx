'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent } from '@/frontend/components/ui/card'
import { Button } from '@/frontend/components/ui/button'
import { Stack, Section } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { TrendingUp, TrendingDown, Pencil } from 'lucide-react'
import { cn } from '@/frontend/utils/cn'
import { ROUTES } from '@/frontend/config/routes'
import { StandardPageLayout } from '@/frontend/components/layout/standard-page-layout'
import Link from 'next/link'
import { fetchHoldingDetail } from '@/frontend/services/portfolio/portfolio.api'
import { transformHoldingDetail } from '@/frontend/view-model/portfolio.vm'
import { HoldingDetailSkeleton } from './components/holding-detail-skeleton'
import { ErrorBoundary } from '@/frontend/components/fragments/error-boundary'

interface HoldingDetailViewProps {
  holdingId: string
  backUrl?: string
}

function HoldingDetailContent({ holdingId }: HoldingDetailViewProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['portfolio', 'holding', holdingId],
    queryFn: () => fetchHoldingDetail(holdingId),
  })

  if (isLoading) {
    return <HoldingDetailSkeleton />
  }

  if (error || !data) {
    throw error || new Error('Failed to load holding')
  }

  const holding = transformHoldingDetail(data)
  const isPositive = holding.pnlColor !== 'negative'

  return (
    <div className="max-w-xl mx-auto pb-24">
      {/* Current Value Section (Hero) */}
      <Section className="px-6 text-center mb-8">
        <Stack gap="sm">
          <Typography variant="h4">Current Value</Typography>
          <Typography variant="h1" className="text-4xl financial-value">
            {holding.totalValue}
          </Typography>
          <Stack direction="horizontal" gap="xs" className="justify-center items-center mt-2">
            {holding.pnlColor === 'positive' && (
              <TrendingUp className="w-4 h-4 text-(--positive)" />
            )}
            {holding.pnlColor === 'negative' && (
              <TrendingDown className="w-4 h-4 text-(--negative)" />
            )}
            <Typography
              variant="body"
              className={cn(
                'font-semibold',
                holding.pnlColor === 'positive' ? 'text-(--positive)' : holding.pnlColor === 'negative' ? 'text-(--negative)' : ''
              )}
            >
              {holding.pnl} ({holding.pnlPercentage})
            </Typography>
          </Stack>
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
                  <Typography variant="body" className="font-medium">{holding.buyDate}</Typography>
                </Stack>
                <Stack direction="horizontal" className="justify-between items-center">
                  <Typography variant="body-sm">Weight</Typography>
                  <Typography variant="body" className="font-medium">{holding.weight}</Typography>
                </Stack>
                <Stack direction="horizontal" className="justify-between items-center">
                  <Typography variant="body-sm">Buy Price (per gram)</Typography>
                  <Typography variant="body" className="font-medium">{holding.avgBuyPrice}</Typography>
                </Stack>

                <div className="h-px bg-(--border) w-full" />

                {/* NOTE: We might want 'totalBuyValue' in VM formatted as string if we used it here.
                    Check HoldingItemVM. Yes it doesn't explicitly have 'totalBuyValue' formatted?
                    Wait, HoldingItem contract has totalBuyValue (number).
                    My HoldingItemVM currently: avgBuyPrice, currentPrice, totalValue (current).
                    Let's check ViewModel again.
                    Ah, HoldingItemVM MISSING totalBuyValue formatted string!
                    I'll double check the ViewModel file content from Step 338.
                    VM has: avgBuyPrice, currentPrice, totalValue (which is currentValue).
                    It DOES NOT have totalBuyValue.
                    I need to add totalBuyValue to ViewModel! 
                */}
                <Stack direction="horizontal" className="justify-between items-center">
                  <Typography variant="body-sm">Total Buy Value</Typography>
                  <Typography variant="body" className="font-medium financial-value">{holding.totalBuyValue}</Typography>
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
      <Section className="px-0 mt-6">
        <Card className="bg-(--surface-elevated) border-(--border) shadow-(--shadow-sm)">
          <CardContent className="p-5">
            <Stack gap="md">
              <Typography variant="h3" className="text-sm">Current Valuation</Typography>

              <Stack gap="md">
                <Stack direction="horizontal" className="justify-between items-center">
                  <Typography variant="body-sm">Current Price (per gram)</Typography>
                  <Typography variant="body" className="font-medium">{holding.currentPrice}</Typography>
                </Stack>
                <Stack direction="horizontal" className="justify-between items-center">
                  <Typography variant="body-sm">Weight</Typography>
                  <Typography variant="body" className="font-medium">{holding.weight}</Typography>
                </Stack>

                <div className="h-px bg-(--border) w-full" />

                <Stack direction="horizontal" className="justify-between items-center">
                  <Typography variant="h3" className="text-sm">Total Current Value</Typography>
                  <Typography variant="h2" className="financial-value">{holding.totalValue}</Typography>
                </Stack>

                <Stack direction="horizontal" className="justify-between items-center">
                  <Typography variant="body-sm">Profit/Loss</Typography>
                  <Typography
                    variant="body"
                    className={cn(
                      'font-semibold',
                      holding.pnlColor === 'positive' ? 'text-(--positive)' : holding.pnlColor === 'negative' ? 'text-(--negative)' : ''
                    )}
                  >
                    {holding.pnl} ({holding.pnlPercentage})
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Section>
    </div>
  )
}

export default function HoldingDetailView(props: HoldingDetailViewProps) {
  return (
    <StandardPageLayout
      title="Holding Details"
      description="Gold bar details and performance"
      breadcrumbs={[
        { label: 'Home', href: ROUTES.DASHBOARD },
        { label: 'Holdings', href: ROUTES.HOLDINGS_LIST },
        { label: 'Detail' }
      ]}
      action={
        <Link href={ROUTES.EDIT_HOLDING(props.holdingId)}>
          <Button variant="outline" size="sm">
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </Link>
      }
    >
      <ErrorBoundary>
        <HoldingDetailContent {...props} />
      </ErrorBoundary>
    </StandardPageLayout>
  )
}
