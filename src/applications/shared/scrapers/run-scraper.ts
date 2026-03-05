import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
// Architects Components
import { PrismaPriceRepository } from '../../modules/prices/v1/repository/prisma-price-repository'
import { PrismaGoldDailyCloseRepository } from '../../modules/prices/v1/repository/prisma-gold-daily-close.repository'
import { ScrapeAndPersistPrices } from '../../modules/prices/v1/usecases/scrape-and-persist-prices'
import { ComputeDailyCloseUsecase } from '../../modules/prices/v1/usecases/compute-daily-close.usecase'
import { DIRECT_URL, SCRAPER_SOURCE_URL } from '../lib/env'

// Validate environment before creating connections
if (!DIRECT_URL) {
  console.error('❌ DIRECT_URL is not set in environment variables')
  console.log('Please ensure your .env file contains DIRECT_URL')
  process.exit(1)
}

const connectionString = DIRECT_URL
const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('=== Gold Price Scraper Runner ===\n')



  console.log(`Using database: ${DIRECT_URL.split('@')[1] || '[hidden]'}`)
  console.log(`Scraper source: ${SCRAPER_SOURCE_URL}\n`)

  // Dependency Injection
  const priceRepo = new PrismaPriceRepository(prisma)
  const dailyCloseRepo = new PrismaGoldDailyCloseRepository(prisma)
  const computeDailyClose = new ComputeDailyCloseUsecase(priceRepo, dailyCloseRepo)
  const usecase = new ScrapeAndPersistPrices(priceRepo, computeDailyClose)

  try {
    const result = await usecase.execute()
    console.log('\n✅ Scraper completed successfully')
    console.log(result)
  } catch (error) {
    console.error('\n❌ Scraper failed:')
    if (error instanceof Error) {
      console.error(`  Message: ${error.message}`)
      console.error(`  Stack: ${error.stack}`)
    } else {
      console.error(error)
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

main()
