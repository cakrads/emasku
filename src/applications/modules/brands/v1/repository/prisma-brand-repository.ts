/**
 * Prisma Implementation of Brand Repository
 */

import { PrismaClient } from '@prisma/client'
import { IBrandRepository } from './brand-repository.interface'
import { Brand } from '../domain/brand'
import { logQuery } from '@/applications/shared/lib/logger'

export class PrismaBrandRepository implements IBrandRepository {
  constructor(private prisma: PrismaClient) { }

  async getActiveBrands(): Promise<Brand[]> {
    const startTime = Date.now()

    const brands = await this.prisma.brand.findMany({
      where: { isActive: true },
      select: {
        code: true,
        name: true,
        isActive: true,
      },
      orderBy: { code: 'asc' },
    })

    logQuery('getActiveBrands', Date.now() - startTime, {
      count: brands.length,
    })

    return brands
  }
}
