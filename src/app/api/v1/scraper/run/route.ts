/**
 * Scraper API Route
 * 
 * Allows the scraper to be triggered via HTTP request.
 * Supports POST (manual) and GET (Vercel Cron).
 */

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import { DATABASE_URL, SCRAPER_SECRET } from '@/applications/shared/lib/env'
import { PrismaPriceRepository } from '@/applications/modules/prices/v1/repository/prisma-price-repository'
import { ScrapeAndPersistPrices } from '@/applications/modules/prices/v1/usecases/scrape-and-persist-prices'

async function runScraper() {
  const pool = new pg.Pool({ connectionString: DATABASE_URL })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  try {
    const priceRepository = new PrismaPriceRepository(prisma)
    const usecase = new ScrapeAndPersistPrices(priceRepository)
    const logs = await usecase.execute()
    return logs
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

function isAuthorized(request: Request) {
  // 1. Check for standard Scraper Secret
  const authHeader = request.headers.get('authorization')

  // SUPPORT Standard Scraper Secret
  if (SCRAPER_SECRET && authHeader === `Bearer ${SCRAPER_SECRET}`) {
    return true
  }

  // SUPPORT Vercel Cron Secret (automatically provided by Vercel)
  // https://vercel.com/docs/cron-jobs/manage-cron-jobs#securing-cron-jobs
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
    return true
  }

  // Allow in development if no secret is set
  if (process.env.NODE_ENV !== 'production' && !SCRAPER_SECRET) {
    return true
  }

  return false
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({
      code: 401,
      status: 'Unauthorized',
      message: 'Invalid or missing Authorization header'
    }, { status: 401 })
  }

  try {
    const logs = await runScraper()
    return NextResponse.json({
      code: 200,
      status: 'OK',
      message: 'Scraper executed successfully',
      data: { status: 'Completed', logs }
    })
  } catch (error) {
    console.error('[Scraper API] Error:', error)
    return NextResponse.json({
      code: 500,
      success: false,
      message: 'Scraper execution failed',
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    }, { status: 500 })
  }
}

// Vercel Cron uses GET by default
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({
      code: 401,
      status: 'Unauthorized',
      message: 'Invalid or missing Authorization header'
    }, { status: 401 })
  }

  try {
    const logs = await runScraper()
    return NextResponse.json({
      code: 200,
      status: 'OK',
      message: 'Cron job executed successfully',
      data: { status: 'Completed', logs }
    })
  } catch (error) {
    console.error('[Scraper Cron] Error:', error)
    return NextResponse.json({
      code: 500,
      success: false,
      message: 'Cron job execution failed',
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    }, { status: 500 })
  }
}
