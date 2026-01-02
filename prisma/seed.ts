import 'dotenv/config'
import { PrismaClient, PriceType } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { Decimal } from 'decimal.js'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const connectionString = `${process.env.DIRECT_URL}`
const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  // 1. Seed Historical Prices (Assuming ANTAM 1g for now)
  const priceDataPath = path.join(__dirname, 'data', '5-years-gold-price.json')

  if (fs.existsSync(priceDataPath)) {
    const priceRawData = fs.readFileSync(priceDataPath, 'utf-8')
    const prices: [number, number][] = JSON.parse(priceRawData)

    console.log(`Seeding ${prices.length} price snapshots for ANTAM...`)

    // Process in chunks (createMany is much faster than upsert loop)
    const CHUNK_SIZE = 5000
    for (let i = 0; i < prices.length; i += CHUNK_SIZE) {
      const chunk = prices.slice(i, i + CHUNK_SIZE)
      console.log(`Processing chunk ${i / CHUNK_SIZE + 1} of ${Math.ceil(prices.length / CHUNK_SIZE)}...`)

      const data = chunk.map(([timestamp, price]) => ({
        brandCode: 'ANTAM',
        brandName: 'ANTAM',
        priceType: PriceType.SPOT,
        denominationGram: new Decimal(1),
        price: BigInt(price), // Map to BigInt for DB
        priceAt: new Date(timestamp),
        recordedAt: new Date(),
        source: 'Logam Mulia (Manual Seed)',
      }))

      await (prisma as any).goldPrice.createMany({
        data,
        skipDuplicates: true,
      })
    }
  } else {
    console.log('No historical price data found, skipping.')
  }

  console.log('Seeding completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
