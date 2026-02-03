# Feature Specification — Buyback Simulation

## Overview

Buyback Simulation adalah fitur untuk mensimulasikan nilai jual kembali (buyback) emas yang dimiliki user **tanpa memodifikasi data holding asli**.

Fitur ini bersifat **read-only & ephemeral**:

- Tidak menyimpan transaksi
- Tidak mengubah portfolio
- Digunakan untuk analisis dan perencanaan

---

## Goals

- Memberikan estimasi nilai buyback real-time berdasarkan harga **GoldDailyClose (BUYBACK)**
- Menghitung PnL total dan per-item
- Mendukung simulasi parsial (jual sebagian gram)

---

## Non-Goals

- Eksekusi transaksi jual
- Penyimpanan hasil simulasi
- Integrasi payment / settlement

---

## Entry Point

- CTA dari Holdings Page:
  - Button: **"Simulate Buyback"**
  - Redirect ke `/buyback-simulation`
  - Default behavior: semua holding aktif otomatis ter-select

---

## Page Structure

### 1. Header Summary (Sticky)

Menampilkan agregasi dari seluruh item yang dipilih.

Fields:

- Selected Holdings Count
- Total Estimated Buyback Value
- Total Cost Basis
- Total PnL (absolute & percentage)

Actions:

- Reset Selection
- Export (optional, future)

---

### 2. Holdings Selector (Paginated)

Daftar holdings user (sama seperti holdings page) dengan kemampuan seleksi.

Per Row:

- Checkbox (select / deselect)
- Brand Name
- Denomination (gram)
- Quantity owned
- Buy Price (cost basis)
- Current Buyback Price (from GoldDailyClose)
- Quantity to sell (editable, default = full quantity)

Rules:

- Pagination does NOT reset selection
- Quantity to sell must be:
  - > 0
  - <= quantity owned
- Deselected item tidak dihitung di summary

---

### 3. Simulation Breakdown Panel

Menampilkan detail per holding yang disimulasikan.

Per Item:

- Brand
- Gram sold
- Buyback Price
- Total Buyback Value
- Cost Basis
- PnL (value & %)

Optional:

- Group by brand
- Collapsible sections

---

## Data Source & Pricing Rules

### Price Source

- Buyback price diambil dari:
  - `GoldDailyClose`
  - `priceType = BUYBACK`
  - `closeDate = today (or latest available <= today)`

### No Price Case

Jika tidak ada daily close hari ini:

- Gunakan latest available close sebelumnya
- Tidak melakukan extrapolation

---

## Calculation Rules

### Cost Basis

cost = buyPrice * quantity_to_sell

### Buyback Value

buyback_value = buyback_daily_close_price * quantity_to_sell

### PnL

PnL = buyback_value - cost
PnL% = (PnL / cost) * 100

### Total Aggregation

- Semua kalkulasi dilakukan **setelah pagination**
- Berdasarkan seluruh item ter-select

---

## State Management

### Read-only Source

- PortfolioHolding (immutable)

### Simulation State (Ephemeral)

BuybackSimulationState {
selectedHoldingIds: string[]
quantityOverrideByHoldingId: Record<string, number>
computedSummary: {
totalCost
totalBuyback
totalPnL
}
}

Rules:

- Tidak ada mutation ke database
- State reset ketika user keluar page

---

## UX Rules

- Tidak ada auto-save
- Semua perubahan bersifat lokal
- Perubahan quantity langsung update summary
- Negative PnL ditampilkan dengan visual merah

---

## Error Handling

- Quantity invalid → inline validation
- Missing price → tampilkan warning badge
- Empty selection → summary = 0, empty state message

---

## Performance Considerations

- Fetch GoldDailyClose in batch (by brand + denomination)
- Hindari per-row API call
- Cache daily close per session

---

## Future Extensions (Out of Scope)

- Export PDF / CSV
- Compare SELL vs BUYBACK spread
- Historical buyback simulation
- Real transaction execution

---

## Acceptance Criteria

- Simulasi tidak mengubah data holdings
- Pagination tidak mempengaruhi hasil agregasi
- Harga selalu berasal dari GoldDailyClose
- PnL sesuai perhitungan spesifikasi
