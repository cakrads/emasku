'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Calendar, Mail, Sun, Moon, Shield, Download, Trash2, Info } from 'lucide-react'
import { useTheme } from "next-themes"
import { useAuth } from '@/frontend/hooks/use-auth'
import { Button } from '@/frontend/components/ui/button'
import { Switch } from "@/frontend/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from '@/frontend/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/frontend/components/ui/card'
import { LogoutDialog } from '@/frontend/components/fragments/logout-dialog'
import { ROUTES } from '@/frontend/config/routes'
import { toast } from 'sonner'
import Link from 'next/link'
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

export function ProfileView() {
  const { user, isGuest, logout } = useAuth()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true)
  }, [])

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push(ROUTES.LOGIN)
  }

  const handleExportData = async () => {
    setIsExporting(true)
    try {
      const response = await fetch('/api/v1/user/export')
      if (!response.ok) throw new Error('Export failed')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `emasku-data-${user?.id || 'guest'}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Data berhasil diunduh')
    } catch (err) {
      console.error(err)
      toast.error('Gagal mengunduh data')
    } finally {
      setIsExporting(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch('/api/v1/user/delete', { method: 'DELETE' })
      if (!response.ok) throw new Error('Deletion failed')

      toast.success('Akun dan data Anda telah dihapus')
      await logout()
      router.push(ROUTES.LOGIN)
    } catch (err) {
      console.error(err)
      toast.error('Gagal menghapus akun')
      setIsDeleting(false)
    }
  }

  if (!user && !isGuest) {
    return null // Or loading skeleton
  }

  return (
    <div className="container max-w-lg mx-auto p-4 space-y-6 pb-24 md:pb-4">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.avatarUrl || ''} alt={user?.displayName || 'User'} />
            <AvatarFallback className="bg-accent-gold/20 text-accent-gold text-xl font-bold">
              {isGuest ? 'G' : user?.displayName?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <CardTitle className="text-xl">
              {isGuest ? 'Guest User' : user?.displayName}
            </CardTitle>
            <CardDescription>
              {isGuest ? 'Temporary Account' : user?.email}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            {!isGuest && user?.email && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 rounded-md bg-muted/50">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 rounded-md bg-muted/50">
              <Calendar className="h-4 w-4" />
              <span>Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID', { dateStyle: 'long' }) : 'Baru saja'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2 md:hidden">
        <h3 className="text-sm font-medium text-muted-foreground ml-1">Preferences</h3>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              <span className="font-medium">Dark Mode</span>
            </div>
            {mounted && (
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground ml-1">Privasi & Data (UU PDP)</h3>
        <Card>
          <CardContent className="p-0 divide-y">
            <div className="p-4 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Download className="h-5 w-5 text-primary" />
                  <div>
                    <span className="font-medium block">Ekspor Data</span>
                    <span className="text-xs text-muted-foreground">Unduh semua data investasi dan profil Anda (JSON).</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportData}
                  disabled={isExporting}
                >
                  {isExporting ? 'Mengunduh...' : 'Ekspor'}
                </Button>
              </div>
            </div>

            <div className="p-4 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-accent-gold" />
                  <div>
                    <span className="font-medium block">Kebijakan Privasi</span>
                    <span className="text-xs text-muted-foreground">Pelajari bagaimana kami melindungi data Anda.</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/privacy">
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
                    <span className="font-medium block text-destructive">Hapus Akun</span>
                    <span className="text-xs text-muted-foreground">Hapus permanen akun dan semua data investasi Anda.</span>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={isDeleting}
                >
                  Hapus
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground ml-1">Akun</h3>

        <Button
          variant="secondary"
          className="w-full justify-start gap-2"
          onClick={() => setShowLogoutDialog(true)}
        >
          <LogOut className="h-4 w-4" />
          Keluar (Log Out)
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
            <AlertDialogTitle>Hapus Akun Permanen?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Semua data portofolio, riwayat transaksi,
              dan informasi profil Anda akan dihapus secara permanen dari server kami sesuai dengan hak penghapusan UU PDP.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Ya, Hapus Permanen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
