/**
 * Prices HTTP Controller
 * 
 * HTTP adapter for prices-related endpoints.
 * Responsibilities:
 * - Instantiate usecase
 * - Map domain models to DTOs
 * - Return standardized responses
 * - Validate against contract
 * 
 * NO business logic here - just translation.
 */

import { NextResponse } from 'next/server'
import { successResponse } from '@/applications/shared/lib/response'
import { GetPricesTodayUsecase } from '../../usecases/get-prices-today'
import { PricesMapper } from './prices.mapper'
import { PricesTodayResponseSchema } from '@/shared/contracts/prices.contract'

export class PricesController {
  /**
   * GET /api/v1/prices/today
   */
  async getTodayPrices(): Promise<NextResponse> {
    // Instantiate usecase
    const usecase = new GetPricesTodayUsecase()

    // Execute business logic
    const domainPrices = await usecase.execute()

    // Map to API contract
    const dto = PricesMapper.toTodayPricesResponse(domainPrices)

    // Validate against contract schema
    const validated = PricesTodayResponseSchema.parse(dto)

    return successResponse(validated, 'Current prices retrieved', {
      source: 'Dummy Data',
      fetchedAt: new Date().toISOString(),
    })
  }
}
