'use client'

import { Stack, Section } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { RefreshCcw } from 'lucide-react'

interface PriceFreshnessProps {
  lastUpdated: Date
}

export default function PriceFreshness({ lastUpdated }: PriceFreshnessProps) {
  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(lastUpdated)

  return (
    <Section className="px-6 pb-2 -mt-4 mb-2 relative z-10">
      <div className="flex items-center gap-2">
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </div>
        <Typography variant="caption" className="text-xs font-medium text-[var(--text-muted)]">
          Updated {formattedDate}
        </Typography>
      </div>
    </Section>
  )
}

