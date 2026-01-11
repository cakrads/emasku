'use client'

import { Stack, ScrollArea } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { Layers } from 'lucide-react'

export default function BrandBreakdownEmpty() {
  return (
    <Stack gap="md">
      <Stack gap="none">
        <Typography as="h2" variant="h3">Holdings</Typography>
        <Typography variant="body-sm">By brand</Typography>
      </Stack>

      <ScrollArea>
        <div className="flex gap-4 pb-2">
          {/* Placeholder Card */}
          <div className="shrink-0 w-[280px] bg-(--surface-elevated) border border-dashed border-(--border) rounded-xl p-6 flex flex-col items-center justify-center text-center gap-3 min-h-[180px]">
            <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
              <Layers className="w-6 h-6 text-muted-foreground" />
            </div>
            <Typography variant="body-sm" className="text-muted-foreground max-w-[200px]">
              Setiap emas yang kamu input akan dikelompokkan otomatis berdasarkan brand
            </Typography>
          </div>
          <div className="w-2 shrink-0" />
        </div>
      </ScrollArea>
    </Stack>
  )
}
