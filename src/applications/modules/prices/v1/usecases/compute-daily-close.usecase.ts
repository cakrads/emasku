import { PriceType } from '@/applications/shared/domain/price.contract'
import { Decimal } from 'decimal.js'
import { IPriceRepository } from '../repository/price-repository.interface'
import { IGoldDailyCloseRepository } from '../repository/daily-close-repository.interface'

export class ComputeDailyCloseUsecase {
  constructor(
    private readonly priceRepo: IPriceRepository,
    private readonly dailyCloseRepo: IGoldDailyCloseRepository
  ) { }

  /**
   * Execute daily close computation for a specific date (WIB).
   * If no date is provided, defaults to yesterday.
   */
  async execute(targetDateStr?: string) {
    const dateStr = targetDateStr || this.getYesterdayWIBStr()

    console.log(`[ComputeDailyClose] Processing: ${dateStr} (WIB)`)
    const closeDate = new Date(dateStr)
    const boundaries = this.getDateBoundaries(dateStr)

    // 1. Identify all active brand/gram combinations
    const baseMarkets = await this.priceRepo.getActiveBrandGramCombinations()

    console.log(`[ComputeDailyClose] Found ${baseMarkets.length} base market combinations.`)

    const roles = [PriceType.SELL, PriceType.BUYBACK]
    const tasks: Promise<boolean>[] = []

    // 2. Queue all market/role combinations for processing
    for (const market of baseMarkets) {
      for (const role of roles) {
        tasks.push(this.processMarketRole(
          market.brandCode,
          new Decimal(market.denominationGram),
          role,
          closeDate,
          boundaries
        ))
      }
    }

    const results = await Promise.all(tasks)
    const processedCount = results.filter(Boolean).length

    console.log(`[ComputeDailyClose] Finished. Updated ${processedCount} records.`)
    return { success: true, processed: processedCount }
  }

  private async processMarketRole(
    brandCode: string,
    gram: Decimal,
    role: PriceType,
    closeDate: Date,
    boundaries: { start: Date, end: Date }
  ): Promise<boolean> {
    // 1. Find Latest Price for THIS ROLE on THIS DAY
    const candidateTypes = role === PriceType.SELL
      ? [PriceType.SELL, PriceType.RETAIL]
      : [PriceType.BUYBACK]

    const latestPrice = await this.priceRepo.findLatestPriceForTypes(
      brandCode,
      gram,
      candidateTypes,
      boundaries.start,
      boundaries.end
    )

    let priceToUse: bigint | null = null
    let derivedFrom: Date | null = null
    let source = 'SYSTEM_DAILY_CLOSE'

    if (latestPrice) {
      priceToUse = BigInt(Math.round(latestPrice.price))
      derivedFrom = latestPrice.priceAt
    } else {
      // 2. Carry Forward from PREVIOUS DAY'S Close
      const prevDate = new Date(closeDate)
      prevDate.setDate(prevDate.getDate() - 1)

      const prevClose = await this.dailyCloseRepo.getByDate(brandCode, role as any, gram, prevDate)

      if (prevClose) {
        priceToUse = prevClose.price
        derivedFrom = prevClose.derivedFromPriceAt
        source = 'SYSTEM_DAILY_CLOSE_CARRY'
      }
    }

    if (priceToUse !== null && derivedFrom !== null) {
      await this.dailyCloseRepo.upsert({
        brandCode,
        priceType: role as any,
        denominationGram: gram,
        price: priceToUse,
        closeDate,
        source,
        derivedFromPriceAt: derivedFrom
      })
      return true
    }

    return false
  }

  private getYesterdayWIBStr(): string {
    const now = new Date()
    const wibNow = new Date(now.getTime() + 7 * 60 * 60 * 1000)
    wibNow.setDate(wibNow.getDate() - 1)
    return wibNow.toISOString().split('T')[0]
  }

  /**
   * Calculate UTC boundaries for a WIB date string (YYYY-MM-DD)
   */
  private getDateBoundaries(dateStr: string) {
    const wibOffset = 7 * 60 * 60 * 1000
    const d = new Date(dateStr)
    const utcMidnight = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))

    // 00:00 WIB in UTC is 17:00 Previous Day
    const start = new Date(utcMidnight.getTime() - wibOffset)
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000)

    return { start, end }
  }
}
