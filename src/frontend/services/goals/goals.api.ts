/**
 * Goals API Client
 * 
 * Fetches goal data from backend API.
 */

import { fetchJson } from '@/frontend/utils/api-client'
import {
    GoalList,
    GoalListSchema,
    GoalDetail,
    GoalDetailSchema,
    CreateGoalRequest,
    CreateGoalResponse,
    CreateGoalResponseSchema,
    UpdateGoalRequest,
    UpdateGoalResponse,
    UpdateGoalResponseSchema,
} from '@/shared/contracts/goals.contract'

/**
 * Fetch all goals for the current user
 */
export async function fetchGoals(): Promise<GoalList> {
    const data = await fetchJson<unknown>('/api/v1/goals')
    return GoalListSchema.parse(data)
}

/**
 * Fetch goal detail by ID
 */
export async function fetchGoalDetail(id: string): Promise<GoalDetail> {
    const data = await fetchJson<unknown>(`/api/v1/goals/${id}`)
    return GoalDetailSchema.parse(data)
}

/**
 * Create a new goal
 */
export async function createGoal(request: CreateGoalRequest): Promise<CreateGoalResponse> {
    const data = await fetchJson<unknown>('/api/v1/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    })
    return CreateGoalResponseSchema.parse(data)
}

/**
 * Update an existing goal
 */
export async function updateGoal(id: string, request: UpdateGoalRequest): Promise<UpdateGoalResponse> {
    const data = await fetchJson<unknown>(`/api/v1/goals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    })
    return UpdateGoalResponseSchema.parse(data)
}

/**
 * Delete a goal
 */
export async function deleteGoal(id: string): Promise<void> {
    await fetchJson<unknown>(`/api/v1/goals/${id}`, {
        method: 'DELETE',
    })
}
