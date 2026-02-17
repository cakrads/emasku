/**
 * Portfolio HTTP Controller
 * 
 * HTTP adapter for portfolio-related endpoints.
 */

import { NextRequest, NextResponse } from 'next/server'
import { successResponse } from '@/applications/shared/lib/response'
import { NotFoundError, ValidationError } from '@/applications/shared/lib/errors'
import { GetPortfolioSummaryUsecase } from '../../usecases/get-portfolio-summary'
import { GetPortfolioHoldingsUsecase } from '../../usecases/get-portfolio-holdings'
import { GetHoldingDetailUsecase } from '../../usecases/get-holding-detail'
import { GetPortfolioHistoryUsecase } from '../../usecases/get-portfolio-history'
import { PortfolioMapper } from './portfolio.mapper'
import { PortfolioSummarySchema, PortfolioListSchema, HoldingDetailSchema, PortfolioHistorySchema } from '@/shared/contracts/portfolio.contract'
import { CreateHoldingRequestSchema, CreateHoldingResponseSchema } from '@/shared/contracts/create-holding.contract'
import { UpdateHoldingRequestSchema, UpdateHoldingResponseSchema } from '@/shared/contracts/update-holding.contract'
import { PrismaUserRepository } from '@/applications/shared/persistence/repositories/prisma-user-repository'
import { CreateHoldingUsecase } from '../../usecases/create-holding.usecase'
import { UpdateHoldingUsecase } from '../../usecases/update-holding.usecase'
import { DeleteHoldingUsecase } from '../../usecases/delete-holding.usecase'
import { SellHoldingUsecase } from '../../usecases/sell-holding.usecase'
import { PrismaPortfolioRepository } from '@/applications/shared/persistence/repositories/prisma-portfolio-repository'
import { getBrandName } from '@/applications/modules/brands/v1/domain/brands.const'
import { verifyUser } from '@/applications/shared/auth/auth.utils'

export class PortfolioController {
  private userRepo = new PrismaUserRepository()


  /**
   * GET /api/v1/portfolio/summary
   * Accepts optional filter params: status, brandCodes, dateFrom, dateTo
   */
  async getPortfolioSummary(req: NextRequest): Promise<NextResponse> {
    const userId = await verifyUser(req)
    const { searchParams } = new URL(req.url)

    // Parse filter params
    const status = searchParams.get('status') as 'active' | 'sold' | 'all' | null
    const brandCodesParam = searchParams.get('brandCodes')
    const brandCodes = brandCodesParam ? brandCodesParam.split(',') : undefined
    const dateFrom = searchParams.get('dateFrom') || undefined
    const dateTo = searchParams.get('dateTo') || undefined

    const filter = {
      status: status || undefined,
      brandCodes,
      dateFrom,
      dateTo,
    }

    const usecase = new GetPortfolioSummaryUsecase()
    const domain = await usecase.execute(userId, filter)
    const dto = PortfolioMapper.toPortfolioSummaryResponse(domain)
    const validated = PortfolioSummarySchema.parse(dto)

    return successResponse(validated, 'Portfolio summary computed', {
      holdingCount: domain.holdingCount,
      lastUpdated: domain.lastUpdated.toISOString(),
    })
  }

  /**
   * GET /api/v1/portfolio
   * Accepts optional filter params: status, brandCodes, dateFrom, dateTo
   * Accepts pagination params: page, pageSize
   */
  async getPortfolioHoldings(req: NextRequest): Promise<NextResponse> {
    const userId = await verifyUser(req)
    const { searchParams } = new URL(req.url)

    // Parse filter params
    const status = searchParams.get('status') as 'active' | 'sold' | 'all' | null
    const brandCodesParam = searchParams.get('brandCodes')
    const brandCodes = brandCodesParam ? brandCodesParam.split(',') : undefined
    const dateFrom = searchParams.get('dateFrom') || undefined
    const dateTo = searchParams.get('dateTo') || undefined
    const goalId = searchParams.get('goalId') || undefined

    const filter = {
      status: status || undefined,
      brandCodes,
      dateFrom,
      dateTo,
      goalId,
    }

    // Parse pagination params
    const page = parseInt(searchParams.get('page') || '1', 10)
    const pageSize = parseInt(searchParams.get('pageSize') || '20', 10)
    const pagination = { page, pageSize }

    const usecase = new GetPortfolioHoldingsUsecase()
    const result = await usecase.execute(userId, filter, pagination)

    const dto = PortfolioMapper.toPortfolioListResponse(result.items)
    // Add pagination to response
    const response = {
      ...dto,
      pagination: result.pagination,
    }
    const validated = PortfolioListSchema.parse(response)

    return successResponse(validated, 'Portfolio retrieved', {
      totalItems: result.pagination.totalItems,
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
  async getPortfolioHistory(req: NextRequest): Promise<NextResponse> {
    const userId = await verifyUser(req)
    const usecase = new GetPortfolioHistoryUsecase()
    const domain = await usecase.execute(userId)
    const dto = PortfolioMapper.toPortfolioHistoryResponse(domain)
    const validated = PortfolioHistorySchema.parse(dto)

    return successResponse(validated, 'Portfolio history retrieved')
  }

  /**
   * POST /api/v1/portfolio
   */
  async createHolding(req: NextRequest): Promise<NextResponse> {
    const userId = await verifyUser(req)
    const body = await req.json()

    // Validate request body
    const parsed = CreateHoldingRequestSchema.safeParse(body)
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors
      console.log('Validation failed:', fieldErrors)
      throw new ValidationError(
        'Validation failed',
        { errors: fieldErrors }
      )
    }

    const portfolioRepo = new PrismaPortfolioRepository()
    const usecase = new CreateHoldingUsecase(portfolioRepo)
    const holding = await usecase.execute(userId, parsed.data)

    // Map to response
    const brandName = getBrandName(holding.brandCode)
    const response = {
      id: holding.id,
      brandCode: holding.brandCode,
      brandName,
      denominationGram: holding.denominationGram,
      quantity: holding.quantity,
      buyPrice: holding.buyPrice,
      buyDate: holding.boughtAt ? holding.boughtAt.toISOString().split('T')[0] : null,
      notes: holding.notes,
      createdAt: new Date().toISOString(),
    }

    const validated = CreateHoldingResponseSchema.parse(response)

    return NextResponse.json(
      {
        code: 201,
        success: true,
        message: 'Holding created successfully',
        data: validated,
      },
      { status: 201 }
    )
  }

  /**
   * PUT /api/v1/portfolio/{id}
   */
  async updateHolding(req: NextRequest, id: string): Promise<NextResponse> {
    const userId = await verifyUser(req)
    const body = await req.json()

    // Validate request body
    const parsed = UpdateHoldingRequestSchema.safeParse(body)
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors
      console.log('Update validation failed:', fieldErrors)
      throw new ValidationError(
        'Validation failed',
        { errors: fieldErrors }
      )
    }

    const portfolioRepo = new PrismaPortfolioRepository()
    const usecase = new UpdateHoldingUsecase(portfolioRepo)
    const holding = await usecase.execute(userId, id, parsed.data)

    // Map to response
    const brandName = getBrandName(holding.brandCode)
    const response = {
      id: holding.id,
      brandCode: holding.brandCode,
      brandName,
      denominationGram: holding.denominationGram,
      quantity: holding.quantity,
      buyPrice: holding.buyPrice,
      buyDate: holding.boughtAt ? holding.boughtAt.toISOString().split('T')[0] : null,
      notes: holding.notes,
      updatedAt: new Date().toISOString(),
    }

    const validated = UpdateHoldingResponseSchema.parse(response)

    return successResponse(validated, 'Holding updated successfully')
  }

  /**
   * POST /api/v1/portfolio/{id}/sell
   */
  async sellHolding(req: NextRequest, id: string): Promise<NextResponse> {
    const userId = await verifyUser(req)

    const portfolioRepo = new PrismaPortfolioRepository()
    const usecase = new SellHoldingUsecase(portfolioRepo)
    await usecase.execute(userId, id)

    return NextResponse.json(
      {
        code: 200,
        success: true,
        message: 'Holding marked as sold successfully',
        data: null,
      },
      { status: 200 }
    )
  }

  /**
   * DELETE /api/v1/portfolio/{id}
   */
  async deleteHolding(req: NextRequest, id: string): Promise<NextResponse> {
    const userId = await verifyUser(req)

    const { searchParams } = new URL(req.url)
    const hard = searchParams.get('hard') === 'true'

    const portfolioRepo = new PrismaPortfolioRepository()
    const usecase = new DeleteHoldingUsecase(portfolioRepo)
    await usecase.execute(userId, id, hard)

    return NextResponse.json(
      {
        code: 200,
        success: true,
        message: 'Holding deleted successfully',
        data: null,
      },
      { status: 200 }
    )
  }
}
