/**
 * Brand Price Skeleton Section
 * 
 * Loading skeleton for brand price tables.
 * Matches the structure of the actual BrandPriceSection component.
 */

import { Skeleton } from '@/frontend/components/ui/skeleton'

export function BrandPriceSkeletonSection() {
  return (
    <div className="mb-8 last:mb-0">
      {/* Brand Header Skeleton */}
      <div className="bg-accent-gold/10 border border-accent-gold/20 px-6 py-3 rounded-t-lg">
        <Skeleton className="h-7 w-48 mx-auto" />
      </div>

      {/* Price Table Skeleton */}
      <div className="border border-border border-t-0 rounded-b-lg overflow-x-auto">
        <table className="w-full min-w-[350px]">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="px-6 py-3 text-left">
                <Skeleton className="h-4 w-16" />
              </th>
              <th className="px-6 py-3 text-right">
                <Skeleton className="h-4 w-20 ml-auto" />
              </th>
              <th className="px-6 py-3 text-right">
                <Skeleton className="h-4 w-24 ml-auto" />
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Skeleton rows for typical price entries */}
            {[1, 2, 3, 4, 5].map((index) => (
              <tr
                key={index}
                className="border-b border-border last:border-0"
              >
                <td className="px-6 py-3">
                  <Skeleton className="h-5 w-12" />
                </td>
                <td className="px-6 py-3 text-right">
                  <Skeleton className="h-5 w-28 ml-auto" />
                </td>
                <td className="px-6 py-3 text-right">
                  <Skeleton className="h-5 w-28 ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
