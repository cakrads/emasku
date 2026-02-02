import { PrismaClient } from '@prisma/client'
import { Decimal } from 'decimal.js'
import fs from 'fs/promises'
import path from 'path'

import { prisma } from '../../src/applications/shared/persistence/prisma-client'

// WIB = UTC+7
function getCutoffWIB(dateStr: string): Date {
  const wibOffset = 7 * 60 * 60 * 1000
  const d = new Date(dateStr)
  const utcMidnight = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))

  // Cutoff is Next Day 00:00 WIB
  // Today 00:00 WIB = UTC Midnight - 7h
  const todayMidnightWIB_in_UTC = new Date(utcMidnight.getTime() - wibOffset)
  // Next Day 00:00 WIB
  return new Date(todayMidnightWIB_in_UTC.getTime() + 24 * 60 * 60 * 1000)
}

function getWIBDate(daysAgo: number): string {
  const now = new Date()
  const wibOffset = 7 * 60 * 60 * 1000
  const wibNow = new Date(now.getTime() + wibOffset)
  wibNow.setDate(wibNow.getDate() - daysAgo)
  return wibNow.toISOString().split('T')[0]
}

async function run() {
  const daysFn = Array.from({ length: 10 }, (_, i) => i) // Last 10 days
  const results: any[] = []

  console.log('Fetching unique markets...')
  const markets = await prisma.goldPrice.groupBy({
    by: ['brandCode', 'priceType', 'denominationGram'],
  })
  console.log(`Found ${markets.length} market combinations.`)

  for (const daysAgo of daysFn) {
    const dateStr = getWIBDate(daysAgo)
    const cutoff = getCutoffWIB(dateStr)
    const closeDate = new Date(dateStr)

    console.log(`Processing Date: ${dateStr} (Cutoff: ${cutoff.toISOString()})`)

    for (const market of markets) {
      const { brandCode, priceType, denominationGram } = market

      // Find LATEST price relative to Cutoff
      // This naturally handles carry-forward: if no price today, it finds yesterday's, etc.
      const price = await prisma.goldPrice.findFirst({
        where: {
          brandCode,
          priceType,
          denominationGram,
          priceAt: { lt: cutoff }
        },
        orderBy: { priceAt: 'desc' }
      })

      if (price) {
        results.push({
          brandCode,
          priceType,
          denominationGram: new Decimal(denominationGram).toNumber(), // Convert for JSON
          price: price.price.toString(), // BigInt to string
          currency: price.currency,
          closeDate: dateStr, // Store as string for JSON readability
          source: 'SYSTEM_DAILY_CLOSE_BACKFILL',
          derivedFromPriceAt: price.priceAt.toISOString()
        })
      }
    }
  }

  const outputPath = path.join(process.cwd(), 'backfill_data.json')
  await fs.writeFile(outputPath, JSON.stringify(results, null, 2))
  console.log(`Backfill data generated at: ${outputPath}`)
  console.log(`Total records: ${results.length}`)
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
