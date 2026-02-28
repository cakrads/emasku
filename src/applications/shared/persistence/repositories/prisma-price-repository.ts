/**
 * Prisma Price Repository
 * 
 * Shared repository for fetching current market prices.
 * Used by portfolio and market modules.
 */

import { prisma } from '../prisma-client'
import { PriceType } from '@prisma/client'
import { logger } from '@/applications/shared/lib/logger'

export interface PriceResult {
  price: number
  priceAt: Date
}

export class PrismaPriceRepository {
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

    const priceRecord = await prisma.goldPrice.findFirst({
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
    const records = await prisma.goldPrice.findMany({
      where: {
        brandCode,
        denominationGram,
        priceType
      },
      orderBy: [
        { priceAt: 'desc' },
        { recordedAt: 'desc' }
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
   * Get latest BUYBACK prices for multiple keys.
   * Key format: "brandCode:denominationGram"
   */
  async getLatestBuybackPrices(keys: string[]): Promise<Record<string, PriceResult>> {
    const results: Record<string, PriceResult> = {}
    if (keys.length === 0) return results

    const parsedKeys = keys.map(key => {
      const [brandCode, denomStr] = key.split(':')
      return {
        brandCode,
        denominationGram: parseFloat(denomStr)
      }
    })

    // Batch fetch latest prices using distinct on brand + denomination
    // Order by recordedAt desc ensures the distinct pick is the latest record
    const priceRecords = await prisma.goldPrice.findMany({
      where: {
        priceType: PriceType.BUYBACK,
        OR: parsedKeys
      },
      orderBy: [
        { brandCode: 'asc' },
        { denominationGram: 'asc' },
        { priceAt: 'desc' }
      ],
      distinct: ['brandCode', 'denominationGram']
    })

    for (const record of priceRecords) {
      const key = `${record.brandCode}:${Number(record.denominationGram)}`
      results[key] = {
        price: Number(record.price),
        priceAt: record.priceAt
      }
    }

    return results
  }
}
