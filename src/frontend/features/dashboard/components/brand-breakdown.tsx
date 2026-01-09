'use client'

import { Stack, ScrollArea } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import BrandCard from './brand-card'

interface BrandData {
  brandCode: string
  brandName: string
  totalGrams: number
  currentValue: number
  deltaValue: number
  deltaPercentage: number
  valuationSource: 'BUYBACK' | 'SPOT' | 'USER' | 'NONE' | 'MIXED'
}

interface BrandBreakdownProps {
  brands: BrandData[]
}

export default function BrandBreakdown({ brands }: BrandBreakdownProps) {
  return (
    <Stack gap="md">
      <Stack gap="none">
        <Typography as="h2" variant="h3">Holdings</Typography>
        <Typography variant="body-sm">By brand</Typography>
      </Stack>

      <ScrollArea>
        <Stack direction="horizontal" gap="sm" className="pb-2">
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
          {/* Spacer for right horizontal scroll padding */}
          <div className="w-2 shrink-0" />

        </Stack>
      </ScrollArea>
    </Stack>
  )
}
