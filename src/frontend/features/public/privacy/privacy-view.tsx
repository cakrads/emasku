'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Shield, Lock, Eye, FileText, Server, Mail, Calendar, TriangleAlert } from 'lucide-react'
import { Button } from '@/frontend/components/ui/button'
import { Card, CardContent } from '@/frontend/components/ui/card'
import { Typography } from '@/frontend/components/ui/typography'
import { Alert, AlertTitle, AlertDescription } from '@/frontend/components/ui/alert'
import { useLanguage } from '@/frontend/hooks/use-language'
import { cn } from '@/frontend/utils/cn'
import { StandardPageLayout } from '@/frontend/components/layout/standard-page-layout'
import { ROUTES } from '@/frontend/config/routes'

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
    <StandardPageLayout
      title={t('privacy.title')}
      description={t('privacy.subtitle')}
      breadcrumbs={[
        { label: t('common.home'), href: ROUTES.HOME },
        { label: t('privacy.title') }
      ]}
    >
      <div className="space-y-16 py-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground -mt-12 mb-8">
          <Calendar className="h-4 w-4" />
          <span>{t('privacy.lastUpdated').replace('{date}', localizedLastUpdated)}</span>
        </div>

        {/* Education Disclaimer */}
        <Alert variant="destructive" className="bg-destructive/5 border-destructive/20 text-destructive dark:text-red-400">
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle className="font-bold">{t('privacy.demoAlert.title')}</AlertTitle>
          <AlertDescription className="text-sm opacity-90">
            {t('privacy.demoAlert.description')}
          </AlertDescription>
        </Alert>

        {/* Introduction */}
        <section className="space-y-6">
          <Typography variant="body" className="text-lg leading-relaxed text-foreground/80">
            {t('privacy.intro')}
          </Typography>
          <div className="mt-8 bg-accent-gold/5 border border-accent-gold/20 rounded-xl p-6 flex gap-4 text-sm text-yellow-800 dark:text-yellow-200 shadow-sm">
            <Shield className="h-6 w-6 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="font-bold text-lg">{t('privacy.securityGuarantee.title')}</p>
              <p className="leading-relaxed opacity-90 text-base">
                {t('privacy.securityGuarantee.description')}
              </p>
            </div>
          </div>
        </section>

        {/* 1. Data Collection */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">1</span>
            {t('privacy.sections.collectedData.title')}
          </h2>
          <Card className="overflow-hidden border-muted/60">
            <CardContent className="p-0 grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
              <div className="p-8 space-y-4">
                <div className="flex items-center gap-2 font-semibold text-blue-600 dark:text-blue-400">
                  <UserIcon className="h-5 w-5" />
                  <h3>{t('privacy.sections.collectedData.identity.title')}</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {safeIdentityItems.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">• {item}</li>
                  ))}
                </ul>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex items-center gap-2 font-semibold text-green-600 dark:text-green-400">
                  <WalletIcon className="h-5 w-5" />
                  <h3>{t('privacy.sections.collectedData.financial.title')}</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {safeFinancialItems.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">• {item}</li>
                  ))}
                </ul>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex items-center gap-2 font-semibold text-purple-600 dark:text-purple-400">
                  <Server className="h-5 w-5" />
                  <h3>{t('privacy.sections.collectedData.technical.title')}</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {safeTechnicalItems.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">• {item}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 2. Purpose */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">2</span>
            {t('privacy.sections.purpose.title')}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {safePurposeItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-lg bg-muted/30 border border-muted/50">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-gold shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 3. User Rights (UU PDP) */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">3</span>
            {t('privacy.sections.rights.title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <RightCard icon={Eye} title={t('privacy.sections.rights.access.title')} desc={t('privacy.sections.rights.access.description')} />
            <RightCard icon={FileText} title={t('privacy.sections.rights.correction.title')} desc={t('privacy.sections.rights.correction.description')} />
            <RightCard icon={Lock} title={t('privacy.sections.rights.deletion.title')} desc={t('privacy.sections.rights.deletion.description')} />
            <RightCard icon={Shield} title={t('privacy.sections.rights.withdrawal.title')} desc={t('privacy.sections.rights.withdrawal.description')} />
          </div>
          <p className="text-sm text-muted-foreground p-4 rounded-lg bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-900/20 italic"
            dangerouslySetInnerHTML={{ __html: t('privacy.sections.rights.note').replace('Profil > Privasi & Data', '<strong>Profil > Privasi & Data</strong>') }} />
        </section>

        {/* 4. Data Retention */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">4</span>
            {t('privacy.sections.retention.title')}
          </h2>
          <Typography variant="body" className="leading-relaxed text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: t('privacy.sections.retention.description').replace('5 tahun', '<strong>5 tahun</strong>').replace('AES-256', '<strong>AES-256</strong>').replace('TLS 1.3', '<strong>TLS 1.3</strong>') }} />
        </section>

        {/* 5. Contact */}
        <section className="space-y-6 pt-12 border-t">
          <h2 className="text-xl font-bold">{t('privacy.sections.contact.title')}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <address className="not-italic space-y-4">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">{t('privacy.sections.contact.privacyTeam')}</p>
                <p className="text-lg font-semibold">{t('privacy.sections.contact.dpo')}</p>
              </div>
              <div className="space-y-2 text-sm text-foreground/80">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-accent-gold" />
                  <a href="mailto:privacy@emasku.com" className="hover:text-accent-gold transition-colors">privacy@emasku.com</a>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-accent-gold" />
                  <span>{t('privacy.sections.contact.location')}</span>
                </div>
              </div>
            </address>
            <div className="bg-muted/30 p-6 rounded-xl border border-muted/50 text-xs text-muted-foreground leading-relaxed">
              <p>
                {t('privacy.sections.contact.processingTime')}
              </p>
            </div>
          </div>
        </section>
      </div>
    </StandardPageLayout>
  )
}


function RightCard({ icon: Icon, title, desc }: { icon: React.ElementType, title: string, desc: string }) {
  return (
    <div className="border rounded-lg p-4 flex gap-3 items-start hover:bg-accent/5 transition-colors">
      <div className="bg-primary/10 p-2 rounded-full shrink-0">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div>
        <h4 className="font-medium text-sm">{title}</h4>
        <p className="text-xs text-muted-foreground mt-1">{desc}</p>
      </div>
    </div>
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
