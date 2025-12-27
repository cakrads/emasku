import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { Decimal } from 'decimal.js'

const prisma = new PrismaClient()

async function main() {
  const dataPath = path.join(__dirname, '..', 'src', 'applications', 'shared', 'persistence', 'seeds', '5-years-gold-price.json')
  const rawData = fs.readFileSync(dataPath, 'utf-8')
  const prices: [number, number][] = JSON.parse(rawData)

  console.log(`Seeding ${prices.length} price snapshots...`)

  for (const [timestamp, price] of prices) {
    await prisma.goldPriceSnapshot.create({
      data: {
        pricePerGram: new Decimal(price),
        recordedAt: new Date(timestamp),
        source: 'Logam Mulia (Manual Seed)',
      },
    })
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
