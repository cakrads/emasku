/**
 * Get Brands Usecase
 * 
 * Business logic to fetch supported brands.
 */

import { logger } from '@/applications/shared/lib/logger'
import { BrandDomain } from '../domain/brand.domain'
import { BRAND_CONFIG } from '../domain/brands.const'

export class GetBrandsUsecase {
  async execute(): Promise<BrandDomain[]> {
    logger.info('Fetching brands')

    // Use shared configuration as single source of truth
    const brands: BrandDomain[] = [...BRAND_CONFIG]

    logger.info('Brands fetched', { count: brands.length })

    return brands
  }
}
