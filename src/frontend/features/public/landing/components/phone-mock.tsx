'use client'

import { cn } from '@/frontend/utils/cn'
import { Typography } from '@/frontend/components/ui/typography'

interface PhoneMockProps {
  activeStep: number
  className?: string
}

export function PhoneMock({ activeStep, className }: PhoneMockProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Phone frame */}
      <div className="relative w-[280px] h-[580px] bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-[3rem] p-2 shadow-2xl shadow-black/50">
        {/* Inner bezel */}
        <div className="relative w-full h-full bg-background rounded-[2.5rem] overflow-hidden">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-zinc-900 rounded-b-2xl z-20" />

          {/* Screen content */}
          <div className="relative w-full h-full pt-10 px-4 pb-4">
            {/* Step 1: Add Gold Screen */}
            <div
              className={cn(
                "absolute inset-0 pt-10 px-4 pb-4 transition-all duration-500",
                activeStep === 0 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8 pointer-events-none"
              )}
            >
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <Typography variant="h3" as="h3" className="text-lg font-semibold">Tambah Emas</Typography>
                  <Typography variant="caption" as="p" className="text-xs text-muted-foreground">Catat pembelian baru</Typography>
                </div>

                <div className="space-y-3">
                  <div className="bg-muted/50 backdrop-blur-sm rounded-xl p-3 border border-border/50">
                    <label className="text-xs text-muted-foreground">Brand</label>
                    <div className="text-sm font-medium mt-1">Antam</div>
                  </div>

                  <div className="bg-muted/50 backdrop-blur-sm rounded-xl p-3 border border-border/50">
                    <label className="text-xs text-muted-foreground">Berat</label>
                    <div className="text-sm font-medium mt-1">5 gram</div>
                  </div>

                  <div className="bg-muted/50 backdrop-blur-sm rounded-xl p-3 border border-border/50">
                    <label className="text-xs text-muted-foreground">Tanggal Beli</label>
                    <div className="text-sm font-medium mt-1">15 Januari 2024</div>
                  </div>

                  <div className="bg-muted/50 backdrop-blur-sm rounded-xl p-3 border border-border/50">
                    <label className="text-xs text-muted-foreground">Harga Beli</label>
                    <div className="text-sm font-medium mt-1">Rp 5.250.000</div>
                  </div>
                </div>

                <button className="w-full mt-4 bg-gradient-to-r from-accent-gold to-amber-600 text-white font-medium py-3 rounded-xl shadow-lg shadow-accent-gold/30">
                  Simpan
                </button>
              </div>
            </div>

            {/* Step 2: Portfolio Screen */}
            <div
              className={cn(
                "absolute inset-0 pt-10 px-4 pb-4 transition-all duration-500",
                activeStep === 1 ? "opacity-100 translate-x-0" : activeStep < 1 ? "opacity-0 translate-x-8 pointer-events-none" : "opacity-0 -translate-x-8 pointer-events-none"
              )}
            >
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <Typography variant="h3" as="h3" className="text-lg font-semibold">Portofolio</Typography>
                  <Typography variant="caption" as="p" className="text-xs text-muted-foreground">Total kepemilikan</Typography>
                </div>

                <div className="bg-muted/50 backdrop-blur-sm rounded-2xl p-4 space-y-4 border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-gold to-amber-600 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">5g</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Antam 5 gram</div>
                      <div className="text-xs text-muted-foreground">15 Jan 2024</div>
                    </div>
                  </div>

                  <div className="border-t border-border/50 pt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Harga beli</span>
                      <span>Rp 5.250.000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Harga saat ini</span>
                      <span>Rp 5.450.000</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-border/30">
                      <span className="text-muted-foreground">Selisih nilai</span>
                      <span className="text-accent-gold font-medium">+Rp 200.000</span>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Typography variant="caption" as="p" className="text-xs text-muted-foreground">Harga market diperbarui otomatis</Typography>
                </div>
              </div>
            </div>

            {/* Step 3: History Screen */}
            <div
              className={cn(
                "absolute inset-0 pt-10 px-4 pb-4 transition-all duration-500",
                activeStep === 2 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8 pointer-events-none"
              )}
            >
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <Typography variant="h3" as="h3" className="text-lg font-semibold">Riwayat</Typography>
                  <Typography variant="caption" as="p" className="text-xs text-muted-foreground">Catatan lengkap</Typography>
                </div>

                <div className="space-y-3">
                  {/* Timeline */}
                  <div className="relative pl-6">
                    <div className="absolute left-2 top-2 bottom-2 w-px bg-gradient-to-b from-accent-gold via-accent-gold/50 to-transparent" />

                    <div className="space-y-4">
                      <div className="relative">
                        <div className="absolute -left-[18px] top-1 w-2 h-2 rounded-full bg-accent-gold" />
                        <div className="bg-muted/50 backdrop-blur-sm rounded-xl p-3 border border-border/50">
                          <div className="text-xs text-muted-foreground">15 Jan 2024, 10:30</div>
                          <div className="text-sm font-medium mt-1">Pembelian</div>
                          <div className="text-xs text-muted-foreground">Rp 5.250.000</div>
                        </div>
                      </div>

                      <div className="relative">
                        <div className="absolute -left-[18px] top-1 w-2 h-2 rounded-full bg-accent-gold/60" />
                        <div className="bg-muted/50 backdrop-blur-sm rounded-xl p-3 border border-border/50">
                          <div className="text-xs text-muted-foreground">20 Jan 2024, 09:00</div>
                          <div className="text-sm font-medium mt-1">Update market</div>
                          <div className="text-xs text-muted-foreground">Rp 5.320.000</div>
                        </div>
                      </div>

                      <div className="relative">
                        <div className="absolute -left-[18px] top-1 w-2 h-2 rounded-full bg-accent-gold/40" />
                        <div className="bg-muted/50 backdrop-blur-sm rounded-xl p-3 border border-border/50">
                          <div className="text-xs text-muted-foreground">25 Jan 2024, 14:15</div>
                          <div className="text-sm font-medium mt-1">Update market</div>
                          <div className="text-xs text-muted-foreground">Rp 5.450.000</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Glow effect */}
      <div className="absolute -inset-4 bg-accent-gold/10 blur-3xl rounded-full -z-10 opacity-50" />
    </div>
  )
}
