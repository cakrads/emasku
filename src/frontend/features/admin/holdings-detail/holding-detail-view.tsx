'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/frontend/components/ui/button'
import { Stack, Section } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { TrendingUp, TrendingDown, Pencil, Trash2, CheckCircle } from 'lucide-react'
import { cn } from '@/frontend/utils/cn'
import { buttonVariants } from '@/frontend/components/ui/button'
import { ROUTES } from '@/frontend/config/routes'
import { StandardPageLayout } from '@/frontend/components/layout/standard-page-layout'
import Link from 'next/link'
import { fetchHoldingDetail } from '@/frontend/services/portfolio/portfolio.api'
import { transformHoldingDetail } from '@/frontend/view-model/portfolio.vm'
import { HoldingDetailSkeleton } from './components/holding-detail-skeleton'
import { SellModal } from './components/sell-modal'
import { PurchaseDetailsCard } from './components/purchase-details-card'
import { SellInfoCard } from './components/sell-info-card'
import { ValuationCard } from './components/valuation-card'
import { useHoldingDetailMutations } from './hooks/use-holding-detail-mutations'
import { ErrorBoundary } from '@/frontend/components/fragments/admin/error-boundary'
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

interface HoldingDetailViewProps {
  holdingId: string
  backUrl?: string
}

function HoldingDetailContent({ holdingId }: HoldingDetailViewProps) {
  const { t, language } = useLanguage()
  const [showSellModal, setShowSellModal] = useState(false)
  const [showHardDeleteDialog, setShowHardDeleteDialog] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: ['portfolio', 'holding', holdingId],
    queryFn: () => fetchHoldingDetail(holdingId),
  })

  const { sellMutation, hardDeleteMutation } = useHoldingDetailMutations(holdingId, t)

  const handleSellConfirm = (sellData: { sellPrice: number; sellDate: string; notes?: string }) => {
    sellMutation.mutate(sellData, {
      onSuccess: () => setShowSellModal(false),
      onError: (error: unknown) => {
        const apiError = error as { errorType?: string }
        if (apiError?.errorType === 'ConflictError') setShowSellModal(false)
      },
    })
  }

  const handleHardDelete = () => {
    hardDeleteMutation.mutate()
    setShowHardDeleteDialog(false)
  }

  if (isLoading) return <HoldingDetailSkeleton />

  if (error || !data) {
    throw error || new Error('Failed to load holding')
  }

  const holding = transformHoldingDetail(data, language === 'id' ? 'id-ID' : 'en-US')
  const isSold = holding.status === 'SOLD' || holding.isSold
  const hasMissingValue = !isSold && holding.totalValue === '-'

  return (
    <Stack className="w-full max-w-xl mx-auto pb-24 sm:min-w-[500px]">
      {/* Hero Section */}
      <Section className="px-6 text-center mb-8">
        <Stack gap="sm">
          {isSold ? (
            <>
              <Stack direction="horizontal" gap="xs" className="justify-center items-center">
                <span className="inline-flex items-center rounded-md bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-700 ring-1 ring-inset ring-orange-600/20 dark:bg-orange-900/30 dark:text-orange-300 dark:ring-orange-500/30">
                  {t('holdingDetail.status.sold')}
                </span>
              </Stack>
              <Typography variant="body-sm" className="text-muted-foreground">
                {t('holdingDetail.sellInfo.sellPrice')}
              </Typography>
              <Typography variant="h1" className="text-4xl financial-value">
                {holding.sellPrice || holding.totalValue}
              </Typography>
              <Stack direction="horizontal" gap="xs" className="justify-center items-center mt-2">
                {holding.realizedPnLColor === 'positive' && <TrendingUp className="w-4 h-4 text-positive" />}
                {holding.realizedPnLColor === 'negative' && <TrendingDown className="w-4 h-4 text-negative" />}
                <Typography variant="body" className={cn(
                  'font-semibold',
                  holding.realizedPnLColor === 'positive' ? 'text-positive' : holding.realizedPnLColor === 'negative' ? 'text-negative' : ''
                )}>
                  {holding.realizedPnL} ({holding.realizedPnLPercentage})
                </Typography>
              </Stack>
            </>
          ) : (
            <>
              <Typography variant="h4">{t('holdingDetail.currentValue.title')}</Typography>
              <Typography variant="h1" className="text-4xl financial-value">
                {holding.totalValue}
              </Typography>
              <Stack direction="horizontal" gap="xs" className="justify-center items-center mt-2">
                {holding.pnlColor === 'positive' && <TrendingUp className="w-4 h-4 text-positive" />}
                {holding.pnlColor === 'negative' && <TrendingDown className="w-4 h-4 text-negative" />}
                <Typography variant="body" className={cn(
                  'font-semibold',
                  holding.pnlColor === 'positive' ? 'text-positive' : holding.pnlColor === 'negative' ? 'text-negative' : ''
                )}>
                  {holding.pnl} ({holding.pnlPercentage})
                </Typography>
              </Stack>
            </>
          )}
        </Stack>
      </Section>

      <Section className="px-0">
        <PurchaseDetailsCard holding={holding} isSold={isSold} t={t} />
      </Section>

      {isSold && holding.sellPrice && (
        <Section className="px-0 mt-6">
          <SellInfoCard holding={holding} t={t} />
        </Section>
      )}

      {!isSold && (
        <Section className="px-0 mt-6">
          <ValuationCard holding={holding} hasMissingValue={hasMissingValue} t={t} />
        </Section>
      )}

      {/* Actions */}
      <Section className="px-0 mt-8">
        <Stack gap="md">
          {!isSold && (
            <Button
              variant="outline"
              color="primary"
              size="lg"
              className="w-full rounded-xl h-14"
              onClick={() => setShowSellModal(true)}
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              {t('holdingDetail.actions.markAsSold')}
            </Button>
          )}
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

      <SellModal
        open={showSellModal}
        onOpenChange={setShowSellModal}
        holding={holding}
        onConfirm={handleSellConfirm}
        isPending={sellMutation.isPending}
      />

      <AlertDialog open={showHardDeleteDialog} onOpenChange={setShowHardDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">{t('holdingDetail.dialog.hardDelete.title')}</AlertDialogTitle>
            <AlertDialogDescription>{t('holdingDetail.dialog.hardDelete.description')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('holdingDetail.dialog.hardDelete.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleHardDelete} className={buttonVariants({ variant: 'solid', color: 'destructive' })}>
              {hardDeleteMutation.isPending ? t('holdingDetail.dialog.hardDelete.confirming') : t('holdingDetail.dialog.hardDelete.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Stack>
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
