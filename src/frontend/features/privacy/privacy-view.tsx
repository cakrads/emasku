'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Shield, Lock, Eye, FileText, Server, Mail, Calendar, TriangleAlert } from 'lucide-react'
import { Button } from '@/frontend/components/ui/button'
import { Card, CardContent } from '@/frontend/components/ui/card'
import { Typography } from '@/frontend/components/ui/typography'
import { Alert, AlertTitle, AlertDescription } from '@/frontend/components/ui/alert'

export function PrivacyView() {
  const lastUpdated = '11 Januari 2026'

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-muted/30 border-b">
        <div className="container max-w-4xl mx-auto py-12 px-6 md:py-16">
          <Button variant="ghost" asChild className="mb-6 -ml-2 text-muted-foreground hover:bg-muted/50">
            <Link href="/login">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Link>
          </Button>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Kebijakan Privasi</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Komitmen kami untuk melindungi data pribadi Anda sesuai dengan standar UU PDP Indonesia.
          </p>
          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Terakhir diperbarui: {lastUpdated}</span>
          </div>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto py-12 px-6 space-y-16">

        {/* Education Disclaimer */}
        <Alert variant="destructive" className="bg-destructive/5 border-destructive/20 text-destructive dark:text-red-400">
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle className="font-bold">Proyek Pembelajaran (Demo Only)</AlertTitle>
          <AlertDescription className="text-sm opacity-90">
            Aplikasi Emasku saat ini masih dalam tahap pengembangan dan digunakan khusus untuk **tujuan pembelajaran**.
            Layanan ini belum siap untuk penggunaan produksi secara publik. Jangan gunakan data asli atau sensitif di dalam aplikasi ini.
          </AlertDescription>
        </Alert>

        {/* Introduction */}
        <section className="space-y-6">
          <Typography variant="body" className="text-lg leading-relaxed text-foreground/80">
            PT Emasku Finansial Digital (&quot;Emasku&quot;, &quot;kami&quot;) berkomitmen untuk melindungi privasi dan keamanan data pribadi Anda.
            Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data Anda sesuai dengan
            <strong> Undang-Undang No. 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP)</strong>.
          </Typography>
          <div className="mt-8 bg-accent-gold/5 border border-accent-gold/20 rounded-xl p-6 flex gap-4 text-sm text-yellow-800 dark:text-yellow-200 shadow-sm">
            <Shield className="h-6 w-6 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="font-bold text-lg">Jaminan Keamanan</p>
              <p className="leading-relaxed opacity-90 text-base">
                Dengan menggunakan layanan Emasku, Anda menyetujui pengumpulan dan penggunaan informasi sesuai dengan kebijakan ini.
                Kami menjamin bahwa data Anda tidak akan dijual kepada pihak ketiga tanpa persetujuan eksplisit Anda.
              </p>
            </div>
          </div>
        </section>

        {/* 1. Data Collection */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">1</span>
            Data yang Kami Kumpulkan
          </h2>
          <Card className="overflow-hidden border-muted/60">
            <CardContent className="p-0 grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
              <div className="p-8 space-y-4">
                <div className="flex items-center gap-2 font-semibold text-blue-600 dark:text-blue-400">
                  <UserIcon className="h-5 w-5" />
                  <h3>Identitas</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">• Nama lengkap</li>
                  <li className="flex items-center gap-2">• Alamat email</li>
                  <li className="flex items-center gap-2">• Foto profil (OAuth)</li>
                  <li className="flex items-center gap-2">• ID Pengguna</li>
                </ul>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex items-center gap-2 font-semibold text-green-600 dark:text-green-400">
                  <WalletIcon className="h-5 w-5" />
                  <h3>Finansial</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">• Riwayat emas</li>
                  <li className="flex items-center gap-2">• Jumlah aset</li>
                  <li className="flex items-center gap-2">• Harga beli</li>
                  <li className="flex items-center gap-2">• Catatan portofolio</li>
                </ul>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex items-center gap-2 font-semibold text-purple-600 dark:text-purple-400">
                  <Server className="h-5 w-5" />
                  <h3>Teknis</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">• Alamat IP</li>
                  <li className="flex items-center gap-2">• Browser & OS</li>
                  <li className="flex items-center gap-2">• Log akses</li>
                  <li className="flex items-center gap-2">• Sesi aktif</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 2. Purpose */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">2</span>
            Tujuan Pemrosesan Data
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "Penyediaan layanan pelacakan portofolio",
              "Keamanan akun dan verifikasi identitas",
              "Analitik kinerja investasi personal",
              "Kepatuhan regulasi keuangan Indonesia",
              "Pencegahan penipuan dan penyalahgunaan"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-lg bg-muted/30 border border-muted/50">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-gold shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 3. User Rights (UU PDP) */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">3</span>
            Hak-Hak Anda (Sesuai UU PDP)
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <RightCard icon={Eye} title="Hak Akses" desc="Meminta salinan data pribadi yang kami simpan tentang Anda." />
            <RightCard icon={FileText} title="Hak Koreksi" desc="Meminta perbaikan data yang tidak akurat atau tidak lengkap." />
            <RightCard icon={Lock} title="Hak Penghapusan" desc="Menghapus akun dan data permanen (Hak untuk Dilupakan)." />
            <RightCard icon={Shield} title="Hak Penarikan" desc="Membatalkan izin pemrosesan data pribadi Anda kapan saja." />
          </div>
          <p className="text-sm text-muted-foreground p-4 rounded-lg bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-900/20 italic">
            Gunakan hak Anda melalui menu <strong>Profil &gt; Privasi & Data</strong> di dalam aplikasi Emasku.
          </p>
        </section>

        {/* 4. Data Retention */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">4</span>
            Penyimpanan & Keamanan
          </h2>
          <Typography variant="body" className="leading-relaxed text-muted-foreground">
            Data transaksi disimpan minimal <strong>5 tahun</strong> sesuai regulasi OJK & PP No. 71/2019. Kami menggunakan
            enkripsi <strong>AES-256</strong> dan protokol <strong>TLS 1.3</strong> untuk menjamin keamanan data Anda dari akses yang tidak sah.
          </Typography>
        </section>

        {/* 5. Contact */}
        <section className="space-y-6 pt-12 border-t">
          <h2 className="text-xl font-bold">Layanan Pengaduan Konsumen</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <address className="not-italic space-y-4">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Tim Privasi Emasku</p>
                <p className="text-lg font-semibold">Petugas Perlindungan Data (DPO)</p>
              </div>
              <div className="space-y-2 text-sm text-foreground/80">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-accent-gold" />
                  <a href="mailto:privacy@emasku.com" className="hover:text-accent-gold transition-colors">privacy@emasku.com</a>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-accent-gold" />
                  <span>Jakarta, Indonesia</span>
                </div>
              </div>
            </address>
            <div className="bg-muted/30 p-6 rounded-xl border border-muted/50 text-xs text-muted-foreground leading-relaxed">
              <p>
                Aduan Anda akan diproses dalam waktu maksimal 3x24 jam kerja sesuai dengan Prosedur Operasional Standar (SOP)
                Penanganan Keluhan UU PDP kami.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}

function RightCard({ icon: Icon, title, desc }: { icon: React.ElementType, title: string, desc: string }) {
  return (
    <div className="border rounded-lg p-4 flex gap-3 items-start hover:bg-accent/5 transition-colors">
      <div className="bg-primary/10 p-2 rounded-full shrink-0">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div>
        <h4 className="font-medium text-sm">{title}</h4>
        <p className="text-xs text-muted-foreground mt-1">{desc}</p>
      </div>
    </div>
  )
}

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function WalletIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </svg>
  )
}
