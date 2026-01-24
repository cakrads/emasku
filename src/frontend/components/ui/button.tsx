import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/frontend/utils/cn"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer active:scale-[0.98]",
  {
    variants: {
      variant: {
        solid: "shadow-sm hover:shadow-md",
        outline: "border bg-transparent shadow-sm",
        ghost: "bg-transparent hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline p-0! h-auto!",
        cta: "font-bold shadow-gold hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] border border-white/10",
        glass: "glass hover:bg-card/80 transition-all text-foreground",
      },
      color: {
        default: "",
        primary: "",
        destructive: "",
        warning: "",
        success: "",
        subtle: "",
        ghost: "", // For neutral ghosts
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-8 text-base",
        icon: "h-11 w-11",
        xl: "h-16 px-10 text-lg",
      },
      rounded: {
        default: "rounded-md",
        xl: "rounded-xl",
        full: "rounded-full",
        none: "rounded-none",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    compoundVariants: [
      // === SOLID VARIANTS ===
      {
        variant: "solid",
        color: "default",
        className: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md",
      },
      {
        variant: "solid",
        color: "primary", // Gold
        className: "dark:bg-gradient-to-r dark:from-gold dark:to-gold-deep bg-accent-gold text-primary-foreground hover:brightness-110 border-0 shadow-gold hover:shadow-glow",
      },
      {
        variant: "solid",
        color: "destructive",
        className: "bg-destructive text-white hover:bg-destructive/90",
      },
      {
        variant: "solid",
        color: "warning",
        className: "bg-amber-500 text-white hover:bg-amber-600",
      },
      {
        variant: "solid",
        color: "success",
        className: "bg-emerald-600 text-white hover:bg-emerald-700",
      },
      {
        variant: "solid",
        color: "subtle",
        className: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      },

      // === OUTLINE VARIANTS ===
      {
        variant: "outline",
        color: "default",
        className: "border-border text-foreground hover:bg-secondary hover:text-secondary-foreground",
      },
      {
        variant: "outline",
        color: "primary",
        className: "border-gold/50 text-gold hover:bg-gold/10 hover:border-gold",
      },
      {
        variant: "outline",
        color: "destructive",
        className: "border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive",
      },
      {
        variant: "outline",
        color: "warning",
        className: "border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10",
      },
      {
        variant: "outline",
        color: "subtle",
        className: "border-border/50 text-muted-foreground hover:text-foreground hover:border-border",
      },

      // === GHOST VARIANTS ===
      {
        variant: "ghost",
        color: "default",
        className: "hover:bg-accent hover:text-accent-foreground",
      },
      {
        variant: "ghost",
        color: "primary",
        className: "text-gold hover:bg-gold/10",
      },
      {
        variant: "ghost",
        color: "destructive",
        className: "text-destructive hover:bg-destructive/10",
      },
      {
        variant: "ghost",
        color: "subtle",
        className: "text-muted-foreground hover:text-foreground",
      },

      // === CTA VARIANTS (Gradient/Special) ===
      {
        variant: "cta",
        color: "primary",
        className: "bg-gradient-to-r from-gold via-yellow-400 to-gold-deep text-white",
      },
      {
        variant: "cta",
        color: "default",
        className: "bg-gradient-to-r from-zinc-800 to-zinc-950 text-white dark:from-zinc-100 dark:to-zinc-300 dark:text-zinc-950",
      },
    ],
    defaultVariants: {
      variant: "solid",
      color: "default",
      size: "default",
      rounded: "default",
    },
  }
)

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color">,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, color, size, rounded, fullWidth, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, color, size, rounded, fullWidth, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
