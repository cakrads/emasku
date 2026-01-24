'use client'

import { useLanguage } from '@/frontend/hooks/use-language'
import { Card } from '@/frontend/components/ui/card'
import { Badge } from '@/frontend/components/ui/badge'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

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
    <section className="py-24 relative z-10 bg-gray-50 dark:bg-zinc-900/80">
      <div className="max-w-3xl mx-auto px-6">
        <Card className="bg-card/50 backdrop-blur-sm border border-border/50 p-8 shadow-card rounded-[2.5rem]">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {t('landing.price.title') || 'Harga Emas Hari Ini'}
              </h2>
              <p className="text-muted-foreground text-sm">
                Data publik, tanpa perlu login
              </p>
            </div>

            <Badge variant="outline" className="w-fit gap-2 py-2 px-4 border-border/50 bg-muted/50 text-muted-foreground font-normal rounded-full">
              <span className="text-accent-gold">🕒</span>
              Update: 09.15 WIB
            </Badge>
          </div>

          {/* Price List */}
          <div className="space-y-4">
            {PRICES.map((item) => (
              <div
                key={item.provider}
                className="flex items-center justify-between p-6 rounded-[1.5rem] bg-background border border-border/50 hover:border-accent-gold/20 transition-all group shadow-sm hover:shadow-md"
              >
                {/* Brand Info */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent-gold/10 flex items-center justify-center text-accent-gold font-bold text-lg shadow-inner">
                    {item.provider[0]}
                  </div>
                  <span className="text-xl font-medium text-foreground">{item.provider}</span>
                </div>

                {/* Price Info */}
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="flex items-baseline gap-1.5 justify-end">
                      <span className="text-2xl font-bold text-foreground tracking-tight">
                        {item.price.replace('Rp ', '')}
                      </span>
                      <span className="text-sm text-muted-foreground font-normal">/gram</span>
                    </div>
                  </div>

                  {/* Change Badge */}
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium ${item.trend === 'up' ? 'bg-green-500/10 text-green-500' :
                    item.trend === 'down' ? 'bg-red-500/10 text-red-500' :
                      'bg-slate-500/10 text-slate-400'
                    }`}>
                    {item.trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> :
                      item.trend === 'down' ? <TrendingDown className="w-3.5 h-3.5" /> :
                        <Minus className="w-3.5 h-3.5" />}
                    {item.changePercent}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground/60">
              {t('landing.price.disclaimer') || 'Harga dapat berubah sewaktu-waktu mengikuti kondisi pasar'}
            </p>
          </div>
        </Card>
      </div>
    </section>
  )
}
