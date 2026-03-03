import { useMemo } from 'react'
import { GoalSummary, GoalList } from '@/shared/contracts/goals.contract'

export type GoalStatus = 'achieved' | 'in-progress' | 'no-target' | 'completed'
export type FilterType = 'all' | 'achieved' | 'in-progress' | 'no-target' | 'completed'

export interface GoalWithStatus extends GoalSummary {
    status: GoalStatus
}

export function deriveGoalStatus(goal: GoalSummary): GoalStatus {
    if (goal.lifecycleStatus === 'COMPLETED') return 'completed'
    if (goal.targetAmount == null) return 'no-target'
    if (goal.isAchieved) return 'achieved'
    return 'in-progress'
}

const STATUS_ORDER: Record<GoalStatus, number> = {
    'in-progress': 0,
    'achieved': 1,
    'no-target': 2,
    'completed': 3,
}

export function useGoalsList(data: GoalList | undefined, activeFilter: FilterType) {
    const processedGoals = useMemo<GoalWithStatus[]>(() => {
        if (!data?.goals) return []

        const withStatus = data.goals.map((goal) => ({
            ...goal,
            status: deriveGoalStatus(goal),
        }))

        const filtered = activeFilter === 'all'
            ? withStatus
            : withStatus.filter((g) => g.status === activeFilter)

        return filtered.sort((a, b) => {
            const orderDiff = STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
            if (orderDiff !== 0) return orderDiff
            if (a.status === 'in-progress' && b.status === 'in-progress') {
                return (a.progressPercentage ?? 0) - (b.progressPercentage ?? 0)
            }
            return 0
        })
    }, [data, activeFilter])

    const counts = useMemo(() => {
        if (!data?.goals) return { all: 0, achieved: 0, 'in-progress': 0, 'no-target': 0, completed: 0 }
        const goals = data.goals
        return {
            all: goals.length,
            achieved: goals.filter((g) => deriveGoalStatus(g) === 'achieved').length,
            'in-progress': goals.filter((g) => deriveGoalStatus(g) === 'in-progress').length,
            'no-target': goals.filter((g) => deriveGoalStatus(g) === 'no-target').length,
            completed: goals.filter((g) => deriveGoalStatus(g) === 'completed').length,
        }
    }, [data])

    return { processedGoals, counts }
}
