/**
 * Get Portfolio Summary Usecase
 * 
 * Business logic to compute portfolio aggregates with spec-compliant valuation.
 * Implements BUYBACK → NULL fallback logic.
 */

import Decimal from 'decimal.js'
import { IPortfolioRepository } from '../domain/repository'
import { IPriceRepository } from '@/applications/shared/domain/price.contract'
import { IGoldDailyCloseRepository } from '@/applications/modules/prices/v1/repository/daily-close-repository.interface'
import { PortfolioSummaryDomain, BrandAllocationDomain, PortfolioHoldingDomain } from '../domain/portfolio.domain'
import { PriceType } from '@/applications/shared/domain/price.contract'
import { logger } from '@/applications/shared/lib/logger'
import { ValidationError } from '@/applications/shared/lib/errors'

export interface HoldingsFilter {
  status?: 'active' | 'sold' | 'all'
  brandCodes?: string[]
  dateFrom?: string
  dateTo?: string
  goalId?: string
}

interface PeriodicDates {
  today: { str: string, date: Date }
  yesterday: { str: string, date: Date }
  weekAgo: { str: string, date: Date }
  monthAgo: { str: string, date: Date }
  yearAgo: { str: string, date: Date }
}

export class GetPortfolioSummaryUsecase {
  constructor(
    private readonly portfolioRepo: IPortfolioRepository,
    private readonly priceRepo: IPriceRepository,
    private readonly dailyCloseRepo: IGoldDailyCloseRepository
  ) { }

  async execute(userId: string, filter: HoldingsFilter = {}): Promise<PortfolioSummaryDomain> {
    if (!userId) {
      throw new ValidationError('userId is required')
    }
    logger.info('Computing portfolio summary', { userId, filter })

    const { items: holdings } = await this.portfolioRepo.findAllByUserId(userId, filter)

    if (holdings.length === 0) {
      return this.emptyPortfolio()
    }

    // 0. Batch collect all required prices to fix N+1
    const dates = this.getPeriodicDates()
    const activeHoldings = holdings.filter(h => h.status !== 'SOLD')
    const priceKeys = new Set<string>()
    const dailyCloseKeysList: Array<{ brandCode: string, priceType: PriceType, denominationGram: Decimal, closeDate: Date }> = []
    const dailyCloseUniqueSet = new Set<string>()

    for (const h of holdings) {
      const g = new Decimal(h.denominationGram)
      const k = `${h.brandCode}:${h.denominationGram}`
      priceKeys.add(k)
      if (!g.equals(1)) priceKeys.add(`${h.brandCode}:1`)

      if (h.status !== 'SOLD') {
        const addCloseKey = (gram: Decimal, date: Date) => {
          const dk = `${h.brandCode}:${PriceType.SELL}:${gram.toString()}:${date.toISOString().split('T')[0]}`
          if (!dailyCloseUniqueSet.has(dk)) {
            dailyCloseUniqueSet.add(dk)
            dailyCloseKeysList.push({ brandCode: h.brandCode, priceType: PriceType.SELL, denominationGram: gram, closeDate: date })
          }
        }

        const targetDates = [dates.yesterday.date, dates.weekAgo.date, dates.monthAgo.date, dates.yearAgo.date]
        for (const d of targetDates) {
          addCloseKey(g, d)
          if (!g.equals(1)) addCloseKey(new Decimal(1), d)
        }
      }
    }

    const [buybackPricesDict, sellPricesDict, dailyCloses] = await Promise.all([
      this.priceRepo.getLatestBuybackPrices(Array.from(priceKeys)),
      this.priceRepo.getLatestSellPrices(Array.from(priceKeys)),
      this.dailyCloseRepo.getByDateBatch(dailyCloseKeysList)
    ])

    // Map daily closes to a fast lookup dictionary
    const dailyClosesDict = new Map<string, number>()
    for (const dc of dailyCloses) {
      const dk = `${dc.brandCode}:${dc.priceType}:${dc.denominationGram.toString()}:${dc.closeDate.toISOString().split('T')[0]}`
      dailyClosesDict.set(dk, Number(dc.price))
    }

    // 1. Enrich with valuations
    const valuatedHoldings = holdings.map((holding) => {
      const valuation = this.getValuationSync(holding, buybackPricesDict)
      return { holding, valuation }
    })

    // 2. Prepare state
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

      brandMap: new Map<string, BrandAllocationDomain>()
    }

    // 3. Process each holding
    valuatedHoldings.forEach(({ holding, valuation }) => {
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

        // Apply PnL results
        const pnl = this.processPeriodicPnLForHoldingSync(holding, dates, sellPricesDict, dailyClosesDict)
        if (pnl) {
          state.daily.pnl = state.daily.pnl.plus(pnl.daily.pnl)
          state.daily.base = state.daily.base.plus(pnl.daily.base)
          if (pnl.daily.has) state.daily.has = true

          state.weekly.pnl = state.weekly.pnl.plus(pnl.weekly.pnl)
          state.weekly.base = state.weekly.base.plus(pnl.weekly.base)
          if (pnl.weekly.has) state.weekly.has = true

          state.monthly.pnl = state.monthly.pnl.plus(pnl.monthly.pnl)
          state.monthly.base = state.monthly.base.plus(pnl.monthly.base)
          if (pnl.monthly.has) state.monthly.has = true

          state.yearly.pnl = state.yearly.pnl.plus(pnl.yearly.pnl)
          state.yearly.base = state.yearly.base.plus(pnl.yearly.base)
          if (pnl.yearly.has) state.yearly.has = true
        }
      }

      this.aggregateBrand(state.brandMap, holding, valuation, buyValue)
    })

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
    logger.debug('Periodic dates', {
      today: dates.today.str,
      yesterday: dates.yesterday.str,
      weekAgo: dates.weekAgo.str,
      monthAgo: dates.monthAgo.str,
      yearAgo: dates.yearAgo.str,
    })
  }

  private processPeriodicPnLForHoldingSync(
    holding: PortfolioHoldingDomain,
    dates: PeriodicDates,
    sellPricesDict: Record<string, { price: number, priceAt: Date }>,
    dailyClosesDict: Map<string, number>
  ): {
    daily: { pnl: Decimal, base: Decimal, has: boolean },
    weekly: { pnl: Decimal, base: Decimal, has: boolean },
    monthly: { pnl: Decimal, base: Decimal, has: boolean },
    yearly: { pnl: Decimal, base: Decimal, has: boolean }
  } {
    const gram = new Decimal(holding.denominationGram)
    const qty = new Decimal(holding.quantity)

    // 1. Get current live price from dict (with fallback)
    const key = `${holding.brandCode}:${holding.denominationGram}`
    let pTodayResult = sellPricesDict[key]

    if (!pTodayResult && !gram.equals(1)) {
      const p1g = sellPricesDict[`${holding.brandCode}:1`]
      if (p1g) {
        pTodayResult = {
          price: new Decimal(p1g.price).times(gram).toNumber(),
          priceAt: p1g.priceAt
        }
      }
    }

    const pToday = pTodayResult ? pTodayResult.price : null

    // 2. Get historical closes from dict
    const getClose = (date: Date) => {
      const dk = `${holding.brandCode}:${PriceType.SELL}:${gram.toString()}:${date.toISOString().split('T')[0]}`
      let val = dailyClosesDict.get(dk)

      if (val === undefined && !gram.equals(1)) {
        const dk1g = `${holding.brandCode}:${PriceType.SELL}:1:${date.toISOString().split('T')[0]}`
        const val1g = dailyClosesDict.get(dk1g)
        if (val1g !== undefined) {
          val = new Decimal(val1g).times(gram).toNumber()
        }
      }
      return val ?? null
    }

    const pYesterday = getClose(dates.yesterday.date)
    const pWeek = getClose(dates.weekAgo.date)
    const pMonth = getClose(dates.monthAgo.date)
    const pYear = getClose(dates.yearAgo.date)

    const result = {
      daily: { pnl: new Decimal(0), base: new Decimal(0), has: false },
      weekly: { pnl: new Decimal(0), base: new Decimal(0), has: false },
      monthly: { pnl: new Decimal(0), base: new Decimal(0), has: false },
      yearly: { pnl: new Decimal(0), base: new Decimal(0), has: false }
    }

    const update = (obj: any, current: number | null, historical: number | null) => {
      if (current !== null && historical !== null) {
        const move = current - historical
        obj.pnl = new Decimal(move).times(qty)
        obj.base = new Decimal(historical).times(qty)
        obj.has = true
      }
    }

    update(result.daily, pToday, pYesterday)
    update(result.weekly, pToday, pWeek)
    update(result.monthly, pToday, pMonth)
    update(result.yearly, pToday, pYear)

    return result
  }

  /**
   * Get valuation for a holding using fallback logic:
   * BUYBACK → NULL
   */
  private getValuationSync(holding: PortfolioHoldingDomain, buybackPricesDict: Record<string, { price: number, priceAt: Date }>) {
    const key = `${holding.brandCode}:${holding.denominationGram}`
    const priceResult = buybackPricesDict[key]

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
