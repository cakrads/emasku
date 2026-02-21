/**
 * Get Goal Detail Usecase
 * 
 * Fetches a single goal with linked holdings and progress data.
 */

import { Decimal } from 'decimal.js'
import { NotFoundError } from '@/applications/shared/lib/errors'
import { logger } from '@/applications/shared/lib/logger'
import { PrismaGoalRepository } from '@/applications/shared/persistence/repositories/prisma-goal-repository'
import { PrismaPriceRepository } from '@/applications/shared/persistence/repositories/prisma-price-repository'
import { GoalSummaryDomain } from '../domain/goal.domain'

export interface GoalDetailResult extends GoalSummaryDomain {
    totalInvestedValue: number
    holdings: Array<{
        id: string
        brandCode: string
        brandName: string
        denominationGram: number
        quantity: number
        currentValue: number | null
        status: string
        isSold: boolean
        soldDate: string | null
    }>
}

export class GetGoalDetailUsecase {
    constructor(
        private goalRepo: PrismaGoalRepository,
        private priceRepo: PrismaPriceRepository,
    ) { }

    async execute(userId: string, goalId: string): Promise<GoalDetailResult> {
        logger.info('Getting goal detail', { userId, goalId })

        const goal = await this.goalRepo.findById(goalId)
        if (!goal || goal.userId !== userId) {
            throw new NotFoundError('Goal not found')
        }

        const holdings = await this.goalRepo.findHoldingsByGoalId(goalId)

        let totalCurrentValue = new Decimal(0)
        let totalInvestedValue = new Decimal(0)

        const enrichedHoldings = await Promise.all(
            holdings.map(async (holding) => {


                // Calculate invested value (cost basis)
                const invested = new Decimal(holding.buyPrice.toString()).times(holding.quantity)
                totalInvestedValue = totalInvestedValue.plus(invested)

                let currentValue: number | null = null

                if (holding.status === 'SOLD' && holding.sellPrice) {
                    const value = new Decimal(holding.sellPrice).times(holding.quantity)
                    currentValue = value.toNumber()
                    totalCurrentValue = totalCurrentValue.plus(value)
                } else {
                    const priceResult = await this.priceRepo.getLatestBuybackPrice(
                        holding.brandCode,
                        holding.denominationGram,
                    )

                    if (priceResult) {
                        const value = new Decimal(priceResult.price).times(holding.quantity)
                        currentValue = value.toNumber()
                        totalCurrentValue = totalCurrentValue.plus(value)
                    }
                }

                return {
                    id: holding.id,
                    brandCode: holding.brandCode,
                    brandName: holding.brandName,
                    denominationGram: holding.denominationGram,
                    quantity: holding.quantity,
                    currentValue,
                    status: holding.status,
                    isSold: holding.status === 'SOLD',
                    soldDate: holding.sellDate ? holding.sellDate.toISOString() : null,
                }
            })
        )

        // Use snapshot value for completed goals, live value for active
        const currentValueNum = (goal.lifecycleStatus === 'COMPLETED' && goal.completedValue != null)
            ? goal.completedValue
            : totalCurrentValue.toNumber()

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

        return {
            ...goal,
            holdingCount: holdings.length,
            totalCurrentValue: currentValueNum,
            totalInvestedValue: totalInvestedValue.toNumber(),
            progressPercentage,
            isAchieved,
            holdings: enrichedHoldings,
        }
    }
}
