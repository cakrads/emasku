/**
 * GET /api/v1/goals/{id}
 * PUT /api/v1/goals/{id}
 * DELETE /api/v1/goals/{id}
 */

import { wrapController } from '@/applications/shared/lib/controller-wrapper'
import { GoalController } from '@/applications/modules/goals/v1/delivery/http/goal-controller'
import { PrismaGoalRepository } from '@/applications/shared/persistence/repositories/prisma-goal-repository'
import { PrismaPriceRepository } from '@/applications/shared/persistence/repositories/prisma-price-repository'
import { prisma } from '@/applications/shared/persistence/prisma-client'

const goalRepo = new PrismaGoalRepository(prisma)
const priceRepo = new PrismaPriceRepository(prisma)
const controller = new GoalController(goalRepo, priceRepo, prisma)

export const GET = wrapController(async (req) => {
    const id = req.nextUrl.pathname.split('/').pop()!
    return controller.getGoalDetail(req, id)
})

export const PUT = wrapController(async (req) => {
    const id = req.nextUrl.pathname.split('/').pop()!
    return controller.updateGoal(req, id)
})

export const DELETE = wrapController(async (req) => {
    const id = req.nextUrl.pathname.split('/').pop()!
    return controller.deleteGoal(req, id)
})
