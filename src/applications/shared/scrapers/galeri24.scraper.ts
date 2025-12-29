/**
 * Galeri24 Gold Price Scraper
 * 
 * This scraper fetches current gold prices from Galeri24.co.id and persists them
 * to the GoldPrice table with proper brand and price type mapping.
 * 
 * Design Principles:
 * - Insert-only (idempotent via skipDuplicates)
 * - Preserve original timestamps from source
 * - Defensive error handling
 * - Observable logging
 */

import { PrismaClient, PriceType } from '@prisma/client'
import { Decimal } from 'decimal.js'
import { SCRAPER_SOURCE_URL } from '../lib/env'

/**
 * Raw price structure from upstream source
 */
interface RawPriceData {
  brand: string
  denominationGram: number
  sellPrice: number
  buybackPrice: number
  timestamp?: Date
}

/**
 * Normalized price ready for database insertion
 */
interface NormalizedPrice {
  brandId: string
  priceType: PriceType
  denominationGram: Decimal
  price: number
  priceAt: Date
  source: string
  rawPayload: any
}

export class Galeri24Scraper {
  private prisma: PrismaClient
  private sourceUrl: string

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
    this.sourceUrl = SCRAPER_SOURCE_URL
  }

  /**
   * Main entry point: Scrape and persist gold prices
   */
  /**
   * Main entry point: Scrape and persist gold prices
   */
  async scrapeAndPersist(): Promise<any> {
    const { ScraperLogger } = await import('./scraper-logger')
    const logger = new ScraperLogger()

    console.log(`[Galeri24] Starting scrape from ${this.sourceUrl}`)

    try {
      // Step 1: Fetch raw data
      const rawData = await this.fetchSourceData()

      // Step 2: Parse prices
      const parsedPrices = await this.parsePrices(rawData)

      // Step 3: Persist to database
      const { inserted, skipped, brandsSkipped, insertedRecords } = await this.persistPrices(parsedPrices)

      // Log success
      logger.log('success', {
        itemsExtracted: rawData.length,
        brandCombinations: parsedPrices.length,
        recordsInserted: inserted,
        recordsSkipped: skipped,
        brandsSkipped: Array.from(brandsSkipped),
        insertedRecords,
      })

      console.log(`[Galeri24] Scrape completed successfully`)
      console.log(`[Galeri24] Log saved to: ${logger.getLogPath()}`)
      console.log('\n' + logger.getSummary())

      return logger.getLastEntry()
    } catch (error) {
      // Log error
      logger.log('error', {
        error: error instanceof Error ? error.message : String(error),
      })

      console.error(`[Galeri24] Scrape failed:`, error)
      throw error // Re-throw to caller (API route will catch)
    }
  }

  /**
   * Fetch raw HTML/JSON from source
   */
  private async fetchSourceData(): Promise<any> {
    console.log(`[Galeri24] Fetching data from ${this.sourceUrl}`)

    const response = await fetch(this.sourceUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; EmasKu/1.0)',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const html = await response.text()

    // Extract __NUXT_DATA__ (structured JSON embedded in page)
    // Try multiple patterns as the exact format may vary
    let match = html.match(/<script[^>]*id="__NUXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)

    if (!match) {
      // Try alternative pattern
      match = html.match(/<script id="__NUXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)
    }

    if (!match) {
      console.error('[Galeri24] Could not find __NUXT_DATA__ script tag')
      console.log('[Galeri24] Saving HTML to debug-failed-scrape.html for inspection')
      // Save for debugging
      const fs = await import('fs')
      fs.writeFileSync('debug-failed-scrape.html', html)
      throw new Error('__NUXT_DATA__ not found in page source')
    }

    console.log(`[Galeri24] Found __NUXT_DATA__ script tag`)
    console.log(`[Galeri24] Data length: ${match[1].length} characters`)

    let rawPayload
    try {
      rawPayload = JSON.parse(match[1])
      console.log(`[Galeri24] Extracted __NUXT_DATA__ (${Array.isArray(rawPayload) ? rawPayload.length : typeof rawPayload} items)`)
    } catch (parseError) {
      console.error('[Galeri24] Failed to parse JSON')
      console.log(`[Galeri24] First 500 chars: ${match[1].substring(0, 500)}`)
      throw new Error(`JSON parse failed: ${parseError instanceof Error ? parseError.message : String(parseError)}`)
    }

    return rawPayload
  }

  /**
   * Parse raw payload into structured price data using deserializer
   * 
   * Maps vendor names from Galeri24 to our Brand codes:
   * - "ANTAM" variants → ANTAM
   * - "UBS" variants → UBS  
   * - "GALERI 24" variants → GALERI24
   * - "LOTUS" variants → LOTUS
   */
  private async parsePrices(rawPayload: any[]): Promise<RawPriceData[]> {
    console.log(`[Galeri24] Parsing price data using deserializer`)

    // Import deserializer dynamically
    const { deserializeNuxtData } = await import('./nuxt-deserializer')
    const { GoldPriceItemSchema } = await import('./schemas')

    const items = deserializeNuxtData(rawPayload)
    console.log(`[Galeri24] Deserialized ${items.length} gold items`)

    if (items.length === 0) {
      throw new Error('No items found in deserialized data')
    }

    // Group by vendor and denomination to get unique prices
    const priceMap = new Map<string, RawPriceData>()

    for (const item of items) {
      // VALIDATION: Ensure item matches expected schema
      const result = GoldPriceItemSchema.safeParse(item)

      if (!result.success) {
        console.warn(`[Galeri24] Skipping invalid item (ID: ${item.id}):`, result.error.format())
        continue
      }

      const validItem = result.data

      // Map vendor name to brand code
      let brandCode = 'ANTAM' // default

      const vendor = validItem.vendorName.toUpperCase()
      if (vendor.includes('UBS')) {
        brandCode = 'UBS'
      } else if (vendor.includes('GALERI')) {
        brandCode = 'GALERI24'
      } else if (vendor.includes('LOTUS')) {
        brandCode = 'LOTUS'
      } else if (vendor.includes('ANTAM')) {
        brandCode = 'ANTAM'
      }

      // Create unique key by brand + denomination
      const key = `${brandCode}_${validItem.denomination}`

      // TIMEZONE HANDLING:
      // Galeri24 is an Indonesian site (WIB / UTC+7).
      // We must interpret dates in 'Asia/Jakarta' timezone to ensure
      // consistency regardless of where this scraper runs (local vs Vercel).
      const { toZonedTime, fromZonedTime } = await import('date-fns-tz')
      const TIMEZONE = 'Asia/Jakarta'

      // Helper to parse date string or timestamp to Date object
      const parseDate = (dateStr: string | undefined): Date => {
        if (!dateStr) return new Date() // Fallback: Server time (Risk: server might be UTC, but distinct enough)
        
        // If it looks like ISO (has T), use standard parsing
        if (dateStr.includes('T')) return new Date(dateStr)

        // If it is just YYYY-MM-DD, treat as Midnight Jakarta Time
        // e.g. "2025-12-29" -> "2025-12-29T00:00:00+07:00" -> UTC equivalent
        return fromZonedTime(dateStr, TIMEZONE)
      }

      const itemDate = parseDate(validItem.date || validItem.updatedAt)

      // Only store if we don't have this combination yet or if this one is newer
      if (!priceMap.has(key) || itemDate.getTime() > new Date(priceMap.get(key)!.timestamp!).getTime()) {
        priceMap.set(key, {
          brand: brandCode,
          denominationGram: validItem.denomination,
          sellPrice: validItem.sellingPrice,
          buybackPrice: validItem.buybackPrice,
          timestamp: itemDate,
        })
      }
    }

    const results = Array.from(priceMap.values())
    console.log(`[Galeri24] Extracted ${results.length} unique brand+denomination combinations`)
    console.log(`[Galeri24] Sample:`, results.slice(0, 3))

    return results
  }

  /**
   * Persist parsed prices to database
   * Uses insert-only strategy with skipDuplicates
   */
  private async persistPrices(prices: RawPriceData[]): Promise<{
    inserted: number
    skipped: number
    brandsSkipped: Set<string>
    insertedRecords: Array<{
      brand: string
      priceType: string
      denominationGram: number
      price: number
      priceAt: string
      source: string
    }>
  }> {
    console.log(`[Galeri24] Persisting ${prices.length} price entries`)

    let totalInserted = 0
    let totalSkipped = 0
    const brandsSkipped = new Set<string>()
    const insertedRecords: Array<{
      brand: string
      priceType: string
      denominationGram: number
      price: number
      priceAt: string
      source: string
    }> = []

    for (const price of prices) {
      // Resolve brand
      const brand = await this.prisma.brand.findUnique({
        where: { code: price.brand },
      })

      if (!brand) {
        console.error(`[Galeri24] Brand ${price.brand} not found in database. Skipping.`)
        brandsSkipped.add(price.brand)
        continue
      }

      const normalized: NormalizedPrice[] = [
        // SELL price
        {
          brandId: brand.id,
          priceType: PriceType.SELL,
          denominationGram: new Decimal(price.denominationGram),
          price: price.sellPrice,
          priceAt: price.timestamp || new Date(),
          source: 'Galeri24 Scraper',
          rawPayload: price,
        },
        // BUYBACK price
        {
          brandId: brand.id,
          priceType: PriceType.BUYBACK,
          denominationGram: new Decimal(price.denominationGram),
          price: price.buybackPrice,
          priceAt: price.timestamp || new Date(),
          source: 'Galeri24 Scraper',
          rawPayload: price,
        },
      ]

      // Insert with skipDuplicates for idempotency
      const result = await this.prisma.goldPrice.createMany({
        data: normalized.map((p) => ({
          brandId: p.brandId,
          priceType: p.priceType,
          denominationGram: p.denominationGram,
          price: p.price,
          priceAt: p.priceAt,
          recordedAt: new Date(),
          source: p.source,
          rawPayload: p.rawPayload,
        })),
        skipDuplicates: true,
      })

      // Track inserted records
      if (result.count > 0) {
        for (const p of normalized) {
          insertedRecords.push({
            brand: price.brand,
            priceType: p.priceType,
            denominationGram: price.denominationGram,
            price: p.price,
            priceAt: p.priceAt.toISOString(),
            source: p.source,
          })
        }
      }

      totalInserted += result.count
      totalSkipped += normalized.length - result.count

      console.log(`[Galeri24] Inserted ${result.count} new price records`)
    }

    return {
      inserted: totalInserted,
      skipped: totalSkipped,
      brandsSkipped,
      insertedRecords,
    }
  }
}
