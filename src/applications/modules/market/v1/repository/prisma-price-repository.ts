/**
 * Prisma Implementation of Price Repository
 * 
 * Concrete adapter that implements IPriceRepository using Prisma.
 * Handles:
 * - BigInt → number conversion
 * - Timezone normalization
 * - Optimized queries
 */

import { PrismaClient, PriceType } from '@prisma/client'
import { Decimal } from 'decimal.js'
import { IPriceRepository } from './price-repository.interface'
import { GoldPriceRecord, TodayPriceGroup } from '../domain/gold-price'
import { logQuery } from '@/applications/shared/lib/logger'

export class PrismaPriceRepository implements IPriceRepository {
  constructor(private prisma: PrismaClient) { }

  async getLatestSpotPrice(
    brandCode: string,
    denominationGram: Decimal
  ): Promise<GoldPriceRecord | null> {
    const startTime = Date.now()

    const price = await this.prisma.goldPrice.findFirst({
      where: {
        brand: { code: brandCode },
        priceType: PriceType.SPOT,
        denominationGram,
      },
      orderBy: { priceAt: 'desc' },
      include: { brand: true },
    })

    logQuery('getLatestSpotPrice', Date.now() - startTime, { brandCode, denominationGram: denominationGram.toNumber() })

    if (!price) return null

    return this.toDomainModel(price)
  }

  async getPriceAt(
    brandCode: string,
    denominationGram: Decimal,
    timestamp: Date
  ): Promise<GoldPriceRecord | null> {
    const startTime = Date.now()

    const price = await this.prisma.goldPrice.findFirst({
      where: {
        brand: { code: brandCode },
        priceType: PriceType.SPOT,
        denominationGram,
        priceAt: { lte: timestamp },
      },
      orderBy: { priceAt: 'desc' },
      include: { brand: true },
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

    const prices = await this.prisma.goldPrice.findMany({
      where: {
        brand: { code: brandCode },
        priceType: PriceType.SPOT,
        denominationGram,
        priceAt: {
          gte: from,
          lte: to,
        },
      },
      orderBy: { priceAt: 'asc' },
      include: { brand: true },
    })

    logQuery('getSpotPriceSeries', Date.now() - startTime, {
      brandCode,
      from,
      to,
      count: prices.length
    })

    return prices.map((p) => this.toDomainModel(p))
  }

  async getTodayPrices(
    brandCode?: string,
    denominationGram?: Decimal
  ): Promise<TodayPriceGroup[]> {
    const startTime = Date.now()

    // Get latest prices for each brand/denomination combination
    // We'll fetch all SELL and BUYBACK prices and group them
    const prices = await this.prisma.goldPrice.findMany({
      where: {
        ...(brandCode && { brand: { code: brandCode } }),
        ...(denominationGram && { denominationGram }),
        priceType: { in: [PriceType.SELL, PriceType.BUYBACK] },
      },
      include: { brand: true },
      orderBy: [{ brand: { code: 'asc' } }, { denominationGram: 'asc' }, { priceAt: 'desc' }],
    })

    logQuery('getTodayPrices', Date.now() - startTime, {
      brandCode,
      count: prices.length
    })

    // Group by brand + denomination and take only the latest price for each type
    const grouped = new Map<string, TodayPriceGroup>()
    const latestPriceKeys = new Set<string>()

    for (const price of prices) {
      const key = `${price.brand.code}_${price.denominationGram.toString()}`
      const priceTypeKey = `${key}_${price.priceType}`

      // Skip if we already have a price for this combination (since ordered by priceAt desc)
      if (latestPriceKeys.has(priceTypeKey)) continue

      latestPriceKeys.add(priceTypeKey)

      if (!grouped.has(key)) {
        grouped.set(key, {
          brand: price.brand.code,
          denominationGram: price.denominationGram.toNumber(),
          sellPrice: null,
          buybackPrice: null,
        })
      }

      const group = grouped.get(key)!
      const priceNum = Number(price.price)

      if (price.priceType === PriceType.SELL) {
        group.sellPrice = priceNum
      } else if (price.priceType === PriceType.BUYBACK) {
        group.buybackPrice = priceNum
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

    // 1. Resolve Brand IDs
    // We need to map brandCode -> brandId
    const distinctCodes = Array.from(new Set(prices.map(p => p.brandCode)))

    // Fetch brands
    const brands = await this.prisma.brand.findMany({
      where: { code: { in: distinctCodes } }
    })

    const brandMap = new Map<string, string>()
    brands.forEach(b => brandMap.set(b.code, b.id))

    // Filter out prices with unknown brands
    const validPrices = []
    const unknownBrands = new Set<string>()

    for (const p of prices) {
      if (brandMap.has(p.brandCode)) {
        validPrices.push({
          ...p,
          brandId: brandMap.get(p.brandCode)!
        })
      } else {
        unknownBrands.add(p.brandCode)
      }
    }

    if (unknownBrands.size > 0) {
      console.warn(`[PrismaPriceRepository] Skipping unknown brands: ${Array.from(unknownBrands).join(', ')}`)
    }

    if (validPrices.length === 0) {
      return { inserted: 0, skipped: prices.length }
    }

    // 2. Perform Batch Insert
    // skipDuplicates: true ensures idempotency (conflicts on unique key are ignored)
    const result = await this.prisma.goldPrice.createMany({
      data: validPrices.map(p => ({
        brandId: p.brandId,
        priceType: p.priceType,
        denominationGram: new Decimal(p.denominationGram),
        price: p.price,
        priceAt: p.priceAt,
        recordedAt: new Date(), // Set ingestion time
        source: p.source,
        rawPayload: p.rawPayload
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
  private toDomainModel(price: any): GoldPriceRecord {
    return {
      id: price.id,
      brandCode: price.brand.code,
      priceType: price.priceType,
      denominationGram: price.denominationGram,
      price: Number(price.price), // BigInt → number
      priceAt: price.priceAt,
      source: price.source,
    }
  }
}
