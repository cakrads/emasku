/**
 * Create Holding Usecase
 * 
 * Business logic for creating new portfolio holdings.
 */

import { ValidationError } from '@/applications/shared/lib/errors'
import { logger } from '@/applications/shared/lib/logger'
import { BRAND_CONFIG } from '@/applications/modules/brands/v1/domain/brands.const'
import { IPortfolioRepository } from '../domain/repository'
import { IGoalRepository } from '@/applications/modules/goals/v1/domain/goal.repository'
import { CreateHoldingRequest } from '@/shared/contracts/create-holding.contract'
import { PortfolioHoldingDomain } from '../domain/portfolio.domain'
import { NotFoundError } from '@/applications/shared/lib/errors'
import { ONE_DAY_MS, MIN_DENOMINATION_GRAM, MAX_DENOMINATION_GRAM } from '@/applications/shared/lib/constants'

export class CreateHoldingUsecase {
  constructor(
    private portfolioRepo: IPortfolioRepository,
    private goalRepo: IGoalRepository
  ) { }

  async execute(userId: string, request: CreateHoldingRequest): Promise<PortfolioHoldingDomain> {
    logger.info('Creating new holding', { userId, brandCode: request.brandCode })

    // Validate brand code exists
    const brandExists = BRAND_CONFIG.some(b => b.code === request.brandCode)
    if (!brandExists) {
      throw new ValidationError('Invalid brand code', {
        brandCode: `Brand code "${request.brandCode}" is not supported`
      })
    }


    // Validate buy date is not in future (only if provided)
    if (request.buyDate) {
      const buyDate = new Date(request.buyDate)
      if (Number.isNaN(buyDate.getTime())) {
        throw new ValidationError('Invalid buy date', {
          buyDate: 'Buy date must be a valid date'
        })
      }
      // Allow 24h buffer for timezone differences
      if (buyDate.getTime() > new Date().getTime() + ONE_DAY_MS) {
        throw new ValidationError('Invalid buy date', {
          buyDate: 'Buy date cannot be in the future'
        })
      }
    }

    // Validate quantity and buyPrice
    if (request.quantity <= 0) {
      throw new ValidationError('Invalid quantity', {
        quantity: 'Quantity must be greater than 0'
      })
    }
    if (request.buyPrice !== undefined && request.buyPrice < 0) {
      throw new ValidationError('Invalid buy price', {
        buyPrice: 'Buy price cannot be negative'
      })
    }

    // Validate denomination is reasonable (between 0.1g and 1000g)
    if (request.denominationGram < MIN_DENOMINATION_GRAM || request.denominationGram > MAX_DENOMINATION_GRAM) {
      throw new ValidationError('Invalid denomination', {
        denominationGram: `Weight must be between ${MIN_DENOMINATION_GRAM}g and ${MAX_DENOMINATION_GRAM}g`
      })
    }
    // Validate goal ownership (if goalId provided)
    if (request.goalId) {
      const goal = await this.goalRepo.findById(request.goalId)
      if (!goal || goal.userId !== userId) {
        throw new NotFoundError('Goal not found', { goalId: request.goalId })
      }
    }

    // Create holding in database
    const holding = await this.portfolioRepo.create(userId, {
      brandCode: request.brandCode,
      denominationGram: request.denominationGram,
      quantity: request.quantity,
      buyPrice: request.buyPrice || 0,
      buyDate: request.buyDate ? new Date(request.buyDate) : undefined,
      notes: request.notes,
      goalId: request.goalId,
    })

    logger.info('Holding created successfully', { holdingId: holding.id })

    return holding
  }
}
