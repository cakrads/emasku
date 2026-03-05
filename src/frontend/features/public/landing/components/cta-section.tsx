import { useLanguage } from '@/frontend/hooks/use-language'
import { Button } from '@/frontend/components/ui/button'
import Link from 'next/link'
import { ROUTES } from '@/frontend/config/routes'
import { ScrollReveal } from '@/frontend/components/ui/scroll-reveal'
import { Typography } from '@/frontend/components/ui/typography'
import { Stack } from '@/frontend/components/ui/layout'

export function CtaSection() {
  const { t } = useLanguage()

  return (
    <section className="relative py-24 md:py-32 bg-white dark:bg-zinc-950 overflow-hidden">
      {/* Bottom glow effect */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-accent-gold/5 dark:bg-accent-gold/10 blur-[150px] rounded-full pointer-events-none" />

      <Stack className="max-w-2xl mx-auto px-6 text-center">
        <ScrollReveal direction="up" duration={800} threshold={0.2}>
          {/* Headline */}
          <Typography variant="h2" className="text-2xl md:text-3xl font-semibold text-foreground">
            {t('landing.cta.headline')}
          </Typography>

          {/* Subheadline */}
          <Typography variant="body" className="mt-3 text-base text-foreground/70 max-w-md mx-auto">
            {t('landing.cta.subheadline')}
          </Typography>

          {/* CTA Button */}
          <Stack className="mt-8">
            <Button asChild variant="solid" color="primary" size="lg" className="animate-glow-pulse">
              <Link href={ROUTES.LOGIN}>{t('landing.cta.button')}</Link>
            </Button>
          </Stack>
        </ScrollReveal>
      </Stack>
    </section>
  )
}


