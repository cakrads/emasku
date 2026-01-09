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
          success: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
          error: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800',
          title: 'text-sm font-semibold',
          description: 'text-sm opacity-90',
        },
      }}
      icons={{
        success: <CircleCheckIcon className="size-4 text-green-600 dark:text-green-400" />,
        info: <InfoIcon className="size-4 text-blue-600 dark:text-blue-400" />,
        warning: <TriangleAlertIcon className="size-4 text-amber-600 dark:text-amber-400" />,
        error: <OctagonXIcon className="size-4 text-red-600 dark:text-red-400" />,
        loading: <Loader2Icon className="size-4 animate-spin text-gray-600 dark:text-gray-400" />,
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
