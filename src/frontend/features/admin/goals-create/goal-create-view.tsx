'use client'

import { StandardPageLayout } from '@/frontend/components/layout/standard-page-layout'
import { ErrorBoundary } from '@/frontend/components/fragments/admin/error-boundary'
import { ROUTES } from '@/frontend/config/routes'
import { useLanguage } from '@/frontend/hooks/use-language'
import { GoalCreateForm } from './components/goal-create-form'

export default function GoalCreateView() {
    const { t } = useLanguage()
    return (
        <StandardPageLayout
            title={t('goals.createTitle')}
            description={t('goals.list.description')}
            breadcrumbs={[
                { label: t('navbar.dashboard'), href: ROUTES.DASHBOARD },
                { label: t('goals.title'), href: ROUTES.GOALS_LIST },
                { label: t('goals.createTitle') },
            ]}
        >
            <ErrorBoundary>
                <GoalCreateForm mode="page" />
            </ErrorBoundary>
        </StandardPageLayout>
    )
}
