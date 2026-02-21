/**
 * Update Goal Usecase
 * 
 * Business logic for updating existing goals.
 */

import { Decimal } from 'decimal.js'
import { NotFoundError } from '@/applications/shared/lib/errors'
import { logger } from '@/applications/shared/lib/logger'
import { PrismaGoalRepository } from '@/applications/shared/persistence/repositories/prisma-goal-repository'
import { PrismaPriceRepository } from '@/applications/shared/persistence/repositories/prisma-price-repository'
import { UpdateGoalRequest } from '@/shared/contracts/goals.contract'
import { GoalDomain } from '../domain/goal.domain'

export class UpdateGoalUsecase {
    constructor(
        private goalRepo: PrismaGoalRepository,
        private priceRepo: PrismaPriceRepository,
    ) { }

    async execute(userId: string, goalId: string, request: UpdateGoalRequest): Promise<GoalDomain> {
        logger.info('Updating goal', { userId, goalId })

        // Check goal exists
        const existing = await this.goalRepo.findById(goalId)
        if (!existing || existing.userId !== userId) {
            throw new NotFoundError('Goal not found')
        }

        let completedAt: Date | null | undefined = undefined
        let completedValue: number | null | undefined = undefined

        if (request.lifecycleStatus === 'COMPLETED' && existing.lifecycleStatus !== 'COMPLETED') {
            completedAt = new Date()

            // Snapshot: calculate total holdings value at this moment
            const holdings = await this.goalRepo.findHoldingsByGoalId(goalId)
            let totalValue = new Decimal(0)

            for (const holding of holdings) {
                if (holding.status === 'SOLD' && holding.sellPrice) {
                    totalValue = totalValue.plus(
                        new Decimal(holding.sellPrice).times(holding.quantity)
                    )
                } else {
                    const priceResult = await this.priceRepo.getLatestBuybackPrice(
                        holding.brandCode,
                        holding.denominationGram,
                    )
                    if (priceResult) {
                        totalValue = totalValue.plus(
                            new Decimal(priceResult.price).times(holding.quantity)
                        )
                    }
                }
            }

            completedValue = totalValue.toNumber()
            logger.info('Goal completion snapshot', { goalId, completedValue, holdingCount: holdings.length })
        } else if (request.lifecycleStatus === 'ACTIVE' && existing.lifecycleStatus !== 'ACTIVE') {
            // Reopening: clear snapshot
            completedAt = null
            completedValue = null
        }

        const goal = await this.goalRepo.update(userId, goalId, {
            name: request.name,
            description: request.description,
            targetAmount: request.targetAmount,
            targetDate: request.targetDate != null ? new Date(request.targetDate) : request.targetDate,
            lifecycleStatus: request.lifecycleStatus,
            completedAt,
            completedValue,
        })

        logger.info('Goal updated successfully', { goalId })
        return goal
    }
}
