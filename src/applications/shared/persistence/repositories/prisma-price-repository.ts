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
}
