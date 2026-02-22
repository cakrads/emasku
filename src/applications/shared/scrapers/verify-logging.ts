import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const connectionString = `${process.env.DIRECT_URL}`
const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

/**
 * Orchestrates a verification workflow that forces a fresh ANTAM 1g price scrape, runs the scraper, and prints the latest scraper log.
 *
 * Deletes today's ANTAM 1g price records (SELL and BUYBACK) to trigger a re-scrape, executes the `scraper:run` npm script, and outputs the most recent log file from `.scrap/logs` if one exists.
 */
async function main() {
  console.log('--- Step 1: Cleaning up specific record to force re-scrape ---')

  // Delete today's price for ANTAM 1g (Sell and Buyback)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const deleted = await prisma.goldPrice.deleteMany({
    where: {
      brandCode: 'ANTAM',
      denominationGram: 1,
      priceAt: { gte: today }
    }
  })

  console.log(`Deleted ${deleted.count} records (should be 2: SELL and BUYBACK)`)

  console.log('\n--- Step 2: Running Scraper ---')
  try {
    execSync('npm run scraper:run', { stdio: 'inherit' })
  } catch {
    console.error('Scraper failed to run via execSync')
  }

  console.log('\n--- Step 3: Checking Logs ---')
  const logDir = path.join(process.cwd(), '.scrap', 'logs')
  const files = fs.readdirSync(logDir).filter(f => f.endsWith('.log')).sort().reverse()

  if (files.length > 0) {
    const latestLog = path.join(logDir, files[0])
    console.log(`Reading latest log: ${latestLog}`)
    const content = fs.readFileSync(latestLog, 'utf-8')
    console.log('Log Content:')
    console.log(content)
  } else {
    console.log('No log files found.')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })