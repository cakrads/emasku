import { useState, useMemo, useCallback } from 'react'
import Decimal from 'decimal.js'
import { HoldingItemVM } from '@/frontend/view-model/portfolio.vm'
import { useQuery } from '@tanstack/react-query'
import { fetchBuybackPrices } from '@/frontend/services/prices/prices.api'

export interface SimulationSummary {
  selectedCount: number
  totalBuybackValue: number
  totalCostBasis: number
  totalPnL: number
  pnlPercentage: number
  remainingValue: number
}

export function useBuybackSimulation(availableItems: HoldingItemVM[] = []) {
  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [selectedItems, setSelectedItems] = useState<Map<string, HoldingItemVM>>(new Map())

  // Simulation overrides
  const [quantityOverrides, setQuantityOverrides] = useState<Record<string, number>>({})

  const toggleSelection = useCallback((item: HoldingItemVM) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(item.id)) {
        next.delete(item.id)
      } else {
        next.add(item.id)
      }
      return next
    })

    setSelectedItems(prev => {
      const next = new Map(prev)
      if (next.has(item.id)) {
        next.delete(item.id)
      } else {
        next.set(item.id, item) // Store item wrapper
      }
      return next
    })
  }, [])

  // Batch selection (e.g. select all on page)
  const selectItems = useCallback((items: HoldingItemVM[], select: boolean) => {
    if (select) {
      setSelectedIds(prev => {
        const next = new Set(prev)
        items.forEach(i => next.add(i.id))
        return next
      })
      setSelectedItems(prev => {
        const next = new Map(prev)
        items.forEach(i => next.set(i.id, i))
        return next
      })
    } else {
      setSelectedIds(prev => {
        const next = new Set(prev)
        items.forEach(i => next.delete(i.id))
        return next
      })
      setSelectedItems(prev => {
        const next = new Map(prev)
        items.forEach(i => next.delete(i.id))
        return next
      })
    }
  }, [])

  const resetSelection = useCallback(() => {
    setSelectedIds(new Set())
    setSelectedItems(new Map())
    setQuantityOverrides({})
  }, [])

  const updateQuantity = useCallback((id: string, qty: number) => {
    setQuantityOverrides(prev => ({
      ...prev,
      [id]: qty
    }))
  }, [])

  // Price Fetching
  const uniqueItems = useMemo(() => {
    const items: { brandCode: string; denominationGram: number }[] = []
    const seen = new Set<string>()

    // Helper to add unique items
    const addItem = (item: HoldingItemVM) => {
      const key = `${item.brand}:${item.rawWeight}`
      if (!seen.has(key)) {
        seen.add(key)
        items.push({
          brandCode: item.brand,
          denominationGram: item.rawWeight
        })
      }
    }

    // Include selected items (for summary)
    selectedItems.forEach(addItem)

    // Include available items (for table display)
    availableItems.forEach(addItem)

    return items
  }, [selectedItems, availableItems])

  const { data: pricesData, isLoading: isLoadingPrices } = useQuery({
    queryKey: ['buyback-prices', uniqueItems], // uniqueItems is distinct array dep
    queryFn: () => fetchBuybackPrices(uniqueItems),
    enabled: uniqueItems.length > 0,
    staleTime: 60 * 1000, // Cache 1 min
    placeholderData: (previousData) => previousData,
  })

  // Create lookup map for prices
  const priceMap = useMemo(() => {
    const map = new Map<string, number>()
    if (pricesData?.prices) {
      pricesData.prices.forEach(p => {
        map.set(`${p.brandCode}:${p.denominationGram}`, p.price)
      })
    }
    return map
  }, [pricesData])

  // Computed Summary
  const summary = useMemo<SimulationSummary>(() => {
    let totalBuybackValue = new Decimal(0)
    let totalCostBasis = new Decimal(0)
    let remainingValue = new Decimal(0)

    selectedItems.forEach(item => {
      const qtyToSell = quantityOverrides[item.id] ?? item.quantity
      if (qtyToSell <= 0) return

      totalCostBasis = totalCostBasis.plus(new Decimal(item.rawAvgBuyPrice).mul(qtyToSell))

      const price = priceMap.get(`${item.brand}:${item.rawWeight}`)
      if (price) totalBuybackValue = totalBuybackValue.plus(new Decimal(price).mul(qtyToSell))
    })

    availableItems.forEach(item => {
      let remainingQty = item.quantity
      if (selectedItems.has(item.id)) {
        const qtyToSell = quantityOverrides[item.id] ?? item.quantity
        remainingQty = Math.max(0, item.quantity - qtyToSell)
      }
      const price = priceMap.get(`${item.brand}:${item.rawWeight}`)
      if (price && remainingQty > 0) {
        remainingValue = remainingValue.plus(new Decimal(price).mul(remainingQty))
      }
    })

    const totalPnL = totalBuybackValue.minus(totalCostBasis)
    const pnlPercentage = totalCostBasis.gt(0) ? totalPnL.div(totalCostBasis).mul(100).toNumber() : 0

    return {
      selectedCount: selectedIds.size,
      totalBuybackValue: totalBuybackValue.toNumber(),
      totalCostBasis: totalCostBasis.toNumber(),
      totalPnL: totalPnL.toNumber(),
      pnlPercentage,
      remainingValue: remainingValue.toNumber()
    }
  }, [selectedItems, selectedIds, availableItems, quantityOverrides, priceMap])

  return {
    selectedIds,
    selectedItems,
    quantityOverrides,
    toggleSelection,
    selectItems,
    resetSelection,
    updateQuantity,
    summary,
    priceMap, // Exposed for table rows
    isLoadingPrices
  }
}
