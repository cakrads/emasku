'use client'

import { useLanguage } from '@/frontend/hooks/use-language'
import { TrendingUp, TrendingDown, Clock, Minus, ArrowRight } from 'lucide-react'
import { ScrollReveal } from '@/frontend/components/ui/scroll-reveal'
import { Skeleton } from '@/frontend/components/ui/skeleton'
import { useQuery } from '@tanstack/react-query'
import { fetchTodayPrices } from '@/frontend/services/prices/prices.api'
import Link from 'next/link'
import { ROUTES } from '@/frontend/config/routes'
import { PricesTodayResponse } from '@/shared/contracts/prices.contract'
import { Typography } from '@/frontend/components/ui/typography'
import { Stack } from '@/frontend/components/ui/layout'

export function PriceSection() {
  const { t, language } = useLanguage()

  const { data, isLoading, error } = useQuery<PricesTodayResponse, Error>({
    queryKey: ['prices', 'today', 'landing'],
    queryFn: fetchTodayPrices,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  })

  // Transform backend data to display format (1 gram only, all 4 brands)
  const prices = data?.brands.map(brand => {
    const price1g = brand.prices.find(p => p.denominationGram === 1)
    const sellPrice = price1g?.sellPrice ?? 0
    const sellDelta = price1g?.sellDelta ?? 0
    const deltaPercent = sellPrice > 0 ? ((sellDelta / (sellPrice - sellDelta)) * 100).toFixed(2) : '0.00'

    return {
      provider: brand.brand,
      price: sellPrice,
      priceFormatted: sellPrice > 0
        ? new Intl.NumberFormat(language === 'id' ? 'id-ID' : 'en-US').format(sellPrice)
        : '—',
      change: sellDelta,
      changePercent: `${Math.abs(Number(deltaPercent))}%`,
      trend: sellDelta > 0 ? 'up' : sellDelta < 0 ? 'down' : 'neutral' as 'up' | 'down' | 'neutral',
    }
  }) ?? []

  // Format update time
  const updateTime = data?.date
    ? new Date(data.date).toLocaleTimeString(language === 'id' ? 'id-ID' : 'en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })
    : '—'

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background Radial Gradient */}
      <div className="absolute inset-0 bg-radial-gradient-bottom opacity-50 pointer-events-none" />

      <Stack className="max-w-3xl mx-auto relative z-10">
        <ScrollReveal direction="up" duration={800}>
          <Stack className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 shadow-card border border-border/50">

            {/* Header */}
            <ScrollReveal delay={100}>
              <Stack className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                <Stack gap="xs">
                  <Typography variant="h2" as="h2" className="text-3xl font-bold text-foreground">
                    {t('landing.price.title')}
                  </Typography>
                  <Typography variant="body-sm" as="p" className="text-muted-foreground text-sm">
                    {t('landing.price.subtitle')}
                  </Typography>
                </Stack>

                <Stack direction="horizontal" className="items-center gap-2 text-sm text-muted-foreground bg-secondary/80 px-4 py-2 rounded-full border border-border/50">
                  <Clock className="w-4 h-4 text-accent-gold" />
                  <Typography variant="body-sm" as="span">{t('landing.price.lastUpdate').replace('{time}', updateTime)}</Typography>
                </Stack>
              </Stack>
            </ScrollReveal>

            {/* Price List */}
            <div className="grid gap-4">
              {isLoading ? (
                // Skeleton loading state
                [...Array(4)].map((_, i) => (
                  <Stack key={i} direction="horizontal" className="items-center justify-between p-6 bg-secondary/30 rounded-[1.5rem] border border-border/50">
                    <Stack direction="horizontal" className="items-center gap-4">
                      <Skeleton className="w-12 h-12 rounded-2xl" />
                      <Skeleton className="h-6 w-24" />
                    </Stack>
                    <Stack direction="horizontal" className="items-center gap-4">
                      <Skeleton className="h-8 w-32" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </Stack>
                  </Stack>
                ))
              ) : error ? (
                <Stack className="text-center py-8 text-muted-foreground">
                  <Typography variant="body" as="p">{t('landing.price.error')}</Typography>
                </Stack>
              ) : (
                prices.map((item, index) => (
                  <ScrollReveal key={item.provider} delay={200 + index * 100} direction="left">
                    <Stack
                      className="p-6 bg-secondary/30 rounded-[1.5rem] border border-border/50 hover:border-accent-gold/30 transition-all duration-300 group hover:bg-secondary/50"
                    >
                      {/* Mobile Layout: Logo Left, Title & Price Right Column */}
                      <Stack direction="horizontal" className="md:hidden items-center gap-4 relative">
                        {/* Logo Left */}
                        <Stack className="w-12 h-12 rounded-2xl bg-accent-gold/10 items-center justify-center shadow-inner group-hover:bg-accent-gold/20 transition-colors shrink-0">
                          <Typography variant="body" as="span" className="font-bold text-accent-gold text-lg">{item.provider?.charAt(0) ?? '?'}</Typography>
                        </Stack>

                        {/* Content Column */}
                        <Stack className="flex-1 gap-0.5 justify-center">
                          {/* Title + PnL Row */}
                          <Stack direction="horizontal" className="items-center justify-between w-full">
                            <Typography variant="body" as="span" className="text-xl font-medium text-foreground translate-y-[2px]">{item.provider}</Typography>

                            {/* PnL Badge Top Right */}
                            <Stack direction="horizontal" className={`items-center justify-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${item.trend === 'up' ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400' :
                              item.trend === 'down' ? 'bg-negative/10 text-negative' :
                                'bg-slate-500/10 text-slate-400'
                              }`}>
                              {item.trend === 'up' ? <TrendingUp className="w-3 h-3" /> :
                                item.trend === 'down' ? <TrendingDown className="w-3 h-3" /> :
                                  <Minus className="w-3 h-3" />}
                              {item.changePercent}
                            </Stack>
                          </Stack>

                          {/* Price Row */}
                          <Stack direction="horizontal" className="items-center gap-3">
                            <Stack direction="horizontal" className="items-baseline gap-1">
                              <Typography variant="body" as="span" className="text-lg font-bold text-foreground tracking-tight">
                                {item.priceFormatted}
                              </Typography>
                              <Typography variant="caption" as="span" className="text-xs text-muted-foreground font-normal">/gram</Typography>
                            </Stack>
                          </Stack>
                        </Stack>
                      </Stack>

                      {/* Desktop Layout: Standard Row */}
                      <Stack direction="horizontal" className="hidden md:flex items-center justify-between">
                        {/* Brand Info */}
                        <Stack direction="horizontal" className="items-center gap-4">
                          <Stack className="w-12 h-12 rounded-2xl bg-accent-gold/10 items-center justify-center shadow-inner group-hover:bg-accent-gold/20 transition-colors">
                            <Typography variant="body" as="span" className="font-bold text-accent-gold text-lg">{item.provider?.charAt(0) ?? '?'}</Typography>
                          </Stack>
                          <Typography variant="body" as="span" className="text-xl font-medium text-foreground">{item.provider}</Typography>
                        </Stack>

                        {/* Price Info */}
                        <Stack direction="horizontal" className="text-right items-center gap-6">
                          <Stack direction="horizontal" className="items-baseline justify-end gap-1.5">
                            <Typography variant="body" as="span" className="text-2xl font-bold text-foreground tracking-tight">
                              {item.priceFormatted}
                            </Typography>
                            <Typography variant="body-sm" as="span" className="text-sm text-muted-foreground font-normal">/gram</Typography>
                          </Stack>

                          <Stack direction="horizontal" className={`items-center justify-end gap-1 px-2.5 py-1 rounded-full text-sm font-medium w-fit ${item.trend === 'up' ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400' :
                            item.trend === 'down' ? 'bg-negative/10 text-negative' :
                              'bg-slate-500/10 text-slate-400'
                            }`}>
                            {item.trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> :
                              item.trend === 'down' ? <TrendingDown className="w-3.5 h-3.5" /> :
                                <Minus className="w-3.5 h-3.5" />}
                            {item.changePercent}
                          </Stack>
                        </Stack>
                      </Stack>
                    </Stack>
                  </ScrollReveal>
                ))
              )}
            </div>

            {/* Link to full price list */}
            <ScrollReveal delay={400}>
              <Stack className="mt-8 text-center space-y-4">
                <Link
                  href={ROUTES.PRICES}
                  className="inline-flex items-center gap-2 text-accent-gold hover:text-accent-gold/80 font-medium transition-colors group"
                >
                  <Typography variant="body" as="span">{t('landing.price.viewAll')}</Typography>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Typography variant="body-sm" as="p" className="text-sm text-muted-foreground">
                  {t('landing.price.disclaimer')}
                </Typography>
              </Stack>
            </ScrollReveal>

          </Stack>
        </ScrollReveal>
      </Stack>
    </section>
  )
}
