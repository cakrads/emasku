/**
 * Get Portfolio Holdings Usecase
 * 
 * Business logic to fetch holdings with valuations and pagination.
 * Implements BUYBACK → NULL fallback logic.
 */

import Decimal from 'decimal.js'
import { IPortfolioRepository } from '../domain/repository'
import { IPriceRepository } from '@/applications/shared/domain/price.contract'
import { ValuatedHoldingDomain } from '../domain/portfolio.domain'
import { logger } from '@/applications/shared/lib/logger'

export interface HoldingsFilter {
  status?: 'active' | 'sold' | 'all'
  brandCodes?: string[]
  dateFrom?: string
  dateTo?: string
  goalId?: string
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
  constructor(
    private readonly portfolioRepo: IPortfolioRepository,
    private readonly priceRepo: IPriceRepository
  ) { }

  async execute(
    userId: string,
    filter: HoldingsFilter = { status: 'active' },
    pagination: PaginationParams = { page: 1, pageSize: 20 }
  ): Promise<PaginatedHoldings> {
    const { ValidationError } = await import('@/applications/shared/lib/errors')
    if (!userId) {
      throw new ValidationError('userId is required')
    }
    if (!Number.isInteger(pagination.page) || pagination.page < 1) {
      throw new ValidationError('page must be a positive integer')
    }
    if (!Number.isInteger(pagination.pageSize) || pagination.pageSize < 1) {
      throw new ValidationError('pageSize must be a positive integer')
    }
    if (pagination.pageSize > 100) {
      throw new ValidationError('pageSize cannot exceed 100')
    }
    logger.info('Fetching portfolio holdings', { userId, filter, pagination })

    const { items: holdings, total } = await this.portfolioRepo.findAllByUserId(userId, filter, pagination)

    const uniqueKeys = new Set<string>()
    for (const holding of holdings) {
      uniqueKeys.add(`${holding.brandCode}:${holding.denominationGram}`)
    }

    const pricesDict = await this.priceRepo.getLatestBuybackPrices(Array.from(uniqueKeys))

    const valuatedHoldings = holdings.map((holding) => {
      const key = `${holding.brandCode}:${holding.denominationGram}`
      const priceResult = pricesDict[key]

      let source: 'BUYBACK' | 'NONE' = 'BUYBACK'
      if (!priceResult) {
        source = 'NONE'
      }

      const buyValue = new Decimal(holding.buyPrice).times(holding.quantity)

      if (!priceResult) {
        return new ValuatedHoldingDomain(
          holding,
          null,
          null,
          null,
          null,
          'NONE',
          null
        )
      }

      const currentValue = new Decimal(priceResult.price.toString()).times(holding.quantity)
      const unrealizedPnL = currentValue.minus(buyValue)
      const pnlPercentage = buyValue.greaterThan(0)
        ? unrealizedPnL.dividedBy(buyValue).times(100)
        : new Decimal(0)

      return new ValuatedHoldingDomain(
        holding,
        Number(priceResult.price),
        currentValue.toNumber(),
        unrealizedPnL.toNumber(),
        pnlPercentage.toNumber(),
        source,
        priceResult.priceAt
      )
    })

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

