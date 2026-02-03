import { NextRequest, NextResponse } from 'next/server'
import { successResponse } from '@/applications/shared/lib/response'
import { ValidationError } from '@/applications/shared/lib/errors'
import { GetBuybackPricesUsecase } from '../../usecases/get-buyback-prices.usecase'
import { PrismaGoldDailyCloseRepository } from '../../repository/prisma-gold-daily-close.repository'

export class BuybackController {
  private repo = new PrismaGoldDailyCloseRepository()
  private usecase = new GetBuybackPricesUsecase(this.repo)

  /**
   * GET /api/v1/buyback/prices
   * 
   * Query params:
   * - items: comma-separated list of brand:gram pairs (e.g. "ANTAM:1,ANTAM:5,UBS:10")
   */
  async getLatestPrices(req: NextRequest): Promise<NextResponse> {
    const { searchParams } = new URL(req.url)
    const itemsParam = searchParams.get('items')

    if (!itemsParam) {
      throw new ValidationError('Missing items parameter')
    }

    const items: { brandCode: string; denominationGram: number }[] = []

    // Parse items
    const rawItems = itemsParam.split(',')
    for (const raw of rawItems) {
      const [brand, weightStr] = raw.split(':')
      if (!brand || !weightStr) {
        continue // Skip invalid format
      }

      const weight = parseFloat(weightStr)
      if (isNaN(weight) || weight <= 0) {
        continue // Skip invalid weight
      }

      items.push({
        brandCode: brand.trim(),
        denominationGram: weight
      })
    }

    if (items.length === 0) {
      throw new ValidationError('No valid items provided')
    }

    // Execute usecase
    const prices = await this.usecase.execute(items)

    // Map to response DTO
    const priceDtos = prices.map(p => ({
      brandCode: p.brandCode,
      denominationGram: p.denominationGram.toNumber(), // Convert Decimal to number
      price: Number(p.price), // Convert BigInt to number
      closeDate: p.closeDate.toISOString().split('T')[0] // YYYY-MM-DD
    }))

    return successResponse({
      prices: priceDtos,
      currency: 'IDR'
    }, 'Buyback prices retrieved')
  }
}
