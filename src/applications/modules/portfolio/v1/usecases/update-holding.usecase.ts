/**
 * Update Holding Usecase
 * 
 * Business logic for updating existing portfolio holdings.
 */

import { NotFoundError, ValidationError } from '@/applications/shared/lib/errors'
import { logger } from '@/applications/shared/lib/logger'
import { PrismaPortfolioRepository } from '@/applications/shared/persistence/repositories/prisma-portfolio-repository'
import { PrismaGoalRepository } from '@/applications/shared/persistence/repositories/prisma-goal-repository'
import { UpdateHoldingRequest } from '@/shared/contracts/update-holding.contract'
import { PortfolioHoldingDomain } from '../domain/portfolio.domain'
import { ONE_DAY_MS, MIN_DENOMINATION_GRAM, MAX_DENOMINATION_GRAM } from '@/applications/shared/lib/constants'

export class UpdateHoldingUsecase {
  constructor(
    private portfolioRepo: PrismaPortfolioRepository,
    private goalRepo?: PrismaGoalRepository,
  ) { }

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
      if (buyDate.getTime() > new Date().getTime() + ONE_DAY_MS) {
        throw new ValidationError('Invalid buy date', {
          buyDate: 'Buy date cannot be in the future'
        })
      }
    }

    // Validate denomination if provided
    if (request.denominationGram !== undefined) {
      if (request.denominationGram < MIN_DENOMINATION_GRAM || request.denominationGram > MAX_DENOMINATION_GRAM) {
        throw new ValidationError('Invalid denomination', {
          denominationGram: `Weight must be between ${MIN_DENOMINATION_GRAM}g and ${MAX_DENOMINATION_GRAM}g`
        })
      }
    }

    // Validate quantity and buyPrice if provided
    if (request.quantity !== undefined && request.quantity <= 0) {
      throw new ValidationError('Invalid quantity', {
        quantity: 'Quantity must be greater than 0'
      })
    }
    if (request.buyPrice !== undefined && request.buyPrice < 0) {
      throw new ValidationError('Invalid buy price', {
        buyPrice: 'Buy price cannot be negative'
      })
    }

    // Validate goal ownership if goalId is being set
    if (request.goalId && this.goalRepo) {
      const goal = await this.goalRepo.findById(request.goalId)
      if (!goal || goal.userId !== userId) {
        throw new NotFoundError('Goal not found', { goalId: request.goalId })
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
