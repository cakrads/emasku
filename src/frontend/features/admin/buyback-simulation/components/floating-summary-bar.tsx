'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/frontend/components/ui/button'
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
        ? 'text-green-600 dark:text-green-400'
        : summary.totalPnL < 0
            ? 'text-red-600 dark:text-red-400'
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
                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-start">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="bg-primary/10 p-2 rounded-full text-primary">
                                <Wallet className="w-5 h-5" />
                            </div>
                            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center border-2 border-background">
                                {summary.selectedCount}
                            </span>
                        </div>
                        <div>
                            <Typography variant="caption" className="text-muted-foreground uppercase tracking-wider font-semibold">
                                {t('buybackSimulation.headerSummary.totalBuyback')}
                            </Typography>
                            <Typography variant="h4" className="financial-value text-lg">
                                {formatIDR(summary.totalBuybackValue)}
                            </Typography>
                        </div>
                    </div>

                    {/* PnL Mini (Visible on mobile/desktop) */}
                    <div className="text-right">
                        <Typography variant="caption" className="text-muted-foreground uppercase tracking-wider font-semibold">
                            {t('buybackSimulation.headerSummary.totalPnL')}
                        </Typography>
                        <div className={cn("flex items-center justify-end gap-1.5", pnlColor)}>
                            {summary.totalPnL > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                            <span className="font-semibold text-sm">
                                {summary.totalPnL > 0 ? '+' : ''}{formatIDR(summary.totalPnL)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3 w-full md:w-auto">
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
                        className="flex-1 md:flex-none bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-lg shadow-orange-600/20"
                    >
                        {t('buybackSimulation.headerSummary.sellSelected')}
                    </Button>
                </div>
            </div>
        </div>
    )
}
