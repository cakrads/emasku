import { PortfolioHoldingDomain } from './portfolio.domain';

export interface SellHoldingData {
  sellPrice: number | bigint
  sellDate: Date
  notes?: string
}

export interface SellHoldingResult {
  id: string
  holdingId: string // keep holdingId for internal backward compatibility if necessary
  realizedPnL: number
  realizedPnLPercentage: number
  status: 'SOLD'
}

export interface BulkSellResult {
  results: Array<{
    id: string
    holdingId: string
    status: 'SOLD' | 'FAILED'
    realizedPnL?: number
    error?: string
  }>
}

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
  }): Promise<PortfolioHoldingDomain>;
  update(userId: string, id: string, data: {
    denominationGram?: number
    quantity?: number
    buyPrice?: number | bigint
    buyDate?: Date
    notes?: string
    brandCode?: string
  }): Promise<PortfolioHoldingDomain>;
  existsByUserIdAndId(userId: string, id: string): Promise<boolean>;
  sellHolding(userId: string, id: string, data: SellHoldingData): Promise<SellHoldingResult>;
  bulkSellHoldings(userId: string, items: { id: string, sellPrice: number }[], commonData: Omit<SellHoldingData, 'sellPrice'>): Promise<BulkSellResult>;
  delete(userId: string, id: string): Promise<void>;
}
