'use client'

import { Label } from '@/frontend/components/ui/label'
import { Input } from '@/frontend/components/ui/input'
import { Stack } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { DatePicker } from '@/frontend/components/ui/date-picker'
import { CurrencyInput } from '@/frontend/components/ui/currency-input'
import { useLanguage } from '@/frontend/hooks/use-language'
import { cn } from '@/frontend/utils/cn'

interface PurchaseFormProps {
  purchaseDate: Date | undefined
  purchasePrice: string
  quantity: string
  notes: string
  onChange: (updates: { purchaseDate?: Date; purchasePrice?: string; quantity?: string; notes?: string }) => void
}

export function PurchaseForm({ purchaseDate, purchasePrice, quantity, notes, onChange }: PurchaseFormProps) {
  const { t } = useLanguage()

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
            <Typography variant="caption" className="text-text-secondary">
              {t('addHolding.details.priceHelp')}
            </Typography>
          </Stack>

          {/* Purchase Date */}
          <Stack gap="sm">
            <Label className="uppercase text-text-secondary font-medium tracking-wider">
              {t('addHolding.details.purchaseDate')} <span className="text-red-500">*</span>
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
        </Stack>
      </Stack>
    </Stack>
  )
}
