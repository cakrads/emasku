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
import { getBrandName } from '../../modules/brands/v1/domain/brands.const'

/**
 * Raw price structure from upstream source
 */
export interface RawPriceData {
  brand: string
  brandName: string
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
      const parsedPrices = await this.parsePrices(rawData as unknown[])

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
  private async fetchSourceData(): Promise<unknown> {
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

      const isVercel = process.env.VERCEL === '1' || !!process.env.VERCEL
      if (!isVercel) {
        console.log('[Galeri24] Saving HTML to debug-failed-scrape.html for inspection')
        const fs = await import('fs')
        fs.writeFileSync('debug-failed-scrape.html', html)
      } else {
        console.log('[Galeri24] First 1000 chars of HTML:', html.substring(0, 1000))
      }
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
   */
  private async parsePrices(rawPayload: unknown[]): Promise<RawPriceData[]> {
    console.log(`[Galeri24] Parsing price data using deserializer`)

    // Import deserializer dynamically
    const { deserializeNuxtData } = await import('./nuxt-deserializer')
    const { GoldPriceItemSchema } = await import('./schemas')

    // EXTRACT GLOBAL DATE from Raw Payload (Index 485 based on user observation, or search for "Date")
    // The structure is ["Date", "2025-12-28T..."]
    let globalDate: Date | null = null
    try {
      // iterate directly to find the tuple ["Date", "TIMESTAMP"]
      for (const item of rawPayload) {
        if (Array.isArray(item) && item.length === 2 && item[0] === 'Date' && typeof item[1] === 'string') {
          globalDate = new Date(item[1])
          console.log(`[Galeri24] Found Global Source Date: ${globalDate.toISOString()}`)
          break
        }
      }
    } catch (e) {
      console.warn('[Galeri24] Failed to extract global date', e)
    }

    const items = deserializeNuxtData(rawPayload)
    console.log(`[Galeri24] Deserialized ${items.length} gold items`)

    if (items.length === 0) {
      throw new Error('No items found in deserialized data')
    }

    // Group by vendor and denomination to get unique prices
    const priceMap = new Map<string, RawPriceData>()

    const { fromZonedTime } = await import('date-fns-tz')
    const TIMEZONE = 'Asia/Jakarta'

    // Helper to parse date string or timestamp to Date object
    const parseDateHelper = (dateStr: string | undefined): Date => {
      if (!dateStr) return new Date()
      if (dateStr.includes('T')) return new Date(dateStr)
      // If it is just YYYY-MM-DD, treat as Midnight Jakarta Time
      return fromZonedTime(dateStr, TIMEZONE)
    }

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
      } else if (vendor === 'GALERI 24' || vendor === 'GALERI24') {
        brandCode = 'GALERI24'
      } else if (vendor === 'LOTUS ARCHI' || vendor === 'LOTUS') {
        brandCode = 'LOTUS_ARCHI'
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
        'LOTUS_ARCHI': [1, 5, 10, 25, 50, 100],
        'UBS': [0.5, 1, 2, 5, 10, 25, 50, 100, 250, 500],
        'GALERI24': [0.5, 1, 2, 5, 10, 25, 50, 100, 250, 500, 1000]
      }

      const allowed = ALLOWED_DENOMS[brandCode]
      if (!allowed || !allowed.includes(validItem.denomination)) {
        continue // Skip invalid denominations
      }

      // Create unique key by brand + denomination
      const key = `${brandCode}_${validItem.denomination}`

      // PRIORITY: Global Date > Item updatedAt > Item date
      let itemDate = globalDate

      if (!itemDate) {
        itemDate = parseDateHelper(validItem.updatedAt || validItem.date)
      }

      // Only store if we don't have this combination yet or if this one is newer
      if (!priceMap.has(key) || itemDate.getTime() > new Date(priceMap.get(key)!.timestamp!).getTime()) {
        priceMap.set(key, {
          brand: brandCode,
          brandName: getBrandName(brandCode),
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
