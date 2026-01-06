/**
 * Get Portfolio Holdings Usecase
 * 
 * Business logic to fetch all holdings with valuations.
 */

import { logger } from '@/applications/shared/lib/logger'
import { HoldingDomain } from '../domain/portfolio.domain'

export class GetPortfolioHoldingsUsecase {
  async execute(): Promise<HoldingDomain[]> {
    logger.info('Fetching portfolio holdings')

    // Dummy holdings data
    const holdings: HoldingDomain[] = [
      {
        id: 'h1',
        brandCode: 'ANTAM',
        brandName: 'ANTAM',
        denominationGram: 10,
        quantity: 1,
        buyDate: new Date('2024-01-15'),
        avgBuyPrice: 1264300,
        currentBuybackPrice: 1180000,
        totalBuyValue: 12643000,
        currentValue: 11800000,
        unrealizedPnL: -843000,
        pnlPercentage: -6.67,
        notes: 'First purchase - 10g bar',
      },
      {
        id: 'h2',
        brandCode: 'ANTAM',
        brandName: 'ANTAM',
        denominationGram: 25,
        quantity: 1,
        buyDate: new Date('2024-02-20'),
        avgBuyPrice: 1260000,
        currentBuybackPrice: 1180000,
        totalBuyValue: 31500000,
        currentValue: 29500000,
        unrealizedPnL: -2000000,
        pnlPercentage: -6.35,
        notes: '25g bar',
      },
      {
        id: 'h3',
        brandCode: 'ANTAM',
        brandName: 'ANTAM',
        denominationGram: 15,
        quantity: 1,
        buyDate: new Date('2024-03-05'),
        avgBuyPrice: 1262000,
        currentBuybackPrice: 1180000,
        totalBuyValue: 18930000,
        currentValue: 17700000,
        unrealizedPnL: -1230000,
        pnlPercentage: -6.50,
      },
      {
        id: 'h4',
        brandCode: 'GALERI24',
        brandName: 'Galeri24',
        denominationGram: 15,
        quantity: 1,
        buyDate: new Date('2024-03-10'),
        avgBuyPrice: 1262000,
        currentBuybackPrice: 1177000,
        totalBuyValue: 18930000,
        currentValue: 17655000,
        unrealizedPnL: -1275000,
        pnlPercentage: -6.74,
        notes: '15g bar',
      },
      {
        id: 'h5',
        brandCode: 'GALERI24',
        brandName: 'Galeri24',
        denominationGram: 20,
        quantity: 1,
        buyDate: new Date('2024-04-01'),
        avgBuyPrice: 1263000,
        currentBuybackPrice: 1177000,
        totalBuyValue: 25260000,
        currentValue: 23540000,
        unrealizedPnL: -1720000,
        pnlPercentage: -6.81,
      },
      {
        id: 'h6',
        brandCode: 'UBS',
        brandName: 'UBS',
        denominationGram: 10,
        quantity: 1,
        buyDate: new Date('2024-05-15'),
        avgBuyPrice: 1278000,
        currentBuybackPrice: 1185000,
        totalBuyValue: 12780000,
        currentValue: 11850000,
        unrealizedPnL: -930000,
        pnlPercentage: -7.28,
        notes: 'UBS 10g bar',
      },
      {
        id: 'h7',
        brandCode: 'UBS',
        brandName: 'UBS',
        denominationGram: 5,
        quantity: 1,
        buyDate: new Date('2024-06-01'),
        avgBuyPrice: 1280000,
        currentBuybackPrice: 1185000,
        totalBuyValue: 6400000,
        currentValue: 5925000,
        unrealizedPnL: -475000,
        pnlPercentage: -7.42,
      },
    ]

    logger.info('Portfolio holdings fetched', { count: holdings.length })

    return holdings
  }
}
