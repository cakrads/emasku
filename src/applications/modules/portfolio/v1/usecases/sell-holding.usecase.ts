/**
 * Sell Holding Usecase
 * 
 * Business logic for selling a holding with proper transaction recording.
 * Creates an immutable SELL transaction and updates holding status.
 */

import { NotFoundError, ConflictError, ValidationError } from '@/applications/shared/lib/errors'
import { logger } from '@/applications/shared/lib/logger'
import { PrismaPortfolioRepository } from '@/applications/shared/persistence/repositories/prisma-portfolio-repository'
import { SellHoldingResult } from '../domain/repository'
import { ONE_DAY_MS } from '@/applications/shared/lib/constants'

interface SellHoldingInput {
  sellPrice: number
  sellDate: string // ISO date string
  notes?: string
}

export class SellHoldingUsecase {
  constructor(private portfolioRepo: PrismaPortfolioRepository) { }

  async execute(userId: string, holdingId: string, input: SellHoldingInput): Promise<SellHoldingResult> {
    logger.info('Selling holding', { userId, holdingId, sellPrice: input.sellPrice })

    // Validate sell price
    if (input.sellPrice <= 0) {
      throw new ValidationError(
        'Invalid sell price',
        { sellPrice: input.sellPrice },
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

    // Verify holding exists and belongs to user
    const holding = await this.portfolioRepo.findById(holdingId)
    if (!holding || holding.userId !== userId) {
      throw new NotFoundError(
        'Holding not found',
        { holdingId },
        `Holding with ID "${holdingId}" not found or does not belong to you`,
        'Holding Not Found'
      )
    }

    // Check if already sold
    if (holding.status === 'SOLD') {
      throw new ConflictError(
        'Holding already sold',
        { holdingId },
        'This holding has already been marked as sold.',
        'Already Sold'
      )
    }

    // Execute atomic sell operation
    const result = await this.portfolioRepo.sellHolding(userId, holdingId, {
      sellPrice: input.sellPrice,
      sellDate: sellDateObj,
      notes: input.notes,
    })

    logger.info('Holding sold successfully', {
      holdingId,
      realizedPnL: result.realizedPnL,
    })

    return result
  }
}
