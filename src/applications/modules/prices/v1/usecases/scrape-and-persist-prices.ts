import { PriceType } from '@prisma/client'
import { IPriceRepository } from '../repository/price-repository.interface'
import { Galeri24Scraper, RawPriceData } from '@/applications/shared/scrapers/galeri24.scraper'
import { CreatePriceInput } from '../domain/gold-price'
import { ScraperLogger } from '@/applications/shared/scrapers/scraper-logger'

export class ScrapeAndPersistPrices {
  constructor(private priceRepository: IPriceRepository) { }

  async execute(): Promise<{ success: boolean, inserted: number, skipped: number }> {
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

        // 2. Create Derived SPOT price (Reference Truth)
        // Per instructions: Derived SPOT must be inserted.
        // We use SELL price as the base for SPOT in this context.
        // User Requirement: Only ANTAM 1g generates a SPOT record.
        if (raw.brand === 'ANTAM' && raw.denominationGram === 1 && raw.sellPrice) {
          pricesToSave.push({
            brandCode: raw.brand,
            brandName: raw.brand,
            priceType: PriceType.SPOT,
            denominationGram: raw.denominationGram,
            price: raw.sellPrice, // SPOT derived from SELL (Identity for now)
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

      // 3. Persist
      console.log(`[ScrapeAndPersistPrices] Persisting ${pricesToSave.length} records...`)
      const result = await this.priceRepository.saveBatch(pricesToSave)

      // 4. Log Result
      logger.log('success', {
        itemsExtracted: rawPrices.length,
        recordsInserted: result.inserted,
        recordsSkipped: result.skipped,
      })

      console.log(`[ScrapeAndPersistPrices] Success: Inserted ${result.inserted}, Skipped ${result.skipped}`)
      return {
        success: true,
        inserted: result.inserted,
        skipped: result.skipped
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
