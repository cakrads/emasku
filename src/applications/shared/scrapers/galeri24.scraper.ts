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

import { SCRAPER_SOURCE_URL } from '../lib/env'

/**
 * Raw price structure from upstream source
 */
export interface RawPriceData {
  brand: string
  denominationGram: number
  sellPrice: number
  buybackPrice: number
  timestamp?: Date
}

export class Galeri24Scraper {
  private sourceUrl: string

  constructor() {
    this.sourceUrl = SCRAPER_SOURCE_URL
  }

  /**
   * Main entry point: Scrape prices
   */
  async scrape(): Promise<RawPriceData[]> {
    console.log(`[Galeri24] Starting scrape from ${this.sourceUrl}`)

    try {
      // Step 1: Fetch raw data
      const rawData = await this.fetchSourceData()

      // Step 2: Parse prices
      const parsedPrices = await this.parsePrices(rawData)

      console.log(`[Galeri24] Scrape completed. Found ${parsedPrices.length} items.`)

      return parsedPrices
    } catch (error) {
      console.error(`[Galeri24] Scrape failed:`, error)
      throw error
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

      const vendor = validItem.vendorName.toUpperCase()
      let brandCode: string | null = null

      if (vendor === 'UBS') {
        brandCode = 'UBS'
      } else if (vendor === 'GALERI 24') {
        brandCode = 'GALERI24'
      } else if (vendor === 'LOTUS ARCHI') {
        brandCode = 'LOTUS'
      } else if (vendor === 'ANTAM') {
        brandCode = 'ANTAM'
      }

      // Skip if brand not recognized
      if (!brandCode) {
        continue
      }

      // STRICT DENOMINATION FILTERING
      const ALLOWED_DENOMS: Record<string, number[]> = {
        'ANTAM': [0.5, 1, 2, 3, 5, 10, 25, 50, 100, 250, 500, 1000],
        'LOTUS': [1, 5, 10, 25, 50, 100],
        'UBS': [0.5, 1, 2, 5, 10, 25, 50, 100, 250, 500],
        'GALERI24': [0.5, 1, 2, 5, 10, 25, 50, 100, 250, 500, 1000]
      }

      const allowed = ALLOWED_DENOMS[brandCode]
      if (!allowed || !allowed.includes(validItem.denomination)) {
        continue // Skip invalid denominations
      }

      // Create unique key by brand + denomination
      const key = `${brandCode}_${validItem.denomination}`

      // TIMEZONE HANDLING:
      // Galeri24 is an Indonesian site (WIB / UTC+7).
      // We must interpret dates in 'Asia/Jakarta' timezone to ensure
      // consistency regardless of where this scraper runs (local vs Vercel).
      const { fromZonedTime } = await import('date-fns-tz')
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
}
