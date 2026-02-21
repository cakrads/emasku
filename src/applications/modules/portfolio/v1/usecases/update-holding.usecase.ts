/**
 * Update Holding Usecase
 * 
 * Business logic for updating existing portfolio holdings.
 */

import { NotFoundError, ValidationError } from '@/applications/shared/lib/errors'
import { logger } from '@/applications/shared/lib/logger'
import { PrismaPortfolioRepository } from '@/applications/shared/persistence/repositories/prisma-portfolio-repository'
import { UpdateHoldingRequest } from '@/shared/contracts/update-holding.contract'
import { PortfolioHoldingDomain } from '../domain/portfolio.domain'

export class UpdateHoldingUsecase {
  constructor(private portfolioRepo: PrismaPortfolioRepository) { }

  async execute(userId: string, holdingId: string, request: UpdateHoldingRequest): Promise<PortfolioHoldingDomain> {
    logger.info('Updating holding', { userId, holdingId })

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

    // Validate buy date if provided
    if (request.buyDate) {
      const buyDate = new Date(request.buyDate)
      // Allow 24h buffer for timezone differences
      if (buyDate.getTime() > new Date().getTime() + 86_400_000) {
        throw new ValidationError('Invalid buy date', {
          buyDate: 'Buy date cannot be in the future'
        })
      }
    }

    // Validate denomination if provided
    if (request.denominationGram !== undefined) {
      if (request.denominationGram < 0.1 || request.denominationGram > 1000) {
        throw new ValidationError('Invalid denomination', {
          denominationGram: 'Weight must be between 0.1g and 1000g'
        })
      }
    }

    // Update holding in database
    const holding = await this.portfolioRepo.update(userId, holdingId, {
      denominationGram: request.denominationGram,
      quantity: request.quantity,
      buyPrice: request.buyPrice,
      buyDate: request.buyDate ? new Date(request.buyDate) : undefined,
      notes: request.notes,
      goalId: request.goalId,
    })

    logger.info('Holding updated successfully', { holdingId })

    return holding
  }
}
