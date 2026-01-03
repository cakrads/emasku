'use client'
import Link from 'next/link'
import { Stack } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { TrendingUp } from 'lucide-react'
import { cn } from '@/frontend/utils/cn'
import { ROUTES } from '@/frontend/config/routes'

interface BrandCardProps {
  brandCode: string
  brandName: string
  totalGrams: number
  currentValue: number
  deltaValue: number
  deltaPercentage: number
  valuationSource: 'OFFICIAL' | 'SPOT' | 'USER' | 'UNVALUED'
}

export default function BrandCard({
  brandCode,
  brandName,
  totalGrams,
  currentValue,
  deltaValue,
  deltaPercentage,
  valuationSource,
}: BrandCardProps) {
  const isPositive = deltaValue >= 0

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatWeight = (grams: number) => `${(grams || 0).toFixed(2)}g`

  return (
    <Link
      href={ROUTES.BRAND_DETAIL(brandCode)}
      className="block outline-none group"
    >
      <Stack
        gap="md"
        className="shrink-0 w-[280px] bg-[var(--surface-elevated)] border border-[var(--border)] rounded-xl p-4 shadow-[var(--shadow-sm)] transition-all group-hover:shadow-[var(--shadow-md)] group-hover:border-[var(--foreground)] cursor-pointer"
      >
        <Stack gap="none">
          <Typography as="h3" variant="h3">{brandName}</Typography>
          <Typography variant="body-sm" className="mt-0.5">{formatWeight(totalGrams)}</Typography>
        </Stack>

        <Stack direction="horizontal" className="items-center flex-wrap" gap="none">
          <Typography variant="h2" className="financial-value">
            {formatCurrency(currentValue)}
          </Typography>
        </Stack>

        <Stack
          direction="horizontal"
          gap="sm"
          className={cn(
            "items-center w-fit px-2 py-1 rounded-md",
            isPositive ? "bg-[var(--positive-bg)]" : "bg-[var(--negative-bg)]"
          )}
        >
          <TrendingUp className={cn("w-3 h-3", !isPositive && "rotate-180 text-[var(--negative)]", isPositive && "text-[var(--positive)]")} />
          <Stack direction="horizontal" gap="xs">
            <Typography
              variant="caption"
              className={cn("font-semibold", isPositive ? "text-[var(--positive)]" : "text-[var(--negative)]")}
            >
              {formatCurrency(Math.abs(deltaValue))}
            </Typography>
            <Typography
              variant="caption"
              className={cn("font-medium", isPositive ? "text-[var(--positive)]" : "text-[var(--negative)]")}
            >
              ({deltaPercentage >= 0 ? '+' : ''}{deltaPercentage.toFixed(2)}%)
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Link>
  )
}
