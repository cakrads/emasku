'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { LayoutDashboard, Coins, Wallet, LogOut, User, Sun, Moon } from 'lucide-react'
import { cn } from '@/frontend/utils/cn'
import { ROUTES } from '@/frontend/config/routes'
import { useTheme } from "next-themes"
import { Button } from '@/frontend/components/ui/button'
import { useAuth } from '@/frontend/hooks/use-auth'
import { Switch } from "@/frontend/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/frontend/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/frontend/components/ui/avatar"
import { LogoutDialog } from '@/frontend/components/fragments/logout-dialog'

export function Navbar() {
  const pathname = usePathname()
  const { isAuthenticated, isGuest, user, logout, isLoading } = useAuth()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  // Effectively avoid hydration mismatch by waiting for mount
  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true)
  }, [])

  const items = [
    { href: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { href: ROUTES.PRICES, label: 'Prices', icon: Coins },
    { href: ROUTES.HOLDINGS_LIST, label: 'Holdings', icon: Wallet },
    // Profile item for Mobile only
    { href: '/profile', label: 'Profile', icon: User, mobileOnly: true },
  ]

  const isActionPage = pathname === ROUTES.ADD_HOLDING || (pathname.startsWith('/holdings/') && pathname.endsWith('/edit'))
  const isLoginPage = pathname === ROUTES.LOGIN

  const handleLogout = async () => {
    await logout()
    setShowLogoutDialog(false)
  }

  // Don't show navbar on login page
  if (isLoginPage) {
    return null
  }

  return (
    <>
      <nav className={cn(
        "fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 md:top-0 md:bottom-auto md:border-t-0 md:border-b",
        isActionPage && "hidden md:block" // Hide on mobile action pages, show on desktop
      )}>
        <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-6 md:max-w-7xl md:justify-between md:gap-8">

          {/* Mobile: Distributed Space Around. Desktop: Left aligned with gap */}
          <div className="flex w-full justify-around md:justify-start md:gap-8">
            {items.map((item) => {
              // Skip mobile-only items on desktop
              if (item.mobileOnly) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-lg p-2 transition-colors md:hidden",
                      pathname === item.href
                        ? "text-accent-gold font-medium bg-accent-gold/10"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <item.icon className={cn("h-6 w-6", pathname === item.href && "fill-current")} />
                    <span className="text-[10px]">{item.label}</span>
                  </Link>
                )
              }

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

          <div className="hidden md:flex md:items-center md:gap-4">
            {/* Desktop User Dropdown */}
            {isAuthenticated && !isLoading && (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-accent hover:text-accent-foreground">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatarUrl || ''} />
                      <AvatarFallback className="bg-accent-gold/20 text-accent-gold">
                        {isGuest ? 'G' : user?.displayName?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium max-w-[120px] truncate">
                      {isGuest ? 'Guest' : user?.displayName || 'User'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer w-full flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center text-sm">
                        {theme === 'dark' ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
                        Dark Mode
                      </div>
                      {mounted && (
                        <Switch
                          checked={theme === 'dark'}
                          onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                        />
                      )}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                    onClick={() => setShowLogoutDialog(true)}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </nav>

      <LogoutDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onConfirm={handleLogout}
      />
    </>
  )
}
