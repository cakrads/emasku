'use client'

import { Label } from '@/frontend/components/ui/label'
import { Input } from '@/frontend/components/ui/input'
import { Stack } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { DatePicker } from '@/frontend/components/ui/date-picker'
import { CurrencyInput } from '@/frontend/components/ui/currency-input'
import { useLanguage } from '@/frontend/hooks/use-language'
import { cn } from '@/frontend/utils/cn'

import { fetchTodayPrices } from '@/frontend/services/prices/prices.api'
import { transformTodayPrices } from '@/frontend/view-model/prices.vm'
import { Brand } from './brand-selector'
import { GoalSelector } from './goal-selector'

interface PurchaseFormProps {
  brand: Brand | null
  weight: string
  pricesData?: any
  purchaseDate: Date | undefined
  purchasePrice: string
  quantity: string
  notes: string
  goalId?: string | null
  onChange: (updates: { purchaseDate?: Date; purchasePrice?: string; quantity?: string; notes?: string; goalId?: string | null }) => void
}

export function PurchaseForm({ brand, weight, pricesData, purchaseDate, purchasePrice, quantity, notes, goalId, onChange }: PurchaseFormProps) {
  const { t, language } = useLanguage()

  const viewModel = pricesData ? transformTodayPrices(pricesData, language === 'id' ? 'id-ID' : 'en-US') : null
  const brandPrices = viewModel?.brands.find(b => b.brandName.toUpperCase() === brand?.name.toUpperCase())
  const weightNum = parseFloat(weight || '0')
  const specificPrice = brandPrices?.prices.find(p => p.denominationGram === weightNum)
  const currentSellPrice = specificPrice?.sellPrice || 0

  const formatCurrency = (val: number) => new Intl.NumberFormat(language === 'id' ? 'id-ID' : 'en-US', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val)

  return (
    <Stack gap="lg" className="animate-in fade-in slide-in-from-right-4 duration-300">
      <Stack gap="xs">
        <Typography as="h2" variant="h1">{t('addHolding.details.title')}</Typography>
        <Typography variant="body-sm">{t('addHolding.details.subtitle')}</Typography>
      </Stack>

      <Stack gap="xl">
        <Stack gap="lg">
          {/* Purchase Price per Gram */}
          <Stack gap="sm">
            <Label className="uppercase text-text-secondary font-medium tracking-wider">
              {t('addHolding.details.purchasePrice')} <span className="text-red-500">*</span>
            </Label>
            <CurrencyInput
              autoFocus
              value={purchasePrice}
              onChange={(val) => onChange({ purchasePrice: val })}
              className="p-4 rounded-xl bg-surface-elevated border-border text-foreground text-lg font-semibold h-14"
              placeholder="e.g. 1.300.000"
            />
            <div className="flex justify-between items-center">
              <Typography variant="caption" className="text-text-secondary">
                {t('addHolding.details.priceHelp')}
              </Typography>
              {currentSellPrice > 0 && (
                <button
                  type="button"
                  onClick={() => onChange({ purchasePrice: currentSellPrice.toString() })}
                  className="text-[10px] font-medium text-accent-gold hover:underline uppercase tracking-tight"
                >
                  {t('common.useToday')}: {formatCurrency(currentSellPrice)}
                </button>
              )}
            </div>
          </Stack>

          {/* Purchase Date */}
          <Stack gap="sm">
            <Label className="uppercase text-text-secondary font-medium tracking-wider">
              {t('addHolding.details.purchaseDate')} <span className="text-xs normal-case font-normal">(Optional)</span>
            </Label>
            <DatePicker
              value={purchaseDate}
              onChange={(date) => onChange({ purchaseDate: date })}
              disabled={(date) => date > new Date()}
            />
          </Stack>

          {/* Notes */}
          <Stack gap="sm">
            <Label className="uppercase text-text-secondary font-medium tracking-wider">
              {t('addHolding.details.notes')} <span className="text-xs normal-case font-normal">(Optional)</span>
            </Label>
            <Input
              value={notes}
              onChange={(e) => onChange({ notes: e.target.value })}
              className="p-4 rounded-xl bg-surface-elevated border-border text-foreground text-lg font-semibold h-14"
              placeholder={t('addHolding.details.notesPlaceholder')}
            />
          </Stack>

          {/* Goal Selector */}
          <GoalSelector
            selectedGoalId={goalId || null}
            onSelect={(id) => onChange({ goalId: id })}
          />
        </Stack>
      </Stack>
    </Stack>
  )
}
