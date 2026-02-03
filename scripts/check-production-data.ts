import { prisma } from '../src/applications/shared/persistence/prisma-client'
import { PriceType } from '@prisma/client'

async function main() {
  console.log('--- Production Data Check ---')
  console.log('Checking GoldPrice distribution...')

  const priceCounts = await prisma.goldPrice.groupBy({
    by: ['priceType'],
    _count: {
      _all: true
    }
  })

  console.table(priceCounts.map(p => ({
    Type: p.priceType,
    Count: p._count._all
  })))

  console.log('\nChecking GoldDailyClose distribution...')

  const dailyCounts = await prisma.goldDailyClose.groupBy({
    by: ['priceType'],
    _count: {
      _all: true
    }
  })

  console.table(dailyCounts.map(p => ({
    Type: p.priceType,
    Count: p._count._all
  })))

  // Check recent buyback
  const recentBuyback = await prisma.goldDailyClose.findFirst({
    where: { priceType: PriceType.BUYBACK },
    orderBy: { closeDate: 'desc' }
  })

  if (recentBuyback) {
    console.log(`\nLatest Buyback Daily Close: ${recentBuyback.closeDate.toISOString().split('T')[0]}`)
  } else {
    console.log('\nWarning: No BUYBACK Daily Close data found.')
  }
}

if (require.main === module) {
  main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
}
