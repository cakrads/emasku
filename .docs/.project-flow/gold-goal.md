# Emasku – Feature Specification
## Goal (Tujuan Emas)

---

## 1. Objective

Fitur Goal memungkinkan user untuk:

- Mengaitkan kepemilikan emas dengan tujuan finansial tertentu
- Melihat progres pencapaian berdasarkan nilai emas terkini
- Mengelompokkan holdings berdasarkan tujuan
- Mendapat insight berbasis target, bukan hanya total portfolio

---

## 2. Scope

### Included (V1)

- CRUD Goal
- 1 Holding hanya dapat memiliki 1 Goal (nullable)
- Filter holdings berdasarkan goal
- Tampilkan progress goal
- Summary total nilai emas per goal
- Goal bersifat optional

### Excluded (Future)

- Many-to-many allocation
- Split berdasarkan percentage
- Auto rebalancing
- Reminder deadline
- Notifikasi target tercapai
- Sharing goal

---

## 3. Domain Model

### Goal Entity

- id: uuid
- user_id: uuid
- name: string (required)
- description: string (optional)
- target_amount: number (optional)
- target_date: date (optional)
- created_at: timestamp
- updated_at: timestamp

### Holding Update

Tambahan field pada Holding:

- goal_id: uuid (nullable)

Constraint:
- goal.user_id harus sama dengan holding.user_id

---

## 4. Database Rules

- goal_id boleh null
- Tidak boleh delete goal jika masih ada holding terhubung (restrict delete)
- User harus remove relasi terlebih dahulu sebelum delete goal
- Tidak boleh ada cross-user goal assignment

---

## 5. Business Logic

### Goal Progress Calculation

Jika target_amount tersedia:

progress_percentage = (total_current_value / target_amount) * 100

Jika target_amount tidak tersedia:

- Progress tidak ditampilkan
- Hanya tampil total nilai emas

### Total Goal Value

total_goal_value = SUM(current_value dari holdings dengan goal_id tertentu)

current_value dihitung dari:

berat_emas * harga_emas_terkini

---

## 6. User Flow

### Create Goal

1. User klik "Tambah Tujuan"
2. Isi nama (required)
3. Isi target nominal (optional)
4. Isi target tanggal (optional)
5. Isi deskripsi (optional)
6. Simpan

### Add / Edit Holding

- Form memiliki field Goal (dropdown)
- Bisa pilih goal yang sudah ada
- Bisa kosong
- Tidak wajib

---

## 7. UI Behavior

### Dashboard

Tambahkan section “Tujuan Saya”

Setiap item menampilkan:

- Nama goal
- Target (jika ada)
- Current value
- Progress bar (jika ada target)

### Holdings List

- Jika holding memiliki goal, tampilkan badge kecil
- Jika tidak memiliki goal, tidak tampil apa pun

Contoh tampilan:

Antam 5g  
Rp 5.200.000  
Dana Nikah  

### Holding Detail

Wajib tampilkan:

- Goal name
- Target amount
- Current contribution
- Progress percentage

---

## 8. Edge Cases

- Goal tanpa target_amount → tidak ada progress %
- Goal tercapai → tampilkan status “Target Tercapai”
- Harga emas turun → progress bisa turun
- Goal tidak bisa dihapus jika masih memiliki holding

---

## 9. Design Decision Summary (V1)

- Goal bersifat optional
- 1 holding maksimal 1 goal
- Tidak ada split allocation
- Progress dihitung dari current value (mark-to-market)
- Target nominal dan target tanggal optional
- Tidak ada auto-notification di V1
