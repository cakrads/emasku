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
import { useLanguage } from '@/frontend/hooks/use-language'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/frontend/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/frontend/components/ui/avatar"
import { LogoutDialog } from '@/frontend/components/fragments/admin/logout-dialog'

export function SharedNavbar() {
  const pathname = usePathname()
  const { isAuthenticated, isGuest, user, logout, isLoading } = useAuth()
  const { theme, setTheme } = useTheme()
  const { t, language, setLanguage } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isLoginPage = pathname === ROUTES.LOGIN

  /**
   * Navigation Items Definition
   * Order for Mobile: Dasbor (1), Portofolio (2), Tambah (3), Harga (4), Profil (5)
   */
  const allItems = [
    {
      id: 'dashboard',
      href: ROUTES.DASHBOARD,
      label: t('navbar.dashboard'),
      icon: LayoutDashboard,
      requiresAuth: true,
      desktopOrder: 1,
      mobileOrder: 1
    },
    {
      id: 'portfolio',
      href: ROUTES.HOLDINGS_LIST,
      label: t('navbar.holdings'),
      icon: Wallet,
      requiresAuth: true,
      desktopOrder: 2,
      mobileOrder: 2
    },
    {
      id: 'add',
      href: ROUTES.ADD_HOLDING,
      label: t('navbar.add'),
      icon: Plus,
      requiresAuth: true,
      isAddButton: true,
      mobileOnly: true,
      mobileOrder: 3
    },
    {
      id: 'prices',
      href: ROUTES.PRICES,
      label: t('navbar.prices'),
      icon: Coins,
      requiresAuth: false,
      desktopOrder: 3,
      mobileOrder: 4
    },
    {
      id: 'profile',
      href: ROUTES.PROFILE,
      label: t('navbar.profile'),
      icon: User,
      requiresAuth: true,
      mobileOnly: true,
      mobileOrder: 5
    },
  ]

  // Filter based on authentication
  const visibleItems = allItems.filter(item => {
    if (item.requiresAuth && !isAuthenticated) return false
    return true
  })

  // Desktop links
  const desktopItems = visibleItems
    .filter(item => !item.mobileOnly)
    .sort((a, b) => (a.desktopOrder || 99) - (b.desktopOrder || 99))

  // Mobile links (sorted for bottom grid)
  const mobileItems = [...visibleItems].sort((a, b) => (a.mobileOrder || 99) - (b.mobileOrder || 99))

  // Layout logic: Authenticated users get bottom bar (unless on login)
  const showMobileBottomBar = isAuthenticated && !isLoginPage

  const handleLogout = async () => {
    await logout()
    setShowLogoutDialog(false)
  }

  return (
    <>
      <nav className={cn(
        "fixed z-50 transition-all duration-300",
        // Desktop: Always top
        "md:top-0 md:left-0 md:right-0 md:bottom-auto",
        "md:bg-background/80 md:backdrop-blur-md md:border-b md:border-border",
        // Mobile: Auth user gets bottom, Guest gets top
        showMobileBottomBar
          ? "bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-accent-gold/20 shadow-[0_-4px_20px_rgba(212,175,55,0.12)] md:shadow-none"
          : "top-0 left-0 right-0 border-b border-border/50 bg-background/80 backdrop-blur-md"
      )}>
        <div className={cn(
          "mx-auto h-16 items-center px-4 md:max-w-7xl md:px-6 justify-between md:justify-start",
          showMobileBottomBar ? "hidden md:flex" : "flex"
        )}>

          {/* Logo */}
          <div className={cn("flex items-center gap-2 shrink-0 md:mr-8", showMobileBottomBar && "hidden md:flex")}>
            <Link href={ROUTES.HOME} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent-gold rounded-full" />
              <span className="font-bold text-lg tracking-tight">Emasku</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {!isLoginPage && (
            <div className="hidden md:flex items-center gap-1 lg:gap-2 flex-1">
              {desktopItems.map((item) => {
                const isActive = item.href === ROUTES.DASHBOARD
                  ? pathname === ROUTES.DASHBOARD
                  : (pathname === item.href || pathname.startsWith(`${item.href}/`))

                const Icon = item.icon

                return (
                  <Link
                    key={item.id}
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
          )}

          {/* Settings / Auth Actions */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Theme Toggle - Hidden on mobile bottom nav */}
            {mounted && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={cn("w-9 h-9 p-0", showMobileBottomBar && "hidden md:flex")}
              >
                {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                <span className="sr-only">Toggle theme</span>
              </Button>
            )}

            {/* Language Toggle - Hidden on mobile bottom nav */}
            <Button
              variant="ghost"
              size="sm"
              className={cn("h-9 px-2 text-xs font-bold", showMobileBottomBar && "hidden md:flex")}
              onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
            >
              {language.toUpperCase()}
            </Button>

            {/* Guest Login */}
            {!isAuthenticated && !isLoading && !isLoginPage && (
              <Button asChild color="primary" size="sm" className="ml-2">
                <Link href={ROUTES.LOGIN}>{t('common.login')}</Link>
              </Button>
            )}

            {/* Profile (Desktop) */}
            {isAuthenticated && !isLoading && (
              <div className="hidden md:block ml-2">
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
                      <Link href={ROUTES.PROFILE} className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>{t('common.account')}</span>
                      </Link>
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
              </div>
            )}
          </div>
        </div>

        {/* Mobile Bottom Bar */}
        {showMobileBottomBar && (
          <div className="w-full grid grid-cols-5 items-end pb-2 md:hidden px-2">
            {mobileItems.map((item) => {
              // Add centered button
              if (item.id === 'add') {
                return (
                  <Link
                    key={item.id}
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

              const isActive = item.href === ROUTES.DASHBOARD
                ? pathname === ROUTES.DASHBOARD
                : (pathname === item.href || pathname.startsWith(`${item.href}/`))

              const Icon = item.icon

              return (
                <Link
                  key={item.id}
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
        )}
      </nav>

      <LogoutDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onConfirm={handleLogout}
      />
    </>
  )
}
