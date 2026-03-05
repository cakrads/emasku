'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Stack, Section } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { Input } from '@/frontend/components/ui/input'
import { Label } from '@/frontend/components/ui/label'
import { StandardPageLayout } from '@/frontend/components/layout/standard-page-layout'
import { ErrorBoundary } from '@/frontend/components/fragments/admin/error-boundary'
import { DetailActions } from '@/frontend/components/fragments/admin/detail-actions'
import { CurrencyInput } from '@/frontend/components/ui/currency-input'
import { DatePicker } from '@/frontend/components/ui/date-picker'
import { Skeleton } from '@/frontend/components/ui/skeleton'
import { ROUTES } from '@/frontend/config/routes'
import { fetchGoalDetail, updateGoal } from '@/frontend/services/goals/goals.api'
import { UpdateGoalRequestSchema } from '@/shared/contracts/goals.contract'
import { useLanguage } from '@/frontend/hooks/use-language'
import { toast } from 'sonner'
import { format } from 'date-fns'

export default function GoalEditView({ goalId }: { goalId: string }) {
    const { t } = useLanguage()
    return (
        <StandardPageLayout
            title={t('goals.editTitle')}
            breadcrumbs={[
                { label: t('navbar.dashboard'), href: ROUTES.DASHBOARD },
                { label: t('goals.title'), href: ROUTES.GOALS_LIST },
                { label: t('goals.detail.edit') },
            ]}
        >
            <ErrorBoundary>
                <GoalEditContent goalId={goalId} />
            </ErrorBoundary>
        </StandardPageLayout>
    )
}

function GoalEditContent({ goalId }: { goalId: string }) {
    const { t } = useLanguage()
    const router = useRouter()
    const queryClient = useQueryClient()

    // Form State
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [targetAmount, setTargetAmount] = useState('')
    const [targetDate, setTargetDate] = useState<Date | undefined>(undefined)
    const [errors, setErrors] = useState<Record<string, string>>({})

    // Fetch Data
    const { data, isLoading, error } = useQuery({
        queryKey: ['goals', goalId],
        queryFn: () => fetchGoalDetail(goalId),
    })

    // Initialize Form
    useEffect(() => {
        if (data) {
            setName(data.name)
            setDescription(data.description || '')
            setTargetAmount(data.targetAmount ? String(data.targetAmount) : '')
            setTargetDate(data.targetDate ? new Date(data.targetDate) : undefined)
        }
    }, [data])

    // Mutation
    const mutation = useMutation({
        mutationFn: (payload: Parameters<typeof updateGoal>[1]) => updateGoal(goalId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['goals'] })
            toast.success(t('goals.messages.updateSuccess'))
            router.push(ROUTES.GOAL_DETAIL(goalId))
        },
        onError: (err) => {
            toast.error(err.message || 'Failed to update goal')
        },
    })

    const handleSave = () => {
        setErrors({})

        // Basic Validation
        if (!name.trim()) {
            setErrors({ name: 'Goal name is required' })
            return
        }

        const payload: Record<string, unknown> = {}

        // Only include changed fields
        if (name !== data?.name) payload.name = name
        if (description.trim() !== (data?.description || '')) {
            payload.description = description.trim() || null
        }

        const currentAmount = data?.targetAmount ? String(data.targetAmount) : ''
        if (targetAmount !== currentAmount) {
            payload.targetAmount = targetAmount ? parseInt(targetAmount, 10) : null
        }

        // Handle Date Comparison
        const currentDateStr = data?.targetDate ? format(new Date(data.targetDate), 'yyyy-MM-dd') : ''
        const newDateStr = targetDate ? format(targetDate, 'yyyy-MM-dd') : ''

        if (newDateStr !== currentDateStr) {
            payload.targetDate = newDateStr || null
        }

        // If nothing changed
        if (Object.keys(payload).length === 0) {
            router.push(ROUTES.GOAL_DETAIL(goalId))
            return
        }

        // Zod Validation
        const parsed = UpdateGoalRequestSchema.safeParse(payload)
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

    if (isLoading) {
        return (
            <div className="w-full max-w-lg mx-auto pb-44 sm:min-w-[500px]">
                <Section className="px-0">
                    <Stack gap="xl">
                        <Stack gap="sm">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-14 w-full rounded-xl" />
                        </Stack>
                        <Stack gap="sm">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-24 w-full rounded-xl" />
                        </Stack>
                    </Stack>
                </Section>
            </div>
        )
    }

    if (error || !data) {
        throw error || new Error('Failed to load goal')
    }

    return (
        <div className="w-full max-w-lg mx-auto pb-44 sm:min-w-[500px]">
            <Section className="px-0">
                <Stack gap="xl">
                    {/* Name */}
                    <Stack gap="sm">
                        <Label htmlFor="goal-name-edit" className="text-text-secondary font-medium uppercase tracking-wider">
                            {t('goals.form.name')} <span className="text-destructive" aria-hidden="true">*</span>
                        </Label>
                        <Input
                            id="goal-name-edit"
                            aria-required="true"
                            aria-describedby={errors.name ? 'goal-name-edit-error' : undefined}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Emergency Fund"
                            maxLength={100}
                            className="p-4 rounded-xl bg-surface-elevated border-border text-foreground text-lg font-semibold h-14"
                        />
                        {errors.name && (
                            <Typography id="goal-name-edit-error" variant="body-sm" className="text-destructive" role="alert">{errors.name}</Typography>
                        )}
                    </Stack>

                    {/* Description */}
                    <Stack gap="sm">
                        <Label htmlFor="goal-description-edit" className="text-text-secondary font-medium uppercase tracking-wider">
                            {t('goals.form.description')}
                        </Label>
                        <Input
                            id="goal-description-edit"
                            aria-describedby={errors.description ? 'goal-description-edit-error' : undefined}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={t('goals.form.optional')}
                            maxLength={500}
                            className="p-4 rounded-xl bg-surface-elevated border-border text-foreground text-lg font-semibold h-14"
                        />
                        {errors.description && (
                            <Typography id="goal-description-edit-error" variant="body-sm" className="text-destructive" role="alert">{errors.description}</Typography>
                        )}
                    </Stack>

                    {/* Target Amount */}
                    <Stack gap="sm">
                        <Label htmlFor="goal-amount-edit" className="text-text-secondary font-medium uppercase tracking-wider">
                            {t('goals.form.targetAmount')}
                        </Label>
                        <CurrencyInput
                            id="goal-amount-edit"
                            aria-describedby={errors.targetAmount ? 'goal-amount-edit-error' : undefined}
                            value={targetAmount}
                            onChange={setTargetAmount}
                            className="p-4 rounded-xl bg-surface-elevated border-border text-foreground text-lg font-semibold h-14"
                            placeholder={t('goals.form.targetHelp')}
                        />
                        {errors.targetAmount && (
                            <Typography id="goal-amount-edit-error" variant="body-sm" className="text-destructive" role="alert">{errors.targetAmount}</Typography>
                        )}
                    </Stack>

                    {/* Target Date */}
                    <Stack gap="sm">
                        <Label htmlFor="goal-date-edit" className="text-text-secondary font-medium uppercase tracking-wider">
                            {t('goals.form.targetDate')}
                        </Label>
                        <DatePicker
                            id="goal-date-edit"
                            aria-describedby={errors.targetDate ? 'goal-date-edit-error' : undefined}
                            value={targetDate}
                            onChange={setTargetDate}
                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        />
                        {errors.targetDate && (
                            <Typography id="goal-date-edit-error" variant="body-sm" className="text-destructive" role="alert">{errors.targetDate}</Typography>
                        )}
                    </Stack>
                </Stack>
            </Section>

            <DetailActions
                actions={[
                    {
                        label: t('goals.form.cancel'),
                        variant: 'outline',
                        onClick: () => router.push(ROUTES.GOAL_DETAIL(goalId)),
                        disabled: mutation.isPending
                    },
                    {
                        label: mutation.isPending ? t('goals.detail.edit') + '...' : t('goals.form.save'),
                        variant: 'solid',
                        color: 'primary',
                        onClick: handleSave,
                        disabled: mutation.isPending
                    },
                ]}
            />
        </div>
    )
}
