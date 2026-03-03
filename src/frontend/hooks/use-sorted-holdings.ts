import { useMemo } from 'react'
import { HoldingItem } from '@/shared/contracts/portfolio.contract'

export function useSortedHoldings(
    holdings: HoldingItem[],
    sortBy: 'date' | 'value',
    sortOrder: 'asc' | 'desc'
): HoldingItem[] {
    return useMemo(() => {
        return [...holdings].sort((a, b) => {
            let output = 0
            if (sortBy === 'date') {
                output = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            } else {
                output = (a.currentValue || 0) - (b.currentValue || 0)
            }
            return sortOrder === 'asc' ? output : -output
        })
    }, [holdings, sortBy, sortOrder])
}
