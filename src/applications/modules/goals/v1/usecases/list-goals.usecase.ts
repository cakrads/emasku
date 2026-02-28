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
        if (goals.length === 0) return []

        // 1. Batch fetch all holdings for all goals
        const allGoalIds = goals.map(g => g.id)
        const holdingsByGoal = await this.goalRepo.findHoldingsByGoalIds(allGoalIds)

        // 2. Collect unique price keys needed for live valuation
        const priceKeys = new Set<string>()
        for (const goalHoldings of Object.values(holdingsByGoal)) {
            for (const h of goalHoldings) {
                if (h.status !== 'SOLD') {
                    priceKeys.add(`${h.brandCode}:${h.denominationGram}`)
                }
            }
        }

        // 3. Batch fetch all required prices
        const priceMap = await this.priceRepo.getLatestBuybackPrices([...priceKeys])

        const summaries: GoalSummaryDomain[] = goals.map((goal) => {
            const holdings = holdingsByGoal[goal.id] || []

            // Use snapshot value for completed goals, live value for active
            let currentValueNum: number | bigint

            if (goal.lifecycleStatus === 'COMPLETED' && goal.completedValue != null) {
                // Use the locked snapshot value
                currentValueNum = goal.completedValue
            } else {
                // Calculate live value from holdings
                let totalCurrentValue = new Decimal(0)

                for (const holding of holdings) {
                    if (holding.status === 'SOLD' && holding.sellPrice != null) {
                        // Use realized sold price
                        const holdingValue = new Decimal(holding.sellPrice.toString()).times(holding.quantity)
                        totalCurrentValue = totalCurrentValue.plus(holdingValue)
                    } else {
                        // Use cached live market price
                        const priceKey = `${holding.brandCode}:${holding.denominationGram}`
                        const priceResult = priceMap[priceKey]

                        if (priceResult) {
                            const holdingValue = new Decimal(priceResult.price).times(holding.quantity)
                            totalCurrentValue = totalCurrentValue.plus(holdingValue)
                        }
                    }
                }

                currentValueNum = BigInt(totalCurrentValue.toFixed(0))
            }

            // Calculate progress percentage
            let progressPercentage: number | null = null
            let isAchieved = false

            if (goal.targetAmount != null && goal.targetAmount > 0) {
                progressPercentage = new Decimal(currentValueNum.toString())
                    .dividedBy(new Decimal(goal.targetAmount.toString()))
                    .times(100)
                    .toDecimalPlaces(2)
                    .toNumber()
                isAchieved = progressPercentage >= 100
            }

            return {
                ...goal,
                holdingCount: holdings.length,
                totalCurrentValue: currentValueNum,
                progressPercentage,
                isAchieved,
            }
        })

        logger.info('Goals listed', { userId, count: summaries.length })
        return summaries
    }
}
