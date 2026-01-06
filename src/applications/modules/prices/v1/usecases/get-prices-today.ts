/**
 * Get Prices Today Usecase
 * 
 * Business logic to fetch current sell and buyback prices for all brands.
 * Returns domain models (NOT API contract types).
 */

import { logger } from '@/applications/shared/lib/logger'
import { prisma } from '@/applications/shared/persistence/prisma-client'
import { BrandDenominationPrice } from '../domain/prices.domain'

export class GetPricesTodayUsecase {
  async execute(): Promise<BrandDenominationPrice[]> {
    logger.info('Fetching today prices from DB')

    try {
      // Fetch latest prices for each brand/denom/type combination
      const rawPrices = await prisma.goldPrice.findMany({
        distinct: ['brandCode', 'denominationGram', 'priceType'],
        orderBy: {
          priceAt: 'desc',
        },
      })

      if (rawPrices.length === 0) {
        logger.warn('No prices found in DB, returning empty list')
        return []
      }

      // Group by Brand + Denom
      const grouped = new Map<string, BrandDenominationPrice>()

      for (const record of rawPrices) {
        // Create unique key for grouping
        const key = `${record.brandCode}-${record.denominationGram}`

        if (!grouped.has(key)) {
          grouped.set(key, {
            brand: record.brandName, // Use brandName for display
            denominationGram: Number(record.denominationGram),
            sellPrice: 0,
            buybackPrice: 0
          })
        }

        const group = grouped.get(key)!
        const priceValue = Number(record.price)

        if (record.priceType === 'SELL') {
          group.sellPrice = priceValue
        } else if (record.priceType === 'BUYBACK') {
          group.buybackPrice = priceValue
        }
      }

      // Convert Map to Array and sort
      // Sort priority: Brand (ANTAM first), then Denom (asc)
      const results = Array.from(grouped.values()).sort((a, b) => {
        if (a.brand !== b.brand) {
          if (a.brand.includes('ANTAM')) return -1
          if (b.brand.includes('ANTAM')) return 1
          return a.brand.localeCompare(b.brand)
        }
        return a.denominationGram - b.denominationGram
      })

      logger.info('Today prices fetched', { count: results.length })
      return results

    } catch (error) {
      logger.error('Failed to fetch prices', error)
      throw error
    }
  }
}
