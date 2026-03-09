'use client'

import { Stack } from '@/frontend/components/ui/layout'
import { SectionHeader } from '@/frontend/components/ui/section-header'
import { TooltipProvider } from '@/frontend/components/ui/tooltip'
import BrandCard from './brand-card'
import { useLanguage } from '@/frontend/hooks/use-language'
import { ROUTES } from '@/frontend/config/routes'

interface BrandData {
  brandCode: string
  brandName: string
  totalGrams: number
  currentValue: number
  deltaValue: number
  deltaPercentage: number
  valuationSource: 'BUYBACK' | 'USER' | 'NONE' | 'MIXED'
}

interface BrandBreakdownProps {
  brands: BrandData[]
}

export default function BrandBreakdown({ brands }: BrandBreakdownProps) {
  const { t } = useLanguage()
  return (
    <Stack gap="md">
      <SectionHeader
        title={t('dashboard.holdings')}
        actionLabel={t('common.viewAll')}
        href={ROUTES.HOLDINGS_LIST}
      />
      <TooltipProvider delayDuration={200}>
        <div className="grid grid-cols-2 gap-3">
          {brands.map((brand) => (
            <BrandCard
              key={brand.brandCode}
              brandCode={brand.brandCode}
              brandName={brand.brandName}
              totalGrams={brand.totalGrams}
              currentValue={brand.currentValue}
              deltaValue={brand.deltaValue}
              deltaPercentage={brand.deltaPercentage}
              valuationSource={brand.valuationSource}
            />
          ))}
        </div>
      </TooltipProvider>
    </Stack>
  )
}
