import { DUMMY_HOLDINGS, Holding } from '@/frontend/data/dummy-holdings'

const STORAGE_KEY = 'emasku-holdings'

export const holdingsRepository = {
  getAll: (): Holding[] => {
    if (typeof window === 'undefined') return DUMMY_HOLDINGS

    try {
      const local = localStorage.getItem(STORAGE_KEY)
      const localItems: any[] = local ? JSON.parse(local) : []

      const parsedLocal: Holding[] = localItems
        .map((h: any) => {
          // Basic compatibility for items saved with mismatched structure
          // If missing ID, ignore or generate?
          if (!h.id) return null

          // Ensure Date object
          const dateVal = h.buyDate || h.purchaseDate
          const buyDate = dateVal ? new Date(dateVal) : new Date()

          return {
            ...h,
            buyDate,
            // Ensure numbers
            weight: Number(h.weight || h.totalGrams || 0),
            buyPrice: Number(h.buyPrice || 0),
            currentPrice: Number(h.currentPrice || 0)
          } as Holding
        })
        .filter((h): h is Holding => h !== null)

      // Map for merging. ID is key.
      const map = new Map<string, Holding>()
      DUMMY_HOLDINGS.forEach(h => map.set(h.id, h))
      parsedLocal.forEach(h => map.set(h.id, h)) // Overwrite matching IDs

      return Array.from(map.values())
    } catch (e) {
      console.error('Failed to load holdings', e)
      return DUMMY_HOLDINGS
    }
  },

  getById: (id: string): Holding | undefined => {
    return holdingsRepository.getAll().find(h => h.id === id)
  },

  save: (holding: Holding) => {
    try {
      const local = localStorage.getItem(STORAGE_KEY)
      const localItems: any[] = local ? JSON.parse(local) : []

      const idx = localItems.findIndex((h: any) => h.id === holding.id)
      if (idx >= 0) {
        localItems[idx] = holding
      } else {
        localItems.push(holding)
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(localItems))
    } catch (e) {
      console.error('Failed to save', e)
    }
  },

  delete: (id: string) => {
    try {
      const local = localStorage.getItem(STORAGE_KEY)
      if (!local) return

      let localItems: any[] = JSON.parse(local)
      localItems = localItems.filter((h: any) => h.id !== id)

      localStorage.setItem(STORAGE_KEY, JSON.stringify(localItems))
    } catch (e) {
      console.error('Failed to delete', e)
    }
  }
}
