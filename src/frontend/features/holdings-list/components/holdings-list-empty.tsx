'use client'

import { Stack } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { Button } from '@/frontend/components/ui/button'
import Link from 'next/link'
import { ROUTES } from '@/frontend/config/routes'
import { Coins } from 'lucide-react'

export default function HoldingsListEmpty() {
  return (
    <Stack
      gap="lg"
      className="items-center justify-center text-center py-16 px-4"
    >
      <div className="w-20 h-20 rounded-full bg-accent-gold/10 flex items-center justify-center">
        <Coins className="w-10 h-10 text-accent-gold" />
      </div>

      <Stack gap="xs" className="items-center max-w-md">
        <Typography variant="h3" className="text-foreground">
          Belum ada emas di portofoliomu
        </Typography>
        <Typography variant="body" className="text-muted-foreground">
          Mulai lacak investasi emasmu dengan menambahkan holding pertama. Kamu bisa melacak nilai, pergerakan, dan performa portofolio secara real-time.
        </Typography>
      </Stack>

      <Stack gap="sm" className="items-center">
        <Button asChild color="primary" size="lg">
          <Link href={ROUTES.ADD_HOLDING}>Tambah Emas Pertama</Link>
        </Button>
        <Link
          href={ROUTES.PRICES}
          className="text-sm text-muted-foreground hover:text-accent-gold transition-colors"
        >
          Atau lihat harga emas hari ini
        </Link>
      </Stack>
    </Stack>
  )
}
