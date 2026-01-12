export default {
  common: {
    language: 'Bahasa',
    darkMode: 'Mode Gelap',
    profile: 'Profil',
    logout: 'Keluar',
    login: 'Masuk',
    guest: 'Tamu',
    cancel: 'Batal',
    confirm: 'Ya, Lanjutkan',
    delete: 'Hapus',
    save: 'Simpan',
    account: 'Akun',
    exporting: 'Mengunduh...',
    export: 'Ekspor',
    error: 'Error',
    errorTitle: 'Kesalahan',
    pickDate: 'Pilih tanggal',
    saveChanges: 'Simpan Perubahan',
    saving: 'Menyimpan...',
    home: 'Beranda',
  },
  profile: {
    title: 'Profil',
    preferences: 'Preferensi',
    privacy: 'Privasi & Data (UU PDP)',
    exportData: 'Ekspor Data',
    exportDesc: 'Unduh semua data investasi dan profil Anda (JSON).',
    privacyPolicy: 'Kebijakan Privasi',
    privacyDesc: 'Pelajari bagaimana kami melindungi data Anda.',
    deleteAccount: 'Hapus Akun',
    deleteDesc: 'Hapus permanen akun dan semua data investasi Anda.',
    temporaryAccount: 'Akun Sementara',
    joined: 'Bergabung sejak',
    justNow: 'Baru saja',
    deleteDialogTitle: 'Hapus Akun Permanen?',
    deleteDialogDesc: 'Tindakan ini tidak dapat dibatalkan. Semua data portofolio, riwayat transaksi, dan informasi profil Anda akan dihapus secara permanen dari server kami sesuai dengan hak penghapusan UU PDP.',
    deleteConfirm: 'Ya, Hapus Permanen',
    messages: {
      deleteSuccess: 'Akun dan data Anda telah dihapus',
      deleteError: 'Gagal menghapus akun',
      exportSuccess: 'Data berhasil diunduh',
      exportError: 'Gagal mengunduh data',
    }
  },
  navbar: {
    dashboard: 'Dasbor',
    prices: 'Harga',
    holdings: 'Portofolio',
    add: 'Tambah',
    profile: 'Profil',
  },
  logout: {
    title: 'Apakah Anda yakin ingin keluar?',
    description: 'Anda perlu masuk kembali untuk mengakses portofolio Anda.',
    cancel: 'Batal',
    confirm: 'Keluar',
  },
  errorBoundary: {
    title: 'Terjadi kesalahan',
    description: 'Terjadi kesalahan yang tidak terduga. Silakan coba segarkan halaman.',
    refresh: 'Segarkan Halaman',
    devTitle: 'Detail kesalahan (dev only)',
  },
  login: {
    title: 'Selamat Datang',
    subtitle: 'Masuk untuk melacak portofolio emas Anda',
    privacyConsent: 'Saya menyetujui Kebijakan Privasi',
    privacyDescription: 'Saya memberikan izin kepada Emasku untuk memproses data pribadi saya sesuai dengan {link}',
    privacyLink: 'Kebijakan Privasi UU PDP',
    googleLogin: 'Masuk dengan Google',
    guestLogin: 'Lanjutkan sebagai Tamu',
    or: 'atau',
    securityTitle: 'Jaminan Keamanan',
    securityDesc: 'Data Anda aman dan rahasia. Kami tidak pernah membagikan data pribadi Anda kepada pihak ketiga tanpa izin Anda.',
    tagline: 'Emasku - Pencatat Investasi Emas Anda',
    error: {
      consentRequired: 'Anda harus menyetujui Kebijakan Privasi untuk melanjutkan.',
    },
  },
  privacy: {
    title: 'Kebijakan Privasi',
    subtitle: 'Komitmen kami untuk melindungi data pribadi Anda sesuai dengan standar UU PDP Indonesia.',
    back: 'Kembali',
    lastUpdated: 'Terakhir diperbarui: {date}',
    demoAlert: {
      title: 'Proyek Pembelajaran (Demo Only)',
      description: 'Aplikasi Emasku saat ini masih dalam tahap pengembangan dan digunakan khusus untuk tujuan pembelajaran. Layanan ini belum siap untuk penggunaan produksi secara publik. Jangan gunakan data asli atau sensitif di dalam aplikasi ini.',
    },
    intro: 'PT Emasku Finansial Digital ("Emasku", "kami") berkomitmen untuk melindungi privasi dan keamanan data pribadi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data Anda sesuai dengan Undang-Undang No. 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP).',
    securityGuarantee: {
      title: 'Jaminan Keamanan',
      description: 'Dengan menggunakan layanan Emasku, Anda menyetujui pengumpulan dan penggunaan informasi sesuai dengan kebijakan ini. Kami menjamin bahwa data Anda tidak akan dijual kepada pihak ketiga tanpa persetujuan eksplisit Anda.',
    },
    sections: {
      collectedData: {
        title: 'Data yang Kami Kumpulkan',
        identity: {
          title: 'Identitas',
          items: ['Nama lengkap', 'Alamat email', 'Foto profil (OAuth)', 'ID Pengguna'],
        },
        financial: {
          title: 'Finansial',
          items: ['Riwayat emas', 'Jumlah aset', 'Harga beli', 'Catatan portofolio'],
        },
        technical: {
          title: 'Teknis',
          items: ['Alamat IP', 'Browser & OS', 'Log akses', 'Sesi aktif'],
        },
      },
      purpose: {
        title: 'Tujuan Pemrosesan Data',
        items: [
          'Penyediaan layanan pelacakan portofolio',
          'Keamanan akun dan verifikasi identitas',
          'Analitik kinerja investasi personal',
          'Kepatuhan regulasi keuangan Indonesia',
          'Pencegahan penipuan dan penyalahgunaan',
        ],
      },
      rights: {
        title: 'Hak-Hak Anda (Sesuai UU PDP)',
        access: {
          title: 'Hak Akses',
          description: 'Meminta salinan data pribadi yang kami simpan tentang Anda.',
        },
        correction: {
          title: 'Hak Koreksi',
          description: 'Meminta perbaikan data yang tidak akurat atau tidak lengkap.',
        },
        deletion: {
          title: 'Hak Penghapusan',
          description: 'Menghapus akun dan data permanen (Hak untuk Dilupakan).',
        },
        withdrawal: {
          title: 'Hak Penarikan',
          description: 'Membatalkan izin pemrosesan data pribadi Anda kapan saja.',
        },
        note: 'Gunakan hak Anda melalui menu Profil > Privasi & Data di dalam aplikasi Emasku.',
      },
      retention: {
        title: 'Penyimpanan & Keamanan',
        description: 'Data transaksi disimpan minimal 5 tahun sesuai regulasi OJK & PP No. 71/2019. Kami menggunakan enkripsi AES-256 dan protokol TLS 1.3 untuk menjamin keamanan data Anda dari akses yang tidak sah.',
      },
      contact: {
        title: 'Layanan Pengaduan Konsumen',
        privacyTeam: 'Tim Privasi Emasku',
        dpo: 'Petugas Perlindungan Data (DPO)',
        location: 'Jakarta, Indonesia',
        processingTime: 'Aduan Anda akan diproses dalam waktu maksimal 3x24 jam kerja sesuai dengan Prosedur Operasional Standar (SOP) Penanganan Keluhan UU PDP kami.',
      },
    },
  },
  dashboard: {
    portfolioValue: 'Portofolio Emas',
    unableToCalculate: 'Belum bisa hitung total',
    allTime: 'sepanjang waktu',
    today: 'hari ini',
    excludedHoldings: 'holding dikecualikan dari total',
    marketToday: 'Pasar Hari Ini',
    viewAllPrices: 'Lihat Semua Harga',
    holdings: 'Emas Saya',
    byBrand: 'Per Brand',
    performance: 'Performa',
    last7Days: '7 hari terakhir',
    chartEmpty: 'Grafik pergerakan nilai akan muncul setelah kamu menambahkan emas',
    emptyPortfolio: 'Belum ada emas di portofoliomu',
    emptyPortfolioDesc: 'Tambahkan emas pertamamu untuk mulai memantau nilai dan pergerakannya',
    checkGoldPrice: 'Lihat Harga Emas Hari Ini',
    brandBreakdownEmptyDesc: 'Setiap emas yang kamu input akan dikelompokkan otomatis berdasarkan brand',
    lastUpdated: 'Diperbarui',
    addGoldHolding: 'Tambah Emas',
    valuationTooltip: {
      buyback: 'Harga buyback resmi dari brand',
      spot: 'Harga referensi pasar (bukan resmi)',
      user: 'Berdasarkan harga beli Anda',
      mixed: 'Sumber valuasi campuran (Resmi + Pasar)',
      none: 'Harga pasar tidak tersedia',
    },
  },
  prices: {
    title: 'Harga Emas Hari Ini',
    description: 'Monitor harga emas berdasarkan merek dan berat',
    table: {
      weight: 'Berat',
      sell: 'Harga Jual',
      buyback: 'Harga Buyback',
    },
    viewHistory: 'Lihat Riwayat Harga',
  },
  priceHistory: {
    title: 'Riwayat Harga ANTAM',
    description: 'SPOT · 1 gram · IDR',
    breadcrumbs: {
      history: 'Riwayat',
    },
    referenceNote: 'Harga referensi saja. Tidak dipersonalisasi. Mulai tanggal: {date}',
  },
  holdings: {
    title: 'Emas Saya',
    description: 'Detail lengkap investasi emas Anda',
    addHolding: 'Tambah Emas Baru',
    filters: {
      status: 'Status:',
      brand: 'Merek:',
      sort: 'Urutkan:',
      options: {
        active: 'Aktif',
        sold: 'Terjual',
        all: 'Semua',
        allBrands: 'Semua Merek',
        date: 'Tanggal',
        value: 'Nilai',
        newest: 'Terbaru',
        oldest: 'Terlama',
      }
    },
    table: {
      date: 'Tanggal',
      weight: 'Berat',
      buyPrice: 'Harga Beli',
      currentValue: 'Nilai Sekarang',
      pnl: 'Untung/Rugi',
      empty: 'Tidak ada emas ditemukan',
    },
    emptyState: {
      title: 'Kamu belum memiliki emas',
      description: 'Mulai lacak investasi emasmu dengan menambahkan holding pertama. Kamu bisa melacak nilai, pergerakan, dan performa portofolio secara real-time.',
      action: 'Tambah Emas Pertama',
      secondaryAction: 'Atau lihat harga emas hari ini',
    }
  },
  addHolding: {
    title: 'Tambah Emas',
    breadcrumbs: {
      add: 'Tambah'
    },
    steps: {
      brand: 'Pilih Brand',
      details: 'Detail Emas',
      review: 'Tinjauan',
    },
    brandSelection: {
      title: 'Pilih Brand',
      subtitle: 'Brand apa yang memproduksi emas ini?',
      brandName: 'Nama Brand',
      customBrand: {
        title: 'Brand Kustom',
        subtitle: 'Masukkan nama brand atau produsen.',
        placeholder: 'Contoh: Cincin Nenek',
        button: 'Brand saya tidak terdaftar (Kustom)',
        warning: 'Kami akan menyimpan detail emas Anda, tetapi <strong>kami tidak dapat menyediakan valuasi pasar</strong> untuk brand kustom atau yang tidak terdaftar.',
        back: 'Kembali ke daftar'
      }
    },
    details: {
      title: 'Detail Emas',
      subtitle: 'Masukkan berat emas Anda.',
      weight: 'Berat (gram)',
      otherWeight: 'Gunakan Berat Lainnya',
      quantity: 'Jumlah',
      weightHelp: '“Berat dimasukkan manual karena merek tidak tersedia”',
      marketWeightHelp: 'Pilih berat yang sesuai dengan emas Anda.',
      purchaseHistory: 'Riwayat Pembelian',
      purchasePrice: 'Harga Beli (per gram)',
      priceHelp: 'Harga yang Anda bayar untuk setiap 1 gram emas.',
      purchaseDate: 'Tanggal Beli / Estimasi',
      notes: 'Catatan',
      notesPlaceholder: 'Catatan opsional...',
      steps: {
        weight: 'Pilih Berat',
      },
    },
    review: {
      title: 'Tinjauan & Konfirmasi',
      subtitle: 'Mohon periksa detail di bawah ini.',
      totalCost: 'Total Biaya',
      currentValue: 'Estimasi Nilai Saat Ini',
      valuationNote: 'Berdasarkan harga buyback resmi hari ini. Nilai ini berfluktuasi mengikuti pasar.',
      customNote: 'Valuasi pasar tidak tersedia untuk brand kustom.',
      customBrandLabel: '(Brand Kustom)',
    },
    actions: {
      continue: 'Lanjut',
      save: 'Simpan',
      back: 'Kembali',
    },
    messages: {
      success: 'Emas berhasil disimpan!',
      successDetail: '{weight}g {brand} telah ditambahkan ke portofolio Anda.',
      error: 'Gagal menyimpan emas',
      validationError: 'Validasi Gagal',
      missingFields: 'Data tidak lengkap',
      missingFieldsDetail: 'Mohon isi brand dan berat emas.',
    }
  },
  holdingDetail: {
    title: 'Detail Emas',
    subtitle: 'Detail emas batangan dan performa',
    breadcrumbs: {
      detail: 'Detail'
    },
    currentValue: {
      title: 'Nilai Saat Ini',
    },
    purchaseDetails: {
      title: 'Detail Pembelian',
      purchaseDate: 'Tanggal Beli',
      weight: 'Berat',
      buyPricePerGram: 'Harga Beli (per gram)',
      totalBuyValue: 'Total Nilai Beli',
      status: 'Status',
      sold: 'TERJUAL',
      notes: 'Catatan',
    },
    valuation: {
      title: 'Valuasi Saat Ini',
      missingTitle: 'Nilai tidak tersedia',
      missingDesc: 'Perhitungan tidak tersedia karena harga belum diberikan.',
      currentPricePerGram: 'Harga Saat Ini (per gram)',
      totalCurrentValue: 'Total Nilai Saat Ini',
      pnl: 'Untung/Rugi',
    },
    actions: {
      markAsSold: 'Tandai Terjual',
      edit: 'Ubah',
    },
    dialog: {
      markAsSold: {
        title: 'Tandai emas sebagai terjual?',
        description: 'Ini akan menandai emas ini sebagai TERJUAL. Item akan tetap ada di riwayat Anda tetapi akan dikeluarkan dari nilai portofolio aktif.',
        cancel: 'Batal',
        confirm: 'Ya, tandai terjual',
        confirming: 'Memproses...',
      }
    },
    messages: {
      soldSuccess: 'Emas berhasil dijual!',
      soldDetail: 'Emas telah dihapus dari portofolio aktif Anda.',
      deleteError: 'Gagal menghapus emas',
    }
  },
  editHolding: {
    title: 'Ubah Data Emas',
    breadcrumbs: {
      edit: 'Ubah'
    },
    brand: {
      label: 'Brand',
      locked: 'Brand tidak dapat diubah.',
    },
    form: {
      weight: 'Berat (g)',
      buyPrice: 'Harga Beli (Total IDR)',
      purchaseDate: 'Tanggal Beli',
      notes: 'Catatan',
      notesPlaceholder: 'Catatan tambahan...',
    },
    actions: {
      cancel: 'Batal',
      save: 'Simpan Perubahan',
      saving: 'Menyimpan...',
    },
    messages: {
      success: 'Data emas berhasil diperbarui!',
      successDetail: 'Perubahan Anda telah disimpan.',
      validationError: 'Validasi Gagal',
      error: 'Gagal memperbarui data emas',
      missingWeight: 'Mohon isi berat emas.',
    }
  }
} as const;
