import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
// Architects Components
import { PrismaPriceRepository } from '../../modules/prices/v1/repository/prisma-price-repository'
import { ScrapeAndPersistPrices } from '../../modules/prices/v1/usecases/scrape-and-persist-prices'
import { ComputeDailyCloseUsecase } from '../../modules/prices/v1/usecases/compute-daily-close.usecase'
import { DIRECT_URL, SCRAPER_SOURCE_URL } from '../lib/env'

const connectionString = DIRECT_URL
const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

/**
 * Orchestrates a single run of the gold price scraper and persists results to the database.
 *
 * Validates required environment variables, logs runtime information, constructs and runs
 * the scraping use case, and prints the result. On missing configuration or on execution
 * error the process exits with code 1. Ensures database client disconnection and pool shutdown
 * in all cases.
 */
async function main() {
  console.log('=== Gold Price Scraper Runner ===\n')

  // Validate environment
  if (!DIRECT_URL) {
    console.error('❌ DIRECT_URL is not set in environment variables')
    console.log('Please ensure your .env file contains DIRECT_URL')
    process.exit(1)
  }

  console.log(`Using database: ${DIRECT_URL.split('@')[1] || '[hidden]'}`)
  console.log(`Scraper source: ${SCRAPER_SOURCE_URL}\n`)

  // Dependency Injection
  const priceRepository = new PrismaPriceRepository(prisma)
  const computeDailyClose = new ComputeDailyCloseUsecase()
  const usecase = new ScrapeAndPersistPrices(priceRepository, computeDailyClose)

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