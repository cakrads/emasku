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
      orderBy: { recordedAt: 'desc' }
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
      orderBy: { recordedAt: 'desc' }, // Use recordedAt to break ties if priceAt is same
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

    // Fetch batch prices (most granular query possible)
    const priceRecords = await Promise.all(
      keys.map(async (key) => {
        const [brandCode, denomStr] = key.split(':')
        const denominationGram = parseFloat(denomStr)
        const price = await this.getLatestBuybackPrice(brandCode, denominationGram)
        return { key, price }
      })
    )

    for (const item of priceRecords) {
      if (item.price) {
        results[item.key] = item.price
      }
    }

    return results
  }
}
