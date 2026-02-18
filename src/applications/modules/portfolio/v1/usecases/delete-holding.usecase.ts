/**
 * Delete Holding Usecase
 * 
 * Business logic for deleting portfolio holdings.
 */

import { NotFoundError } from '@/applications/shared/lib/errors'
import { logger } from '@/applications/shared/lib/logger'
import { PrismaPortfolioRepository } from '@/applications/shared/persistence/repositories/prisma-portfolio-repository'

export class DeleteHoldingUsecase {
  constructor(private portfolioRepo: PrismaPortfolioRepository) { }

  async execute(userId: string, holdingId: string, hard: boolean = false): Promise<void> {
    logger.info('Deleting holding', { userId, holdingId, hard })

    // Verify holding exists and belongs to user
    const exists = await this.portfolioRepo.existsByUserIdAndId(userId, holdingId)
    if (!exists) {
      throw new NotFoundError('Holding not found', {
        holdingId: `Holding with ID "${holdingId}" not found or does not belong to you`
      })
    }

    // Delete holding (permanently remove)
    // Note: "Mark as Sold" is now handled by SellHoldingUsecase. 
    // Delete operation removes the record completely.
    await this.portfolioRepo.delete(userId, holdingId)
    logger.info('Holding deleted', { holdingId, hard })
  }
}
