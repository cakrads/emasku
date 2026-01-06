/**
 * Portfolio HTTP Controller
 * 
 * HTTP adapter for portfolio-related endpoints.
 */

import { NextRequest, NextResponse } from 'next/server'
import { successResponse, errorResponse } from '@/applications/shared/lib/response'
import { NotFoundError } from '@/applications/shared/lib/errors'
import { GetPortfolioSummaryUsecase } from '../../usecases/get-portfolio-summary'
import { GetPortfolioHoldingsUsecase } from '../../usecases/get-portfolio-holdings'
import { GetHoldingDetailUsecase } from '../../usecases/get-holding-detail'
import { GetPortfolioHistoryUsecase } from '../../usecases/get-portfolio-history'
import { PortfolioMapper } from './portfolio.mapper'
import { PortfolioSummarySchema, PortfolioListSchema, HoldingDetailSchema, PortfolioHistorySchema } from '@/shared/contracts/portfolio.contract'

export class PortfolioController {
  /**
   * GET /api/v1/portfolio/summary
   */
  async getPortfolioSummary(): Promise<NextResponse> {
    const usecase = new GetPortfolioSummaryUsecase()
    const domain = await usecase.execute()
    const dto = PortfolioMapper.toPortfolioSummaryResponse(domain)
    const validated = PortfolioSummarySchema.parse(dto)

    return successResponse(validated, 'Portfolio summary computed', {
      holdingCount: domain.holdingCount,
      lastUpdated: domain.lastUpdated.toISOString(),
    })
  }

  /**
   * GET /api/v1/portfolio
   */
  async getPortfolioHoldings(): Promise<NextResponse> {
    const usecase = new GetPortfolioHoldingsUsecase()
    const holdings = await usecase.execute()
    const dto = PortfolioMapper.toPortfolioListResponse(holdings)
    const validated = PortfolioListSchema.parse(dto)

    return successResponse(validated, 'Portfolio retrieved', {
      totalItems: holdings.length,
      valuationMethod: 'LATEST_BUYBACK',
      priceAsOf: new Date().toISOString(),
    })
  }

  /**
   * GET /api/v1/portfolio/{id}
   */
  async getHoldingDetail(id: string): Promise<NextResponse> {
    const usecase = new GetHoldingDetailUsecase()
    const holding = await usecase.execute(id)

    if (!holding) {
      throw new NotFoundError(
        'Holding Not Found',
        { id },
        `The holding with ID "${id}" could not be found. It may have been deleted or does not exist.`,
        'Holding Not Found'
      )
    }

    const dto = PortfolioMapper.toHoldingItem(holding)
    const validated = HoldingDetailSchema.parse(dto)

    return successResponse(validated, 'Holding detail retrieved')
  }

  /**
   * GET /api/v1/portfolio/history
   */
  async getPortfolioHistory(): Promise<NextResponse> {
    const usecase = new GetPortfolioHistoryUsecase()
    const domain = await usecase.execute()
    const dto = PortfolioMapper.toPortfolioHistoryResponse(domain)
    const validated = PortfolioHistorySchema.parse(dto)

    return successResponse(validated, 'Portfolio history retrieved')
  }
}
