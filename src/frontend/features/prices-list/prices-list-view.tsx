/**
 * PricesListView - Today Prices Page
 * 
 * Displays current gold prices grouped by brand.
 * Shows SELL and BUYBACK prices in separate columns, ordered by weight.
 */

'use client'

import { Typography } from '@/frontend/components/ui/typography'
import { DUMMY_TODAY_PRICES } from '@/frontend/data/dummy-prices'

/**
 * Format IDR currency
 */
function formatIDR(value: number): string {
  if (value === 0) return '-'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}


/**
 * Brand Price Section Component
 */
function BrandPriceSection({ brandName, prices }: { brandName: string; prices: any[] }) {
  // Sort by weight ascending
  const sortedPrices = [...prices].sort((a, b) => a.denominationGram - b.denominationGram)

  return (
    <div className="mb-8 last:mb-0">
      {/* Brand Header */}
      <div className="bg-accent-gold/10 border border-accent-gold/20 px-6 py-3 rounded-t-lg">
        <Typography variant="h3" className="text-center">
          {brandName} Prices
        </Typography>
      </div>

      {/* Price Table */}
      <div className="border border-border border-t-0 rounded-b-lg overflow-x-auto">
        <table className="w-full min-w-[350px]">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="px-6 py-3 text-left">
                <Typography variant="body-sm" className="font-medium">
                  Weight
                </Typography>
              </th>
              <th className="px-6 py-3 text-right">
                <Typography variant="body-sm" className="font-medium">
                  Sell Price
                </Typography>
              </th>
              <th className="px-6 py-3 text-right">
                <Typography variant="body-sm" className="font-medium">
                  Buyback Price
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedPrices.map((price, index) => (
              <tr
                key={`${price.denominationGram}-${index}`}
                className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
              >
                <td className="px-6 py-3">
                  <Typography variant="body">{price.denominationGram} g</Typography>
                </td>
                <td className="px-6 py-3 text-right">
                  <Typography variant="body">{formatIDR(price.sellPrice)}</Typography>
                </td>
                <td className="px-6 py-3 text-right">
                  <Typography variant="body">{formatIDR(price.buybackPrice)}</Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

import { StandardPageLayout } from '@/frontend/components/layout/standard-page-layout'
import { ROUTES } from '@/frontend/config/routes'

function formatTimestamp(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
  }).format(date)
}

export function PricesListView() {
  const lastUpdated = formatTimestamp(DUMMY_TODAY_PRICES.date)

  return (
    <StandardPageLayout
      title="Today's Prices"
      description={`Latest update: ${lastUpdated}`}
      breadcrumbs={[{ label: 'Home', href: ROUTES.DASHBOARD }, { label: 'Prices' }]}
    >
      <div className="flex flex-col gap-8">
        {/* Brand Sections */}
        {DUMMY_TODAY_PRICES.brands.map((brandData) => (
          <BrandPriceSection
            key={brandData.brand}
            brandName={brandData.brand}
            prices={brandData.prices}
          />
        ))}
      </div>
    </StandardPageLayout>
  )
}
