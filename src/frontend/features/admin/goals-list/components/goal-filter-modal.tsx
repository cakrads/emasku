'use client'

import { useState } from 'react'
import { ResponsiveModal } from '@/frontend/components/ui/responsive-modal'
import { Button } from '@/frontend/components/ui/button'
import { Stack } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { useLanguage } from '@/frontend/hooks/use-language'
import { cn } from '@/frontend/utils/cn'

type FilterType = 'all' | 'achieved' | 'in-progress' | 'no-target' | 'completed'

interface GoalFilterModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    activeFilter: FilterType
    counts: Record<FilterType, number>
    onApply: (filter: FilterType) => void
}

export default function GoalFilterModal({
    open,
    onOpenChange,
    activeFilter,
    counts,
    onApply,
}: GoalFilterModalProps) {
    const { t } = useLanguage()
    const [localFilter, setLocalFilter] = useState<FilterType>(activeFilter)

    const handleOpenChange = (isOpen: boolean) => {
        if (isOpen) {
            setLocalFilter(activeFilter)
        }
        onOpenChange(isOpen)
    }

    const handleApply = () => {
        onApply(localFilter)
        onOpenChange(false)
    }

    const handleClear = () => {
        setLocalFilter('all')
    }

    const filters: { key: FilterType; label: string }[] = [
        { key: 'all', label: t('goals.filter.all') },
        { key: 'in-progress', label: t('goals.filter.inProgress') },
        { key: 'achieved', label: t('goals.filter.achieved') },
        { key: 'completed', label: t('goals.status.completed') },
        { key: 'no-target', label: t('goals.filter.noTarget') },
    ]

    return (
        <ResponsiveModal
            open={open}
            onOpenChange={handleOpenChange}
            title="Filter"
            description={t('goals.list.description')}
        >
            <Stack gap="lg" className="py-2 pb-0">
                {/* Status Filter */}
                <Stack gap="sm">
                    <Typography variant="body-sm" className="font-medium">
                        Status
                    </Typography>
                    <Stack direction="horizontal" className="flex-wrap gap-2">
                        {filters.map((f) => (
                            <Button
                                key={f.key}
                                variant={localFilter === f.key ? 'solid' : 'outline'}
                                color={localFilter === f.key ? 'primary' : undefined}
                                size="sm"
                                onClick={() => setLocalFilter(f.key)}
                                className="gap-1.5 cursor-pointer"
                            >
                                <span>{f.label}</span>
                                {counts[f.key] > 0 && (
                                    <span className={cn(
                                        'px-1.5 py-0.5 text-xs rounded-full',
                                        localFilter === f.key
                                            ? 'bg-white/20 text-primary-foreground'
                                            : 'bg-muted text-muted-foreground'
                                    )}>
                                        {counts[f.key]}
                                    </span>
                                )}
                            </Button>
                        ))}
                    </Stack>
                </Stack>

                {/* Actions */}
                <Stack direction="horizontal" gap="sm" className="pt-4 border-t border-border">
                    <Button
                        variant="outline"
                        className="flex-1 cursor-pointer"
                        onClick={handleClear}
                        disabled={localFilter === 'all'}
                    >
                        {t('holdings.filters.clear')}
                    </Button>
                    <Button
                        color="primary"
                        className="flex-1 cursor-pointer"
                        onClick={handleApply}
                    >
                        {t('holdings.filters.apply')}
                    </Button>
                </Stack>
            </Stack>
        </ResponsiveModal>
    )
}
