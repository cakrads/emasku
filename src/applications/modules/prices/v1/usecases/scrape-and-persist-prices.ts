import { PriceType } from '@prisma/client'
import { IPriceRepository } from '../repository/price-repository.interface'
import { Galeri24Scraper, RawPriceData } from '@/applications/shared/scrapers/galeri24.scraper'
import { CreatePriceInput } from '../domain/gold-price'
import { ScraperLogger } from '@/applications/shared/scrapers/scraper-logger'
import { ComputeDailyCloseUsecase } from './compute-daily-close.usecase'

export class ScrapeAndPersistPrices {
  constructor(
    private priceRepository: IPriceRepository,
    private computeDailyClose: ComputeDailyCloseUsecase
  ) { }

  async execute(): Promise<{ success: boolean, inserted: number, skipped: number, dailyCloseProcessed?: number }> {
    const logger = new ScraperLogger()
    const scraper = new Galeri24Scraper()

    console.log('[ScrapeAndPersistPrices] Starting execution')

    try {
      // 1. Scrape
      const rawPrices: RawPriceData[] = await scraper.scrape()

      if (rawPrices.length === 0) {
        console.warn('[ScrapeAndPersistPrices] No prices scraped')
        return { success: true, inserted: 0, skipped: 0 }
      }

      // 2. Transform to Domain Input
      const pricesToSave: CreatePriceInput[] = []

      for (const raw of rawPrices) {
        const commonTimestamp = raw.timestamp || new Date()

        // 1. Create SELL price (Market Truth)
        if (raw.sellPrice) {
          pricesToSave.push({
            brandCode: raw.brand,
            brandName: raw.brand, // For standard brands, code equals name
            priceType: PriceType.SELL,
            denominationGram: raw.denominationGram,
            price: raw.sellPrice,
            priceAt: commonTimestamp,
            source: 'Galeri24 Scraper',
            rawPayload: raw
          })
        }


        // 3. Create BUYBACK price
        if (raw.buybackPrice) {
          pricesToSave.push({
            brandCode: raw.brand,
            brandName: raw.brand,
            priceType: PriceType.BUYBACK,
            denominationGram: raw.denominationGram,
            price: raw.buybackPrice,
            priceAt: commonTimestamp,
            source: 'Galeri24 Scraper',
            rawPayload: raw
          })
        }
      }

      // 3. Persist Intraday Prices
      console.log(`[ScrapeAndPersistPrices] Persisting ${pricesToSave.length} records...`)
      const result = await this.priceRepository.saveBatch(pricesToSave)

      // 4. Update Daily Close (Real-time PnL Update)
      // This ensures that Dashboard shows the latest move relative to yesterday
      let dailyCloseProcessed = 0
      try {
        const now = new Date()
        const wibOffset = 7 * 60 * 60 * 1000
        const wibNow = new Date(now.getTime() + wibOffset)

        const todayStr = wibNow.toISOString().split('T')[0]

        const yesterday = new Date(wibNow)
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = yesterday.toISOString().split('T')[0]

        console.log(`[ScrapeAndPersistPrices] Updating daily close for Today(${todayStr}) and Yesterday(${yesterdayStr})`)

        const todayResult = await this.computeDailyClose.execute(todayStr)
        const yesterdayResult = await this.computeDailyClose.execute(yesterdayStr)

        dailyCloseProcessed = todayResult.processed + yesterdayResult.processed
      } catch (closeError) {
        console.error('[ScrapeAndPersistPrices] Failed to update daily close:', closeError)
      }

      // 5. Log Result
      logger.log('success', {
        itemsExtracted: rawPrices.length,
        recordsInserted: result.inserted,
        recordsSkipped: result.skipped,
        dailyCloseProcessed
      })

      console.log(`[ScrapeAndPersistPrices] Success: Inserted ${result.inserted}, Skipped ${result.skipped}, DailyClose: ${dailyCloseProcessed}`)
      return {
        success: true,
        inserted: result.inserted,
        skipped: result.skipped,
        dailyCloseProcessed
      }

    } catch (error) {
      console.error('[ScrapeAndPersistPrices] Failed:', error)
      logger.log('error', {
        error: error instanceof Error ? error.message : String(error),
      })
      throw error
    }
  }
}
