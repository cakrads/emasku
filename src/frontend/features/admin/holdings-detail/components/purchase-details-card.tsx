import { Card, CardContent } from '@/frontend/components/ui/card'
import { Stack, Divider } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import Link from 'next/link'
import { ROUTES } from '@/frontend/config/routes'
import { HoldingItemVM } from '@/frontend/view-model/portfolio.vm'

interface PurchaseDetailsCardProps {
    holding: HoldingItemVM
    isSold: boolean
    t: (key: string) => string
}

export function PurchaseDetailsCard({ holding, isSold, t }: PurchaseDetailsCardProps) {
    return (
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

                        {holding.goalId && (
                            <Stack direction="horizontal" className="justify-between items-center">
                                <Typography variant="body-sm">{t('goals.title')}</Typography>
                                <Link href={ROUTES.GOAL_DETAIL(holding.goalId)} className="text-primary hover:underline font-medium">
                                    {holding.goalName || 'Goal'}
                                </Link>
                            </Stack>
                        )}

                        {isSold && holding.soldAt && (
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

                        <Divider />

                        <Stack direction="horizontal" className="justify-between items-center">
                            <Typography variant="body-sm">{t('holdingDetail.purchaseDetails.totalBuyValue')}</Typography>
                            <Typography variant="body" className="font-medium financial-value">{holding.totalBuyValue}</Typography>
                        </Stack>
                    </Stack>

                    {holding.notes && (
                        <Stack gap="xs" className="mt-2 pt-3 border-t border-border">
                            <Typography variant="caption">{t('holdingDetail.purchaseDetails.notes')}</Typography>
                            <Typography variant="body-sm">{holding.notes}</Typography>
                        </Stack>
                    )}
                </Stack>
            </CardContent>
        </Card>
    )
}
