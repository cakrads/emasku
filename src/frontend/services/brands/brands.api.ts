/**
 * Brands API Client
 */

import { BrandsList, BrandsListSchema } from '@/shared/contracts/brands.contract'

export async function fetchBrands(): Promise<BrandsList> {
  const response = await fetch('/api/v1/brands', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch brands: ${response.statusText}`)
  }

  const json = await response.json()
  const validated = BrandsListSchema.parse(json.data)

  return validated
}
