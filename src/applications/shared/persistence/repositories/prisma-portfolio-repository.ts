/**
 * Prisma Portfolio Repository
 * 
 * Data access layer for portfolio holdings.
 * NO valuation logic - only data fetching and type conversion.
 */

import { PrismaClient, Prisma, PortfolioHolding, HoldingTransaction, HoldingStatus } from '@prisma/client'
import { PortfolioHoldingDomain, SellHoldingData, SellHoldingResult, BulkSellResult } from '@/applications/shared/domain/portfolio.contract'
import { IPortfolioRepository } from '@/applications/modules/portfolio/v1/domain/repository'
import { logger } from '@/applications/shared/lib/logger'
import { ConflictError, NotFoundError, ValidationError } from '@/applications/shared/lib/errors'

type HoldingWithRelations = PortfolioHolding & {
  goal?: { name: string } | null
  soldTransaction?: HoldingTransaction | null
}

export class PrismaPortfolioRepository implements IPortfolioRepository {
  constructor(private readonly prisma: PrismaClient) { }

  private getClient(tx?: Prisma.TransactionClient) {
    return tx || this.prisma
  }

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
  ): Promise<{ items: PortfolioHoldingDomain[]; total: number | undefined }> {
    const startTime = Date.now()

    const where: Prisma.PortfolioHoldingWhereInput = { userId }

    // Apply status filter using the status field
    const status = filter?.status || 'active'
    if (status === 'active') {
      where.status = 'ACTIVE'
    } else if (status === 'sold') {
      where.status = 'SOLD'
    }
    // If 'all', do not add status condition

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

    // Only COUNT when pagination is requested — summary calls skip this
    const total = pagination
      ? await this.prisma.portfolioHolding.count({ where })
      : undefined

    const skip = pagination ? (pagination.page - 1) * pagination.pageSize : undefined
    const take = pagination?.pageSize

    const holdings = await this.prisma.portfolioHolding.findMany({
      where,
      orderBy: [
        { status: 'asc' }, // ACTIVE first, then SOLD
        { createdAt: 'desc' },
      ],
      skip,
      take,
      include: {
        goal: { select: { name: true } },
        soldTransaction: true,
      },
    })

    const duration = Date.now() - startTime
    if (duration > 100) {
      logger.warn('Slow portfolio query', { userId, duration, count: holdings.length })
    }

    logger.debug('Portfolio holdings fetched', { userId, count: holdings.length, total })

    return { items: holdings.map(h => this.toDomain(h)), total }
  }

  /**
   * Fetch single holding by ID.
   * NO price logic - returns raw holding data only.
   */
  async findById(id: string): Promise<PortfolioHoldingDomain | null> {
    const holding = await this.prisma.portfolioHolding.findUnique({
      where: { id },
      include: {
        goal: { select: { name: true } },
        soldTransaction: true,
      },
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
    // [0099] Belt-and-suspenders validation in repo layer
    if (!userId) throw new ValidationError('userId is required')
    if (!data.brandCode) throw new ValidationError('brandCode is required')
    if (data.denominationGram <= 0) throw new ValidationError('denominationGram must be positive')
    if (data.quantity <= 0) throw new ValidationError('quantity must be positive')
    if (Number(data.buyPrice) < 0) throw new ValidationError('buyPrice cannot be negative')

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
        status: 'ACTIVE',
        ...(data.goalId ? { goal: { connect: { id: data.goalId } } } : {}),
      },
      include: {
        goal: { select: { name: true } },
        soldTransaction: true,
      },
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
  }, tx?: Prisma.TransactionClient): Promise<PortfolioHoldingDomain> {
    const client = this.getClient(tx)

    // [0099] Belt-and-suspenders validation in repo layer
    if (!id) throw new ValidationError('id is required')
    if (data.denominationGram !== undefined && data.denominationGram <= 0) {
      throw new ValidationError('denominationGram must be positive')
    }
    if (data.quantity !== undefined && data.quantity <= 0) {
      throw new ValidationError('quantity must be positive')
    }
    if (data.buyPrice !== undefined && Number(data.buyPrice) < 0) {
      throw new ValidationError('buyPrice cannot be negative')
    }

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

    const holding = await client.portfolioHolding.update({
      where: { id, userId },
      data: updateData,
      include: {
        goal: { select: { name: true } },
        soldTransaction: true,
      },
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
   * Sell a holding: create SELL transaction + update holding status.
   * Atomic operation using DB transaction.
   * [0098] Implements pessimistic locking via updateMany with status check.
   */
  async sellHolding(userId: string, id: string, data: SellHoldingData): Promise<SellHoldingResult> {
    const result = await this.prisma.$transaction(async (tx) => {
      return this.executeSellHoldingInTx(tx, userId, id, data)
    })

    logger.info('Holding sold', { holdingId: id, userId, realizedPnL: result.realizedPnL })
    return result
  }

  /**
   * Bulk sell multiple holdings atomically.
   * Each holding is processed independently but within a single DB transaction.
   * Supports individual sell prices per holding.
   */
  async bulkSellHoldings(userId: string, items: { id: string, sellPrice: number }[], commonData: Omit<SellHoldingData, 'sellPrice'>): Promise<BulkSellResult> {
    const results: BulkSellResult['results'] = []

    for (const item of items) {
      const { id: holdingId, sellPrice } = item
      try {
        const result = await this.prisma.$transaction(async (tx) => {
          return this.executeSellHoldingInTx(tx, userId, holdingId, {
            ...commonData,
            sellPrice
          })
        })
        results.push(result)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        results.push({
          id: holdingId,
          holdingId,
          status: 'FAILED',
          error: errorMessage === 'HOLDING_NOT_ACTIVE' ? 'Holding not found or already sold' : errorMessage
        })
      }
    }

    logger.info('Bulk sell completed', {
      userId,
      total: items.length,
      sold: results.filter(r => r.status === 'SOLD').length,
      failed: results.filter(r => r.status === 'FAILED').length,
    })

    return { results }
  }

  /**
   * Internal helper to execute sell holding within a transaction.
   * [0098] Ensures atomic status transition to prevent double-selling.
   */
  private async executeSellHoldingInTx(
    tx: Prisma.TransactionClient,
    userId: string,
    id: string,
    data: SellHoldingData
  ): Promise<SellHoldingResult> {
    // 1. Perform atomic status transition as the lock
    const updated = await tx.portfolioHolding.updateMany({
      where: {
        id,
        userId,
        status: 'ACTIVE' // [0098] Critical: only transition if ACTIVE
      },
      data: {
        status: 'SOLD',
        soldAt: data.sellDate,
      },
    })

    if (updated.count !== 1) {
      throw new ConflictError('Holding already sold or not available for sale')
    }

    // 2. Fetch the transition record with details
    const holding = await tx.portfolioHolding.findUnique({
      where: { id },
      select: { buyPrice: true }
    })

    if (!holding) throw new NotFoundError('Holding not found')

    // 3. Create SELL transaction
    const transaction = await tx.holdingTransaction.create({
      data: {
        holdingId: id,
        type: 'SELL',
        price: BigInt(data.sellPrice),
        transactionDate: data.sellDate,
        notes: data.notes || null,
      },
    })

    // 4. Link the transaction back to the holding
    await tx.portfolioHolding.update({
      where: { id },
      data: { soldTransactionId: transaction.id }
    })

    // Calculate realized P/L
    const buyPrice = Number(holding.buyPrice)
    const sellPrice = Number(data.sellPrice)
    const realizedPnL = sellPrice - buyPrice
    const realizedPnLPercentage = buyPrice > 0
      ? ((sellPrice - buyPrice) / buyPrice) * 100
      : 0

    return {
      id,
      holdingId: id,
      realizedPnL: Math.round(realizedPnL),
      realizedPnLPercentage: Number(realizedPnLPercentage.toFixed(2)),
      status: 'SOLD' as const,
    }
  }

  /**
   * Delete a holding.
   * If hard=true, permanently remove.
   * If hard=false, mark as ARCHIVED.
   */
  async delete(userId: string, id: string, hard: boolean = false): Promise<void> {
    if (hard) {
      await this.prisma.portfolioHolding.delete({
        where: { id, userId },
      })
    } else {
      await this.prisma.portfolioHolding.update({
        where: { id, userId },
        data: { status: HoldingStatus.ARCHIVED }
      })
    }
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
   * Includes sell transaction data when SOLD.
   */
  private toDomain(prismaHolding: HoldingWithRelations): PortfolioHoldingDomain {
    const sellTx = prismaHolding.soldTransaction
    const buyPrice = Number(prismaHolding.buyPrice)
    const sellPrice = sellTx ? Number(sellTx.price) : null

    // Calculate realized P/L if sold
    let realizedPnL: number | null = null
    let realizedPnLPercentage: number | null = null
    let holdingDurationDays: number | null = null

    if (sellPrice !== null && sellTx) {
      realizedPnL = Math.round(sellPrice - buyPrice)
      realizedPnLPercentage = buyPrice > 0
        ? Number(((sellPrice - buyPrice) / buyPrice * 100).toFixed(2))
        : 0

      // Calculate holding duration
      if (prismaHolding.boughtAt) {
        const buyDate = new Date(prismaHolding.boughtAt)
        const sellDate = new Date(sellTx.transactionDate)
        holdingDurationDays = Math.round((sellDate.getTime() - buyDate.getTime()) / (1000 * 60 * 60 * 24))
      }
    }

    return new PortfolioHoldingDomain(
      prismaHolding.id,
      prismaHolding.userId,
      prismaHolding.brandCode,
      prismaHolding.brandName,
      Number(prismaHolding.denominationGram),
      prismaHolding.quantity,
      buyPrice,
      prismaHolding.boughtAt,
      prismaHolding.status as 'ACTIVE' | 'SOLD',
      prismaHolding.createdAt,
      prismaHolding.updatedAt || undefined,
      prismaHolding.notes || undefined,
      prismaHolding.goalId || null,
      prismaHolding.goal?.name || null,
      prismaHolding.soldAt,
      // Sell transaction data
      sellPrice,
      sellTx?.transactionDate || null,
      sellTx?.notes || null,
      realizedPnL,
      realizedPnLPercentage,
      holdingDurationDays,
    )
  }
}
