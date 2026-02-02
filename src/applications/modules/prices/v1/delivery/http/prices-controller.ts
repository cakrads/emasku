/**
 * Prices HTTP Controller
 * 
 * HTTP adapter for price-related endpoints.
 * Responsibilities:
 * - Parse/validate HTTP requests
 * - Instantiate repository + usecase
 * - Map domain models to DTOs
 * - Return standardized responses
 * 
 * NO business logic here - just translation.
 */

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import { DATABASE_URL } from '@/applications/shared/lib/env'
import { successResponse } from '@/applications/shared/lib/response'
import { PrismaPriceRepository } from '../../repository/prisma-price-repository'
import { z } from 'zod'
import { ValidationError } from '@/applications/shared/lib/errors'
import { GetSpotPriceSeriesUsecase } from '../../usecases/get-spot-price-series'
import { GetTodayPricesUsecase } from '../../usecases/get-today-prices'

import { getBrandName } from '@/applications/modules/brands/v1/domain/brands.const'

interface PriceEntry {
  denominationGram: number
  sellPrice: number | null
  buybackPrice: number | null
  sellDelta: number | null
  buybackDelta: number | null
}

export class PricesController {


  /**
   * GET /api/v1/prices/spot
   * 
   * Uses predefined ranges instead of arbitrary dates (anti-scraping measure)
   * Allowed ranges: 7d, 30d, 90d, 1y, 5y
   */
  async getSpotSeries(req: NextRequest): Promise<NextResponse> {
    // Parse and validate query parameters
    const { searchParams } = new URL(req.url)

    // Predefined ranges for anti-scraping
    const ALLOWED_RANGES = ['3d', '1w', '7d', '1m', '30d', '90d', '1y', '5y', 'all'] as const
    type AllowedRange = typeof ALLOWED_RANGES[number]

    const schema = z.object({
      brand: z.string().min(1, 'brand is required'),
      range: z.enum(ALLOWED_RANGES).optional().default('30d'),
      denomination: z.coerce.number().positive().optional().default(1),
    })

    const parsed = schema.safeParse({
      brand: searchParams.get('brand'),
      range: searchParams.get('range') || undefined,
      denomination: searchParams.get('denomination') || undefined,
    })

    if (!parsed.success) {
      throw new ValidationError('Invalid query parameters', {
        errors: parsed.error.format(),
        allowedRanges: ALLOWED_RANGES,
      })
    }

    const { brand: brandCode, range, denomination: denom } = parsed.data

    // Calculate dates from range
    const to = new Date()
    const from = new Date()
    switch (range) {
      case '3d': from.setDate(from.getDate() - 3); break
      case '1w':
      case '7d': from.setDate(from.getDate() - 7); break
      case '1m':
      case '30d': from.setDate(from.getDate() - 30); break
      case '90d': from.setDate(from.getDate() - 90); break
      case '1y': from.setFullYear(from.getFullYear() - 1); break
      case '5y': from.setFullYear(from.getFullYear() - 5); break
      case 'all': from.setFullYear(2020, 0, 1); break // Start of records
    }

    // Setup Prisma
    const pool = new pg.Pool({ connectionString: DATABASE_URL })
    const adapter = new PrismaPg(pool)
    const prisma = new PrismaClient({ adapter })

    try {
      const priceRepo = new PrismaPriceRepository(prisma)
      const usecase = new GetSpotPriceSeriesUsecase(priceRepo)

      const series = await usecase.execute({
        brandCode,
        from,
        to,
        denominationGram: denom,
      })

      // Map to DTO
      const dto = {
        brand: brandCode,
        priceType: 'SELL',
        denominationGram: denom,
        currency: 'IDR',
        range,
        series: series.map((p) => ({
          priceAt: p.priceAt.toISOString(),
          price: p.price,
        })),
      }

      // Create response with cache headers
      const response = successResponse(dto, 'Spot price series retrieved', {
        totalPoints: series.length,
        fromDate: from.toISOString(),
        toDate: to.toISOString(),
      })

      // Add cache headers (15 minutes for historical data)
      response.headers.set('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=60')

      return response
    } finally {
      await prisma.$disconnect()
      await pool.end()
    }
  }

  /**
   * GET /api/v1/prices/today
   */
  async getTodayPrices(req: NextRequest): Promise<NextResponse> {
    const { searchParams } = new URL(req.url)

    const schema = z.object({
      brand: z.string().min(1).optional(),
      denomination: z.coerce.number().positive().optional(),
    })

    const brandParam = searchParams.get('brand') || undefined
    const denominationParam = searchParams.get('denomination') || undefined

    const parsed = schema.safeParse({
      brand: brandParam,
      denomination: denominationParam,
    })

    if (!parsed.success) {
      throw new ValidationError('Invalid query parameters', {
        errors: parsed.error.format(),
      })
    }

    const { brand, denomination } = parsed.data

    const pool = new pg.Pool({ connectionString: DATABASE_URL })
    const adapter = new PrismaPg(pool)
    const prisma = new PrismaClient({ adapter })

    try {
      const priceRepo = new PrismaPriceRepository(prisma)
      const usecase = new GetTodayPricesUsecase(priceRepo)

      const prices = await usecase.execute({
        brandCode: brand,
        denominationGram: denomination,
      })

      // Group by brand (as per api-contract.md structure)
      const brandGroups = new Map<string, PriceEntry[]>()

      for (const price of prices) {
        // Use Display Name (Title) for the brand key if requested by user
        const brandDisplayName = getBrandName(price.brand)

        if (!brandGroups.has(brandDisplayName)) {
          brandGroups.set(brandDisplayName, [])
        }

        brandGroups.get(brandDisplayName)!.push({
          denominationGram: price.denominationGram,
          sellPrice: price.sellPrice,
          buybackPrice: price.buybackPrice,
          sellDelta: price.sellDelta,
          buybackDelta: price.buybackDelta,
        })
      }

      // Calculate latest update time from the data
      let latestUpdate = new Date(0)
      for (const p of prices) {
        if (p.lastUpdated && p.lastUpdated > latestUpdate) {
          latestUpdate = p.lastUpdated
        }
      }
      // If no valid date found (e.g. empty prices), fallback to current time
      const responseDate = latestUpdate.getTime() > 0 ? latestUpdate : new Date()

      const dto = {
        date: responseDate.toISOString(),
        currency: 'IDR',
        brands: Array.from(brandGroups.entries()).map(([brand, prices]) => ({
          brand,
          prices,
        })),
      }

      // Create response with cache headers
      const response = successResponse(dto, 'Current prices retrieved', {
        source: 'Galeri 24 Scraper',
        fetchedAt: new Date().toISOString(),
      })

      // Add cache headers (60 seconds for live prices)
      response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30')

      return response
    } finally {
      await prisma.$disconnect()
      await pool.end()
    }
  }
}
