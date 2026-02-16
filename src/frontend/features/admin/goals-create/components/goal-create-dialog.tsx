'use client'

import { useLanguage } from '@/frontend/hooks/use-language'
import { ResponsiveModal } from '@/frontend/components/ui/responsive-modal'
import { GoalCreateForm } from './goal-create-form'

interface GoalCreateDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: (goalId: string) => void
}

export function GoalCreateDialog({ open, onOpenChange, onSuccess }: GoalCreateDialogProps) {
    const { t } = useLanguage()

    return (
        <ResponsiveModal
            open={open}
            onOpenChange={onOpenChange}
            title={t('goals.createTitle')}
            description={t('goals.list.emptyDesc')}
        >
            <GoalCreateForm
                onSuccess={onSuccess}
                onCancel={() => onOpenChange(false)}
            />
        </ResponsiveModal>
    )
}
