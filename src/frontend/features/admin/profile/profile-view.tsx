'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { LogOut, Calendar, Mail, Sun, Moon, Shield, Download, Trash2, Info, Globe } from 'lucide-react'
import { useTheme } from "next-themes"
import { useAuth } from '@/frontend/hooks/use-auth'
import { useLanguage } from '@/frontend/hooks/use-language'
import { Button, buttonVariants } from '@/frontend/components/ui/button'
import { StandardPageLayout } from '@/frontend/components/layout/standard-page-layout'
import { ErrorBoundary } from '@/frontend/components/fragments/admin/error-boundary'
import { Switch } from "@/frontend/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from '@/frontend/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/frontend/components/ui/card'
import dynamic from 'next/dynamic'
import { ROUTES } from '@/frontend/config/routes'
import { toast } from 'sonner'
import Link from 'next/link'
import { exportUserData, deleteUser } from '@/frontend/services/user/user.api'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/frontend/components/ui/alert-dialog"

const LogoutDialog = dynamic(
  () => import('@/frontend/components/fragments/admin/logout-dialog').then(mod => ({ default: mod.LogoutDialog })),
  { ssr: false }
)

export function ProfileView() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { t, language, setLanguage } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const handleLogout = async () => {
    await logout()
  }

  const handleExportData = async () => {
    setIsExporting(true)
    try {
      const blob = await exportUserData()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `emasku-data-${user?.id || 'user'}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success(t('profile.messages.exportSuccess'))
    } catch (err) {
      console.error(err)
      toast.error(t('profile.messages.exportError'))
    } finally {
      setIsExporting(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      await deleteUser()
      toast.success(t('profile.messages.deleteSuccess'))
      await logout().catch(() => {})
      router.push(ROUTES.LOGIN)
    } catch (err) {
      console.error(err)
      toast.error(t('profile.messages.deleteError'))
    } finally {
      setIsDeleting(false)
    }
  }

  if (!user) {
    return null // Or loading skeleton
  }

  return (
    <StandardPageLayout
      title={t('common.profile')}
      breadcrumbs={[
        { label: t('navbar.dashboard'), href: ROUTES.DASHBOARD },
        { label: t('common.profile') }
      ]}
    >
      <div className="max-w-lg mx-auto space-y-6 pb-24 md:pb-4">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.avatarUrl || ''} alt={user?.displayName || 'User'} />
              <AvatarFallback className="bg-accent-gold/20 text-accent-gold text-xl font-bold">
                {user?.displayName?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <CardTitle className="text-xl">
                {user?.displayName}
              </CardTitle>
              <CardDescription>
                {user?.email}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              {user?.email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 rounded-md bg-muted/50">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 rounded-md bg-muted/50">
                <Calendar className="h-4 w-4" />
                <span>{t('profile.joined')} {user?.createdAt ? new Date(user.createdAt).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { dateStyle: 'long' }) : t('profile.justNow')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2 md:hidden">
          <h3 className="text-sm font-medium text-muted-foreground ml-1">{t('profile.preferences')}</h3>
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  <span className="font-medium">{t('common.darkMode')}</span>
                </div>
                {mounted && (
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                  />
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5" />
                  <span className="font-medium">{t('common.language')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant={language === 'id' ? 'solid' : 'outline'} size="sm" onClick={() => setLanguage('id')} className="h-7 px-2 text-xs">ID</Button>
                  <Button variant={language === 'en' ? 'solid' : 'outline'} size="sm" onClick={() => setLanguage('en')} className="h-7 px-2 text-xs">EN</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground ml-1">{t('profile.privacy')}</h3>
          <Card>
            <CardContent className="p-0 divide-y">
              <div className="p-4 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Download className="h-5 w-5 text-primary" />
                    <div>
                      <span className="font-medium block">{t('profile.exportData')}</span>
                      <span className="text-xs text-muted-foreground">{t('profile.exportDesc')}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportData}
                    disabled={isExporting}
                  >
                    {isExporting ? t('common.exporting') : t('common.export')}
                  </Button>
                </div>
              </div>

              <div className="p-4 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-accent-gold" />
                    <div>
                      <span className="font-medium block">{t('profile.privacyPolicy')}</span>
                      <span className="text-xs text-muted-foreground">{t('profile.privacyDesc')}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={ROUTES.PRIVACY_POLICY}>
                      <Info className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="p-4 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Trash2 className="h-5 w-5 text-destructive" />
                    <div>
                      <span className="font-medium block text-destructive">{t('profile.deleteAccount')}</span>
                      <span className="text-xs text-muted-foreground">{t('profile.deleteDesc')}</span>
                    </div>
                  </div>
                  <Button
                    variant="solid"
                    color="destructive"
                    size="sm"
                    onClick={() => setShowDeleteDialog(true)}
                    disabled={isDeleting}
                  >
                    {t('common.delete')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground ml-1">{t('common.account')}</h3>

          <Button
            variant="solid"
            color="subtle"
            className="w-full justify-start gap-2"
            onClick={() => setShowLogoutDialog(true)}
          >
            <LogOut className="h-4 w-4" />
            {t('common.logout')}
          </Button>
        </div>

        <LogoutDialog
          open={showLogoutDialog}
          onOpenChange={setShowLogoutDialog}
          onConfirm={handleLogout}
        />

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('profile.deleteDialogTitle')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('profile.deleteDialogDesc')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                className={buttonVariants({ variant: 'solid', color: 'destructive' })}
              >
                {t('profile.deleteConfirm')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </StandardPageLayout>
  )
}
