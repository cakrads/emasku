'use client'

import Link from 'next/link'
import { ROUTES } from '@/frontend/config/routes'
import { Button } from '@/frontend/components/ui/button'

export function SimpleNavbar() {
  return (
    <nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto flex h-16 items-center justify-between px-4 md:max-w-7xl md:px-6">
        <Link href={ROUTES.PRICES} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent-gold rounded-full" />
          <span className="font-bold text-lg tracking-tight">Emasku</span>
        </Link>
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link href={ROUTES.LOGIN}>Login</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}
