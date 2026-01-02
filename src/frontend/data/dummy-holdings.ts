/**
 * Centralized dummy data for holdings
 * This ensures consistency across all features
 */

export interface Holding {
  id: string
  brandCode: string
  brandName: string
  buyDate: Date
  weight: number // in grams
  buyPrice: number // price per gram in IDR
  currentPrice: number // current price per gram in IDR
  notes?: string
}

export const DUMMY_HOLDINGS: Holding[] = [
  // ANTAM Holdings
  {
    id: 'h1',
    brandCode: 'ANTAM',
    brandName: 'ANTAM',
    buyDate: new Date('2024-01-15'),
    weight: 10.0,
    buyPrice: 1264300,
    currentPrice: 1270000,
    notes: 'First purchase - 10g bar',
  },
  {
    id: 'h2',
    brandCode: 'ANTAM',
    brandName: 'ANTAM',
    buyDate: new Date('2024-02-20'),
    weight: 25.0,
    buyPrice: 1260000,
    currentPrice: 1270000,
    notes: '25g bar',
  },
  {
    id: 'h3',
    brandCode: 'ANTAM',
    brandName: 'ANTAM',
    buyDate: new Date('2024-03-05'),
    weight: 15.0,
    buyPrice: 1262000,
    currentPrice: 1270000,
  },

  // Galeri24 Holdings
  {
    id: 'h4',
    brandCode: 'GALERI24',
    brandName: 'Galeri24',
    buyDate: new Date('2024-03-10'),
    weight: 15.0,
    buyPrice: 1262000,
    currentPrice: 1268000,
    notes: '15g bar',
  },
  {
    id: 'h5',
    brandCode: 'GALERI24',
    brandName: 'Galeri24',
    buyDate: new Date('2024-04-01'),
    weight: 20.0,
    buyPrice: 1263000,
    currentPrice: 1268000,
  },

  // UBS Holdings
  {
    id: 'h6',
    brandCode: 'UBS',
    brandName: 'UBS',
    buyDate: new Date('2024-05-15'),
    weight: 10.0,
    buyPrice: 1278000,
    currentPrice: 1276000,
    notes: 'UBS 10g bar',
  },
  {
    id: 'h7',
    brandCode: 'UBS',
    brandName: 'UBS',
    buyDate: new Date('2024-06-01'),
    weight: 5.0,
    buyPrice: 1280000,
    currentPrice: 1276000,
  },

  // Lotus Archi Holdings
  {
    id: 'h8',
    brandCode: 'LOTUS_ARCHI',
    brandName: 'Lotus Archi',
    buyDate: new Date('2024-07-10'),
    weight: 1.0,
    buyPrice: 1000000,
    currentPrice: 1000000,
    notes: 'User-estimated value',
  },

  // Unknown Brand (Unvalued)
  {
    id: 'h9',
    brandCode: 'UNKNOWN',
    brandName: 'Unknown Brand',
    buyDate: new Date('2024-08-01'),
    weight: 5.0,
    buyPrice: 0,
    currentPrice: 0,
    notes: 'No current price available',
  },
]
