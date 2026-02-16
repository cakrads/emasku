import GoalEditView from '@/frontend/features/admin/goals-edit/goal-edit-view'

export default async function Page({ params }: { params: Promise<{ goalId: string }> }) {
    const { goalId } = await params
    return <GoalEditView goalId={goalId} />
}
