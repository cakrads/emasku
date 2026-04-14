'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/frontend/components/ui/button'
import { Stack } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { useLanguage } from '@/frontend/hooks/use-language'
import { SimulationSummary } from '../hooks/use-buyback-simulation'
import { X, TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { cn } from '@/frontend/utils/cn'

interface FloatingSummaryBarProps {
    summary: SimulationSummary
    onReset: () => void
    onSell: () => void
}

export function FloatingSummaryBar({ summary, onReset, onSell }: FloatingSummaryBarProps) {
    const { t } = useLanguage()
    const [isVisible, setIsVisible] = useState(false)
    const show = summary.selectedCount > 0

    useEffect(() => {
        if (show) {
            setIsVisible(true)
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300)
            return () => clearTimeout(timer)
        }
    }, [show])

    // Format IDR helper
    const formatIDR = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value)
    }

    const pnlColor = summary.totalPnL > 0
        ? 'text-positive'
        : summary.totalPnL < 0
            ? 'text-negative'
            : 'text-muted-foreground'

    if (!isVisible && !show) return null

    return (
        <div
            className={cn(
                "fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none transition-all duration-300 ease-in-out transform",
                show ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            )}
        >
            <div className="bg-background/95 backdrop-blur-lg border border-border shadow-2xl rounded-2xl p-4 w-full max-w-3xl flex flex-col md:flex-row items-center justify-between gap-4 pointer-events-auto ring-1 ring-black/5 dark:ring-white/10">

                {/* Left: Summary Info */}
                <Stack direction="horizontal" className="items-center gap-6 w-full md:w-auto justify-between md:justify-start">
                    <Stack direction="horizontal" gap="sm" className="items-center">
                        <div className="relative">
                            <Stack className="bg-primary/10 p-2 rounded-full text-primary">
                                <Wallet className="w-5 h-5" />
                            </Stack>
                            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center border-2 border-background">
                                {summary.selectedCount}
                            </span>
                        </div>
                        <Stack gap="xs">
                            <Typography as="div" variant="caption" className="text-muted-foreground uppercase tracking-wider font-semibold">
                                {t('buybackSimulation.headerSummary.totalBuyback')}
                            </Typography>
                            <Typography variant="h4" className="financial-value text-lg">
                                {formatIDR(summary.totalBuybackValue)}
                            </Typography>
                        </Stack>
                    </Stack>

                    {/* PnL Mini (Visible on mobile/desktop) */}
                    <Stack className="text-right" gap="xs">
                        <Typography as="div" variant="caption" className="text-muted-foreground uppercase tracking-wider font-semibold">
                            {t('buybackSimulation.headerSummary.totalPnL')}
                        </Typography>
                        <Stack direction="horizontal" className={cn("items-center justify-end gap-1.5", pnlColor)}>
                            {summary.totalPnL > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                            <Typography as="span" variant="body-sm" className="font-semibold">
                                {summary.totalPnL > 0 ? '+' : ''}{formatIDR(summary.totalPnL)}
                            </Typography>
                        </Stack>
                    </Stack>
                </Stack>

                {/* Right: Actions */}
                <Stack direction="horizontal" gap="sm" className="items-center w-full md:w-auto">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onReset}
                        className="flex-1 md:flex-none rounded-xl"
                    >
                        <X className="w-4 h-4 mr-2" />
                        {t('common.cancel')}
                    </Button>
                    <Button
                        variant="solid"
                        size="sm"
                        onClick={onSell}
                        color="warning"
                        className="flex-1 md:flex-none rounded-xl"
                    >
                        {t('buybackSimulation.headerSummary.sellSelected')}
                    </Button>
                </Stack>
            </div>
        </div>
    )
}
