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
import { Card, CardContent } from '@/frontend/components/ui/card'
import { Stack } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
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
    return null
  }

  return (
    <StandardPageLayout
      title={t('common.profile')}
      breadcrumbs={[
        { label: t('navbar.dashboard'), href: ROUTES.DASHBOARD },
        { label: t('common.profile') }
      ]}
    >
      <ErrorBoundary>
        <Stack gap="lg" className="max-w-lg mx-auto pb-24 md:pb-4">

          {/* User Info Card */}
          <Card>
            <CardContent className="p-6">
              <Stack direction="horizontal" gap="md" className="items-center mb-4">
                <Avatar className="h-16 w-16 shrink-0">
                  <AvatarImage src={user?.avatarUrl || ''} alt={user?.displayName || 'User'} />
                  <AvatarFallback className="bg-accent-gold/20 text-accent-gold text-xl font-bold">
                    {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <Stack gap="xs">
                  <Typography variant="h3">{user?.displayName}</Typography>
                  <Typography variant="body-sm" className="text-muted-foreground">{user?.email}</Typography>
                </Stack>
              </Stack>
              <Stack gap="sm">
                {user?.email && (
                  <Stack direction="horizontal" gap="sm" className="items-center p-2 rounded-md bg-muted/50">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <Typography variant="body-sm" className="text-muted-foreground">{user.email}</Typography>
                  </Stack>
                )}
                <Stack direction="horizontal" gap="sm" className="items-center p-2 rounded-md bg-muted/50">
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Typography variant="body-sm" className="text-muted-foreground">
                    {t('profile.joined')} {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { dateStyle: 'long' })
                      : t('profile.justNow')}
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {/* Preferences Card */}
          <Stack gap="sm">
            <Typography variant="body-sm" className="font-medium text-muted-foreground ml-1">{t('profile.preferences')}</Typography>
            <Card>
              <CardContent className="p-0 divide-y divide-border">
                {/* Dark Mode */}
                <Stack direction="horizontal" className="items-center justify-between p-4">
                  <Stack direction="horizontal" gap="md" className="items-center">
                    {mounted && theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    <Typography variant="body" className="font-medium">{t('common.darkMode')}</Typography>
                  </Stack>
                  {mounted && (
                    <Switch
                      checked={theme === 'dark'}
                      onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                    />
                  )}
                </Stack>
                {/* Language */}
                <Stack direction="horizontal" className="items-center justify-between p-4">
                  <Stack direction="horizontal" gap="md" className="items-center">
                    <Globe className="h-5 w-5" />
                    <Typography variant="body" className="font-medium">{t('common.language')}</Typography>
                  </Stack>
                  <Stack direction="horizontal" gap="sm" className="items-center">
                    <Button variant={language === 'id' ? 'solid' : 'outline'} size="sm" onClick={() => setLanguage('id')} className="h-7 px-2 text-xs">ID</Button>
                    <Button variant={language === 'en' ? 'solid' : 'outline'} size="sm" onClick={() => setLanguage('en')} className="h-7 px-2 text-xs">EN</Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Stack>

          {/* Privacy & Data Card */}
          <Stack gap="sm">
            <Typography variant="body-sm" className="font-medium text-muted-foreground ml-1">{t('profile.privacy')}</Typography>
            <Card>
              <CardContent className="p-0 divide-y divide-border">
                {/* Export Data */}
                <Stack direction="horizontal" className="items-center justify-between p-4">
                  <Stack direction="horizontal" gap="md" className="items-center">
                    <Download className="h-5 w-5 text-primary" />
                    <Stack gap="xs">
                      <Typography variant="body" className="font-medium">{t('profile.exportData')}</Typography>
                      <Typography variant="caption" className="text-muted-foreground">{t('profile.exportDesc')}</Typography>
                    </Stack>
                  </Stack>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportData}
                    disabled={isExporting}
                  >
                    {isExporting ? t('common.exporting') : t('common.export')}
                  </Button>
                </Stack>
                {/* Privacy Policy */}
                <Stack direction="horizontal" className="items-center justify-between p-4">
                  <Stack direction="horizontal" gap="md" className="items-center">
                    <Shield className="h-5 w-5 text-accent-gold" />
                    <Stack gap="xs">
                      <Typography variant="body" className="font-medium">{t('profile.privacyPolicy')}</Typography>
                      <Typography variant="caption" className="text-muted-foreground">{t('profile.privacyDesc')}</Typography>
                    </Stack>
                  </Stack>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={ROUTES.PRIVACY_POLICY}>
                      <Info className="h-4 w-4" />
                    </Link>
                  </Button>
                </Stack>
                {/* Delete Account */}
                <Stack direction="horizontal" className="items-center justify-between p-4">
                  <Stack direction="horizontal" gap="md" className="items-center">
                    <Trash2 className="h-5 w-5 text-destructive" />
                    <Stack gap="xs">
                      <Typography variant="body" className="font-medium text-destructive">{t('profile.deleteAccount')}</Typography>
                      <Typography variant="caption" className="text-muted-foreground">{t('profile.deleteDesc')}</Typography>
                    </Stack>
                  </Stack>
                  <Button
                    variant="solid"
                    color="destructive"
                    size="sm"
                    onClick={() => setShowDeleteDialog(true)}
                    disabled={isDeleting}
                  >
                    {t('common.delete')}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Stack>

          {/* Account Card */}
          <Stack gap="sm">
            <Typography variant="body-sm" className="font-medium text-muted-foreground ml-1">{t('common.account')}</Typography>
            <Card>
              <CardContent className="p-0">
                <Stack
                  direction="horizontal"
                  className="items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors rounded-lg"
                  onClick={() => setShowLogoutDialog(true)}
                >
                  <LogOut className="h-5 w-5 text-muted-foreground" />
                  <Typography variant="body" className="font-medium">{t('common.logout')}</Typography>
                </Stack>
              </CardContent>
            </Card>
          </Stack>

        </Stack>
      </ErrorBoundary>

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
    </StandardPageLayout>
  )
}
