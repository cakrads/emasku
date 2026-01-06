/**
 * Brands HTTP Controller
 */

import { NextResponse } from 'next/server'
import { successResponse } from '@/applications/shared/lib/response'
import { GetBrandsUsecase } from '../../usecases/get-brands'
import { BrandsMapper } from './brands.mapper'
import { BrandsListSchema } from '@/shared/contracts/brands.contract'

export class BrandsController {
  async getBrands(): Promise<NextResponse> {
    const usecase = new GetBrandsUsecase()
    const brands = await usecase.execute()
    const dto = BrandsMapper.toBrandsListResponse(brands)
    const validated = BrandsListSchema.parse(dto)

    return successResponse(validated, 'Supported brands retrieved', {
      totalAvailable: brands.length,
    })
  }
}
