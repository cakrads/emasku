import 'dotenv/config'
import { GetPortfolioSummaryUsecase } from '../../src/applications/modules/portfolio/v1/usecases/get-portfolio-summary'
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

  const usecase = new GetPortfolioSummaryUsecase(prisma)

  console.log(`--- START PNL DEBUG FOR USER: ${user.id} (${user.email}) ---`)
  const result = await usecase.execute(user.id)
  console.log('--- END PNL DEBUG ---')

  await prisma.$disconnect()
  await pool.end()
}

main().catch(console.error)
