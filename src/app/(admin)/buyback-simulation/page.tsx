import { Suspense } from 'react'
import BuybackSimulationView from '@/frontend/features/admin/buyback-simulation/buyback-simulation-view'

export const metadata = {
  title: 'Buyback Simulation | Emasku',
  description: 'Simulate selling your gold holdings with real-time buyback prices.',
}

export default function BuybackSimulationPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center p-8 min-h-[50vh]">
        <div className="text-muted-foreground animate-pulse">Loading simulation...</div>
      </div>
    }>
      <BuybackSimulationView />
    </Suspense>
  )
}
