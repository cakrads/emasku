/**
 * List Brands Usecase
 */

import { IBrandRepository } from '../repository/brand-repository.interface'
import { Brand } from '../domain/brand'
import { logger } from '@/applications/shared/lib/logger'

export class ListBrandsUsecase {
  constructor(private brandRepo: IBrandRepository) { }

  async execute(): Promise<Brand[]> {
    logger.info('Fetching active brands')

    const brands = await this.brandRepo.getActiveBrands()

    logger.info('Active brands fetched', { count: brands.length })

    return brands
  }
}
