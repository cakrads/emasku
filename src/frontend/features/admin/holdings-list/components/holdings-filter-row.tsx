'use client'

import { cn } from '@/frontend/utils/cn'
import { useLanguage } from '@/frontend/hooks/use-language'
import { AppSelect } from '@/frontend/components/ui/select'

interface HoldingsFilterRowProps {
  statusFilter: 'active' | 'sold' | 'all'
  brandFilter: string | null
  sortBy: 'date' | 'value'
  sortOrder: 'asc' | 'desc'
  goalId: string | null
  brands: Array<{ code: string; name: string }>
  goals: Array<{ id: string; name: string }>
  onChange: (filters: {
    status?: 'active' | 'sold' | 'all'
    brand?: string | null
    goalId?: string | null
    sortBy?: 'date' | 'value'
    sortOrder?: 'asc' | 'desc'
  }) => void
}

export function HoldingsFilterRow({
  statusFilter,
  brandFilter,
  sortBy,
  sortOrder,
  goalId,
  brands,
  goals,
  onChange,
}: HoldingsFilterRowProps) {
  const { t } = useLanguage()

  const statuses: Array<{ value: 'active' | 'sold' | 'all'; label: string }> = [
    { value: 'active', label: t('holdings.filters.options.active') },
    { value: 'sold', label: t('holdings.filters.options.sold') },
    { value: 'all', label: t('holdings.filters.options.all') },
  ]

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0">
      {/* Status chips */}
      {statuses.map((status) => (
        <button
          key={status.value}
          type="button"
          aria-pressed={statusFilter === status.value}
          onClick={() => onChange({ status: status.value })}
          className={cn(
            'inline-flex items-center h-9 px-4 rounded-full text-sm font-medium transition-colors shrink-0 cursor-pointer',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            statusFilter === status.value
              ? 'bg-foreground text-background'
              : 'border border-border text-foreground bg-background hover:bg-surface'
          )}
        >
          {status.label}
        </button>
      ))}

      {/* Divider */}
      <div className="h-6 w-px bg-border shrink-0 mx-1" aria-hidden="true" />

      {/* Brand select */}
      {brands.length > 0 && (
        <AppSelect
          value={brandFilter || '__all__'}
          shape="pill"
          size="sm"
          onValueChange={(val) => onChange({ brand: val === '__all__' ? null : val })}
          options={[
            { value: '__all__', label: t('holdings.filters.options.allBrands') },
            ...brands.map((b) => ({ value: b.code, label: b.name })),
          ]}
        />
      )}

      {/* Goal select */}
      {goals.length > 0 && (
        <AppSelect
          value={goalId || '__all__'}
          shape="pill"
          size="sm"
          onValueChange={(val) => onChange({ goalId: val === '__all__' ? null : val })}
          options={[
            { value: '__all__', label: t('holdings.filters.goal') },
            ...goals.map((g) => ({ value: g.id, label: g.name })),
          ]}
        />
      )}

      {/* Sort select */}
      <AppSelect
        value={`${sortBy}-${sortOrder}`}
        shape="pill"
        size="sm"
        onValueChange={(val) => {
          const sep = val.lastIndexOf('-')
          const by = val.substring(0, sep) as 'date' | 'value'
          const order = val.substring(sep + 1) as 'asc' | 'desc'
          onChange({ sortBy: by, sortOrder: order })
        }}
        options={[
          { value: 'date-desc', label: t('holdings.filters.options.newest') },
          { value: 'date-asc', label: t('holdings.filters.options.oldest') },
          { value: 'value-desc', label: t('holdings.filters.options.value_high_to_low') },
          { value: 'value-asc', label: t('holdings.filters.options.value_low_to_high') },
        ]}
      />
    </div>
  )
}
