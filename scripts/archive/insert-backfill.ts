/**
 * Insert Backfill Data into GoldDailyClose
 *
 * Reads backfill_data.json and inserts records into the GoldDailyClose table.
 */

import { prisma } from '../../src/applications/shared/persistence/prisma-client'
import { PriceType } from '@prisma/client'
import { Decimal } from 'decimal.js'
import fs from 'fs/promises'
import path from 'path'

interface BackfillRecord {
  brandCode: string
  priceType: string
  denominationGram: number
  price: string
  currency: string
  closeDate: string
  source: string
  derivedFromPriceAt: string
}

async function run() {
  const inputPath = path.join(process.cwd(), 'backfill_data.json')
  const rawData = await fs.readFile(inputPath, 'utf-8')
  const records: BackfillRecord[] = JSON.parse(rawData)

  console.log(`Loaded ${records.length} records from backfill_data.json`)

  let inserted = 0
  let updated = 0

  for (const record of records) {
    const closeDate = new Date(record.closeDate)
    const derivedFromPriceAt = new Date(record.derivedFromPriceAt)
    const priceType = record.priceType as PriceType
    const denominationGram = new Decimal(record.denominationGram)
    const price = BigInt(record.price)

    try {
      await prisma.goldDailyClose.upsert({
        where: {
          brandCode_priceType_denominationGram_closeDate: {
            brandCode: record.brandCode,
            priceType,
            denominationGram,
            closeDate
          }
        },
        update: {
          price,
          source: record.source,
          derivedFromPriceAt
        },
        create: {
          brandCode: record.brandCode,
          priceType,
          denominationGram,
          price,
          currency: record.currency,
          closeDate,
          source: record.source,
          derivedFromPriceAt
        }
      })
      inserted++
    } catch (err) {
      console.error(`Error inserting record for ${record.brandCode} on ${record.closeDate}:`, err)
    }
  }

  console.log(`Inserted/Updated: ${inserted} records.`)
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
