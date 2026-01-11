'use client'

import { Stack } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { Button } from '@/frontend/components/ui/button'
import Link from 'next/link'
import { ROUTES } from '@/frontend/config/routes'
import { Coins } from 'lucide-react'

export default function PortfolioHeroEmpty() {
  return (
    <Stack gap="md" className="min-h-auto md:min-h-[190px] justify-center">
      <Stack gap="xs">
        <Typography variant="h4" className="mb-2">Portfolio Value</Typography>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-accent-gold/10 flex items-center justify-center">
            <Coins className="w-6 h-6 text-accent-gold" />
          </div>
          <Stack gap="xs">
            <Typography variant="h3" className="text-foreground">
              Belum ada emas di portofoliomu
            </Typography>
            <Typography variant="body-sm" className="text-muted-foreground max-w-sm">
              Tambahkan emas pertamamu untuk mulai memantau nilai dan pergerakannya
            </Typography>
          </Stack>
        </div>
      </Stack>

      <Stack direction="horizontal" gap="md" className="items-center flex-wrap">
        <Button asChild color="primary" size="sm">
          <Link href={ROUTES.ADD_HOLDING}>Tambah Emas</Link>
        </Button>
        <Link
          href={ROUTES.PRICES}
          className="text-sm text-muted-foreground hover:text-accent-gold transition-colors"
        >
          Lihat Harga Emas Hari Ini
        </Link>
      </Stack>
    </Stack>
  )
}
