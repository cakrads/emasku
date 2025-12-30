/**
 * Get Market Overview Usecase
 * 
 * Business logic to compute the market snapshot for the homepage.
 * 
 * Algorithm:
 * 1. Fetch latest ANTAM 1g SPOT price
 * 2. Fetch price from exactly 24h ago
 * 3. Compute delta using decimal.js (financial precision)
 * 4. Return MarketSnapshot
 */

import { Decimal } from 'decimal.js'
import { IPriceRepository } from '../repository/price-repository.interface'
import { MarketSnapshot } from '../domain/market-snapshot'
import { NotFoundError } from '@/applications/shared/lib/errors'
import { logger } from '@/applications/shared/lib/logger'

export class GetMarketOverviewUsecase {
  constructor(private priceRepo: IPriceRepository) { }

  async execute(): Promise<MarketSnapshot> {
    const REFERENCE_BRAND = 'ANTAM'
    const REFERENCE_DENOM = new Decimal(1)

    // Step 1: Get latest spot price
    const latestPrice = await this.priceRepo.getLatestSpotPrice(
      REFERENCE_BRAND,
      REFERENCE_DENOM
    )

    if (!latestPrice) {
      throw new NotFoundError('No market data available')
    }

    logger.info('Market overview: Latest price fetched', {
      brand: REFERENCE_BRAND,
      price: latestPrice.price,
      priceAt: latestPrice.priceAt,
    })

    // Step 2: Get price from 24h ago
    const timestamp24hAgo = new Date(latestPrice.priceAt.getTime() - 24 * 60 * 60 * 1000)
    const price24hAgo = await this.priceRepo.getPriceAt(
      REFERENCE_BRAND,
      REFERENCE_DENOM,
      timestamp24hAgo
    )

    let delta24h: number | null = null
    let deltaPercentage: number | null = null

    if (price24hAgo) {
      // Use Decimal for precise financial calculation
      const latestDecimal = new Decimal(latestPrice.price)
      const oldDecimal = new Decimal(price24hAgo.price)

      // Delta = Latest - 24h
      const deltaDecimal = latestDecimal.minus(oldDecimal)
      delta24h = deltaDecimal.toNumber()

      // Percentage = (Delta / 24h Price) * 100
      if (!oldDecimal.isZero()) {
        deltaPercentage = deltaDecimal.dividedBy(oldDecimal).times(100).toNumber()
      }

      logger.info('Market overview: 24h delta computed', {
        delta24h,
        deltaPercentage,
        price24hAgo: price24hAgo.price,
      })
    } else {
      logger.warn('Market overview: No price found for 24h ago', {
        timestamp24hAgo,
      })
    }

    // Step 3: Get detailed prices for today
    const details = await this.priceRepo.getTodayPrices()

    return {
      referenceBrand: REFERENCE_BRAND,
      spotPrice: latestPrice.price,
      delta24h,
      deltaPercentage,
      lastUpdated: latestPrice.priceAt,
      details,
    }
  }
}
