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
   */
  async getSpotSeries(req: NextRequest): Promise<NextResponse> {
    // Parse and validate query parameters
    const { searchParams } = new URL(req.url)

    const schema = z.object({
      brand: z.string().min(1, 'brand is required'),
      from: z.string().refine(v => !isNaN(Date.parse(v)), 'from must be a valid date'),
      to: z.string().refine(v => !isNaN(Date.parse(v)), 'to must be a valid date'),
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

      const dto = {
        date: new Date().toISOString(),
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
