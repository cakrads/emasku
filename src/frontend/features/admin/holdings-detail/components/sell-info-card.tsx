import { Calendar, Clock, TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent } from '@/frontend/components/ui/card'
import { Stack, Divider } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { cn } from '@/frontend/utils/cn'
import { HoldingItemVM } from '@/frontend/view-model/portfolio.vm'

interface SellInfoCardProps {
    holding: HoldingItemVM
    t: (key: string) => string
}

export function SellInfoCard({ holding, t }: SellInfoCardProps) {
    return (
        <Card className="bg-surface-elevated border-border shadow-sm">
            <CardContent className="p-5">
                <Stack gap="md">
                    <Typography variant="h3" className="text-sm">{t('holdingDetail.sellInfo.title')}</Typography>

                    <Stack gap="md">
                        <Stack direction="horizontal" className="justify-between items-center">
                            <Typography variant="body-sm">{t('holdingDetail.sellInfo.sellPrice')}</Typography>
                            <Typography variant="body" className="font-medium">{holding.sellPrice}</Typography>
                        </Stack>
                        <Stack direction="horizontal" className="justify-between items-center">
                            <Stack direction="horizontal" gap="xs" className="items-center">
                                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                <Typography variant="body-sm">{t('holdingDetail.sellInfo.sellDate')}</Typography>
                            </Stack>
                            <Typography variant="body" className="font-medium">{holding.sellDate}</Typography>
                        </Stack>
                        {holding.holdingDuration && (
                            <Stack direction="horizontal" className="justify-between items-center">
                                <Stack direction="horizontal" gap="xs" className="items-center">
                                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                    <Typography variant="body-sm">{t('holdingDetail.sellInfo.holdingDuration')}</Typography>
                                </Stack>
                                <Typography variant="body" className="font-medium">{holding.holdingDuration}</Typography>
                            </Stack>
                        )}

                        <Divider />

                        <Stack direction="horizontal" className="justify-between items-center">
                            <Typography variant="body-sm" className="font-medium">{t('holdingDetail.sellInfo.realizedPnL')}</Typography>
                            <Stack direction="horizontal" gap="xs" className="items-center">
                                {holding.realizedPnLColor === 'positive' && <TrendingUp className="w-4 h-4 text-positive" />}
                                {holding.realizedPnLColor === 'negative' && <TrendingDown className="w-4 h-4 text-negative" />}
                                <Typography
                                    variant="body"
                                    className={cn(
                                        'font-bold',
                                        holding.realizedPnLColor === 'positive' ? 'text-positive' : holding.realizedPnLColor === 'negative' ? 'text-negative' : ''
                                    )}
                                >
                                    {holding.realizedPnL} ({holding.realizedPnLPercentage})
                                </Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    )
}
