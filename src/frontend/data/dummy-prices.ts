/**
 * Dummy Price Data
 * 
 * This file contains hardcoded price data for MVP testing.
 * Matches the API contract structure from .docs/api-contract.md
 */

/**
 * Today Prices Data
 * Matches GET /api/v1/price/today response structure
 */
export const DUMMY_TODAY_PRICES = {
  date: '2026-01-02',
  currency: 'IDR',
  brands: [
    {
      brand: 'ANTAM',
      prices: [
        { denominationGram: 0.5, sellPrice: 1432000, buybackPrice: 0 },
        { denominationGram: 1, sellPrice: 1270000, buybackPrice: 1180000 },
        { denominationGram: 2, sellPrice: 2520000, buybackPrice: 2340000 },
        { denominationGram: 5, sellPrice: 6280000, buybackPrice: 5830000 },
        { denominationGram: 10, sellPrice: 12540000, buybackPrice: 11640000 },
        { denominationGram: 25, sellPrice: 31300000, buybackPrice: 29050000 },
        { denominationGram: 50, sellPrice: 62550000, buybackPrice: 58050000 },
        { denominationGram: 100, sellPrice: 125050000, buybackPrice: 116050000 },
      ],
    },
    {
      brand: 'UBS',
      prices: [
        { denominationGram: 0.5, sellPrice: 1399000, buybackPrice: 1188000 },
        { denominationGram: 1, sellPrice: 1276000, buybackPrice: 1185000 },
        { denominationGram: 2, sellPrice: 2531000, buybackPrice: 2349000 },
        { denominationGram: 5, sellPrice: 6295000, buybackPrice: 5845000 },
        { denominationGram: 10, sellPrice: 12565000, buybackPrice: 11665000 },
      ],
    },
    {
      brand: 'GALERI24',
      prices: [
        { denominationGram: 0.5, sellPrice: 1331000, buybackPrice: 1189000 },
        { denominationGram: 1, sellPrice: 1268000, buybackPrice: 1177000 },
        { denominationGram: 2, sellPrice: 2513000, buybackPrice: 2331000 },
        { denominationGram: 5, sellPrice: 6265000, buybackPrice: 5815000 },
        { denominationGram: 10, sellPrice: 12505000, buybackPrice: 11605000 },
      ],
    },
  ],
}

/**
 * Historical Price Data for ANTAM SPOT 1g
 * Used for the Price History chart
 */
export const DUMMY_HISTORICAL_PRICES = [
  { timestamp: '2025-10-01', price: 1050000 },
  { timestamp: '2025-10-15', price: 1065000 },
  { timestamp: '2025-11-01', price: 1080000 },
  { timestamp: '2025-11-15', price: 1095000 },
  { timestamp: '2025-12-01', price: 1120000 },
  { timestamp: '2025-12-15', price: 1135000 },
  { timestamp: '2026-01-01', price: 1100000 },
  { timestamp: '2026-01-02', price: 1270000 },
]
