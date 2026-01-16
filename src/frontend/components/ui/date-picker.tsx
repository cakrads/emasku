"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/frontend/utils/cn"
import { Button } from "@/frontend/components/ui/button"
import { Calendar } from "@/frontend/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/frontend/components/ui/popover"

import { id, enUS } from "date-fns/locale"
import { useLanguage } from "@/frontend/hooks/use-language"

interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: (date: Date) => boolean
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
  disabled,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const { language, t } = useLanguage()
  const locale = language === 'id' ? id : enUS
  const displayPlaceholder = placeholder || t('common.pickDate')

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "flex w-full shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm p-4 rounded-xl bg-(--surface-elevated) border-border text-foreground text-lg font-semibold h-14 justify-start text-left",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
          {value ? format(value, "PPP", { locale }) : <span>{displayPlaceholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-50" align="start">
        <Calendar
          mode="single"
          selected={value}
          defaultMonth={value}
          onSelect={(date) => {
            onChange?.(date)
            setOpen(false)
          }}
          disabled={disabled}
          initialFocus
          captionLayout="dropdown"
          fromYear={2000}
          toYear={new Date().getFullYear()}
          locale={locale}
        />
      </PopoverContent>
    </Popover>

  )
}
