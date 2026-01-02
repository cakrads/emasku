'use client'

import { Stack, Section } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { Button } from '@/frontend/components/ui/button'
import { Filter, ArrowUpDown, X } from 'lucide-react'

interface FilterBarProps {
  brands: Array<{ code: string; name: string }>
  selectedBrand: string | null
  onBrandChange: (brand: string | null) => void
  sortBy: 'date' | 'value'
  onSortByChange: (sortBy: 'date' | 'value') => void
  sortOrder: 'asc' | 'desc'
  onSortOrderChange: (order: 'asc' | 'desc') => void
}

export default function FilterBar({
  brands,
  selectedBrand,
  onBrandChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
}: FilterBarProps) {
  return (
    <Section className="bg-[var(--surface-elevated)] border border-[var(--border)] rounded-xl p-4">
      <Stack direction="horizontal" gap="md" className="flex-wrap items-center">
        {/* Brand Filter */}
        <Stack direction="horizontal" gap="sm" className="items-center">
          <Filter className="w-4 h-4 text-[var(--foreground-muted)]" />
          <Typography variant="body-sm" className="text-[var(--foreground-muted)]">
            Brand:
          </Typography>
          <select
            value={selectedBrand || ''}
            onChange={(e) => onBrandChange(e.target.value || null)}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]"
          >
            <option value="">All Brands</option>
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
            Sort:
          </Typography>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as 'date' | 'value')}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]"
          >
            <option value="date">Date</option>
            <option value="value">Value</option>
          </select>
        </Stack>

        {/* Sort Order */}
        <Stack direction="horizontal" gap="xs">
          <Button
            variant={sortOrder === 'desc' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSortOrderChange('desc')}
            className="h-7"
          >
            Newest
          </Button>
          <Button
            variant={sortOrder === 'asc' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSortOrderChange('asc')}
            className="h-7"
          >
            Oldest
          </Button>
        </Stack>
      </Stack>
    </Section>
  )
}
