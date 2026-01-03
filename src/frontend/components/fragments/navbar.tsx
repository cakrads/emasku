'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Coins, Wallet } from 'lucide-react'
import { cn } from '@/frontend/utils/cn'
import { ROUTES } from '@/frontend/config/routes'

export function Navbar() {
  const pathname = usePathname()

  const items = [
    { href: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { href: ROUTES.PRICES, label: 'Prices', icon: Coins },
    { href: ROUTES.HOLDINGS, label: 'Holdings', icon: Wallet },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 md:top-0 md:bottom-auto md:border-t-0 md:border-b">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-6 md:max-w-7xl md:justify-start md:gap-8">
        {items.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg p-2 transition-colors md:flex-row md:gap-2",
                isActive
                  ? "text-accent-gold font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-6 w-6 md:h-5 md:w-5" />
              <span className="text-[10px] md:text-sm">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
