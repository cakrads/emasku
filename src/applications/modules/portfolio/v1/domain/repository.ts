import { PortfolioHoldingDomain } from './portfolio.domain';

export interface IPortfolioRepository {
  findAllByUserId(userId: string, filter?: { status?: 'active' | 'sold' | 'all' }): Promise<PortfolioHoldingDomain[]>;
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
  // We can keep these compatible or just replace them
  existsByUserIdAndId(userId: string, id: string): Promise<boolean>;
  markAsSold(userId: string, id: string): Promise<void>;
  delete(userId: string, id: string): Promise<void>;
}
