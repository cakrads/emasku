'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Check, Info } from 'lucide-react'
import { Typography } from '@/frontend/components/ui/typography'
import { Button } from '@/frontend/components/ui/button'
import { Stack, Section } from '@/frontend/components/ui/layout'
import { Label } from '@/frontend/components/ui/label'
import { Input } from '@/frontend/components/ui/input'
import { Skeleton } from '@/frontend/components/ui/skeleton'
import { cn } from '@/frontend/utils/cn'
import { fetchTodayPrices } from '@/frontend/services/prices/prices.api'
import { transformTodayPrices } from '@/frontend/view-model/prices.vm'
import { useLanguage } from '@/frontend/hooks/use-language'
import { Brand } from './brand-selector'

interface WeightSelectorProps {
  brand: Brand
  selectedWeight: string
  onSelect: (weight: string, autoAdvance?: boolean) => void
  data?: any
  isLoading?: boolean
}

export function WeightSelector({ brand, selectedWeight, onSelect, data, isLoading }: WeightSelectorProps) {
  const { t, language } = useLanguage()
  const [showManual, setShowManual] = useState(brand.isCustom)

  // Remove internal query - now passed from parent

  // Sync showManual when brand changes
  useEffect(() => {
    setShowManual(brand.isCustom)
  }, [brand.id, brand.isCustom])

  const viewModel = data ? transformTodayPrices(data, language === 'id' ? 'id-ID' : 'en-US') : null

  // Extract denominations for the selected brand
  const denominations = viewModel?.brands
    .find(b => b.brandName.toUpperCase() === brand.name.toUpperCase())
    ?.prices.map(p => ({
      gram: p.denominationGram,
      label: p.weightLabel,
      sellPrice: p.sellPrice ?? 0,
    })) || []

  const formatPrice = (val: number) =>
    new Intl.NumberFormat(language === 'id' ? 'id-ID' : 'en-US', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val)

  const handleInputChange = (val: string) => {
    // Only allow positive numbers (decimals allowed)
    if (val === '' || parseFloat(val) >= 0) {
      onSelect(val, false)
    }
  }

  if (isLoading && !brand.isCustom) return <WeightSelectorSkeleton />

  if (showManual) {
    return (
      <Stack gap="lg" className="animate-in fade-in slide-in-from-right-4 duration-300">
        <Stack gap="xs">
          <Typography as="h2" variant="h1">{t('addHolding.details.steps.weight')}</Typography>
          <Typography variant="body-sm" className={brand.isCustom ? "text-amber-500 font-medium" : "text-muted-foreground"}>
            {brand.isCustom ? t('addHolding.details.weightHelp') : t('addHolding.details.marketWeightHelp')}
          </Typography>
        </Stack>

        <Stack gap="sm">
          <Label className="uppercase text-text-secondary font-medium tracking-wider">
            {t('addHolding.details.weight')}
          </Label>
          <Input
            type="number"
            inputMode="decimal"
            step="any"
            autoFocus
            value={selectedWeight}
            onChange={(e) => handleInputChange(e.target.value)}
            className="p-4 rounded-xl bg-surface-elevated border-border text-foreground text-lg font-semibold h-14"
            placeholder="0.00"
          />
          {!brand.isCustom && denominations.length > 0 && (
            <Button
              variant="link"
              onClick={() => setShowManual(false)}
              className="px-0 h-auto text-text-secondary justify-start font-normal"
            >
              ← Kembali ke pilihan berat standar
            </Button>
          )}
        </Stack>
      </Stack>
    )
  }

  return (
    <Stack gap="lg" className="animate-in fade-in slide-in-from-right-4 duration-300">
      <Stack gap="xs">
        <Typography as="h2" variant="h1">{t('addHolding.details.steps.weight')}</Typography>
        <Typography variant="body-sm" className="text-muted-foreground">
          {t('addHolding.details.marketWeightHelp')}
        </Typography>
      </Stack>

      <div className="grid grid-cols-2 gap-3">
        {denominations.map(denom => {
          const isSelected = selectedWeight === denom.gram.toString()
          return (
            <Button
              variant="ghost"
              key={denom.gram}
              onClick={() => onSelect(denom.gram.toString(), true)}
              className={cn(
                "flex flex-col items-center justify-center p-4 rounded-xl border transition-all h-auto min-h-[5rem] gap-1 hover:bg-transparent",
                isSelected
                  ? "bg-accent-gold/10 border-accent-gold ring-1 ring-accent-gold"
                  : "bg-surface-elevated border-border hover:border-text-secondary"
              )}
            >
              <Typography variant="body" className={cn("font-bold text-base", isSelected && "text-accent-gold")}>
                {denom.label}
              </Typography>
              {denom.sellPrice > 0 && (
                <Typography variant="caption" className="text-text-secondary tabular-nums">
                  {formatPrice(denom.sellPrice)}
                </Typography>
              )}
            </Button>
          )
        })}

        {/* Other Weight Option */}
        <Button
          variant="ghost"
          onClick={() => setShowManual(true)}
          className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-border transition-all h-auto hover:bg-transparent bg-surface-elevated/50"
        >
          <Typography variant="body-sm" className="font-medium text-text-secondary">
            {t('addHolding.details.otherWeight')}
          </Typography>
        </Button>
      </div>
    </Stack>
  )
}

function WeightSelectorSkeleton() {
  return (
    <Stack gap="lg" className="animate-pulse">
      <Stack gap="xs">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-64" />
      </Stack>
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    </Stack>
  )
}
