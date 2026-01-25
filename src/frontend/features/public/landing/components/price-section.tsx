'use client'

import { useLanguage } from '@/frontend/hooks/use-language'
import { Badge } from '@/frontend/components/ui/badge'
import { TrendingUp, TrendingDown, Clock, Minus } from 'lucide-react'
import { ScrollReveal } from '@/frontend/components/ui/scroll-reveal'
import { cn } from '@/frontend/utils/cn'

// Mock data for visual purpose - in real app this would come from an API
const PRICES = [
  {
    provider: 'Antam',
    price: 'Rp 1.130.000',
    change: 5000,
    changePercent: '0.45%',
    trend: 'up'
  },
  {
    provider: 'UBS',
    price: 'Rp 1.105.000',
    change: -2000,
    changePercent: '0.18%',
    trend: 'down'
  },
]

export function PriceSection() {
  const { t } = useLanguage()

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background Radial Gradient */}
      <div className="absolute inset-0 bg-radial-gradient-bottom opacity-50 pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        <ScrollReveal direction="up" duration={800}>
          <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 shadow-card border border-border/50">

            {/* Header */}
            <ScrollReveal delay={100}>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-2">
                    {t('landing.price.title') || 'Harga Emas Hari Ini'}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Data publik, tanpa perlu login
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/80 px-4 py-2 rounded-full border border-border/50">
                  <Clock className="w-4 h-4 text-accent-gold" />
                  <span>Update: 09.15 WIB</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Price List */}
            <div className="grid gap-4">
              {PRICES.map((item, index) => (
                <ScrollReveal key={item.provider} delay={200 + index * 100} direction="left">
                  <div
                    className="flex items-center justify-between p-6 bg-secondary/30 rounded-[1.5rem] border border-border/50 hover:border-accent-gold/30 transition-all duration-300 group hover:bg-secondary/50"
                  >
                    {/* Brand Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-accent-gold/10 flex items-center justify-center shadow-inner group-hover:bg-accent-gold/20 transition-colors">
                        <span className="font-bold text-accent-gold text-lg">{item.provider[0]}</span>
                      </div>
                      <span className="text-xl font-medium text-foreground">{item.provider}</span>
                    </div>

                    {/* Price Info */}
                    <div className="text-right flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                      <div className="flex items-baseline justify-end gap-1.5">
                        <span className="text-2xl font-bold text-foreground tracking-tight">
                          {item.price.replace('Rp ', '')}
                        </span>
                        <span className="text-sm text-muted-foreground font-normal">/gram</span>
                      </div>

                      <div className={`flex items-center justify-end gap-1 px-2.5 py-1 rounded-full text-sm font-medium w-fit ml-auto md:ml-0 ${item.trend === 'up' ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400' :
                          item.trend === 'down' ? 'bg-red-500/10 text-red-500 dark:text-red-400' :
                            'bg-slate-500/10 text-slate-400'
                        }`}>
                        {item.trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> :
                          item.trend === 'down' ? <TrendingDown className="w-3.5 h-3.5" /> :
                            <Minus className="w-3.5 h-3.5" />}
                        {item.changePercent}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Disclaimer */}
            <ScrollReveal delay={400}>
              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  {t('landing.price.disclaimer') || 'Harga dapat berubah sewaktu-waktu mengikuti kondisi pasar'}
                </p>
              </div>
            </ScrollReveal>

          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
