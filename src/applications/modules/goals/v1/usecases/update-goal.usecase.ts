/**
 * Update Goal Usecase
 * 
 * Business logic for updating existing goals.
 */

import { NotFoundError } from '@/applications/shared/lib/errors'
import { logger } from '@/applications/shared/lib/logger'
import { PrismaGoalRepository } from '@/applications/shared/persistence/repositories/prisma-goal-repository'
import { UpdateGoalRequest } from '@/shared/contracts/goals.contract'
import { GoalDomain } from '../domain/goal.domain'

export class UpdateGoalUsecase {
    constructor(private goalRepo: PrismaGoalRepository) { }

    async execute(userId: string, goalId: string, request: UpdateGoalRequest): Promise<GoalDomain> {
        logger.info('Updating goal', { userId, goalId })

        // Check goal exists
        const existing = await this.goalRepo.findById(goalId)
        if (!existing || existing.userId !== userId) {
            throw new NotFoundError('Goal not found')
        }

        const goal = await this.goalRepo.update(userId, goalId, {
            name: request.name,
            description: request.description,
            targetAmount: request.targetAmount,
            targetDate: request.targetDate != null ? new Date(request.targetDate) : request.targetDate,
        })

        logger.info('Goal updated successfully', { goalId })
        return goal
    }
}
