'use client'

import { cn } from '@/frontend/utils/cn'
import { useLanguage } from '@/frontend/hooks/use-language'

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

  const selectClass = 'h-9 px-3 rounded-full text-sm border border-border bg-background text-foreground focus:outline-none shrink-0 cursor-pointer'

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
            'inline-flex items-center h-9 px-4 rounded-full text-sm font-medium transition-colors shrink-0',
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
        <select
          value={brandFilter || ''}
          onChange={(e) => onChange({ brand: e.target.value || null })}
          className={selectClass}
          aria-label={t('holdings.filters.brand')}
        >
          <option value="">{t('holdings.filters.options.allBrands')}</option>
          {brands.map((brand) => (
            <option key={brand.code} value={brand.code}>
              {brand.name}
            </option>
          ))}
        </select>
      )}

      {/* Goal select (only if goals exist) */}
      {goals.length > 0 && (
        <select
          value={goalId || ''}
          onChange={(e) => onChange({ goalId: e.target.value || null })}
          className={selectClass}
          aria-label={t('holdings.filters.goal')}
        >
          <option value="">{t('holdings.filters.goal')}</option>
          {goals.map((goal) => (
            <option key={goal.id} value={goal.id}>
              {goal.name}
            </option>
          ))}
        </select>
      )}

      {/* Sort select */}
      <select
        value={`${sortBy}-${sortOrder}`}
        onChange={(e) => {
          const val = e.target.value
          const sep = val.lastIndexOf('-')
          const by = val.substring(0, sep) as 'date' | 'value'
          const order = val.substring(sep + 1) as 'asc' | 'desc'
          onChange({ sortBy: by, sortOrder: order })
        }}
        className={selectClass}
        aria-label={t('holdings.filters.sort')}
      >
        <option value="date-desc">{t('holdings.filters.options.newest')}</option>
        <option value="date-asc">{t('holdings.filters.options.oldest')}</option>
        <option value="value-desc">{t('holdings.filters.sort')} ↑</option>
        <option value="value-asc">{t('holdings.filters.sort')} ↓</option>
      </select>
    </div>
  )
}
