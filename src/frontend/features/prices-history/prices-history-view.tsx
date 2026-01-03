/**
 * PricesHistoryView - Price History Chart Page
 * 
 * Displays historical gold price movement for ANTAM SPOT 1g.
 * This is a reference benchmark, not personalized to user portfolio.
 */

'use client'

import { Container } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { PriceHistoryChart } from '@/frontend/components/fragments/price-history-chart'
import { DUMMY_HISTORICAL_PRICES } from '@/frontend/data/dummy-prices'

export function PricesHistoryView() {
  return (
    <Container className="py-8">
      {/* Header */}
      <div className="mb-8">
        <Typography as="h1" variant="h1" className="mb-2">
          ANTAM Gold Price History
        </Typography>
        <Typography as="p" variant="body" className="text-muted-foreground">
          SPOT · 1 gram · IDR
        </Typography>
      </div>

      {/* Chart Section */}
      <div className="bg-card rounded-lg border border-border p-6 mb-6">
        <PriceHistoryChart data={DUMMY_HISTORICAL_PRICES} height={400} />
      </div>

      {/* Footer Note */}
      <div className="text-center">
        <Typography variant="body-sm" className="text-muted-foreground">
          Reference price only. Not personalized.
        </Typography>
      </div>
    </Container>
  )
}
