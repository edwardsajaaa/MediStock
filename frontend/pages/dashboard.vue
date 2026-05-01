<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1 class="text-xl font-semibold">Dasbor Farmasi</h1>
      <div class="header-actions">
        <button class="btn btn-outline flex items-center gap-2" :disabled="!isAdmin">
          <RefreshCw :size="14" />
          Perbarui Data
        </button>
        <button v-if="isAdmin" class="btn btn-primary">Laporan Bulanan</button>
      </div>
    </div>
    
    <div class="dashboard-content mt-6">
      <div class="kpi-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem;">
        <MetricCard 
          title="Total Item" 
          :value="stats ? stats.metrics.total_items : '...'" 
          change="" 
          :isPositive="true" 
          comparisonText="Data aktif obat dan alat kesehatan" 
        />
        <MetricCard 
          title="Peringatan Stok" 
          :value="stats ? stats.metrics.low_stock_count : '...'" 
          change="Butuh Tindakan" 
          :isPositive="false" 
          comparisonText="Segera lakukan restok" 
          type="danger"
        />
        <MetricCard 
          title="Siaga Kedaluwarsa" 
          :value="stats ? stats.metrics.expiring_count : '...'" 
          change="3 Bulan Ke Depan" 
          :isPositive="false" 
          comparisonText="Barang perlu perhatian khusus" 
          type="warning"
        />
        <MetricCard 
          title="Mutasi Hari Ini" 
          :value="stats ? stats.metrics.today_transactions : '...'" 
          change="Live" 
          :isPositive="true" 
          comparisonText="Akumulasi barang masuk dan keluar" 
        />
      </div>

      <div class="grid grid-cols-2 gap-6 mb-6">
        <!-- Smart Alerts Sections -->
        <div class="card shadow-md border-0 ring-1 ring-gray-100" style="background: linear-gradient(to bottom right, #fff, #fef2f2);">
          <h2 class="text-base font-semibold mb-3 flex items-center gap-2 text-danger">
            <AlertCircle :size="18" /> Peringatan Stok Rendah
          </h2>
          <ul v-if="stats && stats.alerts.low_stock.length > 0" style="list-style: none;">
            <li v-for="(al, idx) in stats.alerts.low_stock" :key="idx" class="flex justify-between items-center py-2 border-b border-red-100" style="border-color: #fee2e2;">
              <span class="font-semibold text-gray-800">{{ al.item_name }}</span>
              <span class="badge badge-danger">Sisa {{ al.current_qty }} / Min {{ al.min_stock }}</span>
            </li>
          </ul>
          <p v-else class="text-sm text-gray-500 italic">Semua stok masih aman.</p>
        </div>

        <div class="card shadow-md border-0 ring-1 ring-warning-100" style="background: linear-gradient(to bottom right, #fff, #fffbeb);">
          <h2 class="text-base font-semibold mb-3 flex items-center gap-2" style="color: #d97706;">
            <AlertTriangle :size="18" /> Peringatan Kedaluwarsa
          </h2>
          <ul v-if="stats && stats.alerts.expiring.length > 0" style="list-style: none;">
            <li v-for="(al, idx) in stats.alerts.expiring" :key="idx" class="flex justify-between items-center py-2 border-b" style="border-color: #fef3c7;">
              <div>
                <div class="font-semibold text-gray-800">{{ al.item_name }}</div>
                <div class="text-xs text-muted">Batch {{ al.batch_number }} · Qty {{ al.quantity }}</div>
              </div>
              <span class="text-sm font-semibold" style="color: #d97706;">{{ al.expiry_date }}</span>
            </li>
          </ul>
          <p v-else class="text-sm text-gray-500 italic">Belum ada barang yang mendekati kedaluwarsa.</p>
        </div>
      </div>

      <div class="charts-grid-top mb-6 grid grid-cols-2 gap-6">
        <ChartWidget title="Tren Stok Masuk dan Keluar">
          <StockTrendChart />
        </ChartWidget>
        <ChartWidget title="Distribusi Kategori">
          <SessionRoleChart />
        </ChartWidget>
      </div>

      <div class="charts-grid-bottom mt-6 grid grid-cols-2 gap-6">
        <ChartWidget title="Analisis Radar Penjualan">
          <CategoryRadarChart />
        </ChartWidget>
        <ChartWidget title="Kontribusi Supplier Utama">
          <SupplierDonutChart />
        </ChartWidget>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { AlertCircle, AlertTriangle, RefreshCw } from 'lucide-vue-next';
import { fetchDashboardStats } from '@/utils/api';
import { useAuthRole } from '@/composables/useAuthRole';

definePageMeta({
  middleware: 'auth',
  layout: 'default'
});

const stats = ref(null);
const { isAdmin } = useAuthRole();

onMounted(async () => {
  try {
    stats.value = await fetchDashboardStats();
  } catch (error) {
    console.error(error);
  }
});
</script>

<style scoped>
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
.header-actions {
  display: flex;
  gap: 0.6rem;
}
.charts-grid-top, .charts-grid-bottom {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
</style>
