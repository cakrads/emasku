'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchGoals } from '@/frontend/services/goals/goals.api'
import { Label } from '@/frontend/components/ui/label'
import { Stack } from '@/frontend/components/ui/layout'
import { useLanguage } from '@/frontend/hooks/use-language'
import { Button } from '@/frontend/components/ui/button'
import { Target, Check, ChevronDown, Plus } from 'lucide-react'
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

    const goals = data?.goals || []

    const handleCreateSuccess = (newGoalId: string) => {
        setIsCreateOpen(false)
        onSelect(newGoalId)
    }

    return (
        <Stack gap="sm" className={className}>
            <Label className="uppercase text-text-secondary font-medium tracking-wider">
                {label || t('goals.title')} <span className="text-xs normal-case font-normal text-muted-foreground">({t('goals.form.optional')})</span>
            </Label>

            <div className="flex gap-2">
                <div className="relative flex-1">
                    <select
                        value={selectedGoalId || ''}
                        onChange={(e) => onSelect(e.target.value || null)}
                        className={cn(
                            "w-full appearance-none rounded-xl bg-surface-elevated border border-border p-4 pr-10 text-foreground text-lg font-semibold h-14 transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
                            isLoading && "opacity-50 cursor-wait"
                        )}
                        disabled={isLoading}
                    >
                        <option value="">{t('common.none')}</option>
                        {goals.map((goal) => (
                            <option key={goal.id} value={goal.id}>
                                {goal.name}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
                        <ChevronDown className="h-5 w-5" />
                    </div>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    className="h-14 w-14 p-0 rounded-xl border-border bg-surface-elevated hover:bg-surface-elevated/80 shrink-0 text-primary border-dashed border-2"
                    onClick={() => setIsCreateOpen(true)}
                    title={t('goals.createTitle')}
                >
                    <Plus className="h-6 w-6" />
                </Button>
            </div>

            <GoalCreateDialog
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                onSuccess={handleCreateSuccess}
            />
        </Stack>
    )
}
