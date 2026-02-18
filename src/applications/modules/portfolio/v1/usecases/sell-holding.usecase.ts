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

    // Verify holding exists and belongs to user
    const holding = await this.portfolioRepo.findById(holdingId)
    if (!holding || holding.id !== holdingId) {
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
      sellDate: new Date(input.sellDate),
      notes: input.notes,
    })

    logger.info('Holding sold successfully', {
      holdingId,
      realizedPnL: result.realizedPnL,
    })

    return result
  }
}
