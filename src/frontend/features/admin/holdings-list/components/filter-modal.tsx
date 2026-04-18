'use client'

import { useState } from 'react'
import { ResponsiveModal } from '@/frontend/components/ui/responsive-modal'
import { Button } from '@/frontend/components/ui/button'
import { AppSelect } from '@/frontend/components/ui/select'
import { Stack } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { useLanguage } from '@/frontend/hooks/use-language'

interface FilterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  brands: Array<{ code: string; name: string }>
  goals: Array<{ id: string; name: string }>
  // Current filter values
  brandFilter: string | null
  statusFilter: 'active' | 'sold' | 'all'
  goalIdFilter: string | null
  sortBy: 'date' | 'value'
  sortOrder: 'asc' | 'desc'
  // Callbacks
  onApply: (filters: {
    brand: string | null
    status: 'active' | 'sold' | 'all'
    goalId: string | null
    sortBy: 'date' | 'value'
    sortOrder: 'asc' | 'desc'
  }) => void
}

export default function FilterModal({
  open,
  onOpenChange,
  brands,
  goals,
  brandFilter,
  statusFilter,
  goalIdFilter,
  sortBy,
  sortOrder,
  onApply,
}: FilterModalProps) {
  const { t } = useLanguage()

  // Local state for form
  const [localBrand, setLocalBrand] = useState<string | null>(brandFilter)
  const [localStatus, setLocalStatus] = useState<'active' | 'sold' | 'all'>(statusFilter)
  const [localGoalId, setLocalGoalId] = useState<string | null>(goalIdFilter)
  const [localSortBy, setLocalSortBy] = useState<'date' | 'value'>(sortBy)
  const [localSortOrder, setLocalSortOrder] = useState<'asc' | 'desc'>(sortOrder)

  // Reset to current values when opening
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setLocalBrand(brandFilter)
      setLocalStatus(statusFilter)
      setLocalGoalId(goalIdFilter)
      setLocalSortBy(sortBy)
      setLocalSortOrder(sortOrder)
    }
    onOpenChange(isOpen)
  }

  const handleApply = () => {
    onApply({
      brand: localBrand,
      status: localStatus,
      goalId: localGoalId,
      sortBy: localSortBy,
      sortOrder: localSortOrder,
    })
    onOpenChange(false)
  }

  const handleClear = () => {
    setLocalBrand(null)
    setLocalStatus('active')
    setLocalGoalId(null)
    setLocalSortBy('date')
    setLocalSortOrder('desc')
  }

  const hasChanges =
    localBrand !== null ||
    localStatus !== 'active' ||
    localGoalId !== null ||
    localSortBy !== 'date' ||
    localSortOrder !== 'desc'

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={handleOpenChange}
      title={t('holdings.filters.title')}
      description={t('holdings.filters.description')}
    >
      <Stack gap="lg" className="py-2 pb-0">
        {/* Status Filter */}
        <Stack gap="sm">
          <Typography variant="body-sm" className="font-medium">
            {t('holdings.filters.status')}
          </Typography>
          <div className="flex flex-wrap gap-2">
            {(['active', 'sold', 'all'] as const).map((status) => (
              <Button
                key={status}
                variant={localStatus === status ? 'solid' : 'outline'}
                size="sm"
                onClick={() => setLocalStatus(status)}
              >
                {t(`holdings.filters.options.${status}`)}
              </Button>
            ))}
          </div>
        </Stack>

        {/* Brand Filter */}
        <Stack gap="sm">
          <Typography variant="body-sm" className="font-medium">
            {t('holdings.filters.brand')}
          </Typography>
          <AppSelect
            value={localBrand || '__all__'}
            onValueChange={(val) => setLocalBrand(val === '__all__' ? null : val)}
            options={[
              { value: '__all__', label: t('holdings.filters.options.allBrands') },
              ...brands.map((b) => ({ value: b.code, label: b.name })),
            ]}
            fullWidth
          />
        </Stack>

        {/* Goal Filter */}
        <Stack gap="sm">
          <Typography variant="body-sm" className="font-medium">
            {t('holdings.filters.goal')}
          </Typography>
          <AppSelect
            value={localGoalId || '__all__'}
            onValueChange={(val) => setLocalGoalId(val === '__all__' ? null : val)}
            options={[
              { value: '__all__', label: t('holdings.filters.options.all') },
              ...goals.map((g) => ({ value: g.id, label: g.name })),
            ]}
            fullWidth
          />
        </Stack>

        {/* Sort By */}
        <Stack gap="sm">
          <Typography variant="body-sm" className="font-medium">
            {t('holdings.filters.sort')}
          </Typography>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={localSortBy === 'date' ? 'solid' : 'outline'}
              size="sm"
              onClick={() => setLocalSortBy('date')}
            >
              {t('holdings.filters.options.date')}
            </Button>
            <Button
              variant={localSortBy === 'value' ? 'solid' : 'outline'}
              size="sm"
              onClick={() => setLocalSortBy('value')}
            >
              {t('holdings.filters.options.value')}
            </Button>
          </div>
        </Stack>

        {/* Sort Order */}
        <Stack gap="sm">
          <Typography variant="body-sm" className="font-medium">
            {t('holdings.filters.order')}
          </Typography>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={localSortOrder === 'desc' ? 'solid' : 'outline'}
              size="sm"
              onClick={() => setLocalSortOrder('desc')}
            >
              {t('holdings.filters.options.newest')}
            </Button>
            <Button
              variant={localSortOrder === 'asc' ? 'solid' : 'outline'}
              size="sm"
              onClick={() => setLocalSortOrder('asc')}
            >
              {t('holdings.filters.options.oldest')}
            </Button>
          </div>
        </Stack>

        {/* Actions */}
        <Stack direction="horizontal" gap="sm" className="pt-4 border-t border-border focus-within:ring-0">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleClear}
            disabled={!hasChanges}
          >
            {t('holdings.filters.clear')}
          </Button>
          <Button
            color="primary"
            className="flex-1"
            onClick={handleApply}
          >
            {t('holdings.filters.apply')}
          </Button>
        </Stack>
      </Stack>
    </ResponsiveModal>
  )
}
