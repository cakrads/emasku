/**
 * GET /api/v1/goals
 * POST /api/v1/goals
 */

import { wrapController } from '@/applications/shared/lib/controller-wrapper'
import { GoalController } from '@/applications/modules/goals/v1/delivery/http/goal-controller'
import { PrismaGoalRepository } from '@/applications/shared/persistence/repositories/prisma-goal-repository'
import { PrismaPriceRepository } from '@/applications/shared/persistence/repositories/prisma-price-repository'
import { prisma } from '@/applications/shared/persistence/prisma-client'

const goalRepo = new PrismaGoalRepository(prisma)
const priceRepo = new PrismaPriceRepository(prisma)
const controller = new GoalController(goalRepo, priceRepo)

export const GET = wrapController(async (req) => {
    return controller.listGoals(req)
})

export const POST = wrapController(async (req) => {
    return controller.createGoal(req)
})
