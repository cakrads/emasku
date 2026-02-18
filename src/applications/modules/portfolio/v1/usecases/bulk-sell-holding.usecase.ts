/**
 * Bulk Sell Holdings Usecase
 * 
 * Business logic for selling multiple holdings with a single sell price.
 * Each holding is processed independently but within an atomic transaction.
 */

import { ValidationError } from '@/applications/shared/lib/errors'
import { logger } from '@/applications/shared/lib/logger'
import { PrismaPortfolioRepository } from '@/applications/shared/persistence/repositories/prisma-portfolio-repository'
import { BulkSellResult } from '../domain/repository'

interface BulkSellInput {
    items: {
        id: string
        sellPrice: number
    }[]
    sellDate: string // ISO date string
    notes?: string
}

export class BulkSellHoldingUsecase {
    constructor(private portfolioRepo: PrismaPortfolioRepository) { }

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
            sellDate: new Date(input.sellDate),
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
