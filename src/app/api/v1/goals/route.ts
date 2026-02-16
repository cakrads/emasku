/**
 * GET /api/v1/goals
 * POST /api/v1/goals
 */

import { wrapController } from '@/applications/shared/lib/controller-wrapper'
import { GoalController } from '@/applications/modules/goals/v1/delivery/http/goal-controller'

export const GET = wrapController(async (req) => {
    const controller = new GoalController()
    return controller.listGoals(req)
})

export const POST = wrapController(async (req) => {
    const controller = new GoalController()
    return controller.createGoal(req)
})
