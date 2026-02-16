/**
 * List Goals Usecase
 * 
 * Fetches all goals for a user with summary data
 * (holding count, current value, progress).
 */

import { Decimal } from 'decimal.js'
import { logger } from '@/applications/shared/lib/logger'
import { PrismaGoalRepository } from '@/applications/shared/persistence/repositories/prisma-goal-repository'
import { PrismaPriceRepository } from '@/applications/shared/persistence/repositories/prisma-price-repository'
import { GoalSummaryDomain } from '../domain/goal.domain'

export class ListGoalsUsecase {
    constructor(
        private goalRepo: PrismaGoalRepository,
        private priceRepo: PrismaPriceRepository,
    ) { }

    async execute(userId: string): Promise<GoalSummaryDomain[]> {
        logger.info('Listing goals with summaries', { userId })

        const goals = await this.goalRepo.findAllByUserId(userId)

        const summaries: GoalSummaryDomain[] = []

        for (const goal of goals) {
            const holdings = await this.goalRepo.findHoldingsByGoalId(goal.id)

            // Calculate total current value from holdings
            let totalCurrentValue = new Decimal(0)

            for (const holding of holdings) {
                // Get latest BUYBACK price for this brand + denomination
                const priceResult = await this.priceRepo.getLatestBuybackPrice(
                    holding.brandCode,
                    holding.denominationGram,
                )

                if (priceResult) {
                    const holdingValue = new Decimal(priceResult.price).times(holding.quantity)
                    totalCurrentValue = totalCurrentValue.plus(holdingValue)
                }
            }

            const currentValueNum = totalCurrentValue.toNumber()

            // Calculate progress percentage
            let progressPercentage: number | null = null
            let isAchieved = false

            if (goal.targetAmount != null && goal.targetAmount > 0) {
                progressPercentage = new Decimal(currentValueNum)
                    .dividedBy(goal.targetAmount)
                    .times(100)
                    .toDecimalPlaces(2)
                    .toNumber()
                isAchieved = progressPercentage >= 100
            }

            summaries.push({
                ...goal,
                holdingCount: holdings.length,
                totalCurrentValue: currentValueNum,
                progressPercentage,
                isAchieved,
            })
        }

        logger.info('Goals listed', { userId, count: summaries.length })
        return summaries
    }
}
