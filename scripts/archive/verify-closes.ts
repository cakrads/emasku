import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

async function main() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  const latest = await prisma.goldDailyClose.findMany({
    orderBy: [
      { closeDate: 'desc' },
      { brandCode: 'asc' },
      { denominationGram: 'asc' }
    ],
    take: 50
  })

  console.log('Latest ANTAM Daily Closes:')
  console.table(latest.map(l => ({
    date: l.closeDate.toISOString().split('T')[0],
    type: l.priceType,
    price: l.price.toString(),
    source: l.source
  })))

  await prisma.$disconnect()
  await pool.end()
}

main().catch(console.error)
