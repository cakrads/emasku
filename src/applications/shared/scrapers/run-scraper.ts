/**
 * Manual Scraper Runner
 * 
 * Allows the scraper to be run locally for testing.
 * Usage: npx tsx src/applications/shared/scrapers/run-scraper.ts
 */

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import { Galeri24Scraper } from './galeri24.scraper'
import { DIRECT_URL, SCRAPER_SOURCE_URL } from '../lib/env'

const connectionString = DIRECT_URL
const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

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

  const scraper = new Galeri24Scraper(prisma)

  try {
    await scraper.scrapeAndPersist()
    console.log('\n✅ Scraper completed successfully')
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
