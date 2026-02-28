import 'dotenv/config'
import { GetPortfolioSummaryUsecase } from '../../src/applications/modules/portfolio/v1/usecases/get-portfolio-summary'
import { PrismaPortfolioRepository } from '../../src/applications/shared/persistence/repositories/prisma-portfolio-repository'
import { PrismaPriceRepository } from '../../src/applications/shared/persistence/repositories/prisma-price-repository'
import { PrismaGoldDailyCloseRepository } from '../../src/applications/modules/prices/v1/repository/prisma-gold-daily-close.repository'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

async function main() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  const user = await prisma.user.findFirst({ where: { email: 'test@emasku.com' } })
  if (!user) {
    console.error('Test user not found. Please run seed first.')
    process.exit(1)
  }

  const portfolioRepo = new PrismaPortfolioRepository(prisma)
  const priceRepo = new PrismaPriceRepository(prisma)
  const dailyCloseRepo = new PrismaGoldDailyCloseRepository(prisma)
  const usecase = new GetPortfolioSummaryUsecase(portfolioRepo, priceRepo, dailyCloseRepo)

  console.log(`--- START PNL DEBUG FOR USER: ${user.id} (${user.email}) ---`)
  const result = await usecase.execute(user.id)
  console.log('--- END PNL DEBUG ---')

  await prisma.$disconnect()
  await pool.end()
}

main().catch(console.error)
