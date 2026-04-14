<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1 class="text-2xl font-bold">Dashboard Overview Farmasi</h1>
      <div class="header-actions">
        <button class="btn btn-outline hover:bg-gray-50 flex items-center gap-2">
          Data Refresh {{ stats ? '✔' : '...' }}
        </button>
        <button class="btn btn-primary shadow hover:-translate-y-1 transition-transform">Laporan Bulanan</button>
      </div>
    </div>
    
    <div class="dashboard-content mt-6">
      <div class="kpi-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem;">
        <MetricCard 
          title="Total Jenis Barang" 
          :value="stats ? stats.metrics.total_items : '...'" 
          change="" 
          :isPositive="true" 
          comparisonText="Katalog aktif obat & alkes" 
        />
        <MetricCard 
          title="Sistem Peringatan (Kritis/Low)" 
          :value="stats ? stats.metrics.low_stock_count : '...'" 
          change="Action Needed" 
          :isPositive="false" 
          comparisonText="Segera lakukan proses restok" 
          type="danger"
        />
        <MetricCard 
          title="Siaga Kadaluarsa (Expiry)" 
          :value="stats ? stats.metrics.expiring_count : '...'" 
          change="Next 3 Months" 
          :isPositive="false" 
          comparisonText="Barang butuh perlakuan khusus" 
          type="warning"
        />
        <MetricCard 
          title="Total Mutasi Hari Ini" 
          :value="stats ? stats.metrics.today_transactions : '...'" 
          change="Live" 
          :isPositive="true" 
          comparisonText="Akumulasi IN & OUT" 
        />
      </div>

      <div class="grid grid-cols-2 gap-6 mb-6">
        <!-- Smart Alerts Sections -->
        <div class="card shadow-md border-0 ring-1 ring-gray-100" style="background: linear-gradient(to bottom right, #fff, #fef2f2);">
          <h2 class="text-lg font-bold mb-4 flex items-center gap-2 text-danger">
            <AlertCircle :size="20" /> Low Stock Alerts
          </h2>
          <ul v-if="stats && stats.alerts.low_stock.length > 0" style="list-style: none;">
            <li v-for="(al, idx) in stats.alerts.low_stock" :key="idx" class="flex justify-between items-center py-2 border-b border-red-100" style="border-color: #fee2e2;">
              <span class="font-semibold text-gray-800">{{ al.item_name }}</span>
              <span class="badge badge-danger">Sisa: {{ al.current_qty }} (Min: {{ al.min_stock }})</span>
            </li>
          </ul>
          <p v-else class="text-sm text-gray-500 italic">Semua stok barang dalam batas aman.</p>
        </div>

        <div class="card shadow-md border-0 ring-1 ring-warning-100" style="background: linear-gradient(to bottom right, #fff, #fffbeb);">
          <h2 class="text-lg font-bold mb-4 flex items-center gap-2" style="color: #d97706;">
            <AlertTriangle :size="20" /> Expiry Alerts (FEFO)
          </h2>
          <ul v-if="stats && stats.alerts.expiring.length > 0" style="list-style: none;">
            <li v-for="(al, idx) in stats.alerts.expiring" :key="idx" class="flex justify-between items-center py-2 border-b" style="border-color: #fef3c7;">
              <div>
                <div class="font-semibold text-gray-800">{{ al.item_name }}</div>
                <div class="text-xs text-muted">Batch: {{ al.batch_number }} (Qty: {{ al.quantity }})</div>
              </div>
              <span class="text-sm font-bold" style="color: #d97706;">Exp: {{ al.expiry_date }}</span>
            </li>
          </ul>
          <p v-else class="text-sm text-gray-500 italic">Tidak ada barang yang mendekati batas kadaluarsa.</p>
        </div>
      </div>

      <div class="charts-grid-top mb-6 grid grid-cols-2 gap-6">
        <ChartWidget title="Tren Nilai Stok Masuk & Keluar">
          <StockTrendChart />
        </ChartWidget>
        <ChartWidget title="Distribusi Kategori Produk">
          <SessionRoleChart />
        </ChartWidget>
      </div>

      <div class="charts-grid-bottom mt-6 grid grid-cols-2 gap-6">
        <ChartWidget title="Analisis Radar Penjualan">
          <CategoryRadarChart />
        </ChartWidget>
        <ChartWidget title="Kontribusi Stok dari Supplier Utama">
          <SupplierDonutChart />
        </ChartWidget>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { AlertCircle, AlertTriangle } from 'lucide-vue-next';
import { fetchDashboardStats } from '@/utils/api';

definePageMeta({
  middleware: 'auth',
  layout: 'default'
});

const stats = ref(null);

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
}
.header-actions {
  display: flex;
  gap: 1rem;
}
.charts-grid-top, .charts-grid-bottom {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
</style>
