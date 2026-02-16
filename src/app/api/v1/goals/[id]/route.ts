/**
 * GET /api/v1/goals/{id}
 * PUT /api/v1/goals/{id}
 * DELETE /api/v1/goals/{id}
 */

import { wrapController } from '@/applications/shared/lib/controller-wrapper'
import { GoalController } from '@/applications/modules/goals/v1/delivery/http/goal-controller'

export const GET = wrapController(async (req) => {
    const controller = new GoalController()
    const id = req.nextUrl.pathname.split('/').pop()!
    return controller.getGoalDetail(req, id)
})

export const PUT = wrapController(async (req) => {
    const controller = new GoalController()
    const id = req.nextUrl.pathname.split('/').pop()!
    return controller.updateGoal(req, id)
})

export const DELETE = wrapController(async (req) => {
    const controller = new GoalController()
    const id = req.nextUrl.pathname.split('/').pop()!
    return controller.deleteGoal(req, id)
})
