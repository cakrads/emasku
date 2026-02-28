import { PortfolioHoldingDomain, SellHoldingData, SellHoldingResult, BulkSellResult } from '@/applications/shared/domain/portfolio.contract'

export type { SellHoldingData, SellHoldingResult, BulkSellResult } from '@/applications/shared/domain/portfolio.contract'


export interface IPortfolioRepository {
  findAllByUserId(
    userId: string,
    filter?: {
      status?: 'active' | 'sold' | 'all'
      brandCodes?: string[]
      dateFrom?: string
      dateTo?: string
      goalId?: string
    },
    pagination?: { page: number; pageSize: number }
  ): Promise<{ items: PortfolioHoldingDomain[]; total: number }>;
  findById(id: string): Promise<PortfolioHoldingDomain | null>;
  create(userId: string, data: {
    brandCode: string
    denominationGram: number
    quantity: number
    buyPrice: number | bigint
    buyDate?: Date
    notes?: string
    goalId?: string
  }): Promise<PortfolioHoldingDomain>;
  update(userId: string, id: string, data: {
    denominationGram?: number
    quantity?: number
    buyPrice?: number | bigint
    buyDate?: Date
    notes?: string
    brandCode?: string
    goalId?: string | null
  }): Promise<PortfolioHoldingDomain>;
  existsByUserIdAndId(userId: string, id: string): Promise<boolean>;
  sellHolding(userId: string, id: string, data: SellHoldingData): Promise<SellHoldingResult>;
  bulkSellHoldings(userId: string, items: { id: string, sellPrice: number }[], commonData: Omit<SellHoldingData, 'sellPrice'>): Promise<BulkSellResult>;
  delete(userId: string, id: string, hard?: boolean): Promise<void>;
}
