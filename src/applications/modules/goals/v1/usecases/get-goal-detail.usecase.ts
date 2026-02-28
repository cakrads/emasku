/**
 * Get Goal Detail Usecase
 * 
 * Fetches a single goal with linked holdings and progress data.
 */

import { Decimal } from 'decimal.js'
import { NotFoundError } from '@/applications/shared/lib/errors'
import { logger } from '@/applications/shared/lib/logger'
import { IGoalRepository } from '../domain/goal.repository'
import { IPriceRepository } from '@/applications/shared/domain/price.contract'
import { GoalSummaryDomain } from '../domain/goal.domain'

export class GoalDetailResult extends GoalSummaryDomain {
    public totalInvestedValue: number | bigint
    public holdings: Array<{
        id: string
        brandCode: string
        brandName: string
        denominationGram: number
        quantity: number
        currentValue: number | bigint | null
        status: string
        isSold: boolean
        soldDate: string | null
    }>

    constructor(
        summary: GoalSummaryDomain,
        totalInvestedValue: number | bigint,
        holdings: GoalDetailResult['holdings']
    ) {
        super(
            summary,
            summary.holdingCount,
            summary.totalCurrentValue,
            summary.progressPercentage,
            summary.isAchieved
        )
        this.totalInvestedValue = totalInvestedValue
        this.holdings = holdings
    }
}

export class GetGoalDetailUsecase {
    constructor(
        private goalRepo: IGoalRepository,
        private priceRepo: IPriceRepository,
    ) { }

    async execute(userId: string, goalId: string): Promise<GoalDetailResult> {
        logger.info('Getting goal detail', { userId, goalId })

        const goal = await this.goalRepo.findById(goalId)
        if (!goal || goal.userId !== userId) {
            throw new NotFoundError('Goal not found', { goalId })
        }

        const holdings = await this.goalRepo.findHoldingsByGoalId(goalId)

        // Batch fetch buyback prices for all active holdings
        const activeHoldings = holdings.filter(h => h.status !== 'SOLD')
        const uniqueKeys = new Set<string>()
        for (const h of activeHoldings) {
            uniqueKeys.add(`${h.brandCode}:${h.denominationGram}`)
        }
        const pricesDict = uniqueKeys.size > 0
            ? await this.priceRepo.getLatestBuybackPrices(Array.from(uniqueKeys))
            : {}

        let totalCurrentValue = new Decimal(0)
        let totalInvestedValue = new Decimal(0)

        const enrichedHoldings = holdings.map((holding) => {
            // Calculate invested value (cost basis)
            const invested = new Decimal(holding.buyPrice.toString()).times(holding.quantity)
            totalInvestedValue = totalInvestedValue.plus(invested)

            let currentValue: number | null = null

            if (holding.status === 'SOLD' && holding.sellPrice) {
                const value = new Decimal(holding.sellPrice.toString()).times(holding.quantity)
                currentValue = value.toNumber()
                totalCurrentValue = totalCurrentValue.plus(value)
            } else {
                const key = `${holding.brandCode}:${holding.denominationGram}`
                const priceResult = pricesDict[key]

                if (priceResult) {
                    const value = new Decimal(priceResult.price.toString()).times(holding.quantity)
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

        // Use snapshot value for completed goals, live value for active
        const currentValueNum = (goal.lifecycleStatus === 'COMPLETED' && goal.completedValue != null)
            ? goal.completedValue
            : BigInt(totalCurrentValue.toFixed(0))

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

        const summary = new GoalSummaryDomain(
            goal,
            holdings.length,
            currentValueNum,
            progressPercentage,
            isAchieved
        )

        return new GoalDetailResult(
            summary,
            BigInt(totalInvestedValue.toFixed(0)),
            enrichedHoldings
        )
    }
}
