'use client'

import * as React from "react"
import { Input } from "./input"
import { cn } from "@/frontend/utils/cn"

interface CurrencyInputProps extends Omit<React.ComponentProps<typeof Input>, 'onChange' | 'value'> {
  value: string
  onChange: (value: string) => void
}

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value, onChange, ...props }, ref) => {

    // Format raw numeric string to Indonesian thousand separator format (e.g. 1.000.000)
    const formatValue = (val: string) => {
      if (!val) return ""
      const num = val.replace(/\D/g, "")
      return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    }

    // Display value with dots
    const displayValue = formatValue(value)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Remove all non-digits to get raw value
      const rawValue = e.target.value.replace(/\D/g, "")
      onChange(rawValue)
    }

    return (
      <Input
        {...props}
        ref={ref}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        className={cn("tabular-nums", className)}
      />
    )
  }
)

CurrencyInput.displayName = "CurrencyInput"
