/**
 * Scraper API Route
 * 
 * Allows the scraper to be triggered via HTTP request.
 * Supports POST and GET (secured by SCRAPER_SECRET).
 */

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import { DATABASE_URL, SCRAPER_SECRET } from '@/applications/shared/lib/env'
import { PrismaPriceRepository } from '@/applications/modules/prices/v1/repository/prisma-price-repository'
import { ScrapeAndPersistPrices } from '@/applications/modules/prices/v1/usecases/scrape-and-persist-prices'
import { ComputeDailyCloseUsecase } from '@/applications/modules/prices/v1/usecases/compute-daily-close.usecase'
import { PrismaGoldDailyCloseRepository } from '@/applications/modules/prices/v1/repository/prisma-gold-daily-close.repository'
import { wrapController } from '@/applications/shared/lib/controller-wrapper'
import { UnauthorizedError } from '@/applications/shared/lib/errors'
import { successResponse } from '@/applications/shared/lib/response'

async function runScraper() {
  const pool = new pg.Pool({ connectionString: DATABASE_URL })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  try {
    const priceRepository = new PrismaPriceRepository(prisma)
    const dailyCloseRepo = new PrismaGoldDailyCloseRepository(prisma)
    const computeDailyClose = new ComputeDailyCloseUsecase(priceRepository, dailyCloseRepo)
    const usecase = new ScrapeAndPersistPrices(priceRepository, computeDailyClose)
    const logs = await usecase.execute()
    return logs
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

function isAuthorized(request: Request) {
  // Check for standard Scraper Secret
  const authHeader = request.headers.get('authorization')

  // SUPPORT Standard Scraper Secret
  if (SCRAPER_SECRET && authHeader === `Bearer ${SCRAPER_SECRET}`) {
    return true
  }

  // Allow in development if no secret is set
  if (process.env.NODE_ENV !== 'production' && !SCRAPER_SECRET) {
    return true
  }

  return false
}

async function handleScraper(request: NextRequest): Promise<NextResponse> {
  if (!isAuthorized(request)) {
    throw new UnauthorizedError('Invalid or missing Authorization header')
  }
  const logs = await runScraper()
  return successResponse({ status: 'Completed', logs }, 'Scraper executed successfully')
}

export const POST = wrapController(handleScraper)

// GET trigger (secured by SCRAPER_SECRET)
export const GET = wrapController(handleScraper)
