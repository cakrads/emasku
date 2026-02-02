/**
 * Get Portfolio Summary Usecase
 * 
 * Business logic to compute portfolio aggregates with spec-compliant valuation.
 * Implements BUYBACK → NULL fallback logic.
 */

import Decimal from 'decimal.js'
import { PrismaPortfolioRepository } from '@/applications/shared/persistence/repositories/prisma-portfolio-repository'
import { PrismaPriceRepository } from '@/applications/shared/persistence/repositories/prisma-price-repository'
import { PrismaGoldDailyCloseRepository } from '@/applications/modules/prices/v1/repository/prisma-gold-daily-close.repository'
import { PortfolioSummaryDomain, BrandAllocationDomain, PortfolioHoldingDomain } from '../domain/portfolio.domain'
import { PriceType } from '@prisma/client'
import { logger } from '@/applications/shared/lib/logger'

export interface HoldingsFilter {
  status?: 'active' | 'sold' | 'all'
  brandCodes?: string[]
  dateFrom?: string
  dateTo?: string
}

interface PeriodicDates {
  today: { str: string, date: Date }
  yesterday: { str: string, date: Date }
  weekAgo: { str: string, date: Date }
  monthAgo: { str: string, date: Date }
  yearAgo: { str: string, date: Date }
}

export class GetPortfolioSummaryUsecase {
  private portfolioRepo = new PrismaPortfolioRepository()
  private priceRepo = new PrismaPriceRepository()
  private dailyCloseRepo = new PrismaGoldDailyCloseRepository()

  async execute(userId: string = 'default-user-id', filter: HoldingsFilter = {}): Promise<PortfolioSummaryDomain> {
    logger.info('Computing portfolio summary', { userId, filter })

    const { items: holdings } = await this.portfolioRepo.findAllByUserId(userId, filter)

    if (holdings.length === 0) {
      return this.emptyPortfolio()
    }

    // 1. Enrich with valuations
    const valuatedHoldings = await Promise.all(
      holdings.map(async (holding) => {
        const valuation = await this.getValuation(holding)
        return { holding, valuation }
      })
    )

    // 2. Prepare periods and state
    const dates = this.getPeriodicDates()
    this.logDates(dates)

    const state = {
      totalBuyValue: new Decimal(0),
      totalCurrentValue: new Decimal(0),
      totalWeightGram: new Decimal(0),
      valuatedCount: 0,
      latestPriceUpdate: null as Date | null,

      // Accumulators for PnL & Base values
      daily: { pnl: new Decimal(0), base: new Decimal(0), has: false },
      weekly: { pnl: new Decimal(0), base: new Decimal(0), has: false },
      monthly: { pnl: new Decimal(0), base: new Decimal(0), has: false },
      yearly: { pnl: new Decimal(0), base: new Decimal(0), has: false },

      dailyCloseCache: new Map<string, number | null>(),
      brandMap: new Map<string, BrandAllocationDomain>()
    }

    // 3. Main processing loop
    for (const { holding, valuation } of valuatedHoldings) {
      const buyValue = new Decimal(holding.buyPrice).times(holding.quantity)

      if (valuation.currentValue !== null) {
        state.totalBuyValue = state.totalBuyValue.plus(buyValue)
        state.totalCurrentValue = state.totalCurrentValue.plus(valuation.currentValue)
        state.totalWeightGram = state.totalWeightGram.plus(
          new Decimal(holding.denominationGram).times(holding.quantity)
        )
        state.valuatedCount++

        if (valuation.priceAsOf && (!state.latestPriceUpdate || valuation.priceAsOf > state.latestPriceUpdate)) {
          state.latestPriceUpdate = valuation.priceAsOf
        }

        // Process periodic PnL for this valuated holding
        await this.processPeriodicPnLForHolding(holding, dates, state)
      }

      this.aggregateBrand(state.brandMap, holding, valuation, buyValue)
    }

    // 4. Final aggregation
    const totalPnL = state.totalCurrentValue.minus(state.totalBuyValue)
    const pnlPercentage = state.totalBuyValue.greaterThan(0)
      ? totalPnL.dividedBy(state.totalBuyValue).times(100).toNumber()
      : 0

    const result: PortfolioSummaryDomain = {
      totalBuyValue: state.totalBuyValue.toNumber(),
      totalCurrentValue: state.totalCurrentValue.toNumber(),
      totalPnL: totalPnL.toNumber(),
      pnlPercentage,

      totalDailyPnL: state.daily.has ? state.daily.pnl.toNumber() : null,
      totalDailyPnLPercentage: this.calcPct(state.daily.pnl, state.daily.base, state.daily.has),

      totalWeeklyPnL: state.weekly.has ? state.weekly.pnl.toNumber() : null,
      totalWeeklyPnLPercentage: this.calcPct(state.weekly.pnl, state.weekly.base, state.weekly.has),

      totalMonthlyPnL: state.monthly.has ? state.monthly.pnl.toNumber() : null,
      totalMonthlyPnLPercentage: this.calcPct(state.monthly.pnl, state.monthly.base, state.monthly.has),

      totalYearlyPnL: state.yearly.has ? state.yearly.pnl.toNumber() : null,
      totalYearlyPnLPercentage: this.calcPct(state.yearly.pnl, state.yearly.base, state.yearly.has),

      totalWeightGram: state.totalWeightGram.toNumber(),
      holdingCount: holdings.length,
      lastUpdated: state.latestPriceUpdate ?? new Date(),
      brandAllocation: Array.from(state.brandMap.values()),
      disclaimer: 'Valuations based on latest available market prices',
      excludedCount: holdings.length - state.valuatedCount,
      valuationCoverage: holdings.length > 0 ? (state.valuatedCount / holdings.length) * 100 : 0
    }

    return result
  }

  private calcPct(pnl: Decimal, base: Decimal, has: boolean): number | null {
    if (!has) return null
    return base.gt(0) ? pnl.dividedBy(base).times(100).toNumber() : 0
  }

  private getPeriodicDates(): PeriodicDates {
    const now = new Date()
    const wibOffset = 7 * 60 * 60 * 1000
    const wibNow = new Date(now.getTime() + wibOffset)

    const createDateInfo = (daysAgo: number) => {
      const d = new Date(wibNow)
      d.setDate(d.getDate() - daysAgo)
      const str = d.toISOString().split('T')[0]
      return { str, date: new Date(str) }
    }

    return {
      today: createDateInfo(0),
      yesterday: createDateInfo(1),
      weekAgo: createDateInfo(7),
      monthAgo: createDateInfo(30),
      yearAgo: createDateInfo(365)
    }
  }

  private logDates(dates: PeriodicDates) {
    console.log('Hari ini (T+0):', dates.today.str);
    console.log('Kemarin (T-1):', dates.yesterday.str);
    console.log('7 hari lalu (T-7):', dates.weekAgo.str);
    console.log('30 hari lalu (T-30):', dates.monthAgo.str);
    console.log('365 hari lalu (T-365):', dates.yearAgo.str);
  }

  private async processPeriodicPnLForHolding(
    holding: PortfolioHoldingDomain,
    dates: PeriodicDates,
    state: any
  ) {
    const gram = new Decimal(holding.denominationGram)
    const qty = new Decimal(holding.quantity)

    // Fetch all closes in parallel for this holding
    const [pToday, pYesterday, pWeek, pMonth, pYear] = await Promise.all([
      this.getClosePrice(holding.brandCode, gram, dates.today.str, dates.today.date, state.dailyCloseCache),
      this.getClosePrice(holding.brandCode, gram, dates.yesterday.str, dates.yesterday.date, state.dailyCloseCache),
      this.getClosePrice(holding.brandCode, gram, dates.weekAgo.str, dates.weekAgo.date, state.dailyCloseCache),
      this.getClosePrice(holding.brandCode, gram, dates.monthAgo.str, dates.monthAgo.date, state.dailyCloseCache),
      this.getClosePrice(holding.brandCode, gram, dates.yearAgo.str, dates.yearAgo.date, state.dailyCloseCache)
    ])

    // helper to update period accumulators
    const update = (obj: any, current: number | null, historical: number | null) => {
      if (current !== null && historical !== null) {
        const move = current - historical
        obj.pnl = obj.pnl.plus(new Decimal(move).times(qty))
        obj.base = obj.base.plus(new Decimal(historical).times(qty))
        obj.has = true
      }
    }

    update(state.daily, pToday, pYesterday)
    update(state.weekly, pToday, pWeek)
    update(state.monthly, pToday, pMonth)
    update(state.yearly, pToday, pYear)
  }

  private async getClosePrice(
    brandCode: string,
    gram: Decimal,
    dateStr: string,
    dateObj: Date,
    cache: Map<string, number | null>
  ): Promise<number | null> {
    const key = `${brandCode}-SELL-${gram}-${dateStr}`
    if (cache.has(key)) return cache.get(key)!

    // 1. Exact match
    let close = await this.dailyCloseRepo.getByDate(brandCode, PriceType.SELL, gram, dateObj)

    // 2. Fallback to 1g scaled
    if (!close && !gram.equals(1)) {
      const close1g = await this.dailyCloseRepo.getByDate(brandCode, PriceType.SELL, new Decimal(1), dateObj)
      if (close1g) {
        const estimated = new Decimal(close1g.price).times(gram).toNumber()
        cache.set(key, estimated)
        return estimated
      }
    }

    const val = close ? Number(close.price) : null
    cache.set(key, val)
    return val
  }

  /**
   * Get valuation for a holding using fallback logic:
   * BUYBACK → NULL
   */
  private async getValuation(holding: PortfolioHoldingDomain) {
    const priceResult = await this.priceRepo.getLatestBuybackPrice(
      holding.brandCode,
      holding.denominationGram
    )

    if (!priceResult) {
      return { currentValue: null, valuationSource: 'NONE' as const, priceAsOf: null }
    }

    const currentValue = new Decimal(priceResult.price)
      .times(holding.quantity)
      .toNumber()

    return {
      currentValue,
      valuationSource: 'BUYBACK' as const,
      priceAsOf: priceResult.priceAt
    }
  }

  /**
   * Aggregate holdings by brand code.
   */
  private aggregateBrand(
    brandMap: Map<string, BrandAllocationDomain>,
    holding: PortfolioHoldingDomain,
    valuation: { currentValue: number | null, valuationSource: string },
    buyValue: Decimal
  ) {
    const existing = brandMap.get(holding.brandCode)
    const grams = new Decimal(holding.denominationGram).times(holding.quantity).toNumber()
    const hasValuation = valuation.currentValue !== null

    if (existing) {
      existing.totalGrams += grams
      existing.totalBuyValue += buyValue.toNumber()
      if (hasValuation) {
        existing.currentValue += valuation.currentValue!
        existing.deltaValue += (valuation.currentValue! - buyValue.toNumber())

        const totalBuyOfValuated = new Decimal(existing.currentValue).minus(existing.deltaValue)
        existing.deltaPercentage = totalBuyOfValuated.greaterThan(0)
          ? new Decimal(existing.deltaValue).dividedBy(totalBuyOfValuated).times(100).toNumber()
          : 0
      }

      if (existing.valuationSource !== valuation.valuationSource) {
        existing.valuationSource = 'MIXED'
      }
    } else {
      const currentValue = valuation.currentValue || 0
      const deltaValue = hasValuation ? (currentValue - buyValue.toNumber()) : 0
      const deltaPercentage = (hasValuation && buyValue.greaterThan(0))
        ? new Decimal(deltaValue).dividedBy(buyValue).times(100).toNumber()
        : 0

      brandMap.set(holding.brandCode, {
        brandCode: holding.brandCode,
        brandName: holding.brandName,
        totalGrams: grams,
        totalBuyValue: buyValue.toNumber(),
        currentValue,
        valuationSource: valuation.valuationSource as 'NONE' | 'BUYBACK' | 'MIXED',
        deltaValue,
        deltaPercentage
      })
    }
  }

  private emptyPortfolio(): PortfolioSummaryDomain {
    return {
      totalBuyValue: 0,
      totalCurrentValue: 0,
      totalPnL: 0,
      pnlPercentage: 0,
      totalDailyPnL: null,
      totalDailyPnLPercentage: null,
      totalWeeklyPnL: null,
      totalWeeklyPnLPercentage: null,
      totalMonthlyPnL: null,
      totalMonthlyPnLPercentage: null,
      totalYearlyPnL: null,
      totalYearlyPnLPercentage: null,
      totalWeightGram: 0,
      holdingCount: 0,
      lastUpdated: new Date(),
      brandAllocation: [],
      disclaimer: 'No holdings in portfolio',
      excludedCount: 0,
      valuationCoverage: 0
    }
  }
}
