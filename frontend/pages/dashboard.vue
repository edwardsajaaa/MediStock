<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1 class="text-xl font-semibold">Dasbor Farmasi</h1>
      <div class="header-actions">
        <button class="btn btn-outline flex items-center gap-2" @click="refreshData" :disabled="isLoading">
          <RefreshCw :size="14" :class="{ 'spin-icon': isLoading }" />
          {{ isLoading ? 'Memperbarui...' : 'Perbarui Data' }}
        </button>
        <button v-if="isAdmin" class="btn btn-primary" @click="router.push('/reports')">Laporan Bulanan</button>
      </div>
    </div>
    
    <div class="dashboard-content mt-6">
      <div class="kpi-grid">
        <MetricCard 
          title="Total Item" 
          :value="stats ? stats.metrics.total_items : '...'" 
          change="" 
          :isPositive="true" 
          comparisonText="Data aktif obat dan alat kesehatan" 
        />
        <div @click="router.push('/alerts')" style="cursor: pointer;">
          <MetricCard 
            title="Peringatan Stok" 
            :value="stats ? stats.metrics.low_stock_count : '...'" 
            change="Butuh Tindakan" 
            :isPositive="false" 
            comparisonText="Segera lakukan restok" 
            type="danger"
          />
        </div>
        <div @click="router.push('/alerts')" style="cursor: pointer;">
          <MetricCard 
            title="Siaga Kedaluwarsa" 
            :value="stats ? stats.metrics.expiring_count : '...'" 
            change="3 Bulan Ke Depan" 
            :isPositive="false" 
            comparisonText="Barang perlu perhatian khusus" 
            type="warning"
          />
        </div>
        <MetricCard 
          title="Mutasi Hari Ini" 
          :value="stats ? stats.metrics.today_transactions : '...'" 
          change="Langsung" 
          :isPositive="true" 
          comparisonText="Akumulasi barang masuk dan keluar" 
        />
      </div>

      <div class="grid grid-cols-2 gap-6 mb-6">
        <!-- Smart Alerts Sections -->
        <div class="card shadow-md border-0 ring-1 ring-gray-100 clickable-card" style="background: linear-gradient(to bottom right, #fff, #fef2f2);" @click="router.push('/alerts')">
          <h2 class="text-base font-semibold mb-3 flex items-center gap-2 text-danger">
            <AlertCircle :size="18" /> Peringatan Stok Rendah
          </h2>
          <ul v-if="stats && stats.alerts.low_stock.length > 0" class="alerts-list">
            <li v-for="(al, idx) in stats.alerts.low_stock" :key="idx" class="alert-item" style="border-color: #fee2e2;">
              <span class="font-semibold text-gray-800 text-sm alert-item-name" :title="al.item_name">{{ al.item_name }}</span>
              <span class="badge badge-danger alert-badge">Sisa {{ al.current_qty }} / Min {{ al.min_stock }}</span>
            </li>
          </ul>
          <p v-else class="text-sm text-gray-500 italic mt-2">Semua stok masih aman.</p>
          <div class="card-link-hint">
            <span>Lihat selengkapnya →</span>
          </div>
        </div>

        <div class="card shadow-md border-0 ring-1 ring-warning-100 clickable-card" style="background: linear-gradient(to bottom right, #fff, #fffbeb);" @click="router.push('/alerts')">
          <h2 class="text-base font-semibold mb-3 flex items-center gap-2" style="color: #d97706;">
            <AlertTriangle :size="18" /> Peringatan Kedaluwarsa
          </h2>
          <ul v-if="stats && stats.alerts.expiring.length > 0" class="alerts-list">
            <li v-for="(al, idx) in stats.alerts.expiring" :key="idx" class="alert-item" style="border-color: #fef3c7;">
              <div class="alert-item-info">
                <div class="font-semibold text-gray-800 text-sm alert-item-name" :title="al.item_name">{{ al.item_name }}</div>
                <div class="text-xs text-muted mt-1">Batch {{ al.batch_number }} · Qty {{ al.quantity }}</div>
              </div>
              <span class="text-sm font-semibold alert-badge" style="color: #d97706;">{{ al.expiry_date }}</span>
            </li>
          </ul>
          <p v-else class="text-sm text-gray-500 italic mt-2">Belum ada barang yang mendekati kedaluwarsa.</p>
          <div class="card-link-hint">
            <span>Lihat selengkapnya →</span>
          </div>
        </div>
      </div>

      <div class="charts-grid-top mb-6 grid grid-cols-2 gap-6">
        <ChartWidget :title="trendTitle">
          <StockTrendChart :chartData="stats?.charts?.stock_trend" />
        </ChartWidget>
        <ChartWidget title="Distribusi Kategori">
          <SessionRoleChart :chartData="stats?.charts?.category_distribution" />
        </ChartWidget>
      </div>

      <div class="charts-grid-bottom mt-6 grid grid-cols-2 gap-6">
        <ChartWidget title="Stok Per Kategori">
          <CategoryRadarChart :chartData="stats?.charts?.category_stock" />
        </ChartWidget>
        <ChartWidget title="Kontribusi Supplier Utama">
          <SupplierDonutChart :chartData="stats?.charts?.top_suppliers" />
        </ChartWidget>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { AlertCircle, AlertTriangle, RefreshCw } from 'lucide-vue-next';
import { fetchDashboardStats } from '@/utils/api';
import { useAuthRole } from '@/composables/useAuthRole';

definePageMeta({
  middleware: 'auth',
  layout: 'default'
});

const stats = ref(null);
const isLoading = ref(false);
const { isAdmin } = useAuthRole();
const router = useRouter();

const trendTitle = computed(() => {
  const year = stats.value?.charts?.stock_trend?.year || new Date().getFullYear();
  return `Tren Stok Masuk dan Keluar ${year}`;
});

const loadDashboard = async () => {
  isLoading.value = true;
  try {
    stats.value = await fetchDashboardStats();
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const refreshData = () => {
  loadDashboard();
};

onMounted(() => {
  loadDashboard();
});
</script>

<style scoped>
.alerts-list {
  list-style: none;
  max-height: 240px;
  overflow-y: auto;
  padding-right: 0.5rem;
  margin-top: 0.5rem;
}

/* Custom scrollbar for alerts list */
.alerts-list::-webkit-scrollbar {
  width: 4px;
}
.alerts-list::-webkit-scrollbar-track {
  background: rgba(0,0,0,0.02);
  border-radius: 4px;
}
.alerts-list::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.1);
  border-radius: 4px;
}

.alert-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid;
  gap: 0.75rem;
}

.alert-item:last-child {
  border-bottom: none;
}

.alert-item-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.alert-item-info {
  flex: 1;
  min-width: 0;
}

.alert-badge {
  flex-shrink: 0;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}
.header-actions {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}
.charts-grid-top, .charts-grid-bottom {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.spin-icon {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .kpi-grid {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions .btn {
    flex: 1;
    font-size: 0.8rem;
    padding: 0.4rem 0.6rem;
  }

  .charts-grid-top, .charts-grid-bottom {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.clickable-card {
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.clickable-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(16, 24, 40, 0.08);
}

.card-link-hint {
  margin-top: 0.75rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(226, 232, 240, 0.5);
}

.card-link-hint span {
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--primary-color);
}

.spin-anim {
  animation: spin 1s linear infinite;
}

.text-danger {
  color: #ef4444;
}
</style>
