import { Suspense } from 'react'
import HoldingsListView from '@/frontend/features/holdings-list/holdings-list-view'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <HoldingsListView />
    </Suspense>
  )
}
