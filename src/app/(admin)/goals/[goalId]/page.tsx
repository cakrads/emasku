import GoalDetailView from '@/frontend/features/admin/goals-detail/goal-detail-view'

export default async function Page({ params }: { params: Promise<{ goalId: string }> }) {
  const { goalId } = await params
  return <GoalDetailView goalId={goalId} />
}
