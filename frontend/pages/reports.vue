<template>
  <div class="flex-col gap-6">

    <!-- PAGE HEADER -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="page-title">Laporan &amp; Export</h1>
        <p class="text-sm text-muted">Unduh data inventaris dalam format CSV atau PDF siap cetak</p>
      </div>
      <button class="btn btn-outline gap-2" @click="loadStats" :disabled="loadingStats">
        <RefreshCw :size="14" :class="{ 'spin-anim': loadingStats }" />
        Perbarui Data
      </button>
    </div>

    <!-- STATS ROW -->
    <div class="stats-grid">
      <div class="card stat-card">
        <div class="stat-icon" style="background:#ecfdf5; color:var(--primary-color);">
          <Package :size="18" />
        </div>
        <div>
          <div class="stat-value">{{ stats.totalItems }}</div>
          <div class="stat-label">Total Item Aktif</div>
        </div>
      </div>
      <div class="card stat-card">
        <div class="stat-icon" style="background:var(--danger-bg); color:var(--danger-text);">
          <AlertCircle :size="18" />
        </div>
        <div>
          <div class="stat-value" style="color:var(--danger-text);">{{ stats.lowStock }}</div>
          <div class="stat-label">Stok Rendah</div>
        </div>
      </div>
      <div class="card stat-card">
        <div class="stat-icon" style="background:#fffbeb; color:#d97706;">
          <AlertTriangle :size="18" />
        </div>
        <div>
          <div class="stat-value" style="color:#d97706;">{{ stats.expiring }}</div>
          <div class="stat-label">Mendekati Kedaluwarsa</div>
        </div>
      </div>
    </div>

    <!-- EXPORT SECTION LABEL -->
    <div class="section-divider">
      <span class="section-label-text">Pilih Laporan untuk Di-preview atau Diunduh</span>
    </div>

    <!-- EXPORT CARDS -->
    <div class="report-grid">

      <!-- DATA MASTER -->
      <div class="card report-card">
        <div class="report-accent" style="background:var(--primary-color);"></div>
        <div class="report-card-header">
          <div class="report-icon" style="background:#ecfdf5; color:var(--primary-color);">
            <Database :size="20" />
          </div>
          <div class="report-card-info">
            <h3 class="font-semibold" style="font-size:0.9375rem;">Data Master Barang</h3>
            <p class="text-sm text-muted" style="margin-top:0.15rem;">Seluruh daftar obat dan alat kesehatan</p>
          </div>
        </div>

        <div class="report-meta">
          <div class="meta-item"><Package :size="12" class="meta-icon" /><span>{{ stats.totalItems }} item tersimpan</span></div>
          <div class="meta-item"><FileText :size="12" class="meta-icon" /><span>SKU · Nama · Kategori · Stok · Harga Beli · Harga Jual</span></div>
        </div>

        <div class="action-group">
          <button class="btn btn-outline action-btn" @click="openPreview('items')" :disabled="busyItems">
            <Eye :size="14" /> Preview PDF
          </button>
          <button class="btn btn-primary action-btn" @click="handleDownload('items', 'pdf')" :disabled="busyItems">
            <span v-if="busyItems" class="spin-dot"></span>
            <Download v-else :size="14" />
            {{ busyItems ? 'Memproses...' : 'Unduh PDF' }}
          </button>
          <button class="btn btn-outline action-btn w-full" @click="handleDownload('items', 'csv')" :disabled="busyItems">
            <FileSpreadsheet :size="14" /> Unduh CSV
          </button>
        </div>
        <button class="btn btn-outline template-btn" @click="handleDownloadTemplate">
          <Download :size="12" /> Template Import CSV
        </button>
      </div>

      <!-- KARTU STOK -->
      <div class="card report-card">
        <div class="report-accent" style="background:#3b82f6;"></div>
        <div class="report-card-header">
          <div class="report-icon" style="background:#eff6ff; color:#3b82f6;">
            <ScrollText :size="20" />
          </div>
          <div class="report-card-info">
            <h3 class="font-semibold" style="font-size:0.9375rem;">Kartu Stok &amp; Mutasi</h3>
            <p class="text-sm text-muted" style="margin-top:0.15rem;">Riwayat semua transaksi masuk dan keluar</p>
          </div>
        </div>

        <div class="report-meta">
          <div class="meta-item"><ArrowDownRight :size="12" class="meta-icon" /><span>Semua transaksi IN / OUT</span></div>
          <div class="meta-item"><FileText :size="12" class="meta-icon" /><span>Tanggal · Tipe · Item · Qty · Batch · Total Nilai</span></div>
        </div>

        <div class="action-group">
          <button class="btn btn-outline action-btn" @click="openPreview('ledger')" :disabled="busyLedger">
            <Eye :size="14" /> Preview PDF
          </button>
          <button class="btn btn-primary action-btn" @click="handleDownload('ledger', 'pdf')" :disabled="busyLedger">
            <span v-if="busyLedger" class="spin-dot"></span>
            <Download v-else :size="14" />
            {{ busyLedger ? 'Memproses...' : 'Unduh PDF' }}
          </button>
          <button class="btn btn-outline action-btn w-full" @click="handleDownload('ledger', 'csv')" :disabled="busyLedger">
            <FileSpreadsheet :size="14" /> Unduh CSV
          </button>
        </div>
      </div>

      <!-- PERINGATAN STOK -->
      <div class="card report-card">
        <div class="report-accent" style="background:#d97706;"></div>
        <div class="report-card-header">
          <div class="report-icon" style="background:#fffbeb; color:#d97706;">
            <AlertTriangle :size="20" />
          </div>
          <div class="report-card-info">
            <h3 class="font-semibold" style="font-size:0.9375rem;">Peringatan Stok</h3>
            <p class="text-sm text-muted" style="margin-top:0.15rem;">Stok rendah &amp; barang mendekati kedaluwarsa</p>
          </div>
        </div>

        <div class="report-meta">
          <div class="meta-item"><AlertCircle :size="12" class="meta-icon" style="color:var(--danger-text);" /><span>{{ stats.lowStock }} item stok rendah</span></div>
          <div class="meta-item"><AlertTriangle :size="12" class="meta-icon" style="color:#d97706;" /><span>{{ stats.expiring }} item mendekati kedaluwarsa</span></div>
        </div>

        <div class="alert-action-grid">
          <div class="alert-action-col">
            <p class="alert-col-label" style="color:var(--danger-text);">
              <AlertCircle :size="11" /> Stok Rendah
            </p>
            <button class="btn btn-outline action-btn" @click="openPreview('alerts_low_stock')" :disabled="busyAlerts">
              <Eye :size="13" /> Preview
            </button>
            <button class="btn btn-primary action-btn" @click="handleDownload('alerts_low_stock', 'pdf')" :disabled="busyAlerts">
              <Download :size="13" /> PDF
            </button>
            <button class="btn btn-outline action-btn" @click="handleDownload('alerts_low_stock', 'csv')" :disabled="busyAlerts">
              <FileSpreadsheet :size="13" /> CSV
            </button>
          </div>
          <div class="alert-col-divider"></div>
          <div class="alert-action-col">
            <p class="alert-col-label" style="color:#d97706;">
              <AlertTriangle :size="11" /> Kedaluwarsa
            </p>
            <button class="btn btn-outline action-btn" @click="openPreview('alerts_expiring')" :disabled="busyAlerts">
              <Eye :size="13" /> Preview
            </button>
            <button class="btn btn-primary action-btn" @click="handleDownload('alerts_expiring', 'pdf')" :disabled="busyAlerts">
              <Download :size="13" /> PDF
            </button>
            <button class="btn btn-outline action-btn" @click="handleDownload('alerts_expiring', 'csv')" :disabled="busyAlerts">
              <FileSpreadsheet :size="13" /> CSV
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- INFO NOTE -->
    <div class="info-note">
      <Info :size="15" style="color:var(--primary-color); flex-shrink:0; margin-top:1px;" />
      <p>
        Klik <strong>Preview PDF</strong> untuk melihat tampilan dokumen sebelum mengunduh — hemat penyimpanan!
        File <strong>CSV</strong> bisa langsung dibuka di Excel atau Google Sheets.
        PDF <strong>Peringatan Stok</strong> sudah otomatis memuat daftar lengkap semua item yang bermasalah beserta detailnya.
      </p>
    </div>

  </div>

  <!-- ========== PREVIEW MODAL ========== -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="showPreview" class="preview-backdrop" @click.self="closePreview">
        <div class="preview-container">

          <!-- Toolbar -->
          <div class="preview-toolbar">
            <div class="preview-toolbar-left">
              <div class="preview-doc-icon">
                <FileText :size="16" />
              </div>
              <div>
                <div class="preview-title">{{ previewTitle }}</div>
                <div class="preview-subtitle">Scroll untuk memeriksa isi dokumen</div>
              </div>
            </div>
            <div class="preview-toolbar-right">
              <button class="btn btn-primary preview-download-btn" @click="triggerDownload">
                <Download :size="14" /> Unduh Sekarang
              </button>
              <button class="preview-close-btn" @click="closePreview" title="Tutup">
                <X :size="18" />
              </button>
            </div>
          </div>

          <!-- PDF iframe -->
          <div class="preview-body">
            <iframe
              v-if="previewUrl"
              :src="previewUrl"
              class="preview-iframe"
              title="Preview PDF"
            ></iframe>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import {
  Database, ScrollText, AlertTriangle, AlertCircle,
  FileSpreadsheet, Package, FileText, ArrowDownRight,
  Info, Download, Eye, X, RefreshCw
} from 'lucide-vue-next';
import { fetchAllItems, fetchLedger, fetchAlerts } from '@/utils/api';
import {
  exportItemsToCSV, exportLedgerToCSV, exportAlertsToCSV,
  exportItemsToPDF, exportLedgerToPDF, exportAlertsToPDF,
  previewItemsPDF, previewLedgerPDF, previewAlertsPDF,
  downloadImportTemplateCSV
} from '@/utils/export';

definePageMeta({ middleware: 'auth', layout: 'default' });

// ── State ──────────────────────────────────────
const stats = reactive({ totalItems: '...', lowStock: '...', expiring: '...' });
const loadingStats = ref(false);
const busyItems = ref(false);
const busyLedger = ref(false);
const busyAlerts = ref(false);

// Preview modal
const showPreview = ref(false);
const previewUrl = ref('');
const previewTitle = ref('');
const currentDownloadFn = ref(null);

// Cache data agar tidak fetch ulang saat download dari preview
let cachedItems = null;
let cachedLedger = null;
let cachedAlerts = null;

// ── Stats ──────────────────────────────────────
const loadStats = async () => {
  loadingStats.value = true;
  try {
    const [itemData, alertData] = await Promise.all([fetchAllItems(), fetchAlerts()]);
    cachedItems = itemData?.data || [];
    cachedAlerts = alertData;
    stats.totalItems = cachedItems.length;
    stats.lowStock = alertData?.summary?.low_stock_count ?? (alertData?.low_stock?.length ?? 0);
    stats.expiring = alertData?.summary?.expiring_count ?? (alertData?.expiring?.length ?? 0);
  } catch (e) {
    console.error(e);
  } finally {
    loadingStats.value = false;
  }
};
onMounted(loadStats);

// ── Preview ────────────────────────────────────
const openPreview = async (type) => {
  let url = '';
  let title = '';
  let downloadFn = null;

  try {
    if (type === 'items') {
      busyItems.value = true;
      if (!cachedItems) { const d = await fetchAllItems(); cachedItems = d?.data || []; }
      url = previewItemsPDF(cachedItems);
      title = 'Data Master Barang';
      downloadFn = () => exportItemsToPDF(cachedItems);

    } else if (type === 'ledger') {
      busyLedger.value = true;
      if (!cachedLedger) { const d = await fetchLedger({ page: 1, limit: 500 }); cachedLedger = Array.isArray(d) ? d : (d?.data || []); }
      url = previewLedgerPDF(cachedLedger);
      title = 'Kartu Stok & Mutasi';
      downloadFn = () => exportLedgerToPDF(cachedLedger);

    } else if (type === 'alerts_low_stock') {
      busyAlerts.value = true;
      if (!cachedAlerts) { cachedAlerts = await fetchAlerts(); }
      url = previewAlertsPDF(cachedAlerts, 'low_stock');
      title = 'Peringatan Stok Rendah';
      downloadFn = () => exportAlertsToPDF(cachedAlerts, 'low_stock');

    } else if (type === 'alerts_expiring') {
      busyAlerts.value = true;
      if (!cachedAlerts) { cachedAlerts = await fetchAlerts(); }
      url = previewAlertsPDF(cachedAlerts, 'expiring');
      title = 'Peringatan Kedaluwarsa';
      downloadFn = () => exportAlertsToPDF(cachedAlerts, 'expiring');
    }

    previewUrl.value = url;
    previewTitle.value = title;
    currentDownloadFn.value = downloadFn;
    showPreview.value = true;

  } catch (e) {
    alert('Gagal membuat preview: ' + e.message);
  } finally {
    busyItems.value = false;
    busyLedger.value = false;
    busyAlerts.value = false;
  }
};

const closePreview = () => {
  showPreview.value = false;
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
  previewUrl.value = '';
  previewTitle.value = '';
  currentDownloadFn.value = null;
};

const triggerDownload = () => {
  if (currentDownloadFn.value) currentDownloadFn.value();
};

// ── Download langsung (tanpa preview) ──────────
const handleDownload = async (type, format) => {
  const setBusy = (v) => {
    if (type === 'items') busyItems.value = v;
    else if (type === 'ledger') busyLedger.value = v;
    else busyAlerts.value = v;
  };
  setBusy(true);
  try {
    if (type === 'items') {
      if (!cachedItems) { const d = await fetchAllItems(); cachedItems = d?.data || []; }
      format === 'csv' ? exportItemsToCSV(cachedItems) : exportItemsToPDF(cachedItems);

    } else if (type === 'ledger') {
      if (!cachedLedger) { const d = await fetchLedger({ page: 1, limit: 500 }); cachedLedger = Array.isArray(d) ? d : (d?.data || []); }
      format === 'csv' ? exportLedgerToCSV(cachedLedger) : exportLedgerToPDF(cachedLedger);

    } else if (type === 'alerts_low_stock') {
      if (!cachedAlerts) { cachedAlerts = await fetchAlerts(); }
      format === 'csv' ? exportAlertsToCSV(cachedAlerts, 'low_stock') : exportAlertsToPDF(cachedAlerts, 'low_stock');

    } else if (type === 'alerts_expiring') {
      if (!cachedAlerts) { cachedAlerts = await fetchAlerts(); }
      format === 'csv' ? exportAlertsToCSV(cachedAlerts, 'expiring') : exportAlertsToPDF(cachedAlerts, 'expiring');
    }
  } catch (e) {
    alert('Gagal export: ' + e.message);
  } finally {
    setBusy(false);
  }
};

const handleDownloadTemplate = () => downloadImportTemplateCSV();
</script>

<style scoped>
/* ── Stats ─────────────────────────────────── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
}
.stat-icon {
  width: 42px; height: 42px;
  border-radius: var(--radius-lg);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.stat-value {
  font-size: 1.5rem; font-weight: 700;
  color: var(--text-main); line-height: 1.1;
}
.stat-label { font-size: 0.775rem; color: var(--text-muted); margin-top: 0.2rem; }

/* ── Section divider ──────────────────────── */
.section-divider {
  display: flex; align-items: center; gap: 0.75rem;
}
.section-divider::before,
.section-divider::after {
  content: ''; flex: 1; height: 1px; background: var(--border-color);
}
.section-label-text {
  font-size: 0.72rem; font-weight: 600; color: var(--text-light);
  text-transform: uppercase; letter-spacing: 0.08em; white-space: nowrap;
}

/* ── Report Grid ──────────────────────────── */
.report-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
  gap: 1.25rem;
}
.report-card {
  position: relative;
  padding: 1.25rem 1.25rem 1.25rem 1.5rem;
  display: flex; flex-direction: column; gap: 1rem;
  overflow: hidden;
}
/* Accent stripe kiri */
.report-accent {
  position: absolute; left: 0; top: 0; bottom: 0; width: 4px;
}
.report-card-header {
  display: flex; align-items: flex-start; gap: 0.75rem;
}
.report-icon {
  width: 42px; height: 42px; border-radius: var(--radius-lg);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.report-card-info { flex: 1; }

/* Meta info box */
.report-meta {
  display: flex; flex-direction: column; gap: 0.35rem;
  padding: 0.7rem 0.85rem;
  background: var(--bg-color);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}
.meta-item {
  display: flex; align-items: center; gap: 0.4rem;
  font-size: 0.76rem; color: var(--text-muted);
}
.meta-icon { flex-shrink: 0; color: var(--text-light); }

/* Action buttons */
.action-group {
  display: flex; flex-wrap: wrap; gap: 0.5rem;
}
.action-btn {
  display: inline-flex; align-items: center; justify-content: center;
  gap: 0.4rem; font-size: 0.8rem; flex: 1; min-width: 0;
}
.w-full { width: 100%; flex: none; }

.template-btn {
  border-style: dashed; font-size: 0.775rem;
  display: flex; align-items: center; justify-content: center; gap: 0.4rem;
  color: var(--text-muted);
}
.template-btn:hover {
  border-color: var(--primary-color); color: var(--primary-color); background: #ecfdf5;
}

/* Alert 2-column action */
.alert-action-grid {
  display: grid; grid-template-columns: 1fr auto 1fr; gap: 0.75rem; align-items: start;
}
.alert-action-col { display: flex; flex-direction: column; gap: 0.4rem; }
.alert-col-label {
  display: flex; align-items: center; gap: 0.3rem;
  font-size: 0.72rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.05em; margin-bottom: 0.15rem;
}
.alert-col-divider { width: 1px; background: var(--border-color); align-self: stretch; margin-top: 1.5rem; }

/* Loading dot */
.spin-dot {
  display: inline-block; width: 13px; height: 13px;
  border: 2px solid rgba(255,255,255,0.35); border-top-color: white;
  border-radius: 50%; animation: spin 0.7s linear infinite;
}
.spin-anim { animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Info note */
.info-note {
  display: flex; align-items: flex-start; gap: 0.6rem;
  background: var(--success-bg); border: 1px solid #bbf7d0;
  border-radius: var(--radius-lg); padding: 0.85rem 1rem;
  color: #14532d; font-size: 0.8rem; line-height: 1.55;
}
.info-note strong { color: var(--primary-color); }

/* ── Preview Modal ────────────────────────── */
.preview-backdrop {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex; align-items: stretch; justify-content: center;
  padding: 1.5rem;
}
.preview-container {
  width: 100%; max-width: 900px;
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  box-shadow: 0 24px 64px rgba(0,0,0,0.2);
  display: flex; flex-direction: column; overflow: hidden;
}
.preview-toolbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.875rem 1.25rem;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-color); flex-shrink: 0;
}
.preview-toolbar-left { display: flex; align-items: center; gap: 0.75rem; }
.preview-doc-icon {
  width: 36px; height: 36px; border-radius: var(--radius-md);
  background: #ecfdf5; color: var(--primary-color);
  display: flex; align-items: center; justify-content: center;
}
.preview-title { font-weight: 700; font-size: 0.9rem; color: var(--text-main); }
.preview-subtitle { font-size: 0.72rem; color: var(--text-muted); margin-top: 1px; }
.preview-toolbar-right { display: flex; align-items: center; gap: 0.5rem; }
.preview-download-btn { display: flex; align-items: center; gap: 0.4rem; font-size: 0.8rem; }
.preview-close-btn {
  width: 34px; height: 34px; border-radius: var(--radius-md);
  border: 1px solid var(--border-color); background: white;
  color: var(--text-muted); cursor: pointer; display: flex;
  align-items: center; justify-content: center; transition: all 0.15s;
}
.preview-close-btn:hover { background: var(--danger-bg); color: var(--danger-text); border-color: var(--danger-bg); }

.preview-body { flex: 1; overflow: hidden; background: #e2e8f0; padding: 1rem; }
.preview-iframe { width: 100%; height: 100%; border: none; border-radius: 4px; }

/* Modal transition */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

/* Responsive */
@media (max-width: 768px) {
  .stats-grid { grid-template-columns: 1fr 1fr; }
  .preview-backdrop { padding: 0; }
  .preview-container { border-radius: 0; }
  .alert-action-grid { grid-template-columns: 1fr; }
  .alert-col-divider { display: none; }
}
@media (max-width: 480px) {
  .stats-grid { grid-template-columns: 1fr; }
}
</style>
