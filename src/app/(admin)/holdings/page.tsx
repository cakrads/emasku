import { Suspense } from 'react'
import HoldingsListView from '@/frontend/features/admin/holdings-list/holdings-list-view'

export default function Page() {
  return (
    <Suspense>
      <HoldingsListView />
    </Suspense>
  )
}
