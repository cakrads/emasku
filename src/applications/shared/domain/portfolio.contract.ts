/**
 * Shared Portfolio Domain Contracts
 * 
 * Centralized interfaces for portfolio-related domain models.
 * Repositories and modules should depend on these to avoid coupling.
 */

import Decimal from 'decimal.js'

export class PortfolioHoldingDomain {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public readonly brandCode: string,
        public readonly brandName: string,
        public readonly denominationGram: number,
        public readonly quantity: number,
        public readonly buyPrice: number,
        public readonly boughtAt: Date | null,
        public status: 'ACTIVE' | 'SOLD',
        public readonly createdAt: Date,
        public updatedAt?: Date,
        public notes?: string,
        public goalId?: string | null,
        public goalName?: string | null,
        public soldAt?: Date | null,
        // Sell transaction data
        public sellPrice?: number | null,
        public sellDate?: Date | null,
        public sellNotes?: string | null,
        public realizedPnL?: number | null,
        public realizedPnLPercentage?: number | null,
        public holdingDurationDays?: number | null,
    ) {
        this.validate()
    }

    private validate() {
        if (this.quantity <= 0) throw new Error('Quantity must be greater than zero')
        if (this.buyPrice < 0) throw new Error('Buy price cannot be negative')
        if (this.denominationGram <= 0) throw new Error('Denomination must be greater than zero')
    }

    public getBuyValue(): Decimal {
        return new Decimal(this.buyPrice).times(this.quantity)
    }

    public isSold(): boolean {
        return this.status === 'SOLD'
    }
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
