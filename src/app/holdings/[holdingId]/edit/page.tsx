
import EditHoldingView from '@/frontend/features/edit-holding/edit-holding-view'

interface PageProps {
  params: Promise<{ holdingId: string }>
}

export default async function EditHoldingPage({ params }: PageProps) {
  const { holdingId } = await params
  return <EditHoldingView holdingId={holdingId} />
}
