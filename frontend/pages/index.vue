<template>
  <div class="landing">

    <!-- ===== HERO ===== -->
    <section class="hero">
      <img src="/img/pic1.jpg" alt="hero bg" class="hero-bg" />
      <div class="hero-overlay"></div>
      <div class="hero-inner">
        <div class="hero-content">
          <p class="hero-eyebrow">Sistem Manajemen Farmasi</p>
          <h1>Kelola farmasi Anda<br />dengan kecepatan<br /><span class="hero-accent">dan presisi.</span></h1>
          <p class="hero-desc">
            MediStock dirancang khusus untuk apotek dan rumah sakit. Inventaris akurat, transaksi langsung tercatat, dan peringatan cerdas dalam satu platform.
          </p>
          <div class="hero-actions">
            <NuxtLink to="/login" class="btn-primary">Masuk Sistem</NuxtLink>
            <a href="#how-it-works" class="btn-ghost">Lihat Cara Kerja</a>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== TRUST BAR ===== -->
    <section class="trust-bar">
      <span class="trust-label">Dipercaya oleh institusi kesehatan</span>
      <div class="trust-list">
        <div class="trust-item" v-for="t in trusts" :key="t">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
          {{ t }}
        </div>
      </div>
    </section>

    <!-- ===== FEATURES GRID ===== -->
    <section class="features-section">
      <div class="section-header">
        <h2>Fitur untuk setiap kebutuhan farmasi</h2>
        <p>Dari pencatatan hingga analitik, semua dalam satu sistem terintegrasi</p>
      </div>
      <div class="features-grid">
        <div class="feature-item" v-for="f in features" :key="f.label">
          <div class="feature-icon" v-html="f.svg"></div>
          <span class="feature-label">{{ f.label }}</span>
        </div>
      </div>
    </section>

    <!-- ===== HOW IT WORKS ===== -->
    <section class="how-section" id="how-it-works">
      <div class="section-header">
        <h2>Bagaimana cara kerjanya</h2>
        <p>Tiga langkah mudah untuk memulai</p>
      </div>
      <div class="how-grid">
        <div class="how-card" v-for="step in steps" :key="step.num">
          <div class="how-img-wrap">
            <img :src="step.img" :alt="step.title" />
            <span class="how-num">{{ step.num }}</span>
          </div>
          <div class="how-body">
            <h3>{{ step.title }}</h3>
            <p>{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== DARK BANNER ===== -->
    <section class="dark-banner">
      <div class="dark-banner-inner">
        <div>
          <h2>Wawasan mendalam tentang<br />stok farmasi Anda</h2>
          <p>Sistem FEFO otomatis memastikan obat yang mendekati kadaluarsa dikeluarkan terlebih dahulu, mencegah kerugian dan risiko medis.</p>
        </div>
        <div class="dark-actions">
          <NuxtLink to="/login" class="btn-accent">Mulai Sekarang</NuxtLink>
        </div>
      </div>
    </section>




    <!-- ===== FOOTER ===== -->
    <footer class="footer">
      <div class="footer-top">
        <div class="footer-brand">
          <img src="/img/Medistock.png" alt="MediStock" height="32" style="object-fit:contain; filter: brightness(0) invert(1);" />
          <p>Sistem manajemen farmasi modern untuk apotek, klinik, dan rumah sakit di Indonesia.</p>
        </div>
        <div class="footer-links">
          <div class="footer-col" v-for="col in footerLinks" :key="col.title">
            <h4>{{ col.title }}</h4>
            <a href="#" v-for="link in col.links" :key="link">{{ link }}</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 MediStock Inc. All rights reserved.</span>
        <div class="footer-legal">
          <a href="#">Syarat Penggunaan</a>
          <a href="#">Kebijakan Privasi</a>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup>
definePageMeta({ layout: 'landing' });

const trusts = [
  'RS Umum', 'Apotek 24 Jam', 'Klinik Spesialis', 'Puskesmas', 'Distributor Alkes', 'Poliklinik'
];

const checkSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;
const crossSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;

const features = [
  {
    label: 'Dashboard',
    svg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>`,
  },
  {
    label: 'Master Data',
    svg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>`,
  },
  {
    label: 'Transaksi Masuk',
    svg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>`,
  },
  {
    label: 'Transaksi Keluar',
    svg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>`,
  },
  {
    label: 'Kartu Stok Digital',
    svg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>`,
  },
  {
    label: 'Smart Alerts',
    svg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`,
  },
  {
    label: 'Laporan Visual',
    svg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>`,
  },
  {
    label: 'Stok Menipis',
    svg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>`,
  },
  {
    label: 'Kadaluarsa',
    svg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
  },
  {
    label: 'Manajemen Batch',
    svg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`,
  },
];

const steps = [
  {
    num: '01',
    img: '/img/pic1.jpg',
    title: 'Daftarkan item farmasi Anda',
    desc: 'Input data obat, kategori, batch, harga, dan tanggal kadaluarsa ke master data dengan mudah dan cepat.',
  },
  {
    num: '02',
    img: '/img/pic4.jpg',
    title: 'Catat setiap transaksi secara langsung',
    desc: 'Setiap mutasi barang masuk dan keluar tercatat otomatis dan sinkron dengan kartu stok digital.',
  },
  {
    num: '03',
    img: '/img/pic2.jpg',
    title: 'Pantau dan terima peringatan cerdas',
    desc: 'Sistem mendeteksi stok rendah dan mendekati kadaluarsa, lalu menampilkan Smart Alert secara proaktif.',
  },
];

const planBasic = [
  { text: 'Dashboard inventaris dasar', active: true },
  { text: 'Manajemen master data item', active: true },
  { text: 'Pencatatan transaksi keluar/masuk', active: true },
  { text: 'Kartu stok digital (ledger)', active: true },
  { text: 'Smart Alerts real-time', active: false },
  { text: 'Laporan dan analitik visual', active: false },
  { text: 'Export laporan PDF/Excel', active: false },
];

const planPro = [
  'Semua fitur Basic',
  'Smart Alerts stok rendah dan kadaluarsa',
  'Dashboard analitik lanjutan',
  'Laporan otomatis harian/bulanan',
  'Export PDF dan Excel',
  'Multi-user dan role management',
  'Prioritas FEFO otomatis',
];

const testimonials = [
  {
    initials: 'AR',
    name: 'Apt. Rina Andayani',
    role: 'Apoteker Utama, RS Budi Sehat',
    text: 'Sejak pakai MediStock, tidak ada lagi kejadian obat kadaluarsa terpakai. FEFO otomatisnya benar-benar menyelamatkan kami.',
  },
  {
    initials: 'DH',
    name: 'Dimas Haryanto',
    role: 'Staf Gudang, Apotek Farma Plus',
    text: 'Laporan harian yang dulu butuh dua jam manual, sekarang bisa langsung dilihat di dashboard dalam hitungan detik.',
  },
  {
    initials: 'SW',
    name: 'dr. Siti Wahyuni',
    role: 'Kepala Instalasi Farmasi, Puskesmas Mawar',
    text: 'Antarmukanya intuitif sekali. Staf kami yang baru pun bisa belajar pakai MediStock hanya dalam satu hari.',
  },
];

const footerLinks = [
  { title: 'Produk', links: ['Dashboard', 'Master Data', 'Transaksi', 'Kartu Stok', 'Smart Alerts', 'Laporan'] },
  { title: 'Perusahaan', links: ['Tentang Kami', 'Karir', 'Blog', 'Press Kit'] },
  { title: 'Dukungan', links: ['Pusat Bantuan', 'Hubungi Kami', 'FAQ', 'Status Sistem'] },
  { title: 'Hukum', links: ['Syarat Penggunaan', 'Kebijakan Privasi', 'Cookie', 'Lisensi'] },
];
</script>

<style scoped>
/* ===== BASE ===== */
.landing {
  font-family: 'Poppins', system-ui, sans-serif;
  font-weight: 300;
  color: #1e293b;
  background: #fff;
}

/* ===== HERO ===== */
.hero {
  position: relative;
  min-height: 92vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: #080f1a;
}

.hero-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 30%;
  opacity: 0.28;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(8,15,26,0.96) 40%, rgba(8,15,26,0.5) 100%);
}

.hero-inner {
  position: relative;
  z-index: 2;
  width: 100%;
  padding: 0 9%;
  max-width: 1400px;
  margin: 0 auto;
}

.hero-content {
  max-width: 620px;
}

.hero-eyebrow {
  font-size: 0.78rem;
  font-weight: 400;
  color: #4ade80;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
}

.hero-content h1 {
  font-size: 4rem;
  font-weight: 400;
  color: #fff;
  line-height: 1.08;
  margin-bottom: 1.75rem;
  letter-spacing: -0.03em;
}

.hero-accent { color: #4ade80; font-weight: 300; }

.hero-desc {
  font-size: 1.05rem;
  font-weight: 300;
  color: rgba(255,255,255,0.55);
  max-width: 460px;
  line-height: 1.8;
  margin-bottom: 2.5rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  padding: 0.9rem 2rem;
  background: #22c55e;
  color: #fff;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.92rem;
  text-decoration: none;
  transition: background 0.2s, transform 0.15s;
  font-family: 'Poppins', sans-serif;
}

.btn-primary:hover { background: #16a34a; transform: translateY(-1px); }

.btn-ghost {
  display: inline-flex;
  align-items: center;
  padding: 0.9rem 2rem;
  background: transparent;
  color: rgba(255,255,255,0.7);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 6px;
  font-weight: 400;
  font-size: 0.92rem;
  text-decoration: none;
  transition: border-color 0.2s, color 0.2s;
}

.btn-ghost:hover { border-color: rgba(255,255,255,0.5); color: #fff; }

/* ===== TRUST BAR ===== */
.trust-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2.5rem;
  padding: 1.25rem 9%;
  background: #f9fafb;
  border-bottom: 1px solid #f1f5f9;
  flex-wrap: wrap;
}

.trust-label {
  font-size: 0.75rem;
  font-weight: 400;
  color: #94a3b8;
  white-space: nowrap;
  text-align: center;
  letter-spacing: 0.04em;
}

.trust-list {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.trust-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  font-weight: 400;
  color: #64748b;
}

.trust-item svg { color: #22c55e; flex-shrink: 0; }

/* ===== SECTION HEADER ===== */
.section-header {
  text-align: center;
  margin-bottom: 3.5rem;
}

.section-header h2 {
  font-size: 1.9rem;
  font-weight: 400;
  color: #0f172a;
  margin-bottom: 0.6rem;
  letter-spacing: -0.015em;
}

.section-header p {
  font-size: 0.92rem;
  font-weight: 300;
  color: #94a3b8;
  max-width: 480px;
  margin: 0 auto;
  line-height: 1.75;
}

/* ===== FEATURES ===== */
.features-section {
  padding: 6rem 9%;
  background: #fff;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7rem;
  padding: 1.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.feature-item:hover {
  border-color: #22c55e;
  background: #f0fdf4;
}

.feature-icon { color: #475569; }
.feature-item:hover .feature-icon { color: #16a34a; }

.feature-label {
  font-size: 0.78rem;
  font-weight: 400;
  color: #64748b;
  text-align: center;
}

/* ===== HOW IT WORKS ===== */
.how-section {
  padding: 6rem 9%;
  background: #f9fafb;
}

.how-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.how-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  transition: transform 0.2s, box-shadow 0.2s;
}

.how-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(0,0,0,0.07);
}

.how-img-wrap {
  position: relative;
  height: 210px;
}

.how-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.how-num {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: #22c55e;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 500;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  letter-spacing: 0.08em;
}

.how-body { padding: 1.5rem; }

.how-body h3 {
  font-size: 0.92rem;
  font-weight: 500;
  color: #0f172a;
  margin-bottom: 0.6rem;
}

.how-body p {
  font-size: 0.83rem;
  font-weight: 300;
  color: #64748b;
  line-height: 1.7;
}

/* ===== DARK BANNER ===== */
.dark-banner {
  background: #080f1a;
  padding: 5rem 9%;
}

.dark-banner-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4rem;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
}

.dark-banner h2 {
  font-size: 2.1rem;
  font-weight: 400;
  color: #fff;
  margin-bottom: 1rem;
  line-height: 1.35;
  letter-spacing: -0.015em;
}

.dark-banner p {
  font-size: 0.92rem;
  font-weight: 300;
  color: rgba(255,255,255,0.5);
  max-width: 480px;
  line-height: 1.8;
}

.btn-accent {
  display: inline-flex;
  padding: 0.9rem 2.25rem;
  background: #22c55e;
  color: #fff;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.88rem;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.2s;
  font-family: 'Poppins', sans-serif;
}

.btn-accent:hover { background: #16a34a; }

/* ===== PLANS ===== */
.plans-section {
  padding: 6rem 9%;
  background: #fff;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  max-width: 880px;
  margin: 0 auto;
}

.plan-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 2.5rem;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
}

.plan-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.07);
}

.plan-card.plan-featured {
  border-color: #22c55e;
  background: #f0fdf4;
}

.plan-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #22c55e;
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.25rem 1rem;
  border-radius: 20px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.plan-card h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 0.4rem;
}

.plan-sub {
  font-size: 0.82rem;
  font-weight: 300;
  color: #64748b;
  margin-bottom: 2rem;
}

.plan-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  margin-bottom: 2.25rem;
}

.plan-list li {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.85rem;
  font-weight: 400;
  color: #374151;
}

.plan-list li.disabled { color: #cbd5e1; }

.plan-check { display: flex; flex-shrink: 0; }

.btn-outline-dark {
  display: block;
  text-align: center;
  padding: 0.85rem;
  border: 1.5px solid #0f172a;
  border-radius: 6px;
  color: #0f172a;
  font-weight: 600;
  font-size: 0.88rem;
  text-decoration: none;
  transition: background 0.2s;
  font-family: 'Poppins', sans-serif;
}

.btn-outline-dark:hover { background: #f8fafc; }

.plan-card .btn-primary {
  display: block;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
  padding: 0.85rem;
  font-size: 0.88rem;
}

.w-full { width: 100%; box-sizing: border-box; }

/* ===== TESTIMONIALS ===== */
.testi-section {
  padding: 6rem 9%;
  background: #f9fafb;
}

.testi-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.testi-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 2rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.testi-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(0,0,0,0.06);
}

.testi-stars {
  display: flex;
  gap: 2px;
  margin-bottom: 1.1rem;
}

.testi-text {
  font-size: 0.87rem;
  font-weight: 300;
  color: #374151;
  line-height: 1.75;
  margin-bottom: 1.5rem;
}

.testi-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.testi-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #22c55e, #0ea5e9);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.testi-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #0f172a;
}

.testi-role {
  font-size: 0.75rem;
  font-weight: 300;
  color: #94a3b8;
  margin-top: 1px;
}

/* ===== FINAL CTA ===== */
.final-cta {
  padding: 5rem 9%;
  background: #22c55e;
  text-align: center;
}

.final-cta h2 {
  font-size: 2.1rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 2.25rem;
  line-height: 1.35;
  letter-spacing: -0.02em;
}

.btn-white-cta {
  display: inline-block;
  padding: 1rem 2.75rem;
  background: #fff;
  color: #16a34a;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.92rem;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
  font-family: 'Poppins', sans-serif;
}

.btn-white-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

/* ===== FOOTER ===== */
.footer {
  background: #080f1a;
  color: #64748b;
  padding: 4.5rem 9% 2rem;
}

.footer-top {
  display: flex;
  gap: 5rem;
  padding-bottom: 3rem;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  flex-wrap: wrap;
}

.footer-brand {
  flex: 0 0 240px;
}

.footer-brand p {
  font-size: 0.8rem;
  font-weight: 300;
  line-height: 1.75;
  margin-top: 1.25rem;
  color: rgba(255,255,255,0.3);
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2.5rem;
  flex: 1;
}

.footer-col h4 {
  color: rgba(255,255,255,0.7);
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  letter-spacing: 0.04em;
}

.footer-col a {
  display: block;
  color: rgba(255,255,255,0.3);
  font-size: 0.78rem;
  font-weight: 300;
  text-decoration: none;
  margin-bottom: 0.6rem;
  transition: color 0.2s;
}

.footer-col a:hover { color: rgba(255,255,255,0.7); }

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  font-size: 0.75rem;
  font-weight: 300;
  color: rgba(255,255,255,0.2);
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-legal { display: flex; gap: 1.5rem; }
.footer-legal a { color: rgba(255,255,255,0.2); text-decoration: none; transition: color 0.2s; }
.footer-legal a:hover { color: rgba(255,255,255,0.6); }

/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
  .features-grid { grid-template-columns: repeat(3, 1fr); }
  .how-grid { grid-template-columns: repeat(2, 1fr); }
  .footer-links { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .hero-content h1 { font-size: 2.6rem; }
  .features-grid { grid-template-columns: repeat(2, 1fr); }
  .how-grid { grid-template-columns: 1fr; }
  .plans-grid { grid-template-columns: 1fr; }
  .testi-grid { grid-template-columns: 1fr; }
  .dark-banner-inner { flex-direction: column; }
  .footer-top { flex-direction: column; gap: 2rem; }
  .footer-links { grid-template-columns: repeat(2, 1fr); }
}
</style>
