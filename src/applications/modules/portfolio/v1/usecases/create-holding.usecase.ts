/**
 * Create Holding Usecase
 * 
 * Business logic for creating new portfolio holdings.
 */

import { ValidationError } from '@/applications/shared/lib/errors'
import { logger } from '@/applications/shared/lib/logger'
import { BRAND_CONFIG } from '@/applications/modules/brands/v1/domain/brands.const'
import { PrismaPortfolioRepository } from '@/applications/shared/persistence/repositories/prisma-portfolio-repository'
import { CreateHoldingRequest } from '@/shared/contracts/create-holding.contract'
import { PortfolioHoldingDomain } from '../domain/portfolio.domain'

export class CreateHoldingUsecase {
  constructor(private portfolioRepo: PrismaPortfolioRepository) { }

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
      // Allow 24h buffer for timezone differences
      if (buyDate.getTime() > new Date().getTime() + 86_400_000) {
        throw new ValidationError('Invalid buy date', {
          buyDate: 'Buy date cannot be in the future'
        })
      }
    }

    // Validate denomination is reasonable (between 0.1g and 1000g)
    if (request.denominationGram < 0.1 || request.denominationGram > 1000) {
      throw new ValidationError('Invalid denomination', {
        denominationGram: 'Weight must be between 0.1g and 1000g'
      })
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
