'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ROUTES } from '@/frontend/config/routes'
import { deleteHolding, sellHolding } from '@/frontend/services/portfolio/portfolio.api'

export function useHoldingDetailMutations(
    holdingId: string,
    t: (key: string) => string
) {
    const router = useRouter()
    const queryClient = useQueryClient()

    const sellMutation = useMutation({
        mutationFn: (sellData: { sellPrice: number; sellDate: string; notes?: string }) =>
            sellHolding(holdingId, sellData),
        onSuccess: () => {
            toast.success(t('holdingDetail.messages.soldSuccess'), {
                description: t('holdingDetail.messages.soldDetail')
            })
            queryClient.invalidateQueries({ queryKey: ['portfolio'] })
            queryClient.invalidateQueries({ queryKey: ['holdings'] })
            queryClient.invalidateQueries({ queryKey: ['portfolio', 'holding', holdingId] })
        },
        onError: (error: unknown) => {
            const apiError = error as { message?: string; description?: string; errorType?: string; title?: string }
            if (apiError?.errorType === 'ConflictError') {
                queryClient.invalidateQueries({ queryKey: ['portfolio', 'holding', holdingId] })
            }
            toast.error(apiError?.title || t('common.errorTitle'), {
                description: apiError?.description || apiError?.message || t('holdingDetail.messages.deleteError'),
                duration: 4000,
            })
        }
    })

    const hardDeleteMutation = useMutation({
        mutationFn: () => deleteHolding(holdingId, { hard: true }),
        onSuccess: () => {
            toast.success(t('holdingDetail.messages.deleteSuccess'), {
                description: t('holdingDetail.messages.deleteDetail')
            })
            queryClient.invalidateQueries({ queryKey: ['portfolio'] })
            queryClient.invalidateQueries({ queryKey: ['holdings'] })
            router.push(ROUTES.HOLDINGS_LIST)
        },
        onError: (error: unknown) => {
            const apiError = error as { message?: string }
            toast.error(t('common.errorTitle'), {
                description: apiError?.message || t('holdingDetail.messages.deleteError'),
                duration: 4000,
            })
        }
    })

    return { sellMutation, hardDeleteMutation }
}
