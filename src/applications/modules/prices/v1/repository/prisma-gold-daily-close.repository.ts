import { prisma } from '@/applications/shared/persistence/prisma-client'
import { GoldDailyClose, PriceType } from '@prisma/client'
import { logger } from '@/applications/shared/lib/logger'
import { Decimal } from 'decimal.js'

export class PrismaGoldDailyCloseRepository {
  /**
   * Upsert a daily close record.
   * If record exists for (brand, type, gram, date), update it (idempotent).
   */
  async upsert(data: {
    brandCode: string
    priceType: PriceType
    denominationGram: Decimal
    price: bigint
    closeDate: Date
    source: string
    derivedFromPriceAt: Date
  }): Promise<GoldDailyClose> {
    const startTime = Date.now()

    const result = await prisma.goldDailyClose.upsert({
      where: {
        brandCode_priceType_denominationGram_closeDate: {
          brandCode: data.brandCode,
          priceType: data.priceType,
          denominationGram: new Decimal(data.denominationGram),
          closeDate: data.closeDate
        }
      },
      update: {
        price: data.price,
        source: data.source,
        derivedFromPriceAt: data.derivedFromPriceAt,
        // Don't update brandCode, denominationGram as they are part of key
      },
      create: {
        brandCode: data.brandCode,
        priceType: data.priceType,
        denominationGram: new Decimal(data.denominationGram),
        price: data.price,
        closeDate: data.closeDate,
        source: data.source,
        derivedFromPriceAt: data.derivedFromPriceAt
      }
    })

    logger.debug('Upserted GoldDailyClose', {
      brand: data.brandCode,
      date: data.closeDate.toISOString().split('T')[0],
      duration: Date.now() - startTime
    })

    return result
  }

  /**
   * Get Daily Close for specific date
   */
  async getByDate(
    brandCode: string,
    priceType: PriceType,
    denominationGram: Decimal,
    date: Date
  ): Promise<GoldDailyClose | null> {
    return prisma.goldDailyClose.findUnique({
      where: {
        brandCode_priceType_denominationGram_closeDate: {
          brandCode,
          priceType,
          denominationGram: new Decimal(denominationGram),
          closeDate: date
        }
      }
    })
  }

  /**
   * Get the LAST available Daily Close strictly before the given date.
   * Used for calculating PnL (Yesterday's Close).
   */
  async getPreviousClose(
    brandCode: string,
    priceType: PriceType,
    denominationGram: Decimal,
    beforeDate: Date
  ): Promise<GoldDailyClose | null> {
    // Find the most recent closeDate < beforeDate
    return prisma.goldDailyClose.findFirst({
      where: {
        brandCode,
        priceType,
        denominationGram: new Decimal(denominationGram),
        closeDate: {
          lt: beforeDate
        }
      },
      orderBy: {
        closeDate: 'desc'
      }
    })
  }
  /**
   * Get latest BUYBACK prices for a list of items.
   * Uses distinct on brand+denomination to get the most recent record for each.
   */
  async getLatestBuybackPrices(
    items: { brandCode: string; denominationGram: number }[]
  ): Promise<GoldDailyClose[]> {
    if (items.length === 0) return []

    // Build OR clause for items
    const orConditions = items.map(item => ({
      brandCode: item.brandCode,
      denominationGram: new Decimal(item.denominationGram)
    }))

    return prisma.goldDailyClose.findMany({
      where: {
        priceType: 'BUYBACK',
        OR: orConditions,
        // Optional: limit to recent history to optimize (e.g. last 30 days) if needed
        // but for now, trusting the index.
      },
      distinct: ['brandCode', 'denominationGram'],
      orderBy: [
        { brandCode: 'asc' },
        { denominationGram: 'asc' },
        { closeDate: 'desc' }
      ]
    })
  }
}
