/**
 * Shared Price Domain Contracts
 */

export enum PriceType {
    SELL = 'SELL',
    BUYBACK = 'BUYBACK',
    RETAIL = 'RETAIL'
}

export interface PriceResult {
    price: number
    priceAt: Date
}

export interface IPriceRepository {
    getLatestBuybackPrice(brandCode: string, denominationGram: number): Promise<PriceResult | null>
    getLatestSellPrice(brandCode: string, denominationGram: number): Promise<PriceResult | null>
    getLatestBuybackPrices(keys: string[]): Promise<Record<string, PriceResult>>
    getLatestSellPrices(keys: string[]): Promise<Record<string, PriceResult>>
    getPreviousPrice(brandCode: string, denominationGram: number, priceType: any): Promise<PriceResult | null>
}
