/**
 * Brands API Client
 */

import { fetchJson } from '@/frontend/utils/api-client'
import { getBaseUrl } from '@/frontend/utils/get-base-url'
import { BrandsList, BrandsListSchema } from '@/shared/contracts/brands.contract'

export async function fetchBrands(options?: RequestInit): Promise<BrandsList> {
  const data = await fetchJson<unknown>(`${getBaseUrl()}/api/v1/brands`, options)
  return BrandsListSchema.parse(data)
}
