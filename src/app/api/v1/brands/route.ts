/**
 * Brands Route
 * GET /api/v1/brands
 * 
 * Thin routing layer - delegates to controller
 */

import { wrapController } from '@/applications/shared/lib/controller-wrapper'
import { BrandController } from '@/applications/modules/brands/v1/delivery/http/brand-controller'

export const GET = wrapController(async () => {
  const controller = new BrandController()
  return controller.list()
})
