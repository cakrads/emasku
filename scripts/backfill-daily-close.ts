import { ComputeDailyCloseUsecase } from '../src/applications/modules/prices/v1/usecases/compute-daily-close.usecase'

/**
 * Backfill GoldDailyClose data for a range of days.
 * 
 * Usage:
 * npx ts-node scripts/backfill-daily-close.ts --days 30
 */
async function backfill(days: number) {
  const usecase = new ComputeDailyCloseUsecase()
  const now = new Date()
  // Adjust to WIB (UTC+7)
  const wibNow = new Date(now.getTime() + 7 * 60 * 60 * 1000)

  console.log(`Starting backfill for the last ${days} days...`)

  // Iterate backwards from today
  for (let i = 0; i <= days; i++) {
    const targetDate = new Date(wibNow)
    targetDate.setDate(wibNow.getDate() - i)
    const dateStr = targetDate.toISOString().split('T')[0]

    try {
      console.log(`[Backfill] Processing ${dateStr}...`)
      await usecase.execute(dateStr)
    } catch (error) {
      console.error(`[Backfill] Failed for ${dateStr}:`, error)
    }
  }

  console.log('Backfill completed.')
}

// CLI Entrypoint
if (require.main === module) {
  const args = process.argv.slice(2)
  let days = 30 // Default

  const daysIdx = args.indexOf('--days')
  if (daysIdx !== -1 && args[daysIdx + 1]) {
    days = parseInt(args[daysIdx + 1], 10)
  }

  if (isNaN(days)) {
    console.error('Invalid number of days. Usage: --days <number>')
    process.exit(1)
  }

  backfill(days)
    .catch(e => {
      console.error(e)
      process.exit(1)
    })
}
