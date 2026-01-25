'use client'

import { Stack } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { Button } from '@/frontend/components/ui/button'
import Link from 'next/link'
import { ROUTES } from '@/frontend/config/routes'
import { Coins } from 'lucide-react'
import { useLanguage } from '@/frontend/hooks/use-language'

export default function HoldingsListEmpty() {
  const { t } = useLanguage()

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
          {t('holdings.emptyState.title')}
        </Typography>
        <Typography variant="body" className="text-muted-foreground">
          {t('holdings.emptyState.description')}
        </Typography>
      </Stack>

      <Stack gap="sm" className="items-center">
        <Button asChild size="lg">
          <Link href={ROUTES.ADD_HOLDING}>{t('holdings.emptyState.action')}</Link>
        </Button>
        <Link
          href={ROUTES.PRICES}
          className="text-sm text-muted-foreground hover:text-accent-gold transition-colors"
        >
          {t('holdings.emptyState.secondaryAction')}
        </Link>
      </Stack>
    </Stack>
  )
}
