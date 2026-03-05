/**
 * Update Goal Usecase
 * 
 * Business logic for updating existing goals.
 */

import { Decimal } from 'decimal.js'
import { NotFoundError, ValidationError } from '@/applications/shared/lib/errors'
import { logger } from '@/applications/shared/lib/logger'
import { IGoalRepository } from '../domain/goal.repository'
import { IPriceRepository } from '@/applications/shared/domain/price.contract'
import { UpdateGoalRequest } from '@/shared/contracts/goals.contract'
import { GoalDomain } from '../domain/goal.domain'

export class UpdateGoalUsecase {
    constructor(
        private readonly goalRepo: IGoalRepository,
        private readonly priceRepo: IPriceRepository
    ) { }

    async execute(userId: string, goalId: string, request: UpdateGoalRequest): Promise<GoalDomain> {
        logger.info('Updating goal', { userId, goalId })

        // Check goal exists
        const existing = await this.goalRepo.findById(goalId)
        if (!existing || existing.userId !== userId) {
            throw new NotFoundError('Goal not found', { goalId })
        }

        let completedAt: Date | null | undefined = undefined
        let completedValue: number | bigint | null | undefined = undefined

        if (request.lifecycleStatus === 'COMPLETED' && existing.lifecycleStatus !== 'COMPLETED') {
            // [0095] Wrap completion in transaction to prevent race conditions
            return await this.goalRepo.executeInTransaction(async (tx) => {
                // Re-fetch goal within transaction to ensure it hasn't changed
                const goalInTx = await this.goalRepo.findById(goalId, tx)
                if (!goalInTx || goalInTx.userId !== userId) {
                    throw new NotFoundError('Goal not found in transaction', { goalId })
                }
                if (goalInTx.lifecycleStatus === 'COMPLETED') {
                    return goalInTx // Already completed by another request
                }

                completedAt = new Date()

                // Snapshot: calculate total holdings value at this moment within transaction
                const holdings = await this.goalRepo.findHoldingsByGoalId(goalId, tx)
                let totalValue = new Decimal(0)

                for (const holding of holdings) {
                    if (holding.status === 'SOLD' && holding.sellPrice) {
                        totalValue = totalValue.plus(
                            new Decimal(holding.sellPrice.toString()).times(holding.quantity)
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

                completedValue = BigInt(totalValue.toFixed(0))
                logger.info('Goal completion snapshot (atomic)', { goalId, completedValue, holdingCount: holdings.length })

                const targetDate = this.parseTargetDate(request.targetDate)

                return await this.goalRepo.update(userId, goalId, {
                    name: request.name,
                    description: request.description,
                    targetAmount: request.targetAmount,
                    targetDate,
                    lifecycleStatus: request.lifecycleStatus,
                    completedAt,
                    completedValue,
                }, tx)
            })
        }

        // Standard update (not completion status change)
        if (request.lifecycleStatus === 'ACTIVE' && existing.lifecycleStatus !== 'ACTIVE') {
            // Reopening: clear snapshot
            completedAt = null
            completedValue = null
        }

        const targetDate = this.parseTargetDate(request.targetDate)

        const goal = await this.goalRepo.update(userId, goalId, {
            name: request.name,
            description: request.description,
            targetAmount: request.targetAmount,
            targetDate,
            lifecycleStatus: request.lifecycleStatus,
            completedAt,
            completedValue,
        })

        logger.info('Goal updated successfully', { goalId })
        return goal
    }

    private parseTargetDate(targetDateReq: string | null | undefined): Date | null | undefined {
        if (targetDateReq === undefined) return undefined
        if (targetDateReq === null) return null

        const parsedDate = new Date(targetDateReq)
        if (isNaN(parsedDate.getTime())) {
            throw new ValidationError('Invalid target date format', {
                targetDate: 'Must be a valid ISO date string'
            })
        }
        return parsedDate
    }
}
