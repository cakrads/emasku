'use client'

import { useState, useMemo } from 'react'
import Decimal from 'decimal.js'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/frontend/components/ui/dialog'
import { Button } from '@/frontend/components/ui/button'
import { Input } from '@/frontend/components/ui/input'
import { Stack } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { cn } from '@/frontend/utils/cn'
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'
import { useLanguage } from '@/frontend/hooks/use-language'
import type { HoldingItemVM } from '@/frontend/view-model/portfolio.vm'

interface BulkSellModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    selectedItems: Map<string, HoldingItemVM>
    quantityOverrides: Record<string, number>
    priceMap: Map<string, number>
    onConfirm: (data: { items: { id: string; sellPrice: number }[]; sellDate: string; notes?: string }) => void
    isPending?: boolean
}

export function BulkSellModal({
    open,
    onOpenChange,
    selectedItems,
    quantityOverrides,
    priceMap,
    onConfirm,
    isPending
}: BulkSellModalProps) {
    const { t } = useLanguage()
    const [sellDate, setSellDate] = useState(() => new Date().toISOString().split('T')[0])
    const [notes, setNotes] = useState('')

    // Calculate totals and prepare payload preview
    const summary = useMemo(() => {
        let totalBuyPrice = new Decimal(0)
        let totalSellPrice = new Decimal(0)
        let partialSellCount = 0
        const itemsPayload: { id: string; sellPrice: number }[] = []

        selectedItems.forEach((holding) => {
            // Logic: We sell the ENTIRE holding, regardless of simulation quantity override.
            // But we should warn if simulation had partial quantity.
            const simQty = quantityOverrides[holding.id] ?? holding.quantity
            if (simQty < holding.quantity) {
                partialSellCount++
            }

            const priceKey = `${holding.brand}:${holding.rawWeight}`
            const unitBuybackPrice = priceMap.get(priceKey) || 0

            // We assume the user wants to sell the HOLDING at the current unit buyback price * TOTAL quantity
            const estimatedTotalSellPrice = new Decimal(unitBuybackPrice).mul(holding.quantity)

            totalBuyPrice = totalBuyPrice.plus(new Decimal(holding.rawAvgBuyPrice).mul(holding.quantity))
            totalSellPrice = totalSellPrice.plus(estimatedTotalSellPrice)

            itemsPayload.push({
                id: holding.id,
                sellPrice: estimatedTotalSellPrice.toNumber()
            })
        })

        const realizedPnL = totalSellPrice.minus(totalBuyPrice)
        const realizedPnLPercentage = totalBuyPrice.gt(0) ? realizedPnL.div(totalBuyPrice).mul(100).toDP(2).toNumber() : 0
        const realizedPnLNum = realizedPnL.toNumber()
        const color = realizedPnLNum > 0 ? 'positive' : realizedPnLNum < 0 ? 'negative' : 'neutral'

        return {
            totalSellPrice: totalSellPrice.toNumber(),
            totalBuyPrice: totalBuyPrice.toNumber(),
            realizedPnL: realizedPnLNum,
            realizedPnLPercentage,
            color,
            formattedPnL: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Math.abs(realizedPnLNum)),
            formattedSellPrice: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalSellPrice.toNumber()),
            itemsPayload,
            partialSellCount
        }
    }, [selectedItems, quantityOverrides, priceMap])

    const handleConfirm = () => {
        if (summary.totalSellPrice > 0) {
            onConfirm({
                items: summary.itemsPayload,
                sellDate,
                notes: notes || undefined,
            })
        }
    }

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setSellDate(new Date().toISOString().split('T')[0])
            setNotes('')
        }
        onOpenChange(open)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('buybackSimulation.bulkSellModal.title')}</DialogTitle>
                    <DialogDescription>
                        {t('buybackSimulation.bulkSellModal.description', { count: selectedItems.size })}
                    </DialogDescription>
                </DialogHeader>

                <Stack gap="md" className="py-2">
                    {/* Partial Sell Warning */}
                    {summary.partialSellCount > 0 && (
                        <Stack direction="horizontal" gap="xs" className="items-start rounded-lg p-3 bg-orange-50 border border-orange-200 dark:bg-orange-950/20 dark:border-orange-900/50">
                            <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 shrink-0" />
                            <Typography variant="body-sm" className="text-orange-800 dark:text-orange-200">
                                {t('buybackSimulation.bulkSellModal.partialWarning', { count: summary.partialSellCount })}
                            </Typography>
                        </Stack>
                    )}

                    {/* Warning for loss */}
                    {summary.realizedPnL < 0 && (
                        <Stack direction="horizontal" gap="xs" className="items-start rounded-lg p-3 bg-red-50 border border-red-200 dark:bg-red-950/20 dark:border-red-900/50">
                            <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                            <Typography variant="body-sm" className="text-red-800 dark:text-red-200">
                                {t('holdingDetail.sellModal.lossWarning')}
                            </Typography>
                        </Stack>
                    )}

                    {/* Summary Box */}
                    <Stack gap="sm" className="bg-muted/50 rounded-lg p-4">
                        <Stack gap="sm">
                            <Stack direction="horizontal" className="justify-between">
                                <Typography variant="body-sm" className="text-muted-foreground">{t('buybackSimulation.bulkSellModal.totalBuyPrice')}</Typography>
                                <Typography variant="body" className="font-medium">
                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(summary.totalBuyPrice)}
                                </Typography>
                            </Stack>
                            <Stack direction="horizontal" className="justify-between">
                                <Typography variant="body-sm" className="text-muted-foreground">{t('buybackSimulation.bulkSellModal.totalSellPrice')}</Typography>
                                <Typography variant="h3" className="financial-value">
                                    {summary.formattedSellPrice}
                                </Typography>
                            </Stack>

                            <div className="h-px bg-border w-full" />

                            <Stack direction="horizontal" className="justify-between items-center" gap="none">
                                <Typography variant="body-sm" className="font-medium">{t('holdingDetail.sellInfo.realizedPnL')}</Typography>
                                <Stack direction="horizontal" gap="xs" className="items-center">
                                    {summary.color === 'positive' && <TrendingUp className="w-4 h-4 text-positive" />}
                                    {summary.color === 'negative' && <TrendingDown className="w-4 h-4 text-negative" />}
                                    <Typography
                                        variant="body"
                                        className={cn(
                                            'font-bold',
                                            summary.color === 'positive' ? 'text-positive' : summary.color === 'negative' ? 'text-negative' : ''
                                        )}
                                    >
                                        {summary.realizedPnL > 0 ? '+' : summary.realizedPnL < 0 ? '-' : ''}{summary.formattedPnL}
                                        {' '}({summary.realizedPnLPercentage > 0 ? '+' : ''}{summary.realizedPnLPercentage}%)
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>

                    {/* Inputs */}
                    <Stack gap="xs">
                        <label htmlFor="sellDate" className="text-sm font-medium">
                            {t('holdingDetail.sellModal.sellDateLabel')} <span className="text-destructive">*</span>
                        </label>
                        <Input
                            id="sellDate"
                            type="date"
                            value={sellDate}
                            onChange={(e) => setSellDate(e.target.value)}
                        />
                    </Stack>

                    <Stack gap="xs">
                        <label htmlFor="sellNotes" className="text-sm font-medium">
                            {t('holdingDetail.sellModal.notesLabel')}
                        </label>
                        <Input
                            id="sellNotes"
                            type="text"
                            placeholder={t('holdingDetail.sellModal.notesPlaceholder')}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </Stack>
                </Stack>

                <DialogFooter>
                    <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isPending}>
                        {t('common.cancel')}
                    </Button>
                    <Button
                        variant="solid"
                        color="destructive"
                        onClick={handleConfirm}
                        disabled={isPending || summary.totalSellPrice <= 0}
                    >
                        {isPending ? t('holdingDetail.sellModal.confirming') : t('holdingDetail.sellModal.confirmSell')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
