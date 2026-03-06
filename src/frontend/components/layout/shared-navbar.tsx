'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { LayoutDashboard, Coins, Wallet, LogOut, User, Sun, Moon, Plus, Menu, Target, Globe } from 'lucide-react'
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/frontend/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/frontend/components/ui/avatar"
import { LogoutDialog } from '@/frontend/components/fragments/admin/logout-dialog'

export function SharedNavbar() {
  const pathname = usePathname()
  const { isAuthenticated, user, logout, isLoading } = useAuth()
  const { theme, setTheme } = useTheme()
  const { t, language, setLanguage } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
      id: 'goals',
      href: ROUTES.GOALS_LIST,
      label: t('navbar.goals'),
      icon: Target,
      requiresAuth: true,
      desktopOrder: 3,
      // mobileOrder: 4 - Hidden on mobile as per user request
    },
    {
      id: 'prices',
      href: ROUTES.PRICES,
      label: t('navbar.prices'),
      icon: Coins,
      requiresAuth: false,
      desktopOrder: 4,
      mobileOrder: 5
    },
    {
      id: 'profile',
      href: ROUTES.PROFILE,
      label: t('navbar.profile'),
      icon: User,
      requiresAuth: true,
      mobileOnly: true,
      mobileOrder: 6
    },
  ]

  const visibleItems = allItems.filter(item => {
    if (item.requiresAuth && !isAuthenticated) return false
    return true
  })

  const desktopItems = visibleItems
    .filter(item => !item.mobileOnly)
    .sort((a, b) => (a.desktopOrder || 99) - (b.desktopOrder || 99))

  const mobileItems = visibleItems
    .filter(item => item.mobileOrder !== undefined)
    .sort((a, b) => (a.mobileOrder || 99) - (b.mobileOrder || 99))

  const isHomePage = pathname === ROUTES.HOME
  const isPrivacyPage = pathname === ROUTES.PRIVACY_POLICY
  const showMobileBottomBar = isAuthenticated && !isLoginPage && !isHomePage && !isPrivacyPage

  const handleLogout = async () => {
    await logout()
    setShowLogoutDialog(false)
  }

  const isFormPage =
    pathname === ROUTES.ADD_HOLDING ||
    pathname === ROUTES.ADD_GOAL ||
    (pathname.includes('/holdings/') && pathname.endsWith('/edit')) ||
    (pathname.includes('/goals/') && pathname.endsWith('/edit'))

  const getIsActive = (href: string) =>
    href === ROUTES.DASHBOARD
      ? pathname === ROUTES.DASHBOARD
      : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <div className="relative">
      <nav className={cn(
        "fixed z-50 transition-colors duration-300",
        isFormPage && "hidden md:block",
        // Desktop: top bar
        "md:top-0 md:left-0 md:right-0 md:bottom-auto",
        "md:bg-background md:border-b md:border-border",
        // Mobile: auth → bottom, guest → top
        showMobileBottomBar
          ? "bottom-0 left-0 right-0 bg-background border-t border-border md:shadow-none"
          : "top-0 left-0 right-0 border-b border-border bg-background"
      )}>

        {/* ── Desktop Top Bar + Guest Mobile Top Bar ── */}
        <div className={cn(
          "mx-auto h-16 items-center px-4 md:max-w-7xl md:px-6",
          showMobileBottomBar ? "hidden md:flex" : "flex"
        )}>

          {/* Logo — left slot */}
          <div className="flex-1 flex items-center">
            <Link href={ROUTES.HOME} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent-gold rounded-full" />
              <span className="font-bold text-lg tracking-tight">Emasku</span>
            </Link>
          </div>

          {/* Desktop Nav Links — center slot */}
          {!isLoginPage && (
            <div className="hidden md:flex items-center gap-1">
              {desktopItems.map((item) => {
                const isActive = getIsActive(item.href)
                const Icon = item.icon

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                      isActive
                        ? "text-accent-gold font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          )}

          {/* Actions — right slot */}
          <div className="flex-1 flex items-center justify-end gap-2">

            {/* Mobile Hamburger (guest / public pages) */}
            {!showMobileBottomBar && !isLoginPage && (
              <div className="md:hidden">
                <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-9 h-9 p-0">
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0">
                    <SheetHeader className="p-6 text-left border-b border-border">
                      <SheetTitle className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-accent-gold rounded-full" />
                        <span className="font-bold text-lg tracking-tight">Emasku</span>
                      </SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col py-4">
                      {mobileItems.filter(item => !item.isAddButton).map((item) => {
                        const Icon = item.icon
                        const isActive = getIsActive(item.href)

                        return (
                          <Link
                            key={item.id}
                            href={item.href}
                            onClick={() => setIsMenuOpen(false)}
                            className={cn(
                              "flex items-center gap-4 px-6 py-4 transition-colors",
                              isActive
                                ? "text-accent-gold font-semibold"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                          >
                            <Icon className="h-5 w-5" />
                            <span>{item.label}</span>
                          </Link>
                        )
                      })}

                      {/* Theme + Language in sheet */}
                      {mounted && (
                        <div className="mt-4 pt-4 border-t border-border px-6 flex flex-col gap-2">
                          <Button
                            variant="ghost"
                            className="w-full justify-start gap-4 px-0"
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                          >
                            {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                            <span>{theme === 'dark' ? t('common.lightMode') : t('common.darkMode')}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start gap-4 px-0"
                            onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
                          >
                            <Globe className="h-5 w-5" />
                            <span>{language === 'id' ? t('common.languageEnglish') : t('common.languageBahasa')}</span>
                          </Button>
                        </div>
                      )}

                      {!isAuthenticated && (
                        <Link
                          href={ROUTES.LOGIN}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-4 px-6 py-4 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                        >
                          <User className="h-5 w-5" />
                          <span>{t('common.login')}</span>
                        </Link>
                      )}

                      {isAuthenticated && (
                        <div className="mt-4 pt-4 border-t border-border px-6">
                          <Button
                            variant="ghost"
                            className="w-full justify-start gap-4 px-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => setShowLogoutDialog(true)}
                          >
                            <LogOut className="h-5 w-5" />
                            <span>{t('common.logout')}</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            )}

            {/* Guest Login CTA (desktop) */}
            {!isAuthenticated && !isLoading && !isLoginPage && (
              <Button asChild color="primary" size="sm" className="hidden md:inline-flex">
                <Link href={ROUTES.LOGIN}>{t('common.login')}</Link>
              </Button>
            )}

            {/* Profile Dropdown (desktop) — includes theme + language */}
            {isAuthenticated && !isLoading && (
              <div className="hidden md:block">
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 px-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatarUrl || ''} />
                        <AvatarFallback className="bg-accent-gold/20 text-accent-gold text-sm font-semibold">
                          {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium max-w-28 truncate">
                        {user?.displayName || 'User'}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>{t('common.account')}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={ROUTES.PROFILE} className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>{t('common.account')}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {mounted && (
                      <DropdownMenuItem
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="cursor-pointer"
                      >
                        {theme === 'dark'
                          ? <Moon className="mr-2 h-4 w-4" />
                          : <Sun className="mr-2 h-4 w-4" />
                        }
                        <span>{theme === 'dark' ? t('common.lightMode') : t('common.darkMode')}</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
                      className="cursor-pointer"
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      <span>{language === 'id' ? t('common.languageEnglish') : t('common.languageBahasa')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive cursor-pointer"
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

        {/* ── Mobile Bottom Tab Bar (authenticated) ── */}
        {showMobileBottomBar && (
          <div className="w-full grid grid-cols-5 items-end pb-2 md:hidden px-2">
            {mobileItems.map((item) => {

              // Center FAB (Add)
              if (item.id === 'add') {
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    aria-label={item.label}
                    className="flex flex-col items-center justify-end relative h-full group"
                  >
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-accent-gold rounded-full p-4 shadow-gold border-4 border-background flex items-center justify-center transition-all active:scale-95">
                      <Plus className="h-6 w-6 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-2xs opacity-0 mt-1">+</span>
                  </Link>
                )
              }

              const isActive = getIsActive(item.href)
              const Icon = item.icon

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-1 py-2 transition-colors",
                    isActive ? "text-accent-gold" : "text-muted-foreground"
                  )}
                >
                  <Icon
                    className="h-5 w-5"
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className={cn(
                    "text-2xs font-medium",
                    isActive ? "opacity-100" : "opacity-60"
                  )}>
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
    </div>
  )
}
