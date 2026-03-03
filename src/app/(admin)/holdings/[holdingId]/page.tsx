import HoldingDetailView from '@/frontend/features/admin/holdings-detail/holding-detail-view'

interface PageProps {
  params: Promise<{ holdingId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ params, searchParams }: PageProps) {
  const { holdingId } = await params
  const { backUrl } = await searchParams

  return <HoldingDetailView holdingId={holdingId} backUrl={backUrl as string} />
}
