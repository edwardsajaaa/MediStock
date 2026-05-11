<template>
  <div class="flex-col gap-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="page-title">Peringatan Cerdas</h1>
        <p class="text-sm text-muted">Pantau stok rendah dan barang yang mendekati kedaluwarsa</p>
      </div>
      <div class="flex gap-2 items-center">
        <button class="btn btn-outline gap-2" @click="loadAlerts">
          <RefreshCw :size="14" />
          Perbarui
        </button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="alert-summary-grid mb-6">
      <div class="summary-card summary-danger">
        <div class="summary-icon-wrap danger">
          <AlertCircle :size="20" />
        </div>
        <div>
          <div class="summary-value">{{ alertData?.summary?.low_stock_count ?? '...' }}</div>
          <div class="summary-label">Stok Rendah</div>
        </div>
      </div>
      <div class="summary-card summary-warning">
        <div class="summary-icon-wrap warning">
          <AlertTriangle :size="20" />
        </div>
        <div>
          <div class="summary-value">{{ alertData?.summary?.expiring_count ?? '...' }}</div>
          <div class="summary-label">Mendekati Kedaluwarsa</div>
        </div>
      </div>
      <div class="summary-card summary-expired">
        <div class="summary-icon-wrap expired">
          <XCircle :size="20" />
        </div>
        <div>
          <div class="summary-value">{{ alertData?.summary?.expired_count ?? '...' }}</div>
          <div class="summary-label">Sudah Kedaluwarsa</div>
        </div>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="alert-tabs mb-4">
      <button
        class="alert-tab"
        :class="{ active: activeTab === 'low_stock' }"
        @click="activeTab = 'low_stock'"
      >
        <AlertCircle :size="16" />
        Stok Rendah
        <span v-if="alertData" class="tab-count danger">{{ alertData.summary.low_stock_count }}</span>
      </button>
      <button
        class="alert-tab"
        :class="{ active: activeTab === 'expiring' }"
        @click="activeTab = 'expiring'"
      >
        <AlertTriangle :size="16" />
        Mendekati Kedaluwarsa
        <span v-if="alertData" class="tab-count warning">{{ alertData.summary.expiring_count }}</span>
      </button>
      <button
        class="alert-tab"
        :class="{ active: activeTab === 'expired' }"
        @click="activeTab = 'expired'"
      >
        <XCircle :size="16" />
        Sudah Kedaluwarsa
        <span v-if="alertData" class="tab-count expired">{{ alertData.summary.expired_count }}</span>
      </button>
    </div>

    <!-- Low Stock Table -->
    <div v-if="activeTab === 'low_stock'" class="card">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-base font-semibold flex items-center gap-2" style="color: var(--danger-text);">
          <AlertCircle :size="18" />
          Daftar Item Stok Rendah
        </h2>
        <button class="btn btn-outline gap-2" @click="handleExport('low_stock')">
          <Download :size="14" />
          Export CSV
        </button>
      </div>
      <table class="table" role="table" aria-label="Daftar stok rendah">
        <thead>
          <tr>
            <th>SKU</th>
            <th>Nama Item</th>
            <th>Kategori</th>
            <th class="text-right">Stok Saat Ini</th>
            <th class="text-right">Stok Minimum</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in lowStockItems" :key="idx">
            <td class="font-medium text-sm">{{ item.sku }}</td>
            <td>
              <div class="flex items-center gap-2">
                <div class="item-icon-bg">
                  <Package :size="16" class="text-primary" />
                </div>
                <span class="font-semibold">{{ item.item_name }}</span>
              </div>
            </td>
            <td>
              <span class="badge" :class="categoryBadge(item.category)">{{ item.category }}</span>
            </td>
            <td class="text-right font-semibold" :style="{ color: item.current_qty === 0 ? 'var(--danger-text)' : 'var(--text-main)' }">
              {{ item.current_qty }}
            </td>
            <td class="text-right text-muted">{{ item.min_stock }}</td>
            <td>
              <span class="severity-badge" :class="item.severity">
                {{ item.severity === 'critical' ? 'Kritis' : 'Perhatian' }}
              </span>
            </td>
          </tr>
          <tr v-if="lowStockItems.length === 0">
            <td colspan="6" class="text-center py-6 text-muted">
              <div class="empty-state">
                <CheckCircle :size="32" style="color: var(--success-text);" />
                <p>Semua stok dalam kondisi aman.</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Expiring Table -->
    <div v-if="activeTab === 'expiring'" class="card">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-base font-semibold flex items-center gap-2" style="color: #d97706;">
          <AlertTriangle :size="18" />
          Daftar Barang Mendekati Kedaluwarsa
        </h2>
        <button class="btn btn-outline gap-2" @click="handleExport('expiring')">
          <Download :size="14" />
          Export CSV
        </button>
      </div>
      <table class="table" role="table" aria-label="Daftar mendekati kedaluwarsa">
        <thead>
          <tr>
            <th>SKU</th>
            <th>Nama Item</th>
            <th>Batch</th>
            <th class="text-right">Qty</th>
            <th>Kedaluwarsa</th>
            <th class="text-right">Sisa Hari</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in expiringItems" :key="idx">
            <td class="font-medium text-sm">{{ item.sku }}</td>
            <td class="font-semibold">{{ item.item_name }}</td>
            <td class="text-sm text-muted">{{ item.batch_number }}</td>
            <td class="text-right font-medium">{{ item.quantity }}</td>
            <td class="text-sm">{{ item.expiry_date }}</td>
            <td class="text-right">
              <span class="days-left-badge" :class="item.severity">
                {{ item.days_left }} hari
              </span>
            </td>
            <td>
              <span class="severity-badge" :class="item.severity">
                {{ item.severity === 'critical' ? 'Kritis' : 'Perhatian' }}
              </span>
            </td>
          </tr>
          <tr v-if="expiringItems.length === 0">
            <td colspan="7" class="text-center py-6 text-muted">
              <div class="empty-state">
                <CheckCircle :size="32" style="color: var(--success-text);" />
                <p>Tidak ada barang yang mendekati kedaluwarsa.</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Expired Table -->
    <div v-if="activeTab === 'expired'" class="card">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-base font-semibold flex items-center gap-2" style="color: #dc2626;">
          <XCircle :size="18" />
          Daftar Barang Sudah Kedaluwarsa
        </h2>
        <button class="btn btn-outline gap-2" @click="handleExport('expiring')">
          <Download :size="14" />
          Export CSV
        </button>
      </div>
      <table class="table" role="table" aria-label="Daftar sudah kedaluwarsa">
        <thead>
          <tr>
            <th>SKU</th>
            <th>Nama Item</th>
            <th>Batch</th>
            <th class="text-right">Qty</th>
            <th>Kedaluwarsa</th>
            <th class="text-right">Lewat</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in expiredItems" :key="idx">
            <td class="font-medium text-sm">{{ item.sku }}</td>
            <td class="font-semibold">{{ item.item_name }}</td>
            <td class="text-sm text-muted">{{ item.batch_number }}</td>
            <td class="text-right font-medium">{{ item.quantity }}</td>
            <td class="text-sm">{{ item.expiry_date }}</td>
            <td class="text-right">
              <span class="days-left-badge expired">
                {{ Math.abs(item.days_left) }} hari lalu
              </span>
            </td>
          </tr>
          <tr v-if="expiredItems.length === 0">
            <td colspan="6" class="text-center py-6 text-muted">
              <div class="empty-state">
                <CheckCircle :size="32" style="color: var(--success-text);" />
                <p>Tidak ada barang kedaluwarsa.</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { AlertCircle, AlertTriangle, XCircle, CheckCircle, RefreshCw, Download, Package } from 'lucide-vue-next';
import { fetchAlerts } from '@/utils/api';
import { exportAlertsToCSV } from '@/utils/export';

definePageMeta({
  middleware: 'auth',
  layout: 'default'
});

const alertData = ref(null);
const activeTab = ref('low_stock');

const lowStockItems = computed(() => alertData.value?.low_stock || []);
const expiringItems = computed(() => alertData.value?.expiring || []);
const expiredItems = computed(() => alertData.value?.expired || []);

const categoryBadge = (cat) => {
  if (cat === 'Alkes') return 'badge-primary';
  if (cat === 'Obat Resep') return 'badge-danger';
  return 'badge-success';
};

const loadAlerts = async () => {
  try {
    alertData.value = await fetchAlerts();
  } catch (e) {
    console.error(e);
  }
};

const handleExport = (type) => {
  if (!alertData.value) return;
  exportAlertsToCSV(alertData.value, type);
};

onMounted(() => { loadAlerts(); });
</script>

<style scoped>
.alert-summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 10px;
  background: var(--card-bg);
  border: 1px solid rgba(226, 232, 240, 0.6);
  box-shadow: 0 6px 18px rgba(16, 24, 40, 0.03);
}

.summary-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.summary-icon-wrap.danger {
  background: #fef2f2;
  color: #ef4444;
}

.summary-icon-wrap.warning {
  background: #fffbeb;
  color: #d97706;
}

.summary-icon-wrap.expired {
  background: #fef2f2;
  color: #dc2626;
}

.summary-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.2;
}

.summary-label {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 0.15rem;
}

/* Tabs */
.alert-tabs {
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0;
}

.alert-tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-muted);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: -1px;
}

.alert-tab:hover {
  color: var(--text-main);
}

.alert-tab.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

.tab-count {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.1rem 0.45rem;
  border-radius: 10px;
  line-height: 1.3;
}

.tab-count.danger {
  background: #fef2f2;
  color: #ef4444;
}

.tab-count.warning {
  background: #fffbeb;
  color: #d97706;
}

.tab-count.expired {
  background: #fef2f2;
  color: #dc2626;
}

/* Item icon */
.item-icon-bg {
  background: var(--bg-color);
  padding: 0.35rem;
  border-radius: 6px;
}

/* Severity badges */
.severity-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.72rem;
  font-weight: 600;
}

.severity-badge.critical {
  background: #fef2f2;
  color: #dc2626;
}

.severity-badge.warning {
  background: #fffbeb;
  color: #d97706;
}

.severity-badge.expired {
  background: #fef2f2;
  color: #991b1b;
}

/* Days left */
.days-left-badge {
  font-size: 0.8rem;
  font-weight: 600;
}

.days-left-badge.critical {
  color: #dc2626;
}

.days-left-badge.warning {
  color: #d97706;
}

.days-left-badge.expired {
  color: #991b1b;
}

/* Empty state */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0;
}

.empty-state p {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.text-danger {
  color: var(--danger-text);
}

.col-span-2 {
  grid-column: span 2;
}

.text-right {
  text-align: right;
}

.py-6 {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}
</style>
