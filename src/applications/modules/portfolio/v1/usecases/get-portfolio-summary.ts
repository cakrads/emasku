/**
 * Get Portfolio Summary Usecase
 * 
 * Business logic to compute portfolio aggregates with spec-compliant valuation.
 * Implements BUYBACK → SPOT → NULL fallback logic.
 */

import Decimal from 'decimal.js'
import { PrismaPortfolioRepository } from '@/applications/shared/persistence/repositories/prisma-portfolio-repository'
import { PrismaPriceRepository } from '@/applications/shared/persistence/repositories/prisma-price-repository'
import { PortfolioSummaryDomain, BrandAllocationDomain, PortfolioHoldingDomain } from '../domain/portfolio.domain'
import { logger } from '@/applications/shared/lib/logger'

export class GetPortfolioSummaryUsecase {
  private portfolioRepo = new PrismaPortfolioRepository()
  private priceRepo = new PrismaPriceRepository()

  async execute(userId: string = 'default-user-id'): Promise<PortfolioSummaryDomain> {
    logger.info('Computing portfolio summary', { userId })

    // 1. Fetch raw holdings
    const holdings = await this.portfolioRepo.findAllByUserId(userId)

    if (holdings.length === 0) {
      return this.emptyPortfolio()
    }

    // 2. Enrich with valuations
    const valuatedHoldings = await Promise.all(
      holdings.map(async (holding) => {
        const valuation = await this.getValuation(holding)
        return { holding, valuation }
      })
    )

    // 3. Calculate aggregates using decimal.js for precision
    let totalBuyValue = new Decimal(0)
    let totalCurrentValue = new Decimal(0)
    let totalWeightGram = new Decimal(0)
    let valuatedCount = 0

    const brandMap = new Map<string, BrandAllocationDomain>()

    for (const { holding, valuation } of valuatedHoldings) {
      const buyValue = new Decimal(holding.buyPrice)
        .times(holding.quantity)
        .times(holding.denominationGram)

      totalBuyValue = totalBuyValue.plus(buyValue)
      totalWeightGram = totalWeightGram.plus(
        new Decimal(holding.denominationGram).times(holding.quantity)
      )

      if (valuation.currentValue !== null) {
        totalCurrentValue = totalCurrentValue.plus(valuation.currentValue)
        valuatedCount++
      }

      // Aggregate by brand
      this.aggregateBrand(brandMap, holding, valuation, buyValue)
    }

    const totalPnL = totalCurrentValue.minus(totalBuyValue)
    const pnlPercentage = totalBuyValue.greaterThan(0)
      ? totalPnL.dividedBy(totalBuyValue).times(100)
      : new Decimal(0)

    const valuationCoverage = holdings.length > 0
      ? (valuatedCount / holdings.length) * 100
      : 0

    return {
      totalBuyValue: totalBuyValue.toNumber(),
      totalCurrentValue: totalCurrentValue.toNumber(),
      totalPnL: totalPnL.toNumber(),
      pnlPercentage: pnlPercentage.toNumber(),
      totalWeightGram: totalWeightGram.toNumber(),
      holdingCount: holdings.length,
      lastUpdated: new Date(),
      brandAllocation: Array.from(brandMap.values()),
      disclaimer: 'Valuations based on latest available market prices',
      excludedCount: holdings.length - valuatedCount,
      valuationCoverage
    }
  }

  /**
   * Get valuation for a holding using fallback logic:
   * BUYBACK → SPOT → NULL
   * 
   * This implements the spec requirement that valuation is NOT hardcoded to BUYBACK.
   */
  private async getValuation(holding: PortfolioHoldingDomain) {
    // Try BUYBACK first
    let priceResult = await this.priceRepo.getLatestBuybackPrice(
      holding.brandCode,
      holding.denominationGram
    )
    let source: 'BUYBACK' | 'SPOT' | 'NONE' = 'BUYBACK'

    // Fallback to SPOT
    if (!priceResult) {
      priceResult = await this.priceRepo.getLatestSpotPrice(
        holding.brandCode,
        holding.denominationGram
      )
      source = priceResult ? 'SPOT' : 'NONE'
    }

    if (!priceResult) {
      return {
        currentValue: null,
        valuationSource: 'NONE' as const,
        priceAsOf: null
      }
    }

    const currentValue = new Decimal(priceResult.price)
      .times(holding.quantity)
      .times(holding.denominationGram)
      .toNumber()

    return {
      currentValue,
      valuationSource: source,
      priceAsOf: priceResult.priceAt
    }
  }

  /**
   * Aggregate holdings by brand code.
   * Calculates brand-level totals and PnL.
   */
  private aggregateBrand(
    brandMap: Map<string, BrandAllocationDomain>,
    holding: PortfolioHoldingDomain,
    valuation: { currentValue: number | null, valuationSource: string },
    buyValue: Decimal
  ) {
    const existing = brandMap.get(holding.brandCode)
    const grams = new Decimal(holding.denominationGram).times(holding.quantity).toNumber()

    if (existing) {
      existing.totalGrams += grams
      if (valuation.currentValue !== null) {
        existing.currentValue += valuation.currentValue
      }
      existing.deltaValue += (valuation.currentValue || 0) - buyValue.toNumber()

      // Update valuation source to MIXED if sources differ
      if (existing.valuationSource !== valuation.valuationSource) {
        existing.valuationSource = 'MIXED'
      }
    } else {
      const currentValue = valuation.currentValue || 0
      const deltaValue = currentValue - buyValue.toNumber()
      const deltaPercentage = buyValue.greaterThan(0)
        ? new Decimal(deltaValue).dividedBy(buyValue).times(100).toNumber()
        : 0

      brandMap.set(holding.brandCode, {
        brandCode: holding.brandCode,
        brandName: holding.brandName,
        totalGrams: grams,
        currentValue,
        valuationSource: valuation.valuationSource as 'NONE' | 'BUYBACK' | 'SPOT' | 'MIXED',
        deltaValue,
        deltaPercentage
      })
    }
  }

  /**
   * Return empty portfolio when no holdings exist.
   */
  private emptyPortfolio(): PortfolioSummaryDomain {
    return {
      totalBuyValue: 0,
      totalCurrentValue: 0,
      totalPnL: 0,
      pnlPercentage: 0,
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
