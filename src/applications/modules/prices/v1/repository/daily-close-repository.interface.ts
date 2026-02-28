import { PriceType, GoldDailyClose } from '@prisma/client'
import { Decimal } from 'decimal.js'

export interface IGoldDailyCloseRepository {
    upsert(data: {
        brandCode: string
        priceType: PriceType
        denominationGram: Decimal
        price: bigint
        closeDate: Date
        source: string
        derivedFromPriceAt: Date
    }): Promise<GoldDailyClose>

    getByDate(
        brandCode: string,
        priceType: PriceType,
        denominationGram: Decimal,
        date: Date
    ): Promise<GoldDailyClose | null>

    getPreviousClose(
        brandCode: string,
        priceType: PriceType,
        denominationGram: Decimal,
        beforeDate: Date
    ): Promise<GoldDailyClose | null>

    getLatestBuybackPrices(
        items: { brandCode: string; denominationGram: number }[]
    ): Promise<GoldDailyClose[]>

    getByDateBatch(
        items: { brandCode: string; priceType: PriceType; denominationGram: Decimal; closeDate: Date }[]
    ): Promise<GoldDailyClose[]>
}
