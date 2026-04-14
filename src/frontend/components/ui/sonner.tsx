"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      richColors
      toastOptions={{
        classNames: {
          toast: 'sm:max-w-md',
          success: 'bg-positive/5 border-positive/20',
          error: 'bg-negative/5 border-negative/20',
          title: 'text-sm font-semibold',
          description: 'text-sm opacity-90',
        },
      }}
      icons={{
        success: <CircleCheckIcon className="size-4 text-positive" />,
        info: <InfoIcon className="size-4 text-primary" />,
        warning: <TriangleAlertIcon className="size-4 text-accent-gold" />,
        error: <OctagonXIcon className="size-4 text-negative" />,
        loading: <Loader2Icon className="size-4 animate-spin text-muted-foreground" />,
      }}
      style={
        {
          "--normal-bg": "hsl(var(--background))",
          "--normal-text": "hsl(var(--foreground))",
          "--normal-border": "hsl(var(--border))",
          "--success-bg": "hsl(142 76% 96%)",
          "--success-text": "hsl(142 71% 25%)",
          "--success-border": "hsl(142 76% 85%)",
          "--error-bg": "hsl(0 86% 97%)",
          "--error-text": "hsl(0 74% 42%)",
          "--error-border": "hsl(0 86% 90%)",
          "--border-radius": "0.75rem",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
