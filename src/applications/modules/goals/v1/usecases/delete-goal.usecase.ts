/**
 * Delete Goal Usecase
 * 
 * Business logic for deleting goals.
 * Unlinks any associated holdings before deletion.
 */

import { NotFoundError } from '@/applications/shared/lib/errors'
import { logger } from '@/applications/shared/lib/logger'
import { IGoalRepository } from '../domain/goal.repository'

export class DeleteGoalUsecase {
    constructor(private goalRepo: IGoalRepository) { }

    async execute(userId: string, goalId: string): Promise<void> {
        logger.info('Deleting goal', { userId, goalId })

        // Check goal exists
        const existing = await this.goalRepo.findById(goalId)
        if (!existing || existing.userId !== userId) {
            throw new NotFoundError('Goal not found', { goalId })
        }

        // Unlink any associated holdings (set goalId to null)
        const hasHoldings = await this.goalRepo.hasLinkedHoldings(goalId)
        if (hasHoldings) {
            await this.goalRepo.unlinkHoldings(goalId)
            logger.info('Unlinked holdings before goal deletion', { goalId })
        }

        await this.goalRepo.delete(userId, goalId)
        logger.info('Goal deleted successfully', { goalId })
    }
}
