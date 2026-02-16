'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent } from '@/frontend/components/ui/card'
import { Button } from '@/frontend/components/ui/button'
import { Stack, Section } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { TrendingUp, TrendingDown, Pencil, Info, Trash2, CheckCircle } from 'lucide-react'
import { cn } from '@/frontend/utils/cn'
import { buttonVariants } from '@/frontend/components/ui/button'
import { ROUTES } from '@/frontend/config/routes'
import { StandardPageLayout } from '@/frontend/components/layout/standard-page-layout'
import Link from 'next/link'
import { fetchHoldingDetail, deleteHolding, sellHolding } from '@/frontend/services/portfolio/portfolio.api'
import { transformHoldingDetail } from '@/frontend/view-model/portfolio.vm'
import { HoldingDetailSkeleton } from './components/holding-detail-skeleton'
import { ErrorBoundary } from '@/frontend/components/fragments/admin/error-boundary'
import { toast } from 'sonner'
import { useLanguage } from '@/frontend/hooks/use-language'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/frontend/components/ui/alert-dialog'
import { Alert, AlertDescription, AlertTitle } from '@/frontend/components/ui/alert'

interface HoldingDetailViewProps {
  holdingId: string
  backUrl?: string
}

function HoldingDetailContent({ holdingId }: HoldingDetailViewProps) {
  const router = useRouter()
  const { t, language } = useLanguage()
  const queryClient = useQueryClient()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showHardDeleteDialog, setShowHardDeleteDialog] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: ['portfolio', 'holding', holdingId],
    queryFn: () => fetchHoldingDetail(holdingId),
  })

  // Sell mutation (Soft Close)
  const sellMutation = useMutation({
    mutationFn: () => sellHolding(holdingId),
    onSuccess: () => {
      toast.success(t('holdingDetail.messages.soldSuccess'), {
        description: t('holdingDetail.messages.soldDetail')
      })
      queryClient.invalidateQueries({ queryKey: ['portfolio'] })
      queryClient.invalidateQueries({ queryKey: ['holdings'] })
      queryClient.invalidateQueries({ queryKey: ['portfolio', 'holding', holdingId] })
    },
    onError: (error: unknown) => {
      const apiError = error as { message?: string }
      toast.error(t('common.errorTitle'), {
        description: apiError?.message || t('holdingDetail.messages.deleteError'),
        duration: 4000,
      })
    }
  })

  // Hard Delete mutation (Permanent)
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

  const handleSold = () => {
    sellMutation.mutate()
    setShowDeleteDialog(false)
  }

  const handleHardDelete = () => {
    hardDeleteMutation.mutate()
    setShowHardDeleteDialog(false)
  }

  if (isLoading) {
    return <HoldingDetailSkeleton />
  }

  if (error || !data) {
    throw error || new Error('Failed to load holding')
  }

  const holding = transformHoldingDetail(data, language === 'id' ? 'id-ID' : 'en-US')

  // Check if holding.totalValue is placeholder '-'
  const hasMissingValue = holding.totalValue === '-'

  return (
    <div className="max-w-xl mx-auto pb-24">
      {/* Current Value Section (Hero) */}
      <Section className="px-6 text-center mb-8">
        <Stack gap="sm">
          <Typography variant="h4">{t('holdingDetail.currentValue.title')}</Typography>
          <Typography variant="h1" className="text-4xl financial-value">
            {holding.totalValue}
          </Typography>
          <Stack direction="horizontal" gap="xs" className="justify-center items-center mt-2">
            {holding.pnlColor === 'positive' && (
              <TrendingUp className="w-4 h-4 text-positive" />
            )}
            {holding.pnlColor === 'negative' && (
              <TrendingDown className="w-4 h-4 text-negative" />
            )}
            <Typography
              variant="body"
              className={cn(
                'font-semibold',
                holding.pnlColor === 'positive' ? 'text-positive' : holding.pnlColor === 'negative' ? 'text-negative' : ''
              )}
            >
              {holding.pnl} ({holding.pnlPercentage})
            </Typography>
          </Stack>
        </Stack>
      </Section>

      {/* Purchase Details Card */}
      <Section className="px-0">
        <Card className="bg-surface-elevated border-border shadow-sm">
          <CardContent className="p-5">
            <Stack gap="md">
              <Typography variant="h3" className="text-sm">{t('holdingDetail.purchaseDetails.title')}</Typography>

              <Stack gap="md">
                <Stack direction="horizontal" className="justify-between items-center">
                  <Typography variant="body-sm">{t('holdingDetail.purchaseDetails.purchaseDate')}</Typography>
                  <Typography variant="body" className="font-medium">{holding.buyDate}</Typography>
                </Stack>
                <Stack direction="horizontal" className="justify-between items-center">
                  <Typography variant="body-sm">{t('holdingDetail.purchaseDetails.weight')}</Typography>
                  <Typography variant="body" className="font-medium">{holding.weight}</Typography>
                </Stack>
                <Stack direction="horizontal" className="justify-between items-center">
                  <Typography variant="body-sm">{t('holdingDetail.purchaseDetails.buyPricePerGram')}</Typography>
                  <Typography variant="body" className="font-medium">{holding.avgBuyPrice}</Typography>
                </Stack>

                {/* Debugging Goal Visibility */}
                {/* {console.log('Holding Data:', holding)} */}
                {holding.goalId && (
                  <Stack direction="horizontal" className="justify-between items-center">
                    <Typography variant="body-sm">{t('goals.title')}</Typography>
                    <Link href={ROUTES.GOAL_DETAIL(holding.goalId)} className="text-primary hover:underline font-medium">
                      {holding.goalName || 'Goal'}
                    </Link>
                  </Stack>
                )}

                {holding.isSold && holding.soldAt && (
                  <Stack direction="horizontal" className="justify-between items-center">
                    <Typography variant="body-sm">{t('holdingDetail.purchaseDetails.status')}</Typography>
                    <Stack direction="horizontal" gap="xs" className="items-center">
                      <span className="inline-flex items-center rounded-md bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-600/20">
                        {t('holdingDetail.purchaseDetails.sold')}
                      </span>
                      <Typography variant="body" className="font-medium text-muted-foreground">
                        {holding.soldAt}
                      </Typography>
                    </Stack>
                  </Stack>
                )}

                <div className="h-px bg-border w-full" />

                {/* NOTE: We might want 'totalBuyValue' in VM formatted as string if we used it here.
                    Check HoldingItemVM. Yes it doesn't explicitly have 'totalBuyValue' formatted?
                    Wait, HoldingItem contract has totalBuyValue (number).
                    My HoldingItemVM currently: avgBuyPrice, currentPrice, totalValue (current).
                    It DOES NOT have totalBuyValue.
                    I need to add totalBuyValue to ViewModel! 
                */}
                <Stack direction="horizontal" className="justify-between items-center">
                  <Typography variant="body-sm">{t('holdingDetail.purchaseDetails.totalBuyValue')}</Typography>
                  <Typography variant="body" className="font-medium financial-value">{holding.totalBuyValue}</Typography>
                </Stack>
              </Stack>

              {holding.notes && (
                <Stack gap="xs" className="mt-2 pt-3 border-t border-border">
                  <Typography variant="caption">{t('holdingDetail.purchaseDetails.notes')}</Typography>
                  <Typography variant="body-sm">
                    {holding.notes}
                  </Typography>
                </Stack>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Section>

      {/* Current Valuation Card */}
      <Section className="px-0 mt-6">
        <Card className="bg-surface-elevated border-border shadow-sm">
          <CardContent className="p-5">
            <Stack gap="md">
              <Typography variant="h3" className="text-sm">{t('holdingDetail.valuation.title')}</Typography>

              {hasMissingValue && (
                <Alert className="bg-zinc-50 border-zinc-200 dark:bg-blue-950/20 dark:border-blue-900/50">
                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <AlertTitle className="text-zinc-900 dark:text-blue-100">{t('holdingDetail.valuation.missingTitle')}</AlertTitle>
                  <AlertDescription className="text-zinc-600 dark:text-blue-300">
                    {t('holdingDetail.valuation.missingDesc')}
                  </AlertDescription>
                </Alert>
              )}

              <Stack gap="md">
                <Stack direction="horizontal" className="justify-between items-center">
                  <Typography variant="body-sm">{t('holdingDetail.valuation.currentPricePerGram')}</Typography>
                  <Typography variant="body" className="font-medium">{holding.currentPrice}</Typography>
                </Stack>
                <Stack direction="horizontal" className="justify-between items-center">
                  <Typography variant="body-sm">{t('holdingDetail.purchaseDetails.weight')}</Typography>
                  <Typography variant="body" className="font-medium">{holding.weight}</Typography>
                </Stack>

                <div className="h-px bg-border w-full" />

                <Stack direction="horizontal" className="justify-between items-center">
                  <Typography variant="h3" className="text-sm">{t('holdingDetail.valuation.totalCurrentValue')}</Typography>
                  <Typography variant="h2" className="financial-value">{holding.totalValue}</Typography>
                </Stack>

                <Stack direction="horizontal" className="justify-between items-center">
                  <Typography variant="body-sm">{t('holdingDetail.valuation.pnl')}</Typography>
                  <Typography
                    variant="body"
                    className={cn(
                      'font-semibold',
                      holding.pnlColor === 'positive' ? 'text-positive' : holding.pnlColor === 'negative' ? 'text-negative' : ''
                    )}
                  >
                    {holding.pnl} ({holding.pnlPercentage})
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Section>

      {/* Action Section */}
      <Section className="px-0 mt-8">
        <Stack gap="md">
          {/* Sold Button - Only show if ACTIVE */}
          {!holding.isSold && (
            <Button
              variant="outline"
              color="primary"
              size="lg"
              className="w-full rounded-xl h-14"
              onClick={() => setShowDeleteDialog(true)}
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              {t('holdingDetail.actions.markAsSold')}
            </Button>
          )}

          {/* Hard Delete Button (Dev/Management) */}
          <Button
            variant="outline"
            color="destructive"
            size="lg"
            className="w-full rounded-xl h-14"
            onClick={() => setShowHardDeleteDialog(true)}
          >
            <Trash2 className="w-5 h-5 mr-2" />
            {t('holdingDetail.actions.deletePermanent')}
          </Button>
        </Stack>
      </Section>

      {/* Mark as Sold Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('holdingDetail.dialog.markAsSold.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('holdingDetail.dialog.markAsSold.description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('holdingDetail.dialog.markAsSold.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleSold} className={buttonVariants({ variant: 'solid', color: 'destructive' })}>
              {sellMutation.isPending ? t('holdingDetail.dialog.markAsSold.confirming') : t('holdingDetail.dialog.markAsSold.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Hard Delete Dialog */}
      <AlertDialog open={showHardDeleteDialog} onOpenChange={setShowHardDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">{t('holdingDetail.dialog.hardDelete.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('holdingDetail.dialog.hardDelete.description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('holdingDetail.dialog.hardDelete.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleHardDelete} className={buttonVariants({ variant: 'solid', color: 'destructive' })}>
              {hardDeleteMutation.isPending ? t('holdingDetail.dialog.hardDelete.confirming') : t('holdingDetail.dialog.hardDelete.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default function HoldingDetailView(props: HoldingDetailViewProps) {
  const { t } = useLanguage()
  return (
    <StandardPageLayout
      title={t('holdingDetail.title')}
      description={t('holdingDetail.subtitle')}
      breadcrumbs={[
        { label: t('navbar.dashboard'), href: ROUTES.DASHBOARD },
        { label: t('navbar.holdings'), href: ROUTES.HOLDINGS_LIST },
        { label: t('holdingDetail.breadcrumbs.detail') }
      ]}
      action={
        // Check if holding data is available to make decision.
        // Since this is server component wrapping client component, we might not have data yet.
        // Wait, 'data' is fetched inside 'HoldingDetailContent'.
        // We can't disable this button based on data from child.
        // We should move Action button inside HoldingDetailContent or accept data.
        // OR simpler: Just link to Edit Page, and Handle "Cannot Edit Sold Item" on Edit Page.
        // For now, let's keep it but perhaps we can't Conditional rendering it here easily without prop drilling.
        // Actually, we can move the action prop to HoldingDetailContent if StandardPageLayout supports it there, 
        // OR just leave it enabled and handle validation on edit. 
        // User asked "when sold handle the button". 
        // Let's modify the "Mark as Sold" button FIRST.
        // I will stick to modifying the "Mark as Sold" button logic inside HoldingDetailContent.
        <Link href={ROUTES.EDIT_HOLDING(props.holdingId)}>
          <Button variant="outline" size="sm">
            <Pencil className="w-4 h-4 mr-2" />
            {t('holdingDetail.actions.edit')}
          </Button>
        </Link>
      }
    >
      <ErrorBoundary>
        <HoldingDetailContent {...props} />
      </ErrorBoundary>
    </StandardPageLayout>
  )
}
