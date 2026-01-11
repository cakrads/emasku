'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { LayoutDashboard, Coins, Wallet, LogOut, User, Sun, Moon, Plus } from 'lucide-react'
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

  // Nav items configuration
  const allItems = [
    { href: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard, requiresAuth: true },
    { href: ROUTES.PRICES, label: 'Prices', icon: Coins, requiresAuth: false },
    // Special 'Add' button for mobile - handled in render logic
    { href: ROUTES.ADD_HOLDING, label: 'Add', icon: Plus, requiresAuth: true, isAddButton: true, mobileOnly: true },
    { href: ROUTES.HOLDINGS_LIST, label: 'Holdings', icon: Wallet, requiresAuth: true },
    { href: ROUTES.PROFILE, label: 'Profile', icon: User, mobileOnly: true, requiresAuth: true },
  ]

  // Filter items based on auth state
  // For the Add button, we only show it if authenticated
  const items = allItems.filter(item => {
    if (item.requiresAuth && !isAuthenticated) return false
    return true
  })

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
        "fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border z-50 md:top-0 md:bottom-auto md:border-t-0 md:border-b",
        isActionPage && "hidden md:block" // Hide on mobile action pages, show on desktop
      )}>
        <div className="mx-auto flex h-16 md:h-16 max-w-lg items-center px-4 md:max-w-7xl md:justify-between md:gap-8 md:px-6">

          {/* Desktop: Standard Flex Layout */}
          <div className="hidden md:flex md:w-full md:justify-start md:gap-8">
            {items.map((item) => {
              // Skip mobile-only items on desktop (Profile, Add Button)
              if (item.mobileOnly) return null

              const isActive =
                item.href === ROUTES.DASHBOARD
                  ? pathname === ROUTES.DASHBOARD
                  : (pathname === item.href || pathname.startsWith(`${item.href}/`))

              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-row items-center gap-2 rounded-lg p-2 transition-colors",
                    isActive
                      ? "text-accent-gold font-medium bg-transparent"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className={cn("h-5 w-5", isActive && "fill-current md:fill-none")} />
                  <span className="text-sm">{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Mobile: Grid Layout (5 columns for perfect centering) */}
          <div className="w-full grid grid-cols-5 items-end pb-2 md:hidden">
            {items.map((item) => {
              // Handle special Add button (Mobile Center)
              if (item.isAddButton) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex flex-col items-center justify-end relative h-full group"
                  >
                    <div className="absolute -top-6 bg-accent-gold rounded-full p-4 shadow-lg border-[6px] border-background flex items-center justify-center transition-transform active:scale-95 group-hover:-translate-y-1">
                      <Plus className="h-6 w-6 text-white" strokeWidth={3} />
                    </div>
                    {/* Spacer text to keep grid height but remains hidden/empty or label */}
                    <span className="text-[10px] opacity-0">Add</span>
                  </Link>
                )
              }

              const isActive =
                item.href === ROUTES.DASHBOARD
                  ? pathname === ROUTES.DASHBOARD
                  : (pathname === item.href || pathname.startsWith(`${item.href}/`))

              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-1 transition-colors",
                    isActive
                      ? "text-accent-gold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className={cn("h-6 w-6", isActive && "fill-current")} strokeWidth={isActive ? 2.5 : 2} />
                  <span className={cn("text-[10px] font-medium", isActive ? "opacity-100" : "opacity-70")}>
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </div>

          <div className="hidden md:flex md:items-center md:gap-4">
            {/* Desktop: Login button for guests */}
            {!isAuthenticated && !isLoading && (
              <Button asChild color="primary" size="sm">
                <Link href={ROUTES.LOGIN}>Login</Link>
              </Button>
            )}

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
                    <Link href={ROUTES.PROFILE} className="cursor-pointer w-full flex items-center">
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
