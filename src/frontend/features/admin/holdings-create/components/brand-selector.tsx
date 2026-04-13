'use client'

import React, { useState } from 'react'
import { Info } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Typography } from '@/frontend/components/ui/typography'
import { Button } from '@/frontend/components/ui/button'
import { Stack, Section, Grid } from '@/frontend/components/ui/layout'
import { Label } from '@/frontend/components/ui/label'
import { Input } from '@/frontend/components/ui/input'
import { Skeleton } from '@/frontend/components/ui/skeleton'
import { cn } from '@/frontend/utils/cn'
import { fetchBrands } from '@/frontend/services/brands/brands.api'
import { useLanguage } from '@/frontend/hooks/use-language'

export interface Brand {
  id: string
  name: string
  hasOfficialPrice: boolean
  isCustom?: boolean
}

interface BrandSelectorProps {
  selected: Brand | null
  onSelect: (brand: Brand, autoAdvance?: boolean) => void
}

export function BrandSelector({ selected, onSelect }: BrandSelectorProps) {
  const { t } = useLanguage()
  const [isCustomMode, setIsCustomMode] = useState(false)
  const [customName, setCustomName] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['brands'],
    queryFn: fetchBrands,
  })

  if (isLoading) return <BrandSelectorSkeleton />
  if (error) throw error

  const brands: Brand[] = (data?.items || [])
    .filter(item => item.code !== 'OTHER')
    .map(item => ({
      id: item.code,
      name: item.name,
      hasOfficialPrice: ['ANTAM', 'UBS', 'GALERI24', 'LOTUS', 'LOTUS ARCHI', 'LOTUS_ARCHI'].includes(item.code.toUpperCase())
    }))

  if (isCustomMode) {
    return (
      <Stack gap="lg" className="animate-in fade-in slide-in-from-right-4 duration-300">
        <Stack gap="xs">
          <Typography as="h2" variant="h1">{t('addHolding.brandSelection.customBrand.title')}</Typography>
          <Typography variant="body-sm">{t('addHolding.brandSelection.customBrand.subtitle')}</Typography>
        </Stack>

        <Section className="p-4 rounded-xl border border-border bg-surface-elevated py-4">
          <Stack direction="horizontal" gap="md" className="items-start text-text-secondary">
            <Info className="h-5 w-5 shrink-0 mt-0.5 text-foreground" />
            <Typography variant="caption" className="text-text-secondary leading-relaxed">
              {parseBoldMarkup(String(t('addHolding.brandSelection.customBrand.warning')))}
            </Typography>
          </Stack>
        </Section>

        <Stack gap="md">
          <Stack gap="sm">
            <Label className="uppercase text-text-secondary font-medium tracking-wider">{t('addHolding.brandSelection.brandName')}</Label>
            <Input
              autoFocus
              value={customName}
              onChange={(e) => {
                setCustomName(e.target.value)
                const name = e.target.value
                const b = name ? { id: 'OTHER', name, hasOfficialPrice: false, isCustom: true } : null
                if (b) onSelect(b, false) // Don't auto-advance on typing
              }}
              className="p-4 rounded-xl bg-surface-elevated border-border text-foreground text-lg font-semibold h-14"
              placeholder={t('addHolding.brandSelection.customBrand.placeholder')}
            />
          </Stack>
          <Button
            variant="ghost"
            className="text-sm font-medium text-text-secondary hover:text-foreground transition-colors py-2 h-auto justify-start"
            onClick={() => setIsCustomMode(false)}
          >
            {t('addHolding.brandSelection.customBrand.back')}
          </Button>
        </Stack>
      </Stack>
    )
  }

  return (
    <Stack gap="lg" className="animate-in fade-in slide-in-from-right-4 duration-300">
      <Stack gap="xs">
        <Typography as="h2" variant="h1">{t('addHolding.brandSelection.title')}</Typography>
        <Typography variant="body-sm">{t('addHolding.brandSelection.subtitle')}</Typography>
      </Stack>

      <Grid className="grid-cols-2 gap-3">
        {brands.map(brand => {
          const isSelected = selected?.id === brand.id && !selected?.isCustom
          const initials = brand.name.slice(0, 2).toUpperCase()
          return (
            <Button
              variant="ghost"
              key={brand.id}
              onClick={() => onSelect(brand, true)}
              className={cn(
                "flex flex-col items-center gap-2 py-4 px-3 rounded-xl border transition-all h-auto min-h-22 hover:bg-transparent",
                isSelected
                  ? "bg-accent-gold/10 border-accent-gold ring-1 ring-accent-gold"
                  : "bg-surface-elevated border-border hover:border-text-secondary"
              )}
            >
              <Stack
                className={cn(
                  "h-12 w-12 rounded-full flex items-center justify-center shrink-0",
                  isSelected ? "bg-accent-gold/20" : "bg-surface"
                )}
              >
                <Typography variant="h3" className={cn("font-bold", isSelected ? "text-accent-gold" : "text-foreground")}>
                  {initials}
                </Typography>
              </Stack>
              <Typography variant="body-sm" className="font-semibold text-center leading-tight">
                {brand.name}
              </Typography>
            </Button>
          )
        })}

        <Button
          variant="ghost"
          onClick={() => setIsCustomMode(true)}
          className="col-span-2 text-left p-4 rounded-xl border border-dashed border-border hover:bg-surface-elevated hover:border-text-secondary transition-all flex items-center gap-3 text-text-secondary mt-1 h-auto justify-start"
        >
          <Stack className="h-8 w-8 rounded-full bg-surface flex items-center justify-center shrink-0">
            <Typography variant="h3" className="font-light">+</Typography>
          </Stack>
          <Typography variant="body" className="font-medium">{t('addHolding.brandSelection.customBrand.button')}</Typography>
        </Button>
      </Grid>
    </Stack>
  )
}

function BrandSelectorSkeleton() {
  return (
    <Stack gap="lg" className="animate-pulse">
      <Stack gap="xs">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-64" />
      </Stack>
      <Grid className="grid-cols-2 gap-3">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="min-h-22 w-full rounded-xl" />
        ))}
        <Skeleton className="col-span-2 h-14 w-full rounded-xl" />
      </Grid>
    </Stack>
  )
}

/** Parses `<strong>...</strong>` tags from a string and renders them as JSX. */
function parseBoldMarkup(text: string): React.ReactNode {
  const parts = text.split(/<strong>(.*?)<\/strong>/)
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  )
}
