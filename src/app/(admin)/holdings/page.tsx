import { Suspense } from 'react'
import HoldingsListView from '@/frontend/features/admin/holdings-list/holdings-list-view'

function HoldingsFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<HoldingsFallback />}>
      <HoldingsListView />
    </Suspense>
  )
}
