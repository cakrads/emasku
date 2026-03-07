/**
 * Prisma Implementation of Price Repository
 * 
 * Concrete adapter that implements IPriceRepository using Prisma.
 * Handles:
 * - BigInt → number conversion
 * - Timezone normalization
 * - Optimized queries
 */

import { PrismaClient, PriceType, GoldPrice } from '@prisma/client'
import { Decimal } from 'decimal.js'
import { IPriceRepository } from './price-repository.interface'
import { GoldPriceRecord, TodayPriceGroup } from '../domain/gold-price'
import { logQuery } from '@/applications/shared/lib/logger'

export class PrismaPriceRepository implements IPriceRepository {
  constructor(private prisma: PrismaClient) { }

  async getPriceAt(
    brandCode: string,
    denominationGram: Decimal,
    timestamp: Date
  ): Promise<GoldPriceRecord | null> {
    const startTime = Date.now()

    const price = await this.prisma.goldPrice.findFirst({
      where: {
        brandCode,
        priceType: PriceType.SELL, // Use SELL as reference if SPOT is gone
        denominationGram,
        priceAt: { lte: timestamp },
      },
      orderBy: { priceAt: 'desc' },
    })

    logQuery('getPriceAt', Date.now() - startTime, { brandCode, timestamp })

    if (!price) return null

    return this.toDomainModel(price)
  }

  async getSpotPriceSeries(
    brandCode: string,
    from: Date,
    to: Date,
    denominationGram: Decimal
  ): Promise<GoldPriceRecord[]> {
    const startTime = Date.now()

    const prices = await this.prisma.goldDailyClose.findMany({
      where: {
        brandCode,
        priceType: PriceType.SELL,
        denominationGram,
        closeDate: { gte: from, lte: to },
      },
      orderBy: { closeDate: 'asc' },
    })

    logQuery('getSpotPriceSeries', Date.now() - startTime, {
      brandCode,
      from,
      to,
      count: prices.length
    })

    return prices.map((p) => ({
      id: p.id,
      brandCode: p.brandCode,
      priceType: p.priceType as unknown as import('@/applications/shared/domain/price.contract').PriceType,
      denominationGram: p.denominationGram,
      price: Number(p.price),
      priceAt: p.closeDate,
      source: p.source,
    }))
  }

  async getTodayPrices(
    brandCode?: string,
    denominationGram?: Decimal
  ): Promise<TodayPriceGroup[]> {
    const startTime = Date.now()

    // Fetch the last 2 days so we can compute a proper daily delta
    // (comparing today's price to yesterday's, not to an earlier same-day scrape)
    const now = new Date()
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday.setHours(0, 0, 0, 0)
    const endOfDay = new Date(now)
    endOfDay.setHours(23, 59, 59, 999)

    const prices = await this.prisma.goldPrice.findMany({
      where: {
        ...(brandCode && { brandCode }),
        ...(denominationGram && { denominationGram }),
        priceType: { in: [PriceType.SELL, PriceType.BUYBACK] },
        priceAt: { gte: yesterday, lte: endOfDay },
      },
      orderBy: [{ brandCode: 'asc' }, { denominationGram: 'asc' }, { priceAt: 'desc' }],
    })

    logQuery('getTodayPrices', Date.now() - startTime, {
      brandCode,
      count: prices.length
    })

    // Group by brand + denomination and track trends
    const grouped = new Map<string, TodayPriceGroup>()
    // Track which calendar day the primary price belongs to, for cross-day delta
    const primaryDays = new Map<string, { sell: string | null, buyback: string | null }>()

    for (const price of prices) {
      const key = `${price.brandCode}_${price.denominationGram.toString()}`
      const priceDay = price.priceAt.toISOString().split('T')[0]

      if (!grouped.has(key)) {
        grouped.set(key, {
          brand: price.brandCode,
          denominationGram: price.denominationGram.toNumber(),
          sellPrice: null,
          buybackPrice: null,
          sellDelta: null,
          buybackDelta: null,
          lastUpdated: price.priceAt,
        })
        primaryDays.set(key, { sell: null, buyback: null })
      }

      const group = grouped.get(key)!
      const days = primaryDays.get(key)!

      // Keep the latest timestamp found for this group
      if (price.priceAt > group.lastUpdated) {
        group.lastUpdated = price.priceAt
      }

      const priceVal = Number(price.price)

      if (price.priceType === PriceType.SELL) {
        if (group.sellPrice === null) {
          group.sellPrice = priceVal
          days.sell = priceDay
        } else if (group.sellDelta === null && days.sell !== priceDay) {
          // Only compute delta when comparing prices from different calendar days
          // This gives a meaningful daily change (today vs yesterday)
          group.sellDelta = group.sellPrice - priceVal
        }
      } else if (price.priceType === PriceType.BUYBACK) {
        if (group.buybackPrice === null) {
          group.buybackPrice = priceVal
          days.buyback = priceDay
        } else if (group.buybackDelta === null && days.buyback !== priceDay) {
          group.buybackDelta = group.buybackPrice - priceVal
        }
      }
    }

    return Array.from(grouped.values())
  }

  async saveBatch(prices: import('../domain/gold-price').CreatePriceInput[]): Promise<{
    inserted: number
    skipped: number
  }> {
    const startTime = Date.now()

    if (prices.length === 0) {
      return { inserted: 0, skipped: 0 }
    }

    const result = await this.prisma.goldPrice.createMany({
      data: prices.map(p => ({
        brandCode: p.brandCode,
        brandName: p.brandName,
        priceType: p.priceType,
        denominationGram: new Decimal(p.denominationGram),
        price: p.price,
        priceAt: p.priceAt,
        recordedAt: new Date(), // Set ingestion time
        source: p.source,
        rawPayload: p.rawPayload as import('@prisma/client').Prisma.InputJsonValue
      })),
      skipDuplicates: true
    })

    const inserted = result.count
    const skipped = prices.length - inserted

    logQuery('saveBatch', Date.now() - startTime, {
      count: prices.length,
      inserted,
      skipped
    })

    return { inserted, skipped }
  }

  /**
   * Convert Prisma model to domain model
   */
  private toDomainModel(price: GoldPrice): GoldPriceRecord {
    return {
      id: price.id,
      brandCode: price.brandCode,
      priceType: price.priceType as unknown as import('@/applications/shared/domain/price.contract').PriceType,
      denominationGram: price.denominationGram,
      price: Number(price.price), // BigInt → number
      priceAt: price.priceAt,
      source: price.source,
    }
  }

  async getActiveBrandGramCombinations(): Promise<Array<{ brandCode: string, denominationGram: Decimal }>> {
    const baseMarkets = await this.prisma.goldPrice.groupBy({
      by: ['brandCode', 'denominationGram'],
    })
    return baseMarkets.map(m => ({
      brandCode: m.brandCode,
      denominationGram: new Decimal(m.denominationGram)
    }))
  }

  async findLatestPriceForTypes(
    brandCode: string,
    denominationGram: Decimal,
    candidateTypes: string[],
    start: Date,
    end: Date
  ): Promise<{ price: number, priceAt: Date } | null> {
    const latestPrice = await this.prisma.goldPrice.findFirst({
      where: {
        brandCode,
        priceType: { in: candidateTypes as PriceType[] }, // Enforce Prisma PriceType here if needed
        denominationGram,
        priceAt: {
          gte: start,
          lt: end
        }
      },
      orderBy: { priceAt: 'desc' }
    })

    if (!latestPrice) return null

    return {
      price: Number(latestPrice.price),
      priceAt: latestPrice.priceAt
    }
  }
}
