'use client'

import React, { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft, Shield, Lock, Eye, FileText, Server, Mail, Calendar, TriangleAlert } from 'lucide-react'
import { Button } from '@/frontend/components/ui/button'
import { Card, CardContent } from '@/frontend/components/ui/card'
import { Typography } from '@/frontend/components/ui/typography'
import { Stack, Section } from '@/frontend/components/ui/layout'
import { Alert, AlertTitle, AlertDescription } from '@/frontend/components/ui/alert'
import { useLanguage } from '@/frontend/hooks/use-language'
import { cn } from '@/frontend/utils/cn'
import { StandardPageLayout } from '@/frontend/components/layout/standard-page-layout'
import { ROUTES } from '@/frontend/config/routes'
import { ErrorBoundary } from '@/frontend/components/fragments/admin/error-boundary'

export function PrivacyView() {
  const { t, language, setLanguage } = useLanguage()
  const localizedLastUpdated = new Date('2026-01-11').toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { dateStyle: 'long' })

  const identityItems = (t('privacy.sections.collectedData.identity.items') as unknown) as string[]
  const safeIdentityItems = Array.isArray(identityItems) ? identityItems : []
  const financialItems = (t('privacy.sections.collectedData.financial.items') as unknown) as string[]
  const safeFinancialItems = Array.isArray(financialItems) ? financialItems : []
  const technicalItems = (t('privacy.sections.collectedData.technical.items') as unknown) as string[]
  const safeTechnicalItems = Array.isArray(technicalItems) ? technicalItems : []
  const purposeItems = (t('privacy.sections.purpose.items') as unknown) as string[]
  const safePurposeItems = Array.isArray(purposeItems) ? purposeItems : []

  return (
    <ErrorBoundary>
    <StandardPageLayout
      title={t('privacy.title')}
      description={t('privacy.subtitle')}
      breadcrumbs={[
        { label: t('common.home'), href: ROUTES.HOME },
        { label: t('privacy.title') }
      ]}
    >
      <Stack direction="vertical" gap="xl" className="py-8">
        <Stack direction="horizontal" gap="sm" className="items-center text-sm text-muted-foreground -mt-12 mb-8">
          <Calendar className="h-4 w-4" />
          <span>{t('privacy.lastUpdated').replace('{date}', localizedLastUpdated)}</span>
        </Stack>

        {/* Education Disclaimer */}
        <Alert variant="destructive" className="bg-destructive/5 border-destructive/20 text-destructive">
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle className="font-bold">{t('privacy.demoAlert.title')}</AlertTitle>
          <AlertDescription className="text-sm opacity-90">
            {t('privacy.demoAlert.description')}
          </AlertDescription>
        </Alert>

        {/* Introduction */}
        <Section className="space-y-6 py-0">
          <Typography variant="body" className="text-lg leading-relaxed text-foreground/80">
            {t('privacy.intro')}
          </Typography>
          <Stack direction="horizontal" gap="md" className="mt-8 bg-accent-gold/5 border border-accent-gold/20 rounded-xl p-6 text-sm text-yellow-800 dark:text-yellow-200 shadow-sm">
            <Shield className="h-6 w-6 shrink-0 mt-0.5" />
            <Stack direction="vertical" gap="sm">
              <Typography variant="body" className="font-bold text-lg">{t('privacy.securityGuarantee.title')}</Typography>
              <Typography variant="body" className="leading-relaxed opacity-90">
                {t('privacy.securityGuarantee.description')}
              </Typography>
            </Stack>
          </Stack>
        </Section>

        {/* 1. Data Collection */}
        <Section className="space-y-6 py-0">
          <Stack direction="horizontal" gap="sm" className="items-center">
            <Stack direction="horizontal" className="items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm shrink-0">
              <Typography variant="body-sm">1</Typography>
            </Stack>
            <Typography variant="h2" className="text-2xl font-bold">
              {t('privacy.sections.collectedData.title')}
            </Typography>
          </Stack>
          <Card className="overflow-hidden border-muted/60">
            <CardContent className="p-0 grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
              <Stack direction="vertical" gap="md" className="p-8">
                <Stack direction="horizontal" gap="sm" className="items-center font-semibold text-primary">
                  <UserIcon className="h-5 w-5" />
                  <Typography variant="body" as="span" className="font-semibold">{t('privacy.sections.collectedData.identity.title')}</Typography>
                </Stack>
                <Stack direction="vertical" gap="sm" className="text-sm text-muted-foreground" as="ul">
                  {safeIdentityItems.map((item, i) => (
                    <Stack key={i} direction="horizontal" gap="sm" className="items-center" as="li">
                      <span>•</span>
                      <Typography variant="body-sm">{item}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
              <Stack direction="vertical" gap="md" className="p-8">
                <Stack direction="horizontal" gap="sm" className="items-center font-semibold text-positive">
                  <WalletIcon className="h-5 w-5" />
                  <Typography variant="body" as="span" className="font-semibold">{t('privacy.sections.collectedData.financial.title')}</Typography>
                </Stack>
                <Stack direction="vertical" gap="sm" className="text-sm text-muted-foreground" as="ul">
                  {safeFinancialItems.map((item, i) => (
                    <Stack key={i} direction="horizontal" gap="sm" className="items-center" as="li">
                      <span>•</span>
                      <Typography variant="body-sm">{item}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
              <Stack direction="vertical" gap="md" className="p-8">
                <Stack direction="horizontal" gap="sm" className="items-center font-semibold text-purple-600 dark:text-purple-400">
                  <Server className="h-5 w-5" />
                  <Typography variant="body" as="span" className="font-semibold">{t('privacy.sections.collectedData.technical.title')}</Typography>
                </Stack>
                <Stack direction="vertical" gap="sm" className="text-sm text-muted-foreground" as="ul">
                  {safeTechnicalItems.map((item, i) => (
                    <Stack key={i} direction="horizontal" gap="sm" className="items-center" as="li">
                      <span>•</span>
                      <Typography variant="body-sm">{item}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Section>

        {/* 2. Purpose */}
        <Section className="space-y-6 py-0">
          <Stack direction="horizontal" gap="sm" className="items-center">
            <Stack direction="horizontal" className="items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm shrink-0">
              <Typography variant="body-sm">2</Typography>
            </Stack>
            <Typography variant="h2" className="text-2xl font-bold">
              {t('privacy.sections.purpose.title')}
            </Typography>
          </Stack>
          <div className="grid sm:grid-cols-2 gap-4">
            {safePurposeItems.map((item, i) => (
              <Stack key={i} direction="horizontal" gap="sm" className="items-center p-4 rounded-lg bg-muted/30 border border-muted/50">
                <Stack direction="horizontal" className="w-1.5 h-1.5 rounded-full bg-accent-gold shadow-[0_0_8px_rgba(212,175,55,0.5)] shrink-0" />
                <Typography variant="body-sm" className="font-medium">{item}</Typography>
              </Stack>
            ))}
          </div>
        </Section>

        {/* 3. User Rights (UU PDP) */}
        <Section className="space-y-6 py-0">
          <Stack direction="horizontal" gap="sm" className="items-center">
            <Stack direction="horizontal" className="items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm shrink-0">
              <Typography variant="body-sm">3</Typography>
            </Stack>
            <Typography variant="h2" className="text-2xl font-bold">
              {t('privacy.sections.rights.title')}
            </Typography>
          </Stack>
          <div className="grid md:grid-cols-2 gap-4">
            <RightCard icon={Eye} title={t('privacy.sections.rights.access.title')} desc={t('privacy.sections.rights.access.description')} />
            <RightCard icon={FileText} title={t('privacy.sections.rights.correction.title')} desc={t('privacy.sections.rights.correction.description')} />
            <RightCard icon={Lock} title={t('privacy.sections.rights.deletion.title')} desc={t('privacy.sections.rights.deletion.description')} />
            <RightCard icon={Shield} title={t('privacy.sections.rights.withdrawal.title')} desc={t('privacy.sections.rights.withdrawal.description')} />
          </div>
          <Typography variant="body-sm" className="text-muted-foreground p-4 rounded-lg bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-900/20 italic">
            {renderWithBold(String(t('privacy.sections.rights.note')), ['Profil > Privasi & Data', 'Profile > Privacy & Data'])}
          </Typography>
        </Section>

        {/* 4. Data Retention */}
        <Section className="space-y-6 py-0">
          <Stack direction="horizontal" gap="sm" className="items-center">
            <Stack direction="horizontal" className="items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm shrink-0">
              <Typography variant="body-sm">4</Typography>
            </Stack>
            <Typography variant="h2" className="text-2xl font-bold">
              {t('privacy.sections.retention.title')}
            </Typography>
          </Stack>
          <Typography variant="body" className="leading-relaxed text-muted-foreground">
            {renderWithBold(String(t('privacy.sections.retention.description')), ['5 tahun', '5 years', 'AES-256', 'TLS 1.3'])}
          </Typography>
        </Section>

        {/* 5. Contact */}
        <Section className="space-y-6 pt-12 border-t py-0">
          <Typography variant="h2" className="text-xl font-bold">{t('privacy.sections.contact.title')}</Typography>
          <div className="grid md:grid-cols-2 gap-8">
            <address className="not-italic space-y-4">
              <Stack direction="vertical" gap="xs">
                <Typography variant="caption" className="text-xs uppercase tracking-widest text-muted-foreground font-bold">{t('privacy.sections.contact.privacyTeam')}</Typography>
                <Typography variant="body" className="text-lg font-semibold">{t('privacy.sections.contact.dpo')}</Typography>
              </Stack>
              <Stack direction="vertical" gap="sm" className="text-sm text-foreground/80">
                <Stack direction="horizontal" gap="sm" className="items-center">
                  <Mail className="h-4 w-4 text-accent-gold" />
                  <a href="mailto:privacy@emasku.com" className="hover:text-accent-gold transition-colors">privacy@emasku.com</a>
                </Stack>
                <Stack direction="horizontal" gap="sm" className="items-center">
                  <FileText className="h-4 w-4 text-accent-gold" />
                  <span>{t('privacy.sections.contact.location')}</span>
                </Stack>
              </Stack>
            </address>
            <Stack direction="vertical" className="bg-muted/30 p-6 rounded-xl border border-muted/50 text-xs text-muted-foreground leading-relaxed">
              <Typography variant="caption" className="leading-relaxed">
                {t('privacy.sections.contact.processingTime')}
              </Typography>
            </Stack>
          </div>
        </Section>
      </Stack>
    </StandardPageLayout>
    </ErrorBoundary>
  )
}


/** Bolds specific patterns in a plain-text string, returning JSX. */
function renderWithBold(text: string, patterns: string[]): ReactNode {
  type Part = string | React.ReactElement
  let parts: Part[] = [text]
  patterns.forEach((pattern, pi) => {
    const next: Part[] = []
    parts.forEach((part, i) => {
      if (typeof part !== 'string') { next.push(part); return }
      const segments = part.split(pattern)
      segments.forEach((seg, si) => {
        if (seg) next.push(seg)
        if (si < segments.length - 1) next.push(<strong key={`${pi}-${i}-${si}`}>{pattern}</strong>)
      })
    })
    parts = next
  })
  return <>{parts}</>
}

function RightCard({ icon: Icon, title, desc }: { icon: React.ElementType, title: string, desc: string }) {
  return (
    <Stack direction="horizontal" gap="sm" className="border rounded-lg p-4 items-start hover:bg-accent/5 transition-colors">
      <Stack direction="horizontal" className="bg-primary/10 p-2 rounded-full shrink-0 items-center justify-center">
        <Icon className="h-4 w-4 text-primary" />
      </Stack>
      <Stack direction="vertical" gap="xs">
        <Typography variant="body-sm" className="font-medium">{title}</Typography>
        <Typography variant="caption" className="text-muted-foreground mt-1">{desc}</Typography>
      </Stack>
    </Stack>
  )
}

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function WalletIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </svg>
  )
}
