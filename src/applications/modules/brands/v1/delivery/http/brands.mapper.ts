/**
 * Brands Mapper
 * 
 * Maps domain models to API contract types.
 */

import { BrandDomain } from '../../domain/brand.domain'
import { BrandsList, BrandItem } from '@/shared/contracts/brands.contract'

export class BrandsMapper {
  static toBrandsListResponse(domains: BrandDomain[]): BrandsList {
    return {
      items: domains.map((d) => ({
        code: d.code,
        name: d.name,
        isActive: d.isActive,
      })),
    }
  }
}
