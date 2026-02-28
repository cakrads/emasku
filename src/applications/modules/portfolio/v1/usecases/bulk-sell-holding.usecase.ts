/**
 * Bulk Sell Holdings Usecase
 * 
 * Business logic for selling multiple holdings with a single sell price.
 * Each holding is processed independently but within an atomic transaction.
 */

import { ValidationError } from '@/applications/shared/lib/errors'
import { logger } from '@/applications/shared/lib/logger'
import { IPortfolioRepository } from '../domain/repository'
import { BulkSellResult } from '../domain/repository'
import { ONE_DAY_MS } from '@/applications/shared/lib/constants'

interface BulkSellInput {
    items: {
        id: string
        sellPrice: number
    }[]
    sellDate: string // ISO date string
    notes?: string
}

export class BulkSellHoldingUsecase {
    constructor(private portfolioRepo: IPortfolioRepository) { }

    async execute(userId: string, input: BulkSellInput): Promise<BulkSellResult> {
        logger.info('Bulk selling holdings', {
            userId,
            count: input.items.length,
        })

        if (input.items.length === 0) {
            throw new ValidationError(
                'No holdings selected',
                { items: [] },
            )
        }

        // Validate sell date
        const sellDateObj = new Date(input.sellDate)
        if (Number.isNaN(sellDateObj.getTime())) {
            throw new ValidationError(
                'Invalid sell date format',
                { sellDate: 'Must be a valid date string (e.g. YYYY-MM-DD)' }
            )
        }
        if (sellDateObj.getTime() > new Date().getTime() + ONE_DAY_MS) {
            throw new ValidationError(
                'Invalid sell date',
                { sellDate: 'Sell date cannot be in the future' }
            )
        }

        // Validate items
        input.items.forEach(item => {
            if (item.sellPrice <= 0) {
                throw new ValidationError(
                    `Invalid sell price for holding ${item.id}`,
                    { id: item.id, sellPrice: item.sellPrice },
                )
            }
        })

        // Execute atomic bulk sell
        const result = await this.portfolioRepo.bulkSellHoldings(userId, input.items, {
            sellDate: sellDateObj,
            notes: input.notes,
        })

        const soldCount = result.results.filter(r => r.status === 'SOLD').length
        const failedCount = result.results.filter(r => r.status === 'FAILED').length

        logger.info('Bulk sell completed', {
            userId,
            total: input.items.length,
            sold: soldCount,
            failed: failedCount,
        })

        return result
    }
}
