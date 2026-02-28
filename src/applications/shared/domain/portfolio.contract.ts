/**
 * Shared Portfolio Domain Contracts
 * 
 * Centralized interfaces for portfolio-related domain models.
 * Repositories and modules should depend on these to avoid coupling.
 */

export interface PortfolioHoldingDomain {
    id: string
    userId: string
    brandCode: string
    brandName: string
    denominationGram: number
    quantity: number
    buyPrice: number
    boughtAt: Date | null
    soldAt?: Date | null
    status: 'ACTIVE' | 'SOLD'
    createdAt: Date
    updatedAt?: Date
    notes?: string
    goalId?: string | null
    goalName?: string | null
    // Sell transaction data
    sellPrice?: number | null
    sellDate?: Date | null
    sellNotes?: string | null
    realizedPnL?: number | null
    realizedPnLPercentage?: number | null
    holdingDurationDays?: number | null
}

export interface SellHoldingData {
    sellPrice: number | bigint
    sellDate: Date
    notes?: string
}

export interface SellHoldingResult {
    id: string
    holdingId: string
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
