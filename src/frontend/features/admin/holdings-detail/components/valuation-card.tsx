import { Info } from 'lucide-react'
import { Card, CardContent } from '@/frontend/components/ui/card'
import { Stack, Divider } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { cn } from '@/frontend/utils/cn'
import { Alert, AlertDescription, AlertTitle } from '@/frontend/components/ui/alert'
import { HoldingItemVM } from '@/frontend/view-model/portfolio.vm'

interface ValuationCardProps {
    holding: HoldingItemVM
    hasMissingValue: boolean
    t: (key: string) => string
}

export function ValuationCard({ holding, hasMissingValue, t }: ValuationCardProps) {
    return (
        <Card className="bg-surface-elevated border-border shadow-sm">
            <CardContent className="p-5">
                <Stack gap="md">
                    <Typography variant="h3" className="text-sm">{t('holdingDetail.valuation.title')}</Typography>

                    {hasMissingValue && (
                        <Alert className="bg-muted border-border">
                            <Info className="h-4 w-4 text-primary" />
                            <AlertTitle className="text-foreground">{t('holdingDetail.valuation.missingTitle')}</AlertTitle>
                            <AlertDescription className="text-muted-foreground">
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

                        <Divider />

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
    )
}
