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
  console.log('🌱 Starting database seeding...\n')

  // 1. Seed Test User
  console.log('📝 Seeding test user...')
  const testUser = await prisma.user.upsert({
    where: { email: 'test@emasku.com' },
    update: {},
    create: {
      email: 'test@emasku.com',
      name: 'Test User'
    }
  })
  console.log(`✅ User created: ${testUser.email}\n`)

  // 2. Seed Historical SPOT Prices (ANTAM 1g)
  const priceDataPath = path.join(__dirname, 'data', '5-years-gold-price.json')

  if (fs.existsSync(priceDataPath)) {
    const priceRawData = fs.readFileSync(priceDataPath, 'utf-8')
    const prices: [number, number][] = JSON.parse(priceRawData)

    console.log(`📊 Seeding ${prices.length} historical SPOT prices for ANTAM 1g...`)

    // Process in chunks (createMany is much faster than upsert loop)
    const CHUNK_SIZE = 5000
    for (let i = 0; i < prices.length; i += CHUNK_SIZE) {
      const chunk = prices.slice(i, i + CHUNK_SIZE)
      console.log(`   Processing chunk ${i / CHUNK_SIZE + 1} of ${Math.ceil(prices.length / CHUNK_SIZE)}...`)

      const data = chunk.map(([timestamp, price]) => ({
        brandCode: 'ANTAM',
        brandName: 'ANTAM',
        priceType: PriceType.SPOT,
        denominationGram: new Decimal(1),
        price: BigInt(price),
        priceAt: new Date(timestamp),
        recordedAt: new Date(),
        source: 'Logam Mulia (Manual Seed)',
      }))

      await prisma.goldPrice.createMany({
        data,
        skipDuplicates: true,
      })
    }
    console.log(`✅ Historical SPOT prices seeded\n`)
  } else {
    console.log('⚠️  No historical price data found, skipping.\n')
  }

  // 3. Seed Recent SELL and BUYBACK Prices
  console.log('💰 Seeding recent SELL and BUYBACK prices...')

  const recentPricesPath = path.join(__dirname, 'data', 'recent-prices.json')
  let recentPrices: {
    brandCode: string
    brandName: string
    denominationGram: Decimal | number | string
    priceType: PriceType
    price: bigint | number
    priceAt: Date
    source: string
  }[] = []

  if (fs.existsSync(recentPricesPath)) {
    const rawData = fs.readFileSync(recentPricesPath, 'utf-8')
    const jsonData = JSON.parse(rawData)

    recentPrices = jsonData.map((p: {
      brandCode: string
      brandName: string
      denominationGram: number
      priceType: string
      price: number | string
      source: string
    }) => ({
      brandCode: p.brandCode,
      brandName: p.brandName,
      denominationGram: Number(p.denominationGram),
      priceType: p.priceType as PriceType,
      price: BigInt(p.price),
      priceAt: new Date(),
      source: p.source
    }))

    await prisma.goldPrice.createMany({
      data: recentPrices,
      skipDuplicates: true
    })
    console.log(`✅ Recent prices seeded (${recentPrices.length} records)\n`)
  } else {
    console.log('⚠️  No recent price data found at prisma/data/recent-prices.json\n')
  }

  // 4. Seed Portfolio Holdings
  console.log('💼 Seeding portfolio holdings...')

  const holdingsPath = path.join(__dirname, 'data', 'portfolio-holdings.json')
  let holdingsCount = 0

  if (fs.existsSync(holdingsPath)) {
    const rawData = fs.readFileSync(holdingsPath, 'utf-8')
    const jsonData = JSON.parse(rawData)

    const holdings = jsonData.map((h: {
      brandCode: string
      brandName: string
      denominationGram: number
      quantity: number
      buyPrice: number | string
      boughtAt: string
      notes?: string
    }) => ({
      userId: testUser.id,
      brandCode: h.brandCode,
      brandName: h.brandName,
      denominationGram: new Decimal(h.denominationGram),
      quantity: h.quantity,
      buyPrice: BigInt(h.buyPrice),
      boughtAt: new Date(h.boughtAt),
      notes: h.notes
    }))

    await prisma.portfolioHolding.createMany({
      data: holdings,
      skipDuplicates: true
    })
    holdingsCount = holdings.length
    console.log(`✅ Portfolio holdings seeded (${holdings.length} records)\n`)
  } else {
    console.log('⚠️  No portfolio holding data found at prisma/data/portfolio-holdings.json\n')
  }
  console.log('🎉 Seeding completed successfully!')
  console.log('\n📋 Summary:')
  console.log(`   - Users: 1`)
  console.log(`   - Portfolio Holdings: ${holdingsCount}`)
  console.log(`   - Recent Prices: ${recentPrices.length}`)
  console.log(`   - Historical SPOT Prices: ${fs.existsSync(priceDataPath) ? 'Yes' : 'No'}`)
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
