# MediStock

MediStock adalah sistem manajemen farmasi dan inventaris obat yang dibangun dengan frontend Nuxt 3, backend Go, dan Supabase. Aplikasi ini dirancang untuk membantu pengelolaan stok obat, transaksi keluar-masuk, kartu stok digital, laporan operasional, serta autentikasi berbasis peran untuk Admin dan Staf Farmasi.

## Ringkasan

- Frontend modern berbasis Nuxt 3 dengan Supabase Auth
- Backend REST API berbasis Go dan Gin
- Database utama PostgreSQL Supabase, dengan fallback SQLite untuk pengembangan lokal
- Dashboard operasional dengan grafik, metrik, dan notifikasi stok
- Navigasi responsif dengan sidebar yang bisa dibuka dan ditutup

## Fitur Utama

### Manajemen Master Data
Mengelola data obat dan alat kesehatan, termasuk nama barang, kategori, batch, harga, stok, dan tanggal kedaluwarsa.

### Transaksi Barang Masuk dan Keluar
Mencatat restok dari supplier dan distribusi barang keluar dengan pembaruan stok otomatis.

### Kartu Stok Digital
Menampilkan histori mutasi barang agar audit dan pelacakan stok lebih mudah.

### Smart Alerts
Memberikan peringatan untuk stok minimum dan barang yang mendekati tanggal kedaluwarsa.

### Dashboard Analitik
Menyediakan visualisasi data seperti tren stok, distribusi kategori, peran pengguna, supplier, dan indikator operasional lain.

### Autentikasi dan Otorisasi
Login menggunakan Supabase Auth dengan pembagian akses berbasis peran:
- Admin: akses penuh
- Staf Farmasi: akses operasional inventaris

## Arsitektur

- `frontend/` menggunakan Nuxt 3 sebagai SPA, Supabase Auth, dan ApexCharts untuk visualisasi.
- `backend/` menyediakan REST API dengan Gin dan GORM.
- `Supabase` digunakan sebagai sumber autentikasi dan database PostgreSQL utama.
- Jika koneksi PostgreSQL belum tersedia, backend otomatis memakai SQLite lokal untuk development.

## Tech Stack

| Komponen | Teknologi |
|---|---|
| Frontend | Nuxt 3, Vue 3, Supabase, ApexCharts |
| Backend | Go, Gin, GORM |
| Database | Supabase PostgreSQL, SQLite fallback |
| UI Icons | lucide-vue-next |

## Struktur Proyek

- `frontend/` - Aplikasi utama user interface
- `backend/` - REST API dan akses database
- `docs/` - Dokumentasi fitur dan catatan proyek

## Prasyarat

- Node.js 18+ 
- npm
- Go 1.25+
- Akun Supabase dan project aktif

## Instalasi

### 1. Frontend
Masuk ke folder frontend dan install dependensi:

```bash
cd frontend
npm install
```

Jalankan mode development:

```bash
npm run dev
```

### 2. Backend
Masuk ke folder backend dan install dependensi Go:

```bash
cd backend
go mod tidy
```

Jalankan server backend:

```bash
go run .
```

## Variabel Environment

### Frontend
Buat file `.env` di folder `frontend/` dan isi kredensial Supabase:

```env
SUPABASE_URL=your-supabase-project-url
SUPABASE_KEY=your-supabase-anon-key
```

### Backend
Backend akan memakai PostgreSQL Supabase jika salah satu konfigurasi berikut tersedia:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/postgres?sslmode=require
```

atau pecahan koneksi berikut:

```env
SUPABASE_DB_HOST=your-host
SUPABASE_DB_PORT=5432
SUPABASE_DB_NAME=postgres
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=your-password
```

Jika tidak ada konfigurasi database yang tersedia, backend akan fallback ke SQLite lokal dengan file `medistock.db`.

## API Utama

Backend saat ini menyediakan endpoint inti berikut:

- `GET /ping`
- `GET /api/items`
- `GET /api/items/:id`
- `POST /api/items`
- `PUT /api/items/:id`
- `DELETE /api/items/:id`
- `POST /api/transactions`
- `GET /api/ledger`
- `GET /api/dashboard/stats`

## Catatan Implementasi

- Frontend sudah disusun agar bekerja sebagai single-page experience dengan middleware autentikasi.
- Sidebar aplikasi mendukung mode buka/tutup untuk desktop dan mobile.
- Beberapa halaman utama sudah menyesuaikan kontrak API yang dipaginasi.
- Backend mengutamakan koneksi PostgreSQL Supabase, tetapi tetap aman untuk pengembangan lokal menggunakan SQLite.

## Dokumentasi Tambahan

- [Fitur dan tujuan proyek](docs/features_overview.md)

## Lisensi

Proyek ini dibuat untuk kebutuhan pengembangan internal dan demonstrasi sistem. Silakan sesuaikan bagian lisensi bila proyek akan dipublikasikan secara formal.
