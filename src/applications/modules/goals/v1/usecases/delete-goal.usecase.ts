/**
 * Delete Goal Usecase
 * 
 * Business logic for deleting goals.
 * Enforces: cannot delete goal with linked holdings.
 */

import { NotFoundError, ValidationError } from '@/applications/shared/lib/errors'
import { logger } from '@/applications/shared/lib/logger'
import { PrismaGoalRepository } from '@/applications/shared/persistence/repositories/prisma-goal-repository'

export class DeleteGoalUsecase {
    constructor(private goalRepo: PrismaGoalRepository) { }

    async execute(userId: string, goalId: string): Promise<void> {
        logger.info('Deleting goal', { userId, goalId })

        // Check goal exists
        const existing = await this.goalRepo.findById(goalId)
        if (!existing || existing.userId !== userId) {
            throw new NotFoundError('Goal not found')
        }

        // Check no linked holdings
        const hasHoldings = await this.goalRepo.hasLinkedHoldings(goalId)
        if (hasHoldings) {
            throw new ValidationError('Cannot delete goal', {
                goal: 'Goal still has linked holdings. Remove all holdings from this goal before deleting.',
            })
        }

        await this.goalRepo.delete(userId, goalId)
        logger.info('Goal deleted successfully', { goalId })
    }
}
