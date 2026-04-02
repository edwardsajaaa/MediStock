# Penjelasan Fitur dan Tujuan Proyek MediStock

Dokumen ini berisi rincian fitur-fitur yang akan dibangun pada proyek MediStock, beserta penjelasan fungsional (untuk apa fitur tersebut dibuat) sebagai panduan untuk perancangan sistem (Arsitektur & Logika Bisnis).

---

## 1. Manajemen Master Data (Obat & Alat Kesehatan)
**Deskripsi Fitur:**  
Modul untuk melakukan input dan pengelolaan katalog barang. Mencakup data esensial seperti nama, harga (beli & jual), kategori (obat bebas, obat resep, alkes), nomor *batch* produksi, dan tanggal kadaluarsa. Sistem ini mendukung metode perhitungan FEFO (*First Expired First Out*).

**Tujuan (Kenapa ini penting?):**
- **Sentralisasi Data:** Menjadi pondasi seluruh transaksi. Tanpa master data yang valid, transaksi tidak bisa dilakukan.
- **Penerapan FEFO:** Menghindari kerugian rumah sakit/apotek akibat obat *expired* yang tidak terjual. Sistem akan memprioritaskan stok dengan tanggal kadaluarsa terdekat untuk dikeluarkan terlebih dulu.
- **Keamanan Pasien:** Mencegah insiden bahaya pemberian obat kadaluarsa kepada pasien.

## 2. Tracking Transaksi & Distribusi (In/Out)
**Deskripsi Fitur:**
Pencatatan keluar-masuknya barang dari gudang. 
- **Barang Masuk:** Mencatat restok/pembelian dari *supplier*.
- **Barang Keluar:** Pengurangan stok otomatis berdasarkan validasi resep dokter maupun penjualan *over-the-counter* (langsung).

**Tujuan (Kenapa ini penting?):**
- **Akurasi Stok Real-time:** Menjaga sinkronisasi antara stok yang ada di database dengan fisik di rak tanpa harus terus-menerus melakukan opname harian.
- **Mencegah Fraud & Human Error:** Proses yang terekam dengan jelas meminimalisir barang hilang atau salah hitung.

## 3. Kartu Stok Digital
**Deskripsi Fitur:**
Buku besar/histori (*ledger*) yang mencatat setiap mutasi (pergerakan) barang. Fitur ini merekam detail kapan masuk, kapan keluar, berapa jumlahnya, serta untuk keperluan apa mutasi terjadi (beserta *batch* barang yang terpakai).

**Tujuan (Kenapa ini penting?):**
- **Audit & Investigasi:** Jika saat *stock opname* (penghitungan stok berkala) ditemukan selisih barang, pengelola dapat melacak riwayat dari Kartu Stok untuk melihat rekam jejak barang tersebut.
- **Transparansi Operasional:** Semua terekam digital tanpa bisa dimodifikasi tanpa meninggalkan jejak historis.

## 4. Sistem Pengingat Cerdas (*Smart Alerts*)
**Deskripsi Fitur:**
Sistem notifikasi otomatis proaktif untuk 2 kondisi:
- **Low Stock Alert:** Terpicu ketika jumlah/kuantitas suatu obat turun hingga batas minimum (*Reorder Point* / titik pemesanan ulang).
- **Expiry Alert:** Muncul ketika ada *batch* obat yang masa kadaluarsanya tinggal menghitung waktu (misal: 3 atau 6 bulan sebelum kadaluarsa).

**Tujuan (Kenapa ini penting?):**
- **Preventif Kekosongan:** Mencegah pelayanan kesehatan terganggu karena obat *life-saving* kehabisan tiba-tiba.
- **Minimalisasi *Waste*:** Memungkinkan apotek meretur barang ke PBF (Pedagang Besar Farmasi) atau merencanakan promo sebelum barang tersebut benar-benar rusak/kadaluarsa.

## 5. Laporan & Analitik (*Reporting Dashboard*)
**Deskripsi Fitur:**
Layar antarmuka visual berupa statistik dan grafik. Mampu mencetak laporan rekap harian, mingguan, bulanan, dan menampilkan *insight* operasional seperti "Obat Paling Laku/Sering Diresepkan" (*fast-moving*).

**Tujuan (Kenapa ini penting?):**
- **Bantuan Pengambilan Keputusan (*Decision Support System*):** Membantu manajer / *owner* apotek meneliti inventaris mana yang paling menguntungkan.
- **Efisiensi Manajemen:** Merampingkan birokrasi penyusunan laporan tertulis yang manual menjadi laporan instan berbasis sistem.
