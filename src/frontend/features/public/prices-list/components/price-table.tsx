/**
 * PriceTable Component
 * 
 * Displays a table of gold prices by brand and denomination.
 * Mobile-responsive design with clear column headers.
 */

import { Typography } from '@/frontend/components/ui/typography'

export interface PriceRow {
  brand: string
  denominationGram: number
  priceType: 'SELL' | 'BUYBACK' | 'SPOT'
  price: number
}

export interface PriceTableProps {
  rows: PriceRow[]
}

/**
 * Format IDR currency
 */
function formatIDR(value: number): string {
  if (value === 0) return '-'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Format weight display
 */
function formatWeight(grams: number): string {
  return `${grams} gr`
}

export function PriceTable({ rows }: PriceTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left">
              <Typography variant="body-sm" className="font-medium text-muted-foreground">
                Brand
              </Typography>
            </th>
            <th className="px-4 py-3 text-left">
              <Typography variant="body-sm" className="font-medium text-muted-foreground">
                Weight
              </Typography>
            </th>
            <th className="px-4 py-3 text-left">
              <Typography variant="body-sm" className="font-medium text-muted-foreground">
                Type
              </Typography>
            </th>
            <th className="px-4 py-3 text-right">
              <Typography variant="body-sm" className="font-medium text-muted-foreground">
                Price
              </Typography>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={`${row.brand}-${row.denominationGram}-${row.priceType}-${index}`}
              className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
            >
              <td className="px-4 py-3">
                <Typography variant="body">{row.brand}</Typography>
              </td>
              <td className="px-4 py-3">
                <Typography variant="body">{formatWeight(row.denominationGram)}</Typography>
              </td>
              <td className="px-4 py-3">
                <Typography variant="body-sm" className="text-muted-foreground">
                  {row.priceType}
                </Typography>
              </td>
              <td className="px-4 py-3 text-right">
                <Typography variant="body" className="font-medium">
                  {formatIDR(row.price)}
                </Typography>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
