/**
 * Get Today Prices Usecase
 * 
 * Business logic to fetch current sell and buyback prices.
 */

import { Decimal } from 'decimal.js'
import { IPriceRepository } from '../repository/price-repository.interface'
import { TodayPriceGroup } from '../domain/gold-price'
import { logger } from '@/applications/shared/lib/logger'

export interface GetTodayPricesParams {
  brandCode?: string
  denominationGram?: number
}

export class GetTodayPricesUsecase {
  constructor(private priceRepo: IPriceRepository) { }

  async execute(params: GetTodayPricesParams): Promise<TodayPriceGroup[]> {
    const { brandCode, denominationGram } = params

    const denom = denominationGram !== undefined ? new Decimal(denominationGram) : undefined

    logger.info('Fetching today prices', { brandCode, denominationGram })

    const prices = await this.priceRepo.getTodayPrices(brandCode, denom)

    logger.info('Today prices fetched', {
      brandCode,
      count: prices.length,
    })

    return prices
  }
}
