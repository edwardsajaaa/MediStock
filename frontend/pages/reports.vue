<template>
  <div class="flex-col gap-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="page-title">Laporan & Export</h1>
        <p class="text-sm text-muted">Unduh data dalam format CSV atau PDF untuk kebutuhan pelaporan</p>
      </div>
    </div>

    <!-- Export Cards Grid -->
    <div class="report-grid">

      <!-- Data Master -->
      <div class="report-card">
        <div class="report-card-header">
          <div class="report-icon-wrap green">
            <Database :size="22" />
          </div>
          <div>
            <h3 class="report-card-title">Data Master</h3>
            <p class="report-card-desc">Daftar lengkap obat dan alat kesehatan</p>
          </div>
        </div>
        <div class="report-card-info">
          <div class="info-row">
            <Package :size="14" class="text-muted" />
            <span>{{ itemCount }} item tersimpan</span>
          </div>
          <div class="info-row">
            <FileText :size="14" class="text-muted" />
            <span>Kolom: SKU, Nama, Kategori, Stok, Harga</span>
          </div>
        </div>
        <div class="report-btn-group">
          <button class="btn btn-outline flex-1 report-btn" @click="handleExportItems('csv')" :disabled="exportingItems">
            <FileSpreadsheet :size="14" />
            CSV
          </button>
          <button class="btn btn-primary flex-1 report-btn" @click="handleExportItems('pdf')" :disabled="exportingItems">
            <FileText :size="14" />
            PDF
          </button>
        </div>
        <button class="btn btn-outline w-full report-btn mt-2" @click="handleDownloadTemplate" style="border-style: dashed;">
          <Download :size="14" />
          Template Import CSV
        </button>
      </div>

      <!-- Kartu Stok -->
      <div class="report-card">
        <div class="report-card-header">
          <div class="report-icon-wrap blue">
            <ScrollText :size="22" />
          </div>
          <div>
            <h3 class="report-card-title">Kartu Stok</h3>
            <p class="report-card-desc">Riwayat mutasi barang masuk dan keluar</p>
          </div>
        </div>
        <div class="report-card-info">
          <div class="info-row">
            <ArrowDownRight :size="14" class="text-muted" />
            <span>Mencakup semua transaksi IN/OUT</span>
          </div>
          <div class="info-row">
            <FileText :size="14" class="text-muted" />
            <span>Kolom: Tanggal, Tipe, Item, Qty, Batch, Harga</span>
          </div>
        </div>
        <div class="report-btn-group">
          <button class="btn btn-outline flex-1 report-btn" @click="handleExportLedger('csv')" :disabled="exportingLedger">
            <FileSpreadsheet :size="14" />
            CSV
          </button>
          <button class="btn btn-primary flex-1 report-btn" @click="handleExportLedger('pdf')" :disabled="exportingLedger">
            <FileText :size="14" />
            PDF
          </button>
        </div>
      </div>

      <!-- Peringatan Stok -->
      <div class="report-card">
        <div class="report-card-header">
          <div class="report-icon-wrap orange">
            <AlertTriangle :size="22" />
          </div>
          <div>
            <h3 class="report-card-title">Peringatan Stok</h3>
            <p class="report-card-desc">Item stok rendah dan mendekati kedaluwarsa</p>
          </div>
        </div>
        <div class="report-card-info">
          <div class="info-row">
            <AlertCircle :size="14" class="text-muted" />
            <span>Stok rendah & kedaluwarsa 3 bulan</span>
          </div>
          <div class="info-row">
            <FileText :size="14" class="text-muted" />
            <span>Kolom: Item, SKU, Qty, Status, Severity</span>
          </div>
        </div>
        <div class="report-btn-group">
          <button class="btn btn-outline flex-1 report-btn" @click="handleExportAlerts('low_stock', 'pdf')" :disabled="exportingAlerts">
            <FileText :size="14" />
            Stok Rendah (PDF)
          </button>
          <button class="btn btn-primary flex-1 report-btn" @click="handleExportAlerts('expiring', 'pdf')" :disabled="exportingAlerts">
            <FileText :size="14" />
            Kedaluwarsa (PDF)
          </button>
        </div>
      </div>
    </div>

    <!-- Info Note -->
    <div class="report-info-note">
      <Info :size="16" />
      <div>
        <strong>Catatan Ekspor:</strong> File <strong>CSV</strong> dapat langsung dibuka dan diolah di Microsoft Excel atau Google Sheets. File <strong>PDF</strong> telah diformat khusus agar rapi saat dicetak dan siap diserahkan sebagai laporan resmi.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Database, ScrollText, AlertTriangle, AlertCircle, FileSpreadsheet, Package, FileText, ArrowDownRight, Info } from 'lucide-vue-next';
import { fetchAllItems, fetchLedger, fetchAlerts } from '@/utils/api';
import { 
  exportItemsToCSV, exportLedgerToCSV, exportAlertsToCSV,
  exportItemsToPDF, exportLedgerToPDF, exportAlertsToPDF,
  downloadImportTemplateCSV
} from '@/utils/export';
import { useAuthRole } from '@/composables/useAuthRole';

definePageMeta({
  middleware: 'auth',
  layout: 'default'
});

const { isAdmin } = useAuthRole();

const itemCount = ref('...');
const exportingItems = ref(false);
const exportingLedger = ref(false);
const exportingAlerts = ref(false);

const handleDownloadTemplate = () => {
  downloadImportTemplateCSV();
};

onMounted(async () => {
  try {
    const data = await fetchAllItems();
    itemCount.value = (data?.data || []).length;
  } catch (e) {
    itemCount.value = '-';
  }
});

const handleExportItems = async (format = 'csv') => {
  exportingItems.value = true;
  try {
    const data = await fetchAllItems();
    const items = data?.data || [];
    if (format === 'csv') {
      exportItemsToCSV(items);
    } else {
      exportItemsToPDF(items);
    }
  } catch (e) {
    alert('Gagal export: ' + e.message);
  } finally {
    exportingItems.value = false;
  }
};

const handleExportLedger = async (format = 'csv') => {
  exportingLedger.value = true;
  try {
    const data = await fetchLedger({ page: 1, limit: 100 });
    const transactions = Array.isArray(data) ? data : (data?.data || []);
    if (format === 'csv') {
      exportLedgerToCSV(transactions);
    } else {
      exportLedgerToPDF(transactions);
    }
  } catch (e) {
    alert('Gagal export: ' + e.message);
  } finally {
    exportingLedger.value = false;
  }
};

const handleExportAlerts = async (type = 'low_stock', format = 'pdf') => {
  exportingAlerts.value = true;
  try {
    const data = await fetchAlerts();
    if (format === 'csv') {
      exportAlertsToCSV(data, type);
    } else {
      exportAlertsToPDF(data, type);
    }
  } catch (e) {
    alert('Gagal export: ' + e.message);
  } finally {
    exportingAlerts.value = false;
  }
};
</script>

<style scoped>
.report-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

.report-card {
  background: var(--card-bg);
  border-radius: 10px;
  padding: 1.5rem;
  border: 1px solid rgba(226, 232, 240, 0.6);
  box-shadow: 0 6px 18px rgba(16, 24, 40, 0.03);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.report-card-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.report-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.report-icon-wrap.green {
  background: #ecfdf5;
  color: var(--primary-color);
}

.report-icon-wrap.blue {
  background: #eff6ff;
  color: #3b82f6;
}

.report-icon-wrap.orange {
  background: #fffbeb;
  color: #d97706;
}

.report-card-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 0.2rem;
}

.report-card-desc {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.report-card-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.report-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.8rem;
}

.report-btn-group {
  display: flex;
  gap: 0.5rem;
}

.w-full {
  width: 100%;
}

.flex-1 {
  flex: 1;
}

.report-info-note {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  background: #ecfdf5;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 0.85rem 1rem;
  color: #14532d;
  font-size: 0.8rem;
  line-height: 1.5;
}

.report-info-note svg {
  flex-shrink: 0;
  margin-top: 2px;
}

.report-info-note strong {
  color: #166534;
}
</style>
