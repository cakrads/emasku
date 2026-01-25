'use client'

import { Stack, Section } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { Button } from '@/frontend/components/ui/button'
import { Filter, ArrowUpDown, X } from 'lucide-react'
import { useLanguage } from '@/frontend/hooks/use-language'

interface FilterBarProps {
  brands: Array<{ code: string; name: string }>
  selectedBrand: string | null
  onBrandChange: (brand: string | null) => void
  sortBy: 'date' | 'value'
  onSortByChange: (sortBy: 'date' | 'value') => void
  sortOrder: 'asc' | 'desc'
  onSortOrderChange: (order: 'asc' | 'desc') => void
  status: 'active' | 'sold' | 'all'
  onStatusChange: (status: 'active' | 'sold' | 'all') => void
}

export default function FilterBar({
  brands,
  selectedBrand,
  onBrandChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  status,
  onStatusChange,
}: FilterBarProps) {
  const { t } = useLanguage()
  return (
    <Section className="bg-[var(--surface-elevated)] border border-[var(--border)] rounded-xl p-4">
      <Stack direction="horizontal" gap="md" className="flex-wrap items-center">
        {/* Status Filter */}
        <Stack direction="horizontal" gap="sm" className="items-center">
          <Filter className="w-4 h-4 text-[var(--foreground-muted)]" />
          <Typography variant="body-sm" className="text-[var(--foreground-muted)]">
            {t('holdings.filters.status')}
          </Typography>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as 'active' | 'sold' | 'all')}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]"
          >

            <option value="active">{t('holdings.filters.options.active')}</option>
            <option value="sold">{t('holdings.filters.options.sold')}</option>
            <option value="all">{t('holdings.filters.options.all')}</option>
          </select>
        </Stack>

        {/* Divider */}
        <div className="h-6 w-px bg-[var(--border)]" />

        {/* Brand Filter */}
        <Stack direction="horizontal" gap="sm" className="items-center">
          <Typography variant="body-sm" className="text-[var(--foreground-muted)]">
            {t('holdings.filters.brand')}
          </Typography>
          <select
            value={selectedBrand || ''}
            onChange={(e) => onBrandChange(e.target.value || null)}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]"
          >
            <option value="">{t('holdings.filters.options.allBrands')}</option>
            {brands.map((brand) => (
              <option key={brand.code} value={brand.code}>
                {brand.name}
              </option>
            ))}
          </select>
          {selectedBrand && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onBrandChange(null)}
              className="h-7 px-2"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </Stack>

        {/* Divider */}
        <div className="h-6 w-px bg-[var(--border)]" />

        {/* Sort By */}
        <Stack direction="horizontal" gap="sm" className="items-center">
          <ArrowUpDown className="w-4 h-4 text-[var(--foreground-muted)]" />
          <Typography variant="body-sm" className="text-[var(--foreground-muted)]">
            {t('holdings.filters.sort')}
          </Typography>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as 'date' | 'value')}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]"
          >
            <option value="date">{t('holdings.filters.options.date')}</option>
            <option value="value">{t('holdings.filters.options.value')}</option>
          </select>
        </Stack>

        {/* Sort Order */}
        <Stack direction="horizontal" gap="xs">
          <Button
            variant={sortOrder === 'desc' ? 'solid' : 'outline'}
            size="sm"
            onClick={() => onSortOrderChange('desc')}
            className="h-7"
          >
            {t('holdings.filters.options.newest')}
          </Button>
          <Button
            variant={sortOrder === 'asc' ? 'solid' : 'outline'}
            size="sm"
            onClick={() => onSortOrderChange('asc')}
            className="h-7"
          >
            {t('holdings.filters.options.oldest')}
          </Button>
        </Stack>
      </Stack>
    </Section>
  )
}
