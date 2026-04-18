'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchGoals } from '@/frontend/services/goals/goals.api'
import { Label } from '@/frontend/components/ui/label'
import { Stack } from '@/frontend/components/ui/layout'
import { useLanguage } from '@/frontend/hooks/use-language'
import { Button } from '@/frontend/components/ui/button'
import { AppSelect } from '@/frontend/components/ui/select'
import { Plus } from 'lucide-react'
import { cn } from '@/frontend/utils/cn'
import { GoalCreateDialog } from '../../goals-create/components/goal-create-dialog'

interface GoalSelectorProps {
    selectedGoalId: string | null
    onSelect: (goalId: string | null) => void
    label?: string
    className?: string
}

export function GoalSelector({ selectedGoalId, onSelect, label, className }: GoalSelectorProps) {
    const { t } = useLanguage()
    const [isCreateOpen, setIsCreateOpen] = useState(false)

    const { data, isLoading } = useQuery({
        queryKey: ['goals', 'list'],
        queryFn: fetchGoals,
    })

    const goals = data?.goals?.filter(goal => goal.lifecycleStatus === 'ACTIVE') || []

    const handleCreateSuccess = (newGoalId: string) => {
        setIsCreateOpen(false)
        onSelect(newGoalId)
    }

    return (
        <Stack gap="sm" className={className}>
            <Label className="uppercase text-text-secondary font-medium tracking-wider">
                {label || t('goals.title')} <span className="text-xs normal-case font-normal text-muted-foreground">({t('goals.form.optional')})</span>
            </Label>

            <Stack direction="horizontal" gap="sm">
                <AppSelect
                    value={selectedGoalId || ''}
                    shape="xl"
                    onValueChange={(val) => onSelect(val || null)}
                    options={goals.map((g) => ({ value: g.id, label: g.name }))}
                    placeholder={t('common.none')}
                    fullWidth
                    disabled={isLoading}
                    className={cn(
                        "h-14 data-[size=default]:h-14 text-lg font-semibold",
                        isLoading && "opacity-50 cursor-wait"
                    )}
                />

                <Button
                    type="button"
                    variant="outline"
                    className="h-14 w-14 p-0 rounded-xl border-border bg-surface-elevated hover:bg-surface-elevated/80 shrink-0 text-primary border-dashed border-2"
                    onClick={() => setIsCreateOpen(true)}
                    title={t('goals.createTitle')}
                >
                    <Plus className="h-6 w-6" />
                </Button>
            </Stack>

            <GoalCreateDialog
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                onSuccess={handleCreateSuccess}
            />
        </Stack>
    )
}
