import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const connectionString = process.env.DIRECT_URL
if (!connectionString || connectionString === 'undefined') {
  console.error('[verify-logging] Error: DIRECT_URL environment variable is missing or invalid.')
  console.log('Ensure it is defined in your .env file.')
  process.exit(1)
}

/** Mask sensitive parts of a connection string for safe logging */
function maskConnectionString(url: string): string {
  try {
    const parsed = new URL(url)
    if (parsed.password) parsed.password = '***'
    if (parsed.username) parsed.username = '***'
    return parsed.toString()
  } catch {
    return '***masked***'
  }
}

const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

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
  } catch (error) {
    console.error('Scraper failed to run via execSync:', error instanceof Error ? error.message : String(error))
    if (error && typeof error === 'object' && 'stderr' in error && error.stderr) {
      console.error('Stderr:', error.stderr.toString())
    }
  }

  console.log('\n--- Step 3: Checking Logs ---')
  const logDir = path.join(process.cwd(), '.scrap', 'logs')

  if (!fs.existsSync(logDir)) {
    console.log('Log directory does not exist yet.')
    return
  }

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
    await pool.end()
  })
