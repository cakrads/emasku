import { PrismaClient, GoldDailyClose, PriceType } from '@prisma/client'
import { logger } from '@/applications/shared/lib/logger'
import { Decimal } from 'decimal.js'
import { IGoldDailyCloseRepository } from './daily-close-repository.interface'

export class PrismaGoldDailyCloseRepository implements IGoldDailyCloseRepository {
  constructor(private readonly prisma: PrismaClient) { }

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

    const result = await this.prisma.goldDailyClose.upsert({
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
    return this.prisma.goldDailyClose.findUnique({
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
    return this.prisma.goldDailyClose.findFirst({
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

    const orValues = items.map((_, i) => `($${i * 2 + 1}::text, $${i * 2 + 2}::numeric)`).join(', ')
    const params: unknown[] = []
    for (const item of items) {
      params.push(item.brandCode, item.denominationGram)
    }

    type RawRow = {
      id: string
      brandCode: string
      priceType: string
      denomination_gram: string
      price: bigint
      currency: string
      closeDate: Date
      source: string
      derivedFromPriceAt: Date
      createdAt: Date
    }

    const rows = await this.prisma.$queryRawUnsafe<RawRow[]>(`
      SELECT DISTINCT ON ("brandCode", "denominationGram")
        id,
        "brandCode",
        "priceType",
        "denominationGram" AS denomination_gram,
        price,
        currency,
        "closeDate",
        source,
        "derivedFromPriceAt",
        "createdAt"
      FROM "GoldDailyClose"
      WHERE "priceType" = 'BUYBACK'
        AND ("brandCode", "denominationGram") IN (${orValues})
      ORDER BY "brandCode", "denominationGram", "closeDate" DESC
    `, ...params)

    return rows.map(row => ({
      id: row.id,
      brandCode: row.brandCode,
      priceType: row.priceType as GoldDailyClose['priceType'],
      denominationGram: new Decimal(row.denomination_gram),
      price: row.price,
      currency: row.currency,
      closeDate: row.closeDate,
      source: row.source,
      derivedFromPriceAt: row.derivedFromPriceAt,
      createdAt: row.createdAt,
    }))
  }
  /**
   * Batch fetch Daily Closes for specific brand/type/gram/date keys.
   */
  async getByDateBatch(
    items: { brandCode: string; priceType: PriceType; denominationGram: Decimal; closeDate: Date }[]
  ): Promise<GoldDailyClose[]> {
    if (items.length === 0) return []

    return this.prisma.goldDailyClose.findMany({
      where: {
        OR: items.map(item => ({
          brandCode: item.brandCode,
          priceType: item.priceType,
          denominationGram: new Decimal(item.denominationGram),
          closeDate: item.closeDate
        }))
      }
    })
  }
}
