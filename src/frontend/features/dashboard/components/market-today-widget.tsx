'use client'

import Link from 'next/link'
import { Typography } from '@/frontend/components/ui/typography'
import { DUMMY_TODAY_PRICES } from '@/frontend/data/dummy-prices'
import { ArrowRight } from 'lucide-react'
import { ROUTES } from '@/frontend/config/routes'

function formatIDR(value: number): string {
  if (value === 0) return '-'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function MarketTodayWidget() {
  // Take top 3 brands for preview
  const previewBrands = DUMMY_TODAY_PRICES.brands.slice(0, 3)

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden mb-6">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <Typography as="h2" variant="h3">Market Today</Typography>
        <Link
          href={ROUTES.PRICES}
          className="flex items-center gap-1 text-sm text-accent-gold hover:underline"
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="p-4">
        <div className="space-y-3">
          {previewBrands.map((brand) => (
            <div key={brand.brand} className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <Link
                  href={ROUTES.BRAND_DETAIL(brand.brand)}
                  className="hover:text-accent-gold underline decoration-accent-gold/30 font-medium"
                >
                  {brand.brand}
                </Link>
                <span className="text-muted-foreground text-xs">· 1g</span>
              </div>
              <div className="font-medium">
                {formatIDR(brand.prices.find(p => p.denominationGram === 1)?.sellPrice || 0)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
