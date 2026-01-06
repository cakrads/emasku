/**
 * Brands View Model
 */

import { BrandsList, BrandItem } from '@/shared/contracts/brands.contract'

export interface BrandItemVM {
  code: string
  name: string
  isActive: boolean
  displayName: string
}

export function transformBrands(api: BrandsList): BrandItemVM[] {
  return api.items.map((brand) => ({
    code: brand.code,
    name: brand.name,
    isActive: brand.isActive,
    displayName: brand.name,
  }))
}
