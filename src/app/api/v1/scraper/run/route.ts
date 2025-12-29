/**
 * Scraper API Route
 * 
 * Allows the scraper to be triggered via HTTP request.
 * POST /api/v1/scraper/run
 */

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import { Galeri24Scraper } from '@/applications/shared/scrapers/galeri24.scraper'
import { DATABASE_URL, SCRAPER_SECRET } from '@/applications/shared/lib/env'

export async function POST(request: NextRequest) {
  // Validate Authorization if SECRET is configured
  if (SCRAPER_SECRET) {
    const authHeader = request.headers.get('authorization')
    // We expect "Bearer <SECRET>" or just "<SECRET>" depending on how strict we want to be.
    // Let's standardise on "Bearer <SECRET>"
    if (authHeader !== `Bearer ${SCRAPER_SECRET}`) {
      return NextResponse.json({
        code: 401,
        status: 'Unauthorized',
        message: 'Invalid or missing Authorization header'
      }, { status: 401 })
    }
  } else if (process.env.NODE_ENV === 'production') {
    console.warn('[Scraper API] SCRAPER_SECRET is not set in production! Endpoint is publicly accessible.')
  }

  const pool = new pg.Pool({ connectionString: DATABASE_URL })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  try {
    // Run scraper
    const scraper = new Galeri24Scraper(prisma)
    const logs = await scraper.scrapeAndPersist()

    return NextResponse.json(
      {
        code: 200,
        status: 'OK',
        message: 'Scraper executed successfully',
        data: {
          status: 'Completed',
          logs: logs
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[Scraper API] Error:', error)

    return NextResponse.json(
      {
        code: 500,
        success: false,
        message: 'Scraper execution failed',
        data: null,
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}
