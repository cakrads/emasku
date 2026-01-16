/**
 * Get Portfolio Holdings Usecase
 * 
 * Business logic to fetch holdings with valuations and pagination.
 * Implements BUYBACK → SPOT → NULL fallback logic.
 */

import Decimal from 'decimal.js'
import { PrismaPortfolioRepository } from '@/applications/shared/persistence/repositories/prisma-portfolio-repository'
import { PrismaPriceRepository } from '@/applications/shared/persistence/repositories/prisma-price-repository'
import { ValuatedHoldingDomain } from '../domain/portfolio.domain'
import { logger } from '@/applications/shared/lib/logger'

export interface HoldingsFilter {
  status?: 'active' | 'sold' | 'all'
  brandCodes?: string[]
  dateFrom?: string
  dateTo?: string
}

export interface PaginationParams {
  page: number
  pageSize: number
}

export interface PaginatedHoldings {
  items: ValuatedHoldingDomain[]
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
  }
}

export class GetPortfolioHoldingsUsecase {
  private portfolioRepo = new PrismaPortfolioRepository()
  private priceRepo = new PrismaPriceRepository()

  async execute(
    userId: string = 'default-user-id',
    filter: HoldingsFilter = { status: 'active' },
    pagination: PaginationParams = { page: 1, pageSize: 20 }
  ): Promise<PaginatedHoldings> {
    logger.info('Fetching portfolio holdings', { userId, filter, pagination })

    const { items: holdings, total } = await this.portfolioRepo.findAllByUserId(userId, filter, pagination)

    const valuatedHoldings = await Promise.all(
      holdings.map(async (holding) => {
        // Try BUYBACK first, fallback to SPOT
        let priceResult = await this.priceRepo.getLatestBuybackPrice(
          holding.brandCode,
          holding.denominationGram
        )
        let source: 'BUYBACK' | 'SPOT' | 'NONE' = 'BUYBACK'

        if (!priceResult) {
          priceResult = await this.priceRepo.getLatestSpotPrice(
            holding.brandCode,
            holding.denominationGram
          )
          source = priceResult ? 'SPOT' : 'NONE'
        }

        const buyValue = new Decimal(holding.buyPrice)
          .times(holding.quantity)
          .times(holding.denominationGram)

        if (!priceResult) {
          return {
            ...holding,
            currentPrice: null,
            currentValue: null,
            unrealizedPnL: null,
            pnlPercentage: null,
            valuationSource: 'NONE' as const,
            priceAsOf: null
          }
        }

        const currentValue = new Decimal(priceResult.price)
          .times(holding.quantity)
          .times(holding.denominationGram)

        const unrealizedPnL = currentValue.minus(buyValue)
        const pnlPercentage = buyValue.greaterThan(0)
          ? unrealizedPnL.dividedBy(buyValue).times(100)
          : new Decimal(0)

        return {
          ...holding,
          currentPrice: priceResult.price,
          currentValue: currentValue.toNumber(),
          unrealizedPnL: unrealizedPnL.toNumber(),
          pnlPercentage: pnlPercentage.toNumber(),
          valuationSource: source,
          priceAsOf: priceResult.priceAt
        }
      })
    )

    logger.info('Portfolio holdings fetched', { count: valuatedHoldings.length, total })

    return {
      items: valuatedHoldings,
      pagination: {
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalItems: total,
        totalPages: Math.ceil(total / pagination.pageSize),
      }
    }
  }
}

