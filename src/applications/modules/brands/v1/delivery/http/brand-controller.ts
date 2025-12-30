/**
 * Brand HTTP Controller
 */

import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import { DATABASE_URL } from '@/applications/shared/lib/env'
import { successResponse } from '@/applications/shared/lib/response'
import { PrismaBrandRepository } from '../../repository/prisma-brand-repository'
import { ListBrandsUsecase } from '../../usecases/list-brands'

export class BrandController {
  /**
   * GET /api/v1/brands
   */
  async list(): Promise<NextResponse> {
    const pool = new pg.Pool({ connectionString: DATABASE_URL })
    const adapter = new PrismaPg(pool)
    const prisma = new PrismaClient({ adapter })

    try {
      const brandRepo = new PrismaBrandRepository(prisma)
      const usecase = new ListBrandsUsecase(brandRepo)

      const brands = await usecase.execute()

      const dto = {
        items: brands.map((b) => ({
          code: b.code,
          name: b.name,
          isActive: b.isActive,
        })),
      }

      return successResponse(dto, 'Supported brands retrieved', {
        totalAvailable: brands.length,
      })
    } finally {
      await prisma.$disconnect()
      await pool.end()
    }
  }
}
