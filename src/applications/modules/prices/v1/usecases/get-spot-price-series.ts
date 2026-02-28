/**
 * Get Spot Price Series Usecase
 * 
 * Business logic to fetch historical spot prices for charting.
 */

import { Decimal } from 'decimal.js'
import { IPriceRepository } from '../repository/price-repository.interface'
import { GoldPriceRecord } from '../domain/gold-price'
import { ValidationError } from '@/applications/shared/lib/errors'
import { logger } from '@/applications/shared/lib/logger'

export interface GetSpotSeriesParams {
  brandCode: string
  from: Date
  to: Date
  denominationGram?: number
}

export class GetSpotPriceSeriesUsecase {
  constructor(private priceRepo: IPriceRepository) { }

  async execute(params: GetSpotSeriesParams): Promise<GoldPriceRecord[]> {
    const { brandCode, from, to, denominationGram = 1 } = params

    // 1. Basic type validation
    if (!(from instanceof Date) || isNaN(from.getTime())) {
      throw new ValidationError('from date is invalid')
    }
    if (!(to instanceof Date) || isNaN(to.getTime())) {
      throw new ValidationError('to date is invalid')
    }
    if (typeof denominationGram !== 'number' || !isFinite(denominationGram) || denominationGram <= 0) {
      throw new ValidationError('denominationGram must be a positive number')
    }

    // 2. Logical validation: from must be before to
    if (from >= to) {
      throw new ValidationError('from date must be before to date', {
        from: from.toISOString(),
        to: to.toISOString(),
      })
    }

    const denom = new Decimal(denominationGram)

    logger.info('Fetching spot price series', {
      brandCode,
      from,
      to,
      denominationGram,
    })

    const series = await this.priceRepo.getSpotPriceSeries(
      brandCode,
      from,
      to,
      denom
    )

    logger.info('Spot price series fetched', {
      brandCode,
      count: series.length,
    })

    return series
  }
}
