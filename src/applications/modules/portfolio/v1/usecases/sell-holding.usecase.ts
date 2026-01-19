/**
 * Sell Holding Usecase
 * 
 * Business logic for selling (soft closing) a holding.
 * Implements Optimistic Locking to prevent double-selling.
 */

import { NotFoundError, ConflictError } from '@/applications/shared/lib/errors'
import { logger } from '@/applications/shared/lib/logger'
import { PrismaPortfolioRepository } from '@/applications/shared/persistence/repositories/prisma-portfolio-repository'
import { prisma } from '@/applications/shared/persistence/prisma-client'

export class SellHoldingUsecase {
  constructor(private portfolioRepo: PrismaPortfolioRepository) { }

  async execute(userId: string, holdingId: string): Promise<void> {
    logger.info('Selling holding', { userId, holdingId })

    // Verify holding exists and belongs to user
    const exists = await this.portfolioRepo.existsByUserIdAndId(userId, holdingId)
    if (!exists) {
      throw new NotFoundError(
        'Holding not found',
        { holdingId },
        `Holding with ID "${holdingId}" not found or does not belong to you`,
        'Holding Not Found'
      )
    }

    // Optimistic Locking: Only update if soldAt is NULL
    // We use raw updateMany to get the count of modified rows
    const result = await prisma.portfolioHolding.updateMany({
      where: {
        id: holdingId,
        userId: userId,
        soldAt: null, // Critical: Ensure it's not already sold
      },
      data: {
        soldAt: new Date(),
      },
    })

    if (result.count === 0) {
      // If count is 0, it means the holding was either not found (handled above)
      // OR it was already sold (soldAt != null)
      logger.warn('Double sell attempt prevented', { userId, holdingId })
      throw new ConflictError(
        'Holding already sold',
        { holdingId },
        'This holding has already been marked as sold.',
        'Already Sold'
      )
    }

    logger.info('Holding sold successfully', { holdingId })
  }
}
