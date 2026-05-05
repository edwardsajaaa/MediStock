<template>
  <div class="flex-col gap-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="page-title">Kartu Stok</h1>
      <p class="text-sm text-muted">Riwayat mutasi barang masuk dan keluar</p>
    </div>

    <!-- Filters Row -->
    <div class="card ledger-filters">
      <div class="filters-grid">
        <!-- Search -->
        <div class="filter-group">
          <label class="filter-label">
            <Search size="14" class="filter-label-icon" />
            Cari Catatan
          </label>
          <div class="search-wrap">
            <Search class="icon" size="16" />
            <input
              type="text"
              class="input search-input"
              placeholder="Cari catatan..."
              v-model="filters.search"
              @input="debouncedLoad"
              aria-label="Cari catatan transaksi"
            />
          </div>
        </div>

        <!-- Item Filter -->
        <div class="filter-group">
          <label class="filter-label">
            <Package size="14" class="filter-label-icon" />
            Barang
          </label>
          <select class="input" v-model="filters.item_id" @change="loadLedger(1)" aria-label="Filter berdasarkan barang">
            <option value="">Semua Barang</option>
            <option v-for="item in itemList" :key="item.id" :value="item.id">
              {{ item.name }} ({{ item.sku }})
            </option>
          </select>
        </div>

        <!-- Type Filter -->
        <div class="filter-group">
          <label class="filter-label">
            <ArrowLeftRight size="14" class="filter-label-icon" />
            Tipe
          </label>
          <div class="type-toggle">
            <button
              class="type-btn"
              :class="{ active: filters.type === '' }"
              @click="filters.type = ''; loadLedger(1)"
            >
              Semua
            </button>
            <button
              class="type-btn type-btn-in"
              :class="{ active: filters.type === 'IN' }"
              @click="filters.type = 'IN'; loadLedger(1)"
            >
              <ArrowDownRight size="14" />
              Masuk
            </button>
            <button
              class="type-btn type-btn-out"
              :class="{ active: filters.type === 'OUT' }"
              @click="filters.type = 'OUT'; loadLedger(1)"
            >
              <ArrowUpRight size="14" />
              Keluar
            </button>
          </div>
        </div>

        <!-- Date Range -->
        <div class="filter-group filter-group-date">
          <label class="filter-label">
            <Calendar size="14" class="filter-label-icon" />
            Rentang Tanggal
          </label>
          <div class="date-range">
            <input type="date" class="input" v-model="filters.date_from" @change="loadLedger(1)" aria-label="Tanggal dari" />
            <span class="date-separator">—</span>
            <input type="date" class="input" v-model="filters.date_to" @change="loadLedger(1)" aria-label="Tanggal sampai" />
          </div>
        </div>
      </div>

      <!-- Active filters summary & clear -->
      <div v-if="hasActiveFilter" class="active-filters-bar">
        <div class="flex items-center gap-2">
          <Filter size="14" class="text-primary" />
          <span class="text-sm text-muted">Filter aktif:</span>
          <span v-if="filters.type" class="filter-chip">
            {{ filters.type === 'IN' ? 'Masuk' : 'Keluar' }}
            <button @click="filters.type = ''; loadLedger(1)" class="chip-remove" aria-label="Hapus filter tipe">&times;</button>
          </span>
          <span v-if="filters.item_id" class="filter-chip">
            {{ selectedItemName }}
            <button @click="filters.item_id = ''; loadLedger(1)" class="chip-remove" aria-label="Hapus filter barang">&times;</button>
          </span>
          <span v-if="filters.date_from || filters.date_to" class="filter-chip">
            {{ filters.date_from || '...' }} → {{ filters.date_to || '...' }}
            <button @click="filters.date_from = ''; filters.date_to = ''; loadLedger(1)" class="chip-remove" aria-label="Hapus filter tanggal">&times;</button>
          </span>
          <span v-if="filters.search" class="filter-chip">
            "{{ filters.search }}"
            <button @click="filters.search = ''; loadLedger(1)" class="chip-remove" aria-label="Hapus filter pencarian">&times;</button>
          </span>
        </div>
        <button class="btn btn-outline btn-clear-filters" @click="clearFilters">
          <X size="14" />
          Hapus Semua Filter
        </button>
      </div>
    </div>

    <!-- Table Card -->
    <div class="card">
      <!-- Loading State -->
      <div v-if="isLoading" class="ledger-loading">
        <Loader2 size="28" class="spin-icon text-primary" />
        <span class="text-sm text-muted">Memuat data mutasi...</span>
      </div>

      <!-- Data Table -->
      <table v-else class="table" role="table" aria-label="Riwayat kartu stok">
        <thead>
          <tr>
            <th style="width: 120px; padding-right: 1rem">Arah</th>
            <th style="width: 180px; padding-right: 1rem">Waktu</th>
            <th style="padding-right: 1rem">Detail Barang</th>
            <th class="text-right" style="width: 140px; padding-right: 1.5rem">Nilai</th>
            <th style="width: 180px">Catatan</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="trx in transactions" :key="trx.id" class="ledger-row">
            <td class="py-4">
              <div class="flex items-center gap-2">
                <div :class="trx.type === 'IN' ? 'ledger-pill-in' : 'ledger-pill-out'">
                  <ArrowDownRight v-if="trx.type === 'IN'" size="18" class="text-primary" />
                  <ArrowUpRight v-else size="18" class="text-danger" />
                </div>
                <span class="ledger-type-label" :class="trx.type === 'IN' ? 'ledger-type-in' : 'ledger-type-out'">
                  {{ trx.type === 'IN' ? 'MASUK' : 'KELUAR' }}
                </span>
              </div>
            </td>
            <td class="py-4">
              <div class="flex-col gap-0">
                <span class="text-sm font-medium">{{ formatDate(trx.date) }}</span>
                <span class="text-xs text-muted">{{ formatTime(trx.date) }}</span>
              </div>
            </td>
            <td class="py-4">
              <div class="text-sm">
                <div
                  v-for="(item, idxx) in trx.items"
                  :key="idxx"
                  class="ledger-item-row"
                  :class="{ 'ledger-item-row-last': idxx === trx.items.length - 1 }"
                >
                  <div class="flex items-center gap-2">
                    <span class="ledger-qty-badge">{{ item.qty }}x</span>
                    <span class="font-medium">{{ item.item?.name || '-' }}</span>
                  </div>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="text-xs text-muted ledger-batch-tag" v-if="item.batch?.batch_number">
                      <Hash size="10" />
                      {{ item.batch?.batch_number }}
                    </span>
                    <span class="text-xs text-muted ledger-batch-tag" v-if="item.batch?.expiry_date">
                      <Calendar size="10" />
                      Exp: {{ formatDateShort(item.batch?.expiry_date) }}
                    </span>
                  </div>
                </div>
              </div>
            </td>
            <td class="py-4 text-right">
              <span class="ledger-amount" :class="trx.type === 'IN' ? 'text-primary' : 'text-danger'">
                {{ trx.type === 'OUT' ? '-' : '+' }}Rp {{ trx.total_amount?.toLocaleString() || '0' }}
              </span>
            </td>
            <td class="py-4">
              <span class="text-sm text-muted ledger-notes">{{ trx.notes || '-' }}</span>
            </td>
          </tr>
          <tr v-if="transactions.length === 0 && !isLoading">
            <td colspan="5" class="ledger-empty">
              <div class="ledger-empty-content">
                <div class="ledger-empty-icon">
                  <FileText size="32" />
                </div>
                <p class="font-medium">Belum ada riwayat mutasi</p>
                <p class="text-sm text-muted">Data mutasi stok akan muncul setelah ada transaksi barang masuk atau keluar.</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="ledger-pagination" v-if="transactions.length > 0 || currentPage > 1">
        <div class="flex items-center gap-2">
          <span class="text-sm text-muted">
            Menampilkan {{ (currentPage - 1) * pageSize + 1 }}–{{ Math.min(currentPage * pageSize, totalRecords) }}
            dari {{ totalRecords }} data
          </span>
        </div>
        <div class="flex items-center gap-2">
          <button
            class="btn btn-outline btn-pagination"
            :disabled="currentPage === 1"
            @click="loadLedger(currentPage - 1)"
          >
            <ChevronLeft size="16" />
            Sebelumnya
          </button>
          <div class="pagination-pages">
            <button
              v-for="p in visiblePages"
              :key="p"
              class="btn btn-page"
              :class="{ 'btn-page-active': p === currentPage }"
              @click="loadLedger(p)"
            >
              {{ p }}
            </button>
          </div>
          <button
            class="btn btn-outline btn-pagination"
            :disabled="currentPage >= totalPages"
            @click="loadLedger(currentPage + 1)"
          >
            Berikutnya
            <ChevronRight size="16" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { fetchLedger, fetchItems } from '@/utils/api';
import {
  Clock,
  ArrowDownRight,
  ArrowUpRight,
  ArrowLeftRight,
  Search,
  Calendar,
  Package,
  Filter,
  X,
  FileText,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Hash,
} from 'lucide-vue-next';

definePageMeta({
  middleware: 'auth',
  layout: 'default'
});

const transactions = ref([]);
const itemList = ref([]);
const currentPage = ref(1);
const totalRecords = ref(0);
const pageSize = 15;
const isLoading = ref(false);

const filters = reactive({
  type: '',
  item_id: '',
  date_from: '',
  date_to: '',
  search: '',
});

// Debounce timer
let debounceTimer = null;
const debouncedLoad = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => loadLedger(1), 400);
};

const hasActiveFilter = computed(() => {
  return filters.type || filters.item_id || filters.date_from || filters.date_to || filters.search;
});

const selectedItemName = computed(() => {
  const item = itemList.value.find(i => i.id === parseInt(filters.item_id));
  return item ? item.name : '';
});

const totalPages = computed(() => Math.max(1, Math.ceil(totalRecords.value / pageSize)));

const visiblePages = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value;

  let start = Math.max(1, current - 2);
  let end = Math.min(total, current + 2);

  // Ensure we always show 5 pages when possible
  if (end - start < 4) {
    if (start === 1) {
      end = Math.min(total, start + 4);
    } else {
      start = Math.max(1, end - 4);
    }
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

const clearFilters = () => {
  filters.type = '';
  filters.item_id = '';
  filters.date_from = '';
  filters.date_to = '';
  filters.search = '';
  loadLedger(1);
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatTime = (dateStr) => {
  return new Date(dateStr).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDateShort = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const loadLedger = async (page = 1) => {
  isLoading.value = true;
  try {
    const params = {
      page,
      limit: pageSize,
    };
    if (filters.type) params.type = filters.type;
    if (filters.item_id) params.item_id = filters.item_id;
    if (filters.date_from) params.date_from = filters.date_from;
    if (filters.date_to) params.date_to = filters.date_to;
    if (filters.search) params.search = filters.search;

    const data = await fetchLedger(params);
    currentPage.value = page;
    transactions.value = data?.data || [];
    totalRecords.value = data?.total || 0;
  } catch (e) {
    console.error('Error loading ledger:', e);
    transactions.value = [];
    totalRecords.value = 0;
  } finally {
    isLoading.value = false;
  }
};

const loadItems = async () => {
  try {
    const data = await fetchItems({ page: 1, limit: 100 });
    itemList.value = data?.data || [];
  } catch (e) {
    console.error('Error loading items:', e);
  }
};

onMounted(async () => {
  await Promise.all([loadLedger(), loadItems()]);
});
</script>

<style scoped>
/* ── Filters Card ── */
.ledger-filters {
  padding: 1.25rem;
}

.filters-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1.2fr;
  gap: 1rem;
  align-items: flex-end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.filter-label-icon {
  color: var(--text-light);
}

/* ── Type Toggle Buttons ── */
.type-toggle {
  display: flex;
  gap: 0;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.type-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  padding: 0.45rem 0.65rem;
  font-size: 0.8125rem;
  font-weight: 500;
  font-family: inherit;
  color: var(--text-muted);
  background: var(--card-bg);
  border: none;
  cursor: pointer;
  transition: all 0.18s ease;
  border-right: 1px solid var(--border-color);
}

.type-btn:last-child {
  border-right: none;
}

.type-btn:hover {
  background: var(--bg-color);
}

.type-btn.active {
  background: var(--primary-color);
  color: white;
  font-weight: 600;
}

.type-btn-in.active {
  background: #059669;
}

.type-btn-out.active {
  background: #dc2626;
}

/* ── Date Range ── */
.date-range {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.date-range .input {
  font-size: 0.8125rem;
  padding: 0.42rem 0.5rem;
}

.date-separator {
  color: var(--text-light);
  font-size: 0.75rem;
  flex-shrink: 0;
}

/* ── Active Filter Bar ── */
.active-filters-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.85rem;
  padding-top: 0.85rem;
  border-top: 1px solid var(--border-color);
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.55rem;
  background: rgba(37, 110, 95, 0.08);
  color: var(--primary-color);
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: var(--radius-full);
  border: 1px solid rgba(37, 110, 95, 0.15);
}

.chip-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: none;
  background: none;
  color: var(--primary-color);
  font-size: 1rem;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.15s ease;
  line-height: 1;
}

.chip-remove:hover {
  background: rgba(37, 110, 95, 0.15);
}

.btn-clear-filters {
  font-size: 0.75rem;
  padding: 0.3rem 0.65rem;
  gap: 0.3rem;
  flex-shrink: 0;
}

/* ── Loading State ── */
.ledger-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem 1rem;
}

/* ── Table Row Styles ── */
.ledger-row {
  transition: background-color 150ms ease;
}

.ledger-row:hover {
  background: rgba(37, 110, 95, 0.02);
}

.ledger-type-label {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
}

.ledger-type-in {
  color: #059669;
  background: #ecfdf5;
}

.ledger-type-out {
  color: #dc2626;
  background: #fef2f2;
}

.ledger-qty-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  padding: 0.1rem 0.35rem;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-main);
}

.ledger-batch-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  padding: 0.1rem 0.4rem;
  background: var(--bg-color);
  border-radius: 3px;
  font-family: 'SF Mono', 'Fira Code', monospace;
}

.ledger-amount {
  font-weight: 600;
  font-size: 0.9rem;
}

.ledger-notes {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-width: 180px;
}

/* ── Empty State ── */
.ledger-empty {
  padding: 3rem 1rem !important;
}

.ledger-empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
}

.ledger-empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: var(--bg-color);
  color: var(--text-light);
  margin-bottom: 0.5rem;
}

/* ── Pagination ── */
.ledger-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.btn-pagination {
  font-size: 0.8125rem;
  padding: 0.4rem 0.75rem;
  gap: 0.3rem;
}

.btn-pagination:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination-pages {
  display: flex;
  gap: 0.25rem;
}

.btn-page {
  min-width: 34px;
  height: 34px;
  padding: 0;
  font-size: 0.8125rem;
  font-weight: 500;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-page:hover {
  background: var(--bg-color);
  color: var(--text-main);
}

.btn-page-active {
  background: var(--primary-color) !important;
  color: white !important;
  font-weight: 600;
  border-color: var(--primary-color);
}

/* ── Spinner ── */
.spin-icon {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ── Text helpers ── */
.text-danger { color: #ef4444; }
.text-right { text-align: right; }
.gap-0 { gap: 0; }
.mt-1 { margin-top: 0.25rem; }
.py-4 { padding-top: 1rem; padding-bottom: 1rem; }

/* ── Search ── */
.search-wrap { position: relative; }
.search-wrap .icon {
  position: absolute;
  left: 0.65rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
}
.search-input {
  padding-left: 2rem;
  font-size: 0.8125rem;
}

/* ── Responsive ── */
@media (max-width: 1024px) {
  .filters-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .filters-grid {
    grid-template-columns: 1fr;
  }

  .ledger-pagination {
    flex-direction: column;
    gap: 0.75rem;
    align-items: stretch;
    text-align: center;
  }

  .ledger-pagination .flex:last-child {
    justify-content: center;
  }

  .active-filters-bar {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }

  .type-toggle {
    width: 100%;
  }

  .date-range {
    flex-direction: column;
  }

  .date-separator {
    display: none;
  }
}
</style>
