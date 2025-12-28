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
  // 1. Seed Brands
  const brandDataPath = path.join(__dirname, 'data', 'brand.json')
  const brandRawData = fs.readFileSync(brandDataPath, 'utf-8')
  const { brands } = JSON.parse(brandRawData)

  console.log(`Seeding ${brands.length} brands...`)

  const brandMap = new Map<string, string>()

  for (const b of brands) {
    const brand = await prisma.brand.upsert({
      where: { code: b.code },
      update: {
        name: b.name,
        sourceUrl: b.sourceUrl,
        isActive: b.isActive
      },
      create: {
        code: b.code,
        name: b.name,
        sourceUrl: b.sourceUrl,
        isActive: b.isActive
      },
    })
    brandMap.set(b.code, brand.id)
  }

  // 2. Seed Historical Prices (Assuming ANTAM 1g for now based on previous context)
  const priceDataPath = path.join(__dirname, 'data', '5-years-gold-price.json')
  if (fs.existsSync(priceDataPath)) {
    const priceRawData = fs.readFileSync(priceDataPath, 'utf-8')
    const prices: [number, number][] = JSON.parse(priceRawData)

    console.log(`Seeding ${prices.length} price snapshots for ANTAM...`)

    const antamId = brandMap.get('ANTAM')
    if (!antamId) {
      throw new Error('ANTAM brand not found after seeding brands')
    }

    // Process in chunks to avoid massive memory usage or connection timeouts
    const CHUNK_SIZE = 20
    for (let i = 0; i < prices.length; i += CHUNK_SIZE) {
      const chunk = prices.slice(i, i + CHUNK_SIZE)

      await Promise.all(
        chunk.map(([timestamp, price]) => {
          const priceAt = new Date(timestamp)
          const denominationGram = new Decimal(1)

          return prisma.goldPrice.upsert({
            where: {
              brandId_priceType_denominationGram_priceAt: {
                brandId: antamId,
                priceType: PriceType.SPOT, // Historical reference is usually SPOT
                denominationGram,
                priceAt,
              },
            },
            update: {}, // Immutable, don't update if exists
            create: {
              brandId: antamId,
              priceType: PriceType.SPOT,
              denominationGram,
              price: price, // Raw integer price from JSON
              priceAt,
              recordedAt: new Date(),
              source: 'Logam Mulia (Manual Seed)',
            },
          })
        })
      )
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
