'use client'

import { Stack, Section } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { Button } from '@/frontend/components/ui/button'
import { AppSelect } from '@/frontend/components/ui/select'
import { Filter, ArrowUpDown } from 'lucide-react'
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
    <Section className="bg-surface-elevated border border-border rounded-xl p-4">
      <Stack direction="horizontal" gap="md" className="flex-wrap items-center">
        {/* Status Filter */}
        <Stack direction="horizontal" gap="sm" className="items-center">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Typography variant="body-sm" className="text-muted-foreground">
            {t('holdings.filters.status')}
          </Typography>
          <AppSelect
            value={status}
            size="sm"
            onValueChange={(val) => onStatusChange(val as 'active' | 'sold' | 'all')}
            options={[
              { value: 'active', label: t('holdings.filters.options.active') },
              { value: 'sold', label: t('holdings.filters.options.sold') },
              { value: 'all', label: t('holdings.filters.options.all') },
            ]}
          />
        </Stack>

        {/* Divider */}
        <div className="h-6 w-px bg-border" />

        {/* Brand Filter */}
        <Stack direction="horizontal" gap="sm" className="items-center">
          <Typography variant="body-sm" className="text-muted-foreground">
            {t('holdings.filters.brand')}
          </Typography>
          <AppSelect
            value={selectedBrand || '__all__'}
            size="sm"
            onValueChange={(val) => onBrandChange(val === '__all__' ? null : val)}
            options={[
              { value: '__all__', label: t('holdings.filters.options.allBrands') },
              ...brands.map((b) => ({ value: b.code, label: b.name })),
            ]}
          />
        </Stack>

        {/* Divider */}
        <div className="h-6 w-px bg-border" />

        {/* Sort By */}
        <Stack direction="horizontal" gap="sm" className="items-center">
          <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
          <Typography variant="body-sm" className="text-muted-foreground">
            {t('holdings.filters.sort')}
          </Typography>
          <AppSelect
            value={sortBy}
            size="sm"
            onValueChange={(val) => onSortByChange(val as 'date' | 'value')}
            options={[
              { value: 'date', label: t('holdings.filters.options.date') },
              { value: 'value', label: t('holdings.filters.options.value') },
            ]}
          />
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
