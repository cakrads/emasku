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
      priceType: p.priceType,
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

    // Get latest prices for each brand/denomination combination
    // We'll fetch all SELL and BUYBACK prices and group them
    // Bound to today's temporal window (00:00:00–23:59:59) to prevent stale data
    const now = new Date()
    const startOfDay = new Date(now)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(now)
    endOfDay.setHours(23, 59, 59, 999)

    const prices = await this.prisma.goldPrice.findMany({
      where: {
        ...(brandCode && { brandCode }),
        ...(denominationGram && { denominationGram }),
        priceType: { in: [PriceType.SELL, PriceType.BUYBACK] },
        recordedAt: { gte: startOfDay, lte: endOfDay },
      },
      orderBy: [{ brandCode: 'asc' }, { denominationGram: 'asc' }, { recordedAt: 'desc' }],
    })

    logQuery('getTodayPrices', Date.now() - startTime, {
      brandCode,
      count: prices.length
    })

    // Group by brand + denomination and track trends
    const grouped = new Map<string, TodayPriceGroup>()

    for (const price of prices) {
      const key = `${price.brandCode}_${price.denominationGram.toString()}`

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
      }

      const group = grouped.get(key)!
      // Keep the latest timestamp found for this group
      if (price.priceAt > group.lastUpdated) {
        group.lastUpdated = price.priceAt
      }

      const priceVal = Number(price.price)

      if (price.priceType === PriceType.SELL) {
        if (group.sellPrice === null) {
          group.sellPrice = priceVal
        } else if (group.sellDelta === null && priceVal !== group.sellPrice) {
          // Found the first DIFFERENT price in history - this is our trend baseline
          group.sellDelta = group.sellPrice - priceVal
        }
      } else if (price.priceType === PriceType.BUYBACK) {
        if (group.buybackPrice === null) {
          group.buybackPrice = priceVal
        } else if (group.buybackDelta === null && priceVal !== group.buybackPrice) {
          // Found the first DIFFERENT price in history - this is our trend baseline
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
      priceType: price.priceType,
      denominationGram: price.denominationGram,
      price: Number(price.price), // BigInt → number
      priceAt: price.priceAt,
      source: price.source,
    }
  }
}
