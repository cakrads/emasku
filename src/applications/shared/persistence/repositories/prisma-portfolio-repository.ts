/**
 * Prisma Portfolio Repository
 * 
 * Data access layer for portfolio holdings.
 * NO valuation logic - only data fetching and type conversion.
 */

import { prisma } from '../prisma-client'
import { Prisma, PortfolioHolding } from '@prisma/client'
import { PortfolioHoldingDomain } from '@/applications/modules/portfolio/v1/domain/portfolio.domain'
import { logger } from '@/applications/shared/lib/logger'

export class PrismaPortfolioRepository {
  private prisma = prisma

  /**
   * Extended filter type for holdings queries.
   */
  // Defining inline type instead of interface for class member compatibility

  /**
   * Fetch all holdings for a user with optional filters and pagination.
   * NO valuation logic - returns raw holding data only.
   */
  async findAllByUserId(
    userId: string,
    filter?: {
      status?: 'active' | 'sold' | 'all'
      brandCodes?: string[]
      dateFrom?: string
      dateTo?: string
      goalId?: string
    },
    pagination?: { page: number; pageSize: number }
  ): Promise<{ items: PortfolioHoldingDomain[]; total: number }> {
    const startTime = Date.now()

    const where: Prisma.PortfolioHoldingWhereInput = { userId }

    // Apply status filter
    const status = filter?.status || 'active'
    if (status === 'active') {
      where.soldAt = null
    } else if (status === 'sold') {
      where.soldAt = { not: null }
    }
    // If 'all', do not add soldAt condition

    // Apply brand filter (multi-select)
    if (filter?.brandCodes && filter.brandCodes.length > 0) {
      where.brandCode = { in: filter.brandCodes }
    }

    // Apply date range filter
    if (filter?.dateFrom || filter?.dateTo) {
      where.boughtAt = {}
      if (filter.dateFrom) {
        where.boughtAt.gte = new Date(filter.dateFrom)
      }
      if (filter.dateTo) {
        where.boughtAt.lte = new Date(filter.dateTo)
      }
    }

    // Apply goal filter
    if (filter?.goalId) {
      where.goalId = filter.goalId
    }

    // Get total count for pagination
    const total = await prisma.portfolioHolding.count({ where })

    // Apply pagination
    const skip = pagination ? (pagination.page - 1) * pagination.pageSize : undefined
    const take = pagination?.pageSize

    const holdings = await prisma.portfolioHolding.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      include: { goal: { select: { name: true } } },
    })

    const duration = Date.now() - startTime
    if (duration > 100) {
      logger.warn('Slow portfolio query', { userId, duration, count: holdings.length })
    }

    logger.debug('Portfolio holdings fetched', { userId, count: holdings.length, total })

    return { items: holdings.map(this.toDomain), total }
  }

  /**
   * Fetch single holding by ID.
   * NO price logic - returns raw holding data only.
   */
  async findById(id: string): Promise<PortfolioHoldingDomain | null> {
    const holding = await this.prisma.portfolioHolding.findUnique({
      where: { id },
      include: { goal: { select: { name: true } } },
    })

    if (!holding) {
      logger.debug('Holding not found', { id })
      return null
    }

    return this.toDomain(holding)
  }

  /**
   * Create a new holding.
   */
  async create(userId: string, data: {
    brandCode: string
    denominationGram: number
    quantity: number
    buyPrice: number | bigint
    buyDate?: Date // Input is usually buyDate
    notes?: string
    goalId?: string
  }): Promise<PortfolioHoldingDomain> {
    const brandName = await this.getBrandName(data.brandCode)

    const holding = await this.prisma.portfolioHolding.create({
      data: {
        user: { connect: { id: userId } },
        brandCode: data.brandCode,
        brandName,
        denominationGram: data.denominationGram,
        quantity: data.quantity,
        buyPrice: BigInt(data.buyPrice),
        boughtAt: data.buyDate,
        notes: data.notes || null,
        ...(data.goalId ? { goal: { connect: { id: data.goalId } } } : {}),
      },
      include: { goal: { select: { name: true } } },
    })

    logger.info('Holding created', { holdingId: holding.id, userId })

    return this.toDomain(holding)
  }

  /**
   * Update an existing holding.
   * Only updates provided fields.
   */
  async update(userId: string, id: string, data: {
    denominationGram?: number
    quantity?: number
    buyPrice?: number | bigint
    buyDate?: Date
    notes?: string
    brandCode?: string
    goalId?: string | null
  }): Promise<PortfolioHoldingDomain> {
    const updateData: Prisma.PortfolioHoldingUpdateInput = {}

    // Explicitly map fields
    if (data.denominationGram !== undefined) updateData.denominationGram = data.denominationGram
    if (data.quantity !== undefined) updateData.quantity = data.quantity
    if (data.buyPrice !== undefined) updateData.buyPrice = BigInt(data.buyPrice)
    // Map buyDate -> boughtAt
    if (data.buyDate !== undefined) updateData.boughtAt = data.buyDate

    if (data.brandCode) {
      updateData.brandCode = data.brandCode
      updateData.brandName = await this.getBrandName(data.brandCode)
    }

    if (data.notes !== undefined) updateData.notes = data.notes

    // Handle goalId: connect, disconnect, or skip
    if (data.goalId !== undefined) {
      if (data.goalId === null) {
        updateData.goal = { disconnect: true }
      } else {
        updateData.goal = { connect: { id: data.goalId } }
      }
    }

    const holding = await this.prisma.portfolioHolding.update({
      where: { id, userId },
      data: updateData,
      include: { goal: { select: { name: true } } },
    })

    logger.info('Holding updated', { holdingId: id, userId })

    return this.toDomain(holding)
  }

  /**
   * Check if holding exists and belongs to user.
   */
  async existsByUserIdAndId(userId: string, id: string): Promise<boolean> {
    const count = await this.prisma.portfolioHolding.count({
      where: { id, userId }
    })

    return count > 0
  }

  /**
   * soft-delete a holding (mark as sold).
   */
  async markAsSold(userId: string, id: string): Promise<void> {
    await this.prisma.portfolioHolding.update({
      where: {
        id,
        userId,
      },
      data: {
        soldAt: new Date(),
      }
    })
  }

  /**
   * Hard delete a holding (permanently remove).
   */
  async delete(userId: string, id: string): Promise<void> {
    await this.prisma.portfolioHolding.delete({
      where: {
        id,
        userId,
      },
    })
  }

  /**
   * Get brand name from brand code.
   */
  private async getBrandName(brandCode: string): Promise<string> {
    // Import BRAND_CONFIG to get display name
    const { BRAND_CONFIG } = await import('@/applications/modules/brands/v1/domain/brands.const')
    const brand = BRAND_CONFIG.find(b => b.code === brandCode)
    return brand?.name || brandCode
  }

  /**
   * Map Prisma model to domain model.
   * Converts BigInt → number and Decimal → number.
   * NO business logic - pure data transformation.
   */
  private toDomain(prismaHolding: PortfolioHolding & { goal?: { name: string } | null }): PortfolioHoldingDomain {
    return {
      id: prismaHolding.id,
      brandCode: prismaHolding.brandCode,
      brandName: prismaHolding.brandName,
      denominationGram: Number(prismaHolding.denominationGram),
      quantity: prismaHolding.quantity,
      buyPrice: Number(prismaHolding.buyPrice),
      boughtAt: prismaHolding.boughtAt,
      soldAt: prismaHolding.soldAt,
      createdAt: prismaHolding.createdAt,
      notes: prismaHolding.notes || undefined,
      goalId: prismaHolding.goalId || null,
      goalName: prismaHolding.goal?.name || null,
    }
  }
}
