/**
 * Debug script to check GoldDailyClose data
 */
import { prisma } from '../../src/applications/shared/persistence/prisma-client'
import { PriceType } from '@prisma/client'
import { Decimal } from 'decimal.js'

async function debug() {
  console.log('=== Debug GoldDailyClose ===')

  // Count total records
  const count = await prisma.goldDailyClose.count()
  console.log(`Total records: ${count}`)

  // Check distinct dates
  const distinctDates = await prisma.$queryRaw`
    SELECT DISTINCT close_date 
    FROM "GoldDailyClose" 
    ORDER BY close_date DESC
  ` as { close_date: Date }[]

  console.log('Available dates:', distinctDates.map(d => d.close_date.toISOString().split('T')[0]))

  // Check ANTAM 1g BUYBACK for specified dates
  const today = new Date('2026-02-01')
  const yesterday = new Date('2026-01-31')

  const todayRecord = await prisma.goldDailyClose.findUnique({
    where: {
      brandCode_priceType_denominationGram_closeDate: {
        brandCode: 'ANTAM',
        priceType: PriceType.BUYBACK,
        denominationGram: new Decimal(1),
        closeDate: today
      }
    }
  })

  const yesterdayRecord = await prisma.goldDailyClose.findUnique({
    where: {
      brandCode_priceType_denominationGram_closeDate: {
        brandCode: 'ANTAM',
        priceType: PriceType.BUYBACK,
        denominationGram: new Decimal(1),
        closeDate: yesterday
      }
    }
  })

  console.log('=== ANTAM 1g BUYBACK ===')
  console.log('Today (2026-02-01):', todayRecord ? Number(todayRecord.price) : 'NOT FOUND')
  console.log('Yesterday (2026-01-31):', yesterdayRecord ? Number(yesterdayRecord.price) : 'NOT FOUND')

  if (todayRecord && yesterdayRecord) {
    const diff = Number(todayRecord.price) - Number(yesterdayRecord.price)
    console.log('Difference:', diff)
  }

  await prisma.$disconnect()
}

debug().catch(console.error)
