/**
 * Get Brands Usecase
 * 
 * Business logic to fetch supported brands.
 */

import { logger } from '@/applications/shared/lib/logger'
import { BrandDomain } from '../domain/brand.domain'

export class GetBrandsUsecase {
  async execute(): Promise<BrandDomain[]> {
    logger.info('Fetching brands')

    // Static brand list
    const brands: BrandDomain[] = [
      { code: 'ANTAM', name: 'Antam', isActive: true },
      { code: 'UBS', name: 'UBS Gold', isActive: true },
      { code: 'GALERI24', name: 'Galeri24', isActive: true },
      { code: 'LOTUS_ARCHI', name: 'Lotus Archi', isActive: true },
    ]

    logger.info('Brands fetched', { count: brands.length })

    return brands
  }
}
