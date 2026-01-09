'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Coins, Wallet } from 'lucide-react'
import { cn } from '@/frontend/utils/cn'
import { ROUTES } from '@/frontend/config/routes'
import { ThemeToggle } from '@/frontend/components/ui/theme-toggle'

export function Navbar() {
  const pathname = usePathname()

  const items = [
    { href: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { href: ROUTES.PRICES, label: 'Prices', icon: Coins },
    { href: ROUTES.HOLDINGS_LIST, label: 'Holdings', icon: Wallet },
  ]

  const isActionPage = pathname === ROUTES.ADD_HOLDING || (pathname.startsWith('/holdings/') && pathname.endsWith('/edit'))

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 md:top-0 md:bottom-auto md:border-t-0 md:border-b",
      isActionPage && "hidden md:block"
    )}>
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-6 md:max-w-7xl md:justify-between md:gap-8">
        <div className="flex w-full justify-around md:justify-start md:gap-8">
          {items.map((item) => {
            const isActive =
              item.href === ROUTES.DASHBOARD
                ? pathname === ROUTES.DASHBOARD
                : (pathname === item.href || pathname.startsWith(`${item.href}/`)) ||
                (item.label === 'Holdings' && pathname === ROUTES.ADD_HOLDING)

            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-lg p-2 transition-colors md:flex-row md:gap-2",
                  isActive
                    ? "text-accent-gold font-medium bg-accent-gold/10 md:bg-transparent"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("h-6 w-6 md:h-5 md:w-5", isActive && "fill-current md:fill-none")} />
                <span className="text-[10px] md:text-sm">{item.label}</span>
              </Link>
            )
          })}
        </div>

        <div className="hidden md:block">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
