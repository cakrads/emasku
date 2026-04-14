'use client'

import { useState, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/frontend/components/ui/dialog'
import { Button } from '@/frontend/components/ui/button'
import { Input } from '@/frontend/components/ui/input'
import { CurrencyInput } from '@/frontend/components/ui/currency-input'
import { Stack, Divider } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { cn } from '@/frontend/utils/cn'
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'
import { useLanguage } from '@/frontend/hooks/use-language'
import type { HoldingItemVM } from '@/frontend/view-model/portfolio.vm'

interface SellModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    holding: HoldingItemVM
    onConfirm: (data: { sellPrice: number; sellDate: string; notes?: string }) => void
    isPending?: boolean
}

export function SellModal({ open, onOpenChange, holding, onConfirm, isPending }: SellModalProps) {
    const { t } = useLanguage()
    const [step, setStep] = useState<'input' | 'preview'>('input')
    const [sellPrice, setSellPrice] = useState('')
    const [sellDate, setSellDate] = useState(() => new Date().toISOString().split('T')[0])
    const [notes, setNotes] = useState('')

    const sellPriceNum = Number(sellPrice)
    const buyPriceNum = holding.rawAvgBuyPrice

    // Calculate preview P/L
    const preview = useMemo(() => {
        if (!sellPriceNum || sellPriceNum <= 0) return null
        const realizedPnL = sellPriceNum - buyPriceNum
        const realizedPnLPercentage = buyPriceNum > 0
            ? ((sellPriceNum - buyPriceNum) / buyPriceNum) * 100
            : 0
        const color = realizedPnL > 0 ? 'positive' : realizedPnL < 0 ? 'negative' : 'neutral'
        return {
            realizedPnL,
            realizedPnLPercentage: Number(realizedPnLPercentage.toFixed(2)),
            color,
            formattedPnL: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Math.abs(realizedPnL)),
            formattedSellPrice: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(sellPriceNum),
        }
    }, [sellPriceNum, buyPriceNum])

    const isValid = sellPriceNum > 0 && sellDate

    const handleNext = () => {
        if (isValid) setStep('preview')
    }

    const handleBack = () => {
        setStep('input')
    }

    const handleConfirm = () => {
        if (isValid) {
            onConfirm({
                sellPrice: sellPriceNum,
                sellDate,
                notes: notes || undefined,
            })
        }
    }

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            // Reset state when closing
            setStep('input')
            setSellPrice('')
            setSellDate(new Date().toISOString().split('T')[0])
            setNotes('')
        }
        onOpenChange(open)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {step === 'input' ? t('holdingDetail.sellModal.title') : t('holdingDetail.sellModal.confirmTitle')}
                    </DialogTitle>
                    <DialogDescription>
                        {step === 'input'
                            ? t('holdingDetail.sellModal.description')
                            : t('holdingDetail.sellModal.confirmDescription')
                        }
                    </DialogDescription>
                </DialogHeader>

                {step === 'input' ? (
                    <Stack gap="md" className="py-2">
                        {/* Holding Info */}
                        <Stack gap="xs" className="bg-muted/50 rounded-lg p-3">
                                <Typography variant="body-sm" className="text-muted-foreground">
                                    {holding.brandName} • {holding.weight} × {holding.quantity}
                                </Typography>
                                <Typography variant="body" className="font-medium">
                                    {t('holdingDetail.sellModal.buyPrice')}: {holding.avgBuyPrice}
                                </Typography>
                        </Stack>

                        {/* Sell Price Input */}
                        <Stack gap="xs">
                            <label htmlFor="sellPrice" className="text-sm font-medium">
                                {t('holdingDetail.sellModal.sellPriceLabel')} <span className="text-destructive">*</span>
                            </label>
                            <CurrencyInput
                                value={sellPrice}
                                onChange={setSellPrice}
                                placeholder={t('holdingDetail.sellModal.sellPricePlaceholder')}
                            />
                            {sellPrice && sellPriceNum <= 0 && (
                                <Typography variant="caption" className="text-destructive">
                                    {t('holdingDetail.sellModal.invalidPrice')}
                                </Typography>
                            )}
                        </Stack>

                        {/* Sell Date Input */}
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

                        {/* Notes Input */}
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

                        {/* Live P/L Preview */}
                        {preview && (
                            <Stack className={cn(
                                'rounded-lg p-3 border',
                                preview.color === 'positive' ? 'bg-positive/5 border-positive/20' :
                                    preview.color === 'negative' ? 'bg-negative/5 border-negative/20' :
                                        'bg-muted/50 border-border'
                            )}>
                                <Stack direction="horizontal" className="justify-between items-center">
                                    <Typography variant="body-sm">{t('holdingDetail.sellModal.estimatedPnL')}</Typography>
                                    <Stack direction="horizontal" gap="xs" className="items-center">
                                        {preview.color === 'positive' && <TrendingUp className="w-4 h-4 text-positive" />}
                                        {preview.color === 'negative' && <TrendingDown className="w-4 h-4 text-negative" />}
                                        <Typography
                                            variant="body"
                                            className={cn(
                                                'font-semibold',
                                                preview.color === 'positive' ? 'text-positive' : preview.color === 'negative' ? 'text-negative' : ''
                                            )}
                                        >
                                            {preview.realizedPnL > 0 ? '+' : preview.realizedPnL < 0 ? '-' : ''}{preview.formattedPnL}
                                            {' '}({preview.realizedPnLPercentage > 0 ? '+' : ''}{preview.realizedPnLPercentage}%)
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                        )}
                    </Stack>
                ) : (
                    /* Preview Step */
                    <Stack gap="md" className="py-2">
                        {/* Warning for loss */}
                        {preview && preview.realizedPnL < 0 && (
                            <Stack direction="horizontal" gap="sm" className="items-start rounded-lg p-3 bg-orange-50 border border-orange-200 dark:bg-orange-950/20 dark:border-orange-900/50">
                                <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 shrink-0" />
                                <Typography variant="body-sm" className="text-orange-800 dark:text-orange-200">
                                    {t('holdingDetail.sellModal.lossWarning')}
                                </Typography>
                            </Stack>
                        )}

                        {/* Summary */}
                        <Stack gap="md" className="bg-muted/50 rounded-lg p-4">
                            <Typography variant="h4" className="text-sm">{holding.brandName}</Typography>

                            <Stack gap="sm">
                                <Stack direction="horizontal" className="justify-between">
                                    <Typography variant="body-sm" className="text-muted-foreground">{t('holdingDetail.sellModal.buyPrice')}</Typography>
                                    <Typography variant="body" className="font-medium">{holding.avgBuyPrice}</Typography>
                                </Stack>
                                <Stack direction="horizontal" className="justify-between">
                                    <Typography variant="body-sm" className="text-muted-foreground">{t('holdingDetail.sellModal.sellPriceLabel')}</Typography>
                                    <Typography variant="body" className="font-medium">{preview?.formattedSellPrice}</Typography>
                                </Stack>
                                <Stack direction="horizontal" className="justify-between">
                                    <Typography variant="body-sm" className="text-muted-foreground">{t('holdingDetail.sellModal.sellDateLabel')}</Typography>
                                    <Typography variant="body" className="font-medium">{new Date(sellDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</Typography>
                                </Stack>
                                {notes && (
                                    <Stack direction="horizontal" className="justify-between">
                                        <Typography variant="body-sm" className="text-muted-foreground">{t('holdingDetail.sellModal.notesLabel')}</Typography>
                                        <Typography variant="body" className="font-medium ">{notes}</Typography>
                                    </Stack>
                                )}

                                <Divider />

                                <Stack direction="horizontal" className="justify-between items-center">
                                    <Typography variant="body-sm" className="font-medium">{t('holdingDetail.sellModal.realizedPnL')}</Typography>
                                    <Stack direction="horizontal" gap="xs" className="items-center">
                                        {preview?.color === 'positive' && <TrendingUp className="w-4 h-4 text-positive" />}
                                        {preview?.color === 'negative' && <TrendingDown className="w-4 h-4 text-negative" />}
                                        <Typography
                                            variant="body"
                                            className={cn(
                                                'font-bold',
                                                preview?.color === 'positive' ? 'text-positive' : preview?.color === 'negative' ? 'text-negative' : ''
                                            )}
                                        >
                                            {preview && preview.realizedPnL > 0 ? '+' : preview && preview.realizedPnL < 0 ? '-' : ''}{preview?.formattedPnL}
                                            {' '}({preview && preview.realizedPnLPercentage > 0 ? '+' : ''}{preview?.realizedPnLPercentage}%)
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                )}

                <DialogFooter>
                    {step === 'input' ? (
                        <>
                            <Button variant="outline" onClick={() => handleOpenChange(false)}>
                                {t('common.cancel')}
                            </Button>
                            <Button onClick={handleNext} disabled={!isValid}>
                                {t('holdingDetail.sellModal.next')}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="outline" onClick={handleBack}>
                                {t('holdingDetail.sellModal.back')}
                            </Button>
                            <Button
                                variant="solid"
                                color="destructive"
                                onClick={handleConfirm}
                                disabled={isPending}
                            >
                                {isPending ? t('holdingDetail.sellModal.confirming') : t('holdingDetail.sellModal.confirmSell')}
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
