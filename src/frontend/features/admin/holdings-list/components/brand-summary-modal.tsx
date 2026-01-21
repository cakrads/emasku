'use client'

import { ResponsiveModal } from '@/frontend/components/ui/responsive-modal'
import { Stack } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { ResponsiveInfoTip } from '@/frontend/components/ui/responsive-info-tip'
import { TrendingUp } from 'lucide-react'
import { cn } from '@/frontend/utils/cn'
import { useLanguage } from '@/frontend/hooks/use-language'
import { BrandData } from '@/frontend/view-model/portfolio.vm'

interface BrandSummaryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  brands: BrandData[]
}

export default function BrandSummaryModal({
  open,
  onOpenChange,
  brands,
}: BrandSummaryModalProps) {
  const { t, language } = useLanguage()
  const locale = language === 'id' ? 'id-ID' : 'en-US'

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatWeight = (grams: number) => {
    return `${new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(grams)} g`
  }

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title={t('holdings.brandSummary.title')}
      description={t('holdings.brandSummary.description')}
    >
      <div className="py-2 max-h-[60vh] overflow-y-auto">
        {brands.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Typography variant="body">{t('holdings.brandSummary.empty')}</Typography>
          </div>
        ) : (
          <Stack gap="sm">
            {brands.map((brand) => {
              const isUnvalued = brand.valuationSource === 'NONE'
              const pnlColor = brand.deltaValue > 0
                ? 'text-(--positive)'
                : brand.deltaValue < 0
                  ? 'text-(--negative)'
                  : 'text-muted-foreground'

              return (
                <div
                  key={brand.brandCode}
                  className="p-4 rounded-lg border border-(--border) bg-(--surface)"
                >
                  {/* Header: Brand Name + Weight */}
                  <div className="flex justify-between items-start mb-3 pb-2 border-b border-dashed border-(--border)/50">
                    <div className="flex flex-col">
                      <Typography className="font-semibold">{brand.brandName}</Typography>
                      <Typography variant="caption" className="text-muted-foreground">
                        {formatWeight(brand.totalGrams)}
                      </Typography>
                    </div>
                    {!isUnvalued && (
                      <div className={cn('flex items-center gap-1 text-sm', pnlColor)}>
                        <TrendingUp className={cn(
                          'w-4 h-4',
                          brand.deltaValue < 0 && 'rotate-180',
                          brand.deltaValue === 0 && 'hidden'
                        )} />
                        <span className="font-medium">
                          {brand.deltaValue > 0 ? '+' : ''}{brand.deltaPercentage.toFixed(2)}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Values Grid */}
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="min-w-0">
                      <Typography variant="caption" className="text-muted-foreground text-xs block">
                        {t('holdings.summary.purchaseValue')}
                      </Typography>
                      <ResponsiveInfoTip content={<p className="font-mono">{formatCurrency(brand.totalBuyValue)}</p>}>
                        <Typography as="div" className="font-medium financial-value truncate cursor-help">
                          {formatCurrency(brand.totalBuyValue)}
                        </Typography>
                      </ResponsiveInfoTip>
                    </div>
                    <div className="min-w-0">
                      <Typography variant="caption" className="text-muted-foreground text-xs block">
                        {t('holdings.summary.estimatedValue')}
                      </Typography>
                      <ResponsiveInfoTip content={<p className="font-mono">{isUnvalued ? '—' : formatCurrency(brand.currentValue)}</p>}>
                        <Typography as="div" className="font-medium financial-value truncate cursor-help">
                          {isUnvalued ? '—' : formatCurrency(brand.currentValue)}
                        </Typography>
                      </ResponsiveInfoTip>
                    </div>
                    <div className="min-w-0">
                      <Typography variant="caption" className="text-muted-foreground text-xs block">
                        {t('holdings.summary.profitLoss')}
                      </Typography>
                      <ResponsiveInfoTip content={<p className="font-mono">{isUnvalued ? '—' : `${brand.deltaValue > 0 ? '+' : ''}${formatCurrency(brand.deltaValue)}`}</p>}>
                        <Typography as="div" className={cn('font-medium truncate cursor-help', pnlColor)}>
                          {isUnvalued ? '—' : `${brand.deltaValue > 0 ? '+' : ''}${formatCurrency(brand.deltaValue)}`}
                        </Typography>
                      </ResponsiveInfoTip>
                    </div>
                  </div>
                </div>
              )
            })}
          </Stack>
        )}
      </div>
    </ResponsiveModal>
  )
}
