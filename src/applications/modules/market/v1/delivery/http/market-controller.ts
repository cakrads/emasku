/**
 * Market HTTP Controller
 * 
 * HTTP adapter for market-related endpoints.
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
import { GetMarketOverviewUsecase } from '../../usecases/get-market-overview'
import { z } from 'zod'
import { ValidationError } from '@/applications/shared/lib/errors'
import { GetSpotPriceSeriesUsecase } from '../../usecases/get-spot-price-series'
import { GetTodayPricesUsecase } from '../../usecases/get-today-prices'

export class MarketController {
  /**
   * GET /api/v1/market/overview
   */
  async getOverview(): Promise<NextResponse> {
    // Setup Prisma with pg adapter
    const pool = new pg.Pool({ connectionString: DATABASE_URL })
    const adapter = new PrismaPg(pool)
    const prisma = new PrismaClient({ adapter })

    try {
      // Dependency injection
      const priceRepo = new PrismaPriceRepository(prisma)
      const usecase = new GetMarketOverviewUsecase(priceRepo)

      // Execute business logic
      const snapshot = await usecase.execute()

      // Map to DTO (matching api-contract.md)
      const dto = {
        referenceBrand: snapshot.referenceBrand,
        spotPrice: snapshot.spotPrice,
        delta24h: snapshot.delta24h,
        deltaPercentage: snapshot.deltaPercentage,
        lastUpdated: snapshot.lastUpdated.toISOString(),
      }

      return successResponse(dto, 'Market overview retrieved')
    } finally {
      await prisma.$disconnect()
      await pool.end()
    }
  }

  /**
   * GET /api/v1/price/spot
   */
  async getSpotSeries(req: NextRequest): Promise<NextResponse> {
    // Parse and validate query parameters
    const { searchParams } = new URL(req.url)

    const schema = z.object({
      brand: z.string().min(1, 'brand is required'),
      from: z.string().datetime('from must be valid ISO date'),
      to: z.string().datetime('to must be valid ISO date'),
      denomination: z.coerce.number().positive().optional().default(1),
    })

    const parsed = schema.safeParse({
      brand: searchParams.get('brand'),
      from: searchParams.get('from'),
      to: searchParams.get('to'),
      denomination: searchParams.get('denomination') || undefined,
    })

    if (!parsed.success) {
      throw new ValidationError('Invalid query parameters', {
        errors: parsed.error.format(),
      })
    }

    const { brand: brandCode, from: fromStr, to: toStr, denomination: denom } = parsed.data

    // Setup Prisma
    const pool = new pg.Pool({ connectionString: DATABASE_URL })
    const adapter = new PrismaPg(pool)
    const prisma = new PrismaClient({ adapter })

    try {
      const priceRepo = new PrismaPriceRepository(prisma)
      const usecase = new GetSpotPriceSeriesUsecase(priceRepo)

      const series = await usecase.execute({
        brandCode,
        from: new Date(fromStr),
        to: new Date(toStr),
        denominationGram: denom,
      })

      // Map to DTO
      const dto = {
        brand: brandCode,
        priceType: 'SPOT',
        denominationGram: denom,
        currency: 'IDR',
        series: series.map((p) => ({
          priceAt: p.priceAt.toISOString(),
          price: p.price,
        })),
      }

      return successResponse(dto, 'Spot price series retrieved', {
        totalPoints: series.length,
      })
    } finally {
      await prisma.$disconnect()
      await pool.end()
    }
  }

  /**
   * GET /api/v1/price/today
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
      const brandGroups = new Map<string, any[]>()

      for (const price of prices) {
        if (!brandGroups.has(price.brand)) {
          brandGroups.set(price.brand, [])
        }

        brandGroups.get(price.brand)!.push({
          denominationGram: price.denominationGram,
          sellPrice: price.sellPrice,
          buybackPrice: price.buybackPrice,
        })
      }

      const dto = {
        date: new Date().toISOString().split('T')[0],
        currency: 'IDR',
        brands: Array.from(brandGroups.entries()).map(([brand, prices]) => ({
          brand,
          prices,
        })),
      }

      return successResponse(dto, 'Current prices retrieved', {
        source: 'Galeri 24 Scraper',
        fetchedAt: new Date().toISOString(),
      })
    } finally {
      await prisma.$disconnect()
      await pool.end()
    }
  }
}
