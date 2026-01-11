import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/frontend/utils/cn"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      color: {
        default: "",
        primary: "",
        warning: "",
        error: "",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        xl: "h-14 px-8 text-base font-semibold",
        icon: "h-9 w-9",
      },
      fullWidth: {
        true: "w-full",
      },
      rounded: {
        default: "rounded-md",
        xl: "rounded-xl",
        full: "rounded-full",
      }
    },
    compoundVariants: [
      // Primary Color
      {
        variant: "default",
        color: "primary",
        className: "bg-accent-gold text-white hover:bg-accent-gold/90 shadow-md hover:shadow-lg",
      },
      {
        variant: "outline",
        color: "primary",
        className: "border-accent-gold text-accent-gold hover:bg-accent-gold/10",
      },
      // Warning Color (for "Mark as Sold" etc)
      {
        variant: "default",
        color: "warning",
        className: "bg-amber-500 text-white hover:bg-amber-600 shadow-sm",
      },
      {
        variant: "outline",
        color: "warning",
        className: "border-orange-200 bg-orange-50 text-orange-400 hover:bg-orange-100 hover:border-orange-300 hover:text-orange-600 dark:bg-orange-950/20 dark:border-orange-800 dark:hover:bg-orange-900/40 dark:text-orange-400",
      },
      // Error Color
      {
        variant: "default",
        color: "error",
        className: "bg-destructive text-white hover:bg-destructive/90 shadow-sm",
      },
      {
        variant: "outline",
        color: "error",
        className: "border-destructive/30 text-destructive hover:bg-destructive/10",
      }
    ],
    defaultVariants: {
      variant: "default",
      color: "default",
      size: "default",
      rounded: "default",
    },
  }
)

// Omit color from button attributes to avoid conflict with our color prop
export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color">,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, color, size, fullWidth, rounded, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, color, size, fullWidth, rounded, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
