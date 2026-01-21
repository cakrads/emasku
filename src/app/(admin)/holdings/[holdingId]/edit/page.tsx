
import EditHoldingView from '@/frontend/features/admin/holdings-edit/edit-holding-view'

interface PageProps {
  params: Promise<{ holdingId: string }>
}

export default async function EditHoldingPage({ params }: PageProps) {
  const { holdingId } = await params
  return <EditHoldingView holdingId={holdingId} />
}
