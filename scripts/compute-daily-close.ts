import { ComputeDailyCloseUsecase } from '../src/applications/modules/prices/v1/usecases/compute-daily-close.usecase'
import { PrismaPriceRepository } from '../src/applications/modules/prices/v1/repository/prisma-price-repository'
import { PrismaGoldDailyCloseRepository } from '../src/applications/modules/prices/v1/repository/prisma-gold-daily-close.repository'
import { prisma } from '../src/applications/shared/persistence/prisma-client'

async function run(targetDateStr?: string) {
  const priceRepo = new PrismaPriceRepository(prisma)
  const dailyCloseRepo = new PrismaGoldDailyCloseRepository(prisma)
  const usecase = new ComputeDailyCloseUsecase(priceRepo, dailyCloseRepo)
  await usecase.execute(targetDateStr)
}

// CLI Entrypoint
if (require.main === module) {
  const args = process.argv.slice(2)
  const targetDate = args[0] // Optional YYYY-MM-DD
  run(targetDate)
    .catch(e => {
      console.error(e)
      process.exit(1)
    })
}
