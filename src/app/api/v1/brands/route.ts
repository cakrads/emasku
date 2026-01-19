/**
 * GET /api/v1/brands
 * 
 * Returns list of supported brands.
 */

import { wrapController } from '@/applications/shared/lib/controller-wrapper'
import { BrandsController } from '@/applications/modules/brands/v1/delivery/http/brands-controller'

export const GET = wrapController(async () => {
  const controller = new BrandsController()
  const response = await controller.getBrands()

  // Cache for 24 hours (Master Data rarely changes)
  response.headers.set('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=3600')

  return response
})
