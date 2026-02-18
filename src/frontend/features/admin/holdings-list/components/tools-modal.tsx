'use client'

import Link from 'next/link'
import { Calculator, LayoutGrid, Target, ChevronRight } from 'lucide-react'
import { ResponsiveModal } from '@/frontend/components/ui/responsive-modal'
import { Button } from '@/frontend/components/ui/button'
import { Stack } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { useLanguage } from '@/frontend/hooks/use-language'
import { ROUTES } from '@/frontend/config/routes'

interface ToolsModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onShowBrandSummary: () => void
}

export default function ToolsModal({
    open,
    onOpenChange,
    onShowBrandSummary,
}: ToolsModalProps) {
    const { t } = useLanguage()

    const handleToolClick = (callback?: () => void) => {
        onOpenChange(false)
        if (callback) callback()
    }

    const tools = [
        {
            id: 'buyback',
            href: ROUTES.BUYBACK_SIMULATION,
            icon: Calculator,
            label: t('buybackSimulation.cta'),
            description: 'Simulate selling your gold at current prices',
            color: 'bg-blue-500/10 text-blue-500',
        },
        {
            id: 'brand',
            icon: LayoutGrid,
            label: t('holdings.brandSummary.title'),
            description: 'View your portfolio distribution by brand',
            color: 'bg-purple-500/10 text-purple-500',
            onClick: onShowBrandSummary,
        },
        {
            id: 'goals',
            href: ROUTES.GOALS_LIST,
            icon: Target,
            label: t('navbar.goals'),
            description: 'Track your progress towards investment goals',
            color: 'bg-accent-gold/10 text-accent-gold',
        },
    ]

    return (
        <ResponsiveModal
            open={open}
            onOpenChange={onOpenChange}
            title={t('holdings.tools.title')}
            description={t('holdings.tools.description')}
        >
            <Stack gap="md" className="py-2">
                {tools.map((tool) => {
                    const Icon = tool.icon
                    const content = (
                        <div
                            className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors w-full text-left group"
                            onClick={() => tool.onClick ? handleToolClick(tool.onClick) : onOpenChange(false)}
                        >
                            <div className={`p-3 rounded-xl ${tool.color}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <Typography variant="body-sm" className="font-bold">
                                    {tool.label}
                                </Typography>
                                <Typography variant="caption" className="text-muted-foreground line-clamp-1 group-hover:text-foreground/80 transition-all">
                                    {tool.description}
                                </Typography>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </div>
                    )

                    if (tool.href) {
                        return (
                            <Link key={tool.id} href={tool.href} className="block">
                                {content}
                            </Link>
                        )
                    }

                    return (
                        <button key={tool.id} className="block w-full">
                            {content}
                        </button>
                    )
                })}
            </Stack>
        </ResponsiveModal>
    )
}
