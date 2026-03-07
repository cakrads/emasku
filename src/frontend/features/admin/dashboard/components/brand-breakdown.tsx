'use client'

import { Stack } from '@/frontend/components/ui/layout'
import { SectionHeader } from '@/frontend/components/ui/section-header'
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
      <div className="grid grid-cols-2 gap-3">
        {brands.filter(b => b.brandCode).map((brand, index) => (
          <BrandCard
            key={index}
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
    </Stack>
  )
}
