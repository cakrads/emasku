/**
 * Prisma Price Repository
 * 
 * Shared repository for fetching current market prices.
 * Used by portfolio and market modules.
 */

import { PrismaClient, PriceType } from '@prisma/client'
import { logger } from '@/applications/shared/lib/logger'
import { IPriceRepository, PriceResult } from '@/applications/shared/domain/price.contract'

export class PrismaPriceRepository implements IPriceRepository {
  constructor(private readonly prisma: PrismaClient) { }
  /**
   * Get latest BUYBACK price for brand/denomination.
   * Returns null if no BUYBACK price exists.
   */
  async getLatestBuybackPrice(
    brandCode: string,
    denominationGram: number
  ): Promise<PriceResult | null> {
    return this.getLatestPrice(brandCode, denominationGram, PriceType.BUYBACK)
  }

  /**
   * Get latest SELL price for brand/denomination.
   */
  async getLatestSellPrice(
    brandCode: string,
    denominationGram: number
  ): Promise<PriceResult | null> {
    return this.getLatestPrice(brandCode, denominationGram, PriceType.SELL)
  }


  /**
   * Generic price fetcher with fallback to null.
   * NO assumptions about price availability.
   */
  private async getLatestPrice(
    brandCode: string,
    denominationGram: number,
    priceType: PriceType
  ): Promise<PriceResult | null> {
    const startTime = Date.now()

    const priceRecord = await this.prisma.goldPrice.findFirst({
      where: {
        brandCode,
        denominationGram,
        priceType
      },
      orderBy: { priceAt: 'desc' }
    })

    const duration = Date.now() - startTime
    if (duration > 100) {
      logger.warn('Slow price query', { brandCode, denominationGram, priceType, duration })
    }

    if (!priceRecord) {
      logger.debug('No price found', { brandCode, denominationGram, priceType })
      return null
    }

    // Convert BigInt to number
    return {
      price: Number(priceRecord.price),
      priceAt: priceRecord.priceAt
    }
  }

  /**
   * Get the penultimate price record for comparison.
   */
  async getPreviousPrice(
    brandCode: string,
    denominationGram: number,
    priceType: PriceType
  ): Promise<PriceResult | null> {
    const records = await this.prisma.goldPrice.findMany({
      where: {
        brandCode,
        denominationGram,
        priceType
      },
      orderBy: [
        { priceAt: 'desc' }
      ],
      take: 2
    })

    if (records.length < 2) return null

    const prev = records[1]
    return {
      price: Number(prev.price),
      priceAt: prev.priceAt
    }
  }

  /**
   * Batch fetch latest BUYBACK prices for multiple brand:denomination keys.
   */
  async getLatestBuybackPrices(keys: string[]): Promise<Record<string, PriceResult>> {
    return this.getLatestPricesDict(keys, PriceType.BUYBACK)
  }

  /**
   * Batch fetch latest SELL prices for multiple brand:denomination keys.
   */
  async getLatestSellPrices(keys: string[]): Promise<Record<string, PriceResult>> {
    return this.getLatestPricesDict(keys, PriceType.SELL)
  }

  /**
   * Generic batch fetch for latest prices of a specific type.
   */
  private async getLatestPricesDict(keys: string[], priceType: PriceType): Promise<Record<string, PriceResult>> {
    const results: Record<string, PriceResult> = {}
    if (keys.length === 0) return results

    const keyMapping: Record<string, string[]> = {}
    const parsedConditions: Array<{ brandCode: string; denominationGram: number }> = []

    for (const key of keys) {
      const parts = key.split(':')
      if (parts.length !== 2) continue
      const [brandCode, denomStr] = parts
      const denominationGram = parseFloat(denomStr)
      if (!brandCode || isNaN(denominationGram)) continue
      const normalizedKey = `${brandCode.trim()}:${denominationGram}`
      if (!keyMapping[normalizedKey]) {
        keyMapping[normalizedKey] = []
        parsedConditions.push({ brandCode: brandCode.trim(), denominationGram })
      }
      keyMapping[normalizedKey].push(key)
    }

    if (parsedConditions.length === 0) return results

    // Use DISTINCT ON for O(log N) index scan instead of Prisma distinct (full table scan)
    const priceTypeStr = priceType as string
    const orValues = parsedConditions
      .map((_, i) => `($${i * 2 + 2}::text, $${i * 2 + 3}::numeric)`)
      .join(', ')
    const params: unknown[] = [priceTypeStr]
    for (const c of parsedConditions) {
      params.push(c.brandCode, c.denominationGram)
    }

    type RawRow = { brand_code: string; denomination_gram: string; price: bigint; price_at: Date }
    const priceRecords = await this.prisma.$queryRawUnsafe<RawRow[]>(`
      SELECT DISTINCT ON ("brandCode", "denominationGram")
        "brandCode" AS brand_code,
        "denominationGram" AS denomination_gram,
        price,
        "priceAt" AS price_at
      FROM "GoldPrice"
      WHERE "priceType" = $1
        AND ("brandCode", "denominationGram") IN (${orValues})
      ORDER BY "brandCode", "denominationGram", "priceAt" DESC
    `, ...params)

    for (const record of priceRecords) {
      const normalizedKey = `${record.brand_code}:${Number(record.denomination_gram)}`
      const originalKeys = keyMapping[normalizedKey]
      if (originalKeys) {
        for (const originalKey of originalKeys) {
          results[originalKey] = {
            price: Number(record.price),
            priceAt: record.price_at
          }
        }
      }
    }

    return results
  }
}
