



# MediStock: Sistem Manajemen Farmasi & Inventaris Obat

![Vite Logo](https://vitejs.dev/logo.svg#center)
![Golang Logo](https://golang.org/lib/godoc/images/go-logo-blue.svg#center)

---

## Deskripsi Sistem
MediStock adalah aplikasi web profesional untuk digitalisasi dan otomasi manajemen stok obat serta alat kesehatan di instalasi farmasi. Sistem ini mengelola seluruh alur sediaan farmasi, mulai dari pencatatan barang masuk, pemantauan tanggal kadaluarsa (FEFO - First Expired First Out), hingga pelacakan distribusi barang keluar berdasarkan resep dokter. Data inventaris selalu akurat secara real-time, meminimalisir risiko kekosongan atau kerusakan stok.

## Arsitektur Implementasi
- **Frontend:** Vite + React — UI dashboard, tabel data, notifikasi, dan visualisasi statistik
- **Backend:** Golang (Gin/Fiber) — RESTful API, logika bisnis, routing, validasi transaksi, dan query database
- **Database:** Supabase (Managed PostgreSQL) — Penyimpanan data, integritas ACID, kolaborasi remote

### Alur Kerja
1. Barang Masuk: Supplier → Gudang Farmasi (input batch, tanggal kadaluarsa, harga, kategori)
2. Barang Keluar: Gudang → Resep Dokter/Penjualan (stok otomatis berkurang, validasi resep)
3. FEFO: Barang dengan tanggal kadaluarsa terdekat diprioritaskan keluar
4. Kartu Stok Digital: Mutasi barang tercatat otomatis
5. Smart Alerts: Dashboard menampilkan peringatan stok rendah dan kadaluarsa
6. Reporting: Laporan periodik dan dashboard visual statistik

## Fitur Utama
**1. Manajemen Master Data Obat & Alkes**
- Input stok awal, harga beli/jual, kategori (obat bebas, resep, alat kesehatan)
- Tracking batch dan tanggal kadaluarsa (FEFO)

**2. Tracking Transaksi & Distribusi**
- Pemasukan barang (restok dari supplier)
- Pengeluaran barang (berdasarkan resep dokter/penjualan langsung)
- Kartu stok digital: histori mutasi barang

**3. Sistem Pengingat Cerdas (Smart Alerts)**
- Low Stock Alert: Peringatan otomatis saat stok menyentuh batas minimum (Reorder Point)
- Expiry Alert: Notifikasi untuk barang mendekati kadaluarsa

**4. Laporan & Analitik (Reporting)**
- Generate laporan harian, mingguan, bulanan
- Dashboard visual: statistik operasional, obat paling sering diresepkan

## Tech Stack

| Logo | Teknologi |
|------|-----------|
| ![Vite](https://vitejs.dev/logo.svg) | Vite |
| ![React](https://raw.githubusercontent.com/reactjs/reactjs.org/main/src/icons/logo.svg) | React |
| ![Golang](https://golang.org/lib/godoc/images/go-logo-blue.svg) | Golang |
| ![Supabase](https://raw.githubusercontent.com/supabase/supabase/master/web/public/images/supabase-logo.svg) | Supabase |
| ![PostgreSQL](https://www.postgresql.org/media/img/about/press/elephant.png) | PostgreSQL |

- **Frontend:** Vite + React
- **Backend:** Golang (Gin/Fiber)
- **Database:** Supabase PostgreSQL (tanpa auto-API)

## Struktur Proyek
- `frontend/` — Kode UI/UX dashboard, tabel, notifikasi
- `backend/` — Kode REST API, logika bisnis, koneksi database

## Setup & Instalasi

### Frontend
1. Masuk ke folder `frontend`
2. Jalankan `npm create vite@latest` dan pilih React
3. Install dependensi: `npm install`
4. Jalankan: `npm run dev` untuk development

### Backend
1. Masuk ke folder `backend`
2. Inisialisasi Go module: `go mod init medistock`
3. Install Gin/Fiber:
	- Gin: `go get github.com/gin-gonic/gin`
	- Fiber: `go get github.com/gofiber/fiber/v2`
4. Setup koneksi ke Supabase PostgreSQL:
	- Dapatkan URL, user, password, dan database dari dashboard Supabase
	- Gunakan ORM seperti GORM untuk query
	- Contoh koneksi:
	  ```go
	  import (
			"gorm.io/driver/postgres"
			"gorm.io/gorm"
	  )
	  dsn := "host=... user=... password=... dbname=... port=... sslmode=disable"
	  db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	  ```

### Database
- Gunakan Supabase sebagai server PostgreSQL
- Backend terhubung langsung ke Supabase (tanpa auto-API)

## Alur Pengembangan
- Frontend konsumsi REST API dari backend
- Backend handle logika bisnis, validasi, dan query database
- Semua transaksi tercatat otomatis (mutasi, batch, kadaluarsa)

## Referensi & Dokumentasi
- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [Gin](https://gin-gonic.com/)
- [Fiber](https://docs.gofiber.io/)
- [Supabase](https://supabase.com/)
- [GORM](https://gorm.io/)

---

Silakan lanjutkan setup sesuai instruksi di atas. Jika membutuhkan contoh kode, struktur API, atau desain UI, silakan request.