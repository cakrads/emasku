/**
 * GET /api/v1/brands
 * 
 * Returns list of supported brands.
 */

import { wrapController } from '@/applications/shared/lib/controller-wrapper'
import { BrandsController } from '@/applications/modules/brands/v1/delivery/http/brands-controller'

export const GET = wrapController(async () => {
  const controller = new BrandsController()
  return controller.getBrands()
})
