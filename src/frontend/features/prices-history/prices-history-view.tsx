/**
 * PricesHistoryView - Price History Chart Page
 * 
 * Displays historical gold price movement for ANTAM SPOT 1g.
 * This is a reference benchmark, not personalized to user portfolio.
 */

'use client'

import { Typography } from '@/frontend/components/ui/typography'
import { PriceHistoryChart } from '@/frontend/components/fragments/price-history-chart'
import { DUMMY_HISTORICAL_PRICES } from '@/frontend/data/dummy-prices'

import { StandardPageLayout } from '@/frontend/components/layout/standard-page-layout'
import { ROUTES } from '@/frontend/config/routes'

export function PricesHistoryView() {
  return (
    <StandardPageLayout
      title="ANTAM Price History"
      description="SPOT · 1 gram · IDR"
      breadcrumbs={[
        { label: 'Home', href: ROUTES.DASHBOARD },
        { label: 'Prices', href: ROUTES.PRICES },
        { label: 'History' }
      ]}
    >
      <div className="flex flex-col">
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
      </div>
    </StandardPageLayout>
  )
}
