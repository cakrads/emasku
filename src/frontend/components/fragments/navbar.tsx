'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { LayoutDashboard, Coins, Wallet, LogOut, User, Sun, Moon, Plus, Globe } from 'lucide-react'
import { cn } from '@/frontend/utils/cn'
import { ROUTES } from '@/frontend/config/routes'
import { useTheme } from "next-themes"
import { Button } from '@/frontend/components/ui/button'
import { useAuth } from '@/frontend/hooks/use-auth'
import { useLanguage } from '@/frontend/hooks/use-language'
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
  const { t, language, setLanguage } = useLanguage()
  const [mounted, setMounted] = useState(false)

  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  // Effectively avoid hydration mismatch by waiting for mount
  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true)
  }, [])

  // Nav items configuration
  const allItems = [

    { href: ROUTES.DASHBOARD, label: t('navbar.dashboard'), icon: LayoutDashboard, requiresAuth: true },
    { href: ROUTES.PRICES, label: t('navbar.prices'), icon: Coins, requiresAuth: false },
    // Special 'Add' button for mobile - handled in render logic
    { href: ROUTES.ADD_HOLDING, label: t('navbar.add'), icon: Plus, requiresAuth: true, isAddButton: true, mobileOnly: true },
    { href: ROUTES.HOLDINGS_LIST, label: t('navbar.holdings'), icon: Wallet, requiresAuth: true },
    { href: ROUTES.PROFILE, label: t('navbar.profile'), icon: User, mobileOnly: true, requiresAuth: true },
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
        "fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-accent-gold/20 shadow-[0_-4px_20px_rgba(212,175,55,0.12)] z-50 md:top-0 md:bottom-auto md:border-t-0 md:border-b md:border-border md:shadow-none",
        isActionPage && "hidden md:block" // Hide on mobile action pages, show on desktop
      )}>
        <div className="mx-auto flex h-16 items-center px-4 md:max-w-7xl md:px-6">

          {/* Desktop: Brand + Left-aligned Nav */}
          <div className="hidden md:flex items-center gap-8 flex-1">
            <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 bg-accent-gold rounded-full" />
              <span className="font-bold text-lg tracking-tight">Emasku</span>
            </Link>

            <div className="flex items-center gap-1 lg:gap-2">
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
                      "flex flex-row items-center gap-2 rounded-lg px-3 py-2 transition-colors",
                      isActive
                        ? "text-accent-gold font-semibold bg-accent-gold/5 shadow-[0_2px_8px_rgba(212,175,55,0.1)]"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <Icon className={cn("h-4 w-4", isActive && "fill-current md:fill-none")} />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Mobile: Stable 5-column Grid */}
          <div className="w-full grid grid-cols-5 items-end pb-2 md:hidden">
            {allItems.map((item) => {
              const isVisible = !item.requiresAuth || isAuthenticated;
              if (!isVisible) return <div key={item.href} />;

              // Handle special Add button (Mobile Center)
              if (item.isAddButton) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex flex-col items-center justify-end relative h-full group"
                  >
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-accent-gold rounded-full p-4 shadow-[0_4px_12px_rgba(212,175,55,0.4)] border-[6px] border-background flex items-center justify-center transition-all active:scale-95 group-hover:shadow-[0_8px_16px_rgba(212,175,55,0.5)]">
                      <Plus className="h-6 w-6 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-[10px] opacity-0 mt-1">Add</span>
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
                    "flex flex-col items-center gap-1 transition-all py-1",
                    isActive
                      ? "text-accent-gold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className={cn(
                    "p-1.5 rounded-xl transition-colors",
                    isActive && "bg-accent-gold/10 shadow-[0_4px_12px_rgba(212,175,55,0.2)]"
                  )}>
                    <Icon className={cn("h-5 w-5", isActive && "fill-current")} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className={cn("text-[10px] font-bold tracking-tight", isActive ? "opacity-100" : "opacity-60")}>
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </div>

          <div className="hidden md:flex md:items-center md:gap-4 md:justify-end">
            {/* Desktop: Login button for guests */}
            {!isAuthenticated && !isLoading && (
              <Button asChild color="primary" size="sm">
                <Link href={ROUTES.LOGIN}>{t('common.login')}</Link>
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
                      {isGuest ? t('common.guest') : user?.displayName || 'User'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={ROUTES.PROFILE} className="cursor-pointer w-full flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>{t('common.profile')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center text-sm">
                        <Globe className="mr-2 h-4 w-4" />
                        {t('common.language')}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs font-bold"
                        onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
                      >
                        {language.toUpperCase()}
                      </Button>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center text-sm">
                        {theme === 'dark' ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
                        {t('common.darkMode')}
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
                    <span>{t('common.logout')}</span>
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
