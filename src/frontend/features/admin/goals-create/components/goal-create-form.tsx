'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Stack, Section } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { Button } from '@/frontend/components/ui/button'
import { Input } from '@/frontend/components/ui/input'
import { Label } from '@/frontend/components/ui/label'
import { createGoal } from '@/frontend/services/goals/goals.api'
import { CreateGoalRequestSchema } from '@/shared/contracts/goals.contract'
import { useLanguage } from '@/frontend/hooks/use-language'
import { toast } from 'sonner'
import { ROUTES } from '@/frontend/config/routes'
import { DetailActions } from '@/frontend/components/fragments/admin/detail-actions'
import { CurrencyInput } from '@/frontend/components/ui/currency-input'
import { DatePicker } from '@/frontend/components/ui/date-picker'
import { format } from 'date-fns'

export interface GoalCreateFormProps {
    onSuccess?: (goalId: string) => void
    onCancel?: () => void
    mode?: 'page' | 'dialog'
}

export function GoalCreateForm({ onSuccess, onCancel, mode = 'dialog' }: GoalCreateFormProps) {
    const { t } = useLanguage()
    const router = useRouter()
    const queryClient = useQueryClient()

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [targetAmount, setTargetAmount] = useState('')
    const [targetDate, setTargetDate] = useState<Date | undefined>(undefined)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const mutation = useMutation({
        mutationFn: createGoal,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['goals'] })
            toast.success(t('goals.messages.createSuccess'))
            if (onSuccess) {
                onSuccess(data.id)
            } else {
                router.push(ROUTES.GOALS_LIST)
            }
        },
        onError: (err) => {
            toast.error(err.message || 'Failed to create goal')
        },
    })

    const handleSave = (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        setErrors({})

        const payload: Record<string, unknown> = { name }
        if (description.trim()) payload.description = description.trim()
        if (targetAmount) payload.targetAmount = parseInt(targetAmount, 10)

        // Format date string for API: "YYYY-MM-DD"
        if (targetDate) {
            payload.targetDate = format(targetDate, 'yyyy-MM-dd')
        }

        const parsed = CreateGoalRequestSchema.safeParse(payload)
        if (!parsed.success) {
            const fieldErrors: Record<string, string> = {}
            for (const issue of parsed.error.issues) {
                const field = issue.path[0]
                if (field) fieldErrors[String(field)] = issue.message
            }
            setErrors(fieldErrors)
            return
        }

        mutation.mutate(parsed.data)
    }

    const isPage = mode === 'page'

    // Enhanced styling for page mode
    const inputClassName = isPage
        ? "p-4 rounded-xl bg-surface-elevated border-border text-foreground text-lg font-semibold h-14"
        : ""

    const labelClassName = isPage
        ? "text-text-secondary font-medium uppercase tracking-wider"
        : "block text-sm font-medium mb-1.5"

    const content = (
        <Stack gap={isPage ? 'xl' : 'md'} className={isPage ? '' : 'max-w-lg'}>
            {/* Name */}
            <Stack gap="sm">
                <Label className={labelClassName}>
                    {t('goals.form.name')} <span className="text-destructive">*</span>
                </Label>
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Emergency Fund"
                    maxLength={100}
                    className={inputClassName}
                />
                {errors.name && (
                    <Typography variant="body-sm" className="text-destructive">{errors.name}</Typography>
                )}
            </Stack>

            {/* Description */}
            <Stack gap="sm">
                <Label className={labelClassName}>
                    {t('goals.form.description')}
                </Label>
                <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t('goals.form.optional')}
                    maxLength={500}
                    className={inputClassName}
                />
                {errors.description && (
                    <Typography variant="body-sm" className="text-destructive">{errors.description}</Typography>
                )}
            </Stack>

            {/* Target Amount */}
            <Stack gap="sm">
                <Label className={labelClassName}>
                    {t('goals.form.targetAmount')}
                </Label>
                <CurrencyInput
                    value={targetAmount}
                    onChange={setTargetAmount}
                    className={inputClassName}
                    placeholder={t('goals.form.optional')}
                />
                {errors.targetAmount && (
                    <Typography variant="body-sm" className="text-destructive">{errors.targetAmount}</Typography>
                )}
                {!isPage && (
                    <Typography variant="body-sm" className="text-muted-foreground">
                        {t('goals.form.targetHelp')}
                    </Typography>
                )}
            </Stack>

            {/* Target Date */}
            <Stack gap="sm">
                <Label className={labelClassName}>
                    {t('goals.form.targetDate')}
                </Label>
                <DatePicker
                    value={targetDate}
                    onChange={setTargetDate}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
                {errors.targetDate && (
                    <Typography variant="body-sm" className="text-destructive">{errors.targetDate}</Typography>
                )}
                {!isPage && (
                    <Typography variant="body-sm" className="text-muted-foreground">
                        {t('goals.form.dateHelp')}
                    </Typography>
                )}
            </Stack>
        </Stack>
    )

    if (isPage) {
        return (
            <div className="max-w-lg mx-auto pb-44">
                <Section className="px-0">
                    {content}
                </Section>
                <DetailActions
                    actions={[
                        {
                            label: t('goals.form.cancel'),
                            variant: 'outline',
                            onClick: onCancel ? onCancel : () => router.push(ROUTES.GOALS_LIST),
                            disabled: mutation.isPending
                        },
                        {
                            label: mutation.isPending ? t('common.saving') : t('goals.form.create'),
                            variant: 'solid',
                            color: 'primary',
                            onClick: () => handleSave(),
                            disabled: mutation.isPending
                        }
                    ]}
                />
            </div>
        )
    }

    return (
        <form onSubmit={handleSave}>
            {content}
            {/* Actions */}
            <Stack direction="horizontal" gap="sm" className="pt-4 justify-end">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel ? onCancel : () => router.push(ROUTES.GOALS_LIST)}
                >
                    {t('goals.form.cancel')}
                </Button>
                <Button
                    type="submit"
                    variant="solid"
                    color="primary"
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? t('common.saving') : t('goals.form.create')}
                </Button>
            </Stack>
        </form>
    )
}
