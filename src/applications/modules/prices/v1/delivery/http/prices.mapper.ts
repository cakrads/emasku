/**
 * Prices Mapper
 * 
 * Maps domain models to API contract types.
 * 
 * CRITICAL RULES:
 * - NO business logic
 * - NO formatting
 * - ONLY type transformation
 */

import { BrandDenominationPrice } from '../../domain/prices.domain'
import { PricesTodayResponse, BrandPriceGroup } from '@/shared/contracts/prices.contract'

export class PricesMapper {
  /**
   * Map domain prices to API contract
   */
  static toTodayPricesResponse(domainPrices: BrandDenominationPrice[]): PricesTodayResponse {
    // Group by brand
    const brandMap = new Map<string, BrandDenominationPrice[]>()

    for (const price of domainPrices) {
      if (!brandMap.has(price.brand)) {
        brandMap.set(price.brand, [])
      }
      brandMap.get(price.brand)!.push(price)
    }

    // Transform to contract format
    const brands: BrandPriceGroup[] = Array.from(brandMap.entries()).map(
      ([brandCode, prices]) => ({
        brand: brandCode,
        prices: prices.map((p) => ({
          denominationGram: p.denominationGram,
          sellPrice: p.sellPrice ?? 0,
          buybackPrice: p.buybackPrice ?? 0,
        })),
      })
    )

    return {
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      currency: 'IDR',
      brands,
    }
  }
}
