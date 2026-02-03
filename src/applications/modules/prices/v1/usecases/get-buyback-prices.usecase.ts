import { PrismaGoldDailyCloseRepository } from '../repository/prisma-gold-daily-close.repository'
import { GoldDailyClose } from '@prisma/client'

export class GetBuybackPricesUsecase {
  constructor(private repo: PrismaGoldDailyCloseRepository) { }

  async execute(items: { brandCode: string; denominationGram: number }[]): Promise<GoldDailyClose[]> {
    return this.repo.getLatestBuybackPrices(items)
  }
}
