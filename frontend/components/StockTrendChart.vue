<template>
  <div class="h-full w-full" style="min-height: 300px;">
    <div class="flex gap-4 mb-4 text-sm font-medium flex-wrap">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-[#256e5f]"></div>
        <span class="text-muted">Stok Masuk (Nilai)</span>
        <span class="font-bold text-main">{{ formatRupiah(totalIn) }} • {{ pctIn }}%</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-[#f59e0b]"></div>
        <span class="text-muted">Stok Keluar (Nilai)</span>
        <span class="font-bold text-main">{{ formatRupiah(totalOut) }} • {{ pctOut }}%</span>
      </div>
    </div>
    <ClientOnly>
      <apexchart 
        v-if="isReady"
        type="line" 
        height="250" 
        :options="chartOptions" 
        :series="series"
        :key="chartKey"
      ></apexchart>
      <div v-else class="chart-loading">
        <span class="text-sm text-muted">Memuat grafik...</span>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  chartData: {
    type: Object,
    default: () => null
  }
});

const chartKey = ref(0);
const isReady = computed(() => !!props.chartData);

// Force re-render when data changes
watch(() => props.chartData, () => {
  chartKey.value++;
}, { deep: true });

const formatRupiah = (val) => {
  if (!val && val !== 0) return 'Rp 0';
  return 'Rp ' + Math.round(val).toLocaleString('id-ID');
};

const formatAxis = (value) => {
  if (value >= 1000000) return `Rp ${(value/1000000).toFixed(1)}Jt`;
  if (value >= 1000) return `Rp ${Math.round(value/1000)}Rb`;
  return `Rp ${value}`;
};

const totalIn = computed(() => props.chartData?.total_in || 0);
const totalOut = computed(() => props.chartData?.total_out || 0);

const pctIn = computed(() => {
  const total = totalIn.value + totalOut.value;
  return total > 0 ? Math.round((totalIn.value / total) * 100) : 0;
});

const pctOut = computed(() => {
  const total = totalIn.value + totalOut.value;
  return total > 0 ? Math.round((totalOut.value / total) * 100) : 0;
});

const series = computed(() => [
  { name: 'Stok Masuk', data: props.chartData?.series_in || Array(12).fill(0) },
  { name: 'Stok Keluar', data: props.chartData?.series_out || Array(12).fill(0) }
]);

const chartOptions = computed(() => ({
  chart: {
    type: 'line',
    toolbar: { show: false },
    zoom: { enabled: false }
  },
  colors: ['#256e5f', '#f59e0b'],
  dataLabels: { enabled: false },
  stroke: { curve: 'straight', width: 3 },
  markers: { size: 4 },
  grid: {
    borderColor: '#e2e8f0',
    strokeDashArray: 3,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } }
  },
  xaxis: {
    categories: props.chartData?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
    labels: { style: { colors: '#94a3b8', fontSize: '12px' } },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    labels: { 
      style: { colors: '#94a3b8', fontSize: '12px' },
      formatter: formatAxis
    }
  },
  tooltip: {
    y: { formatter: (value) => formatRupiah(value) }
  },
  legend: { show: false },
  noData: {
    text: 'Belum ada data transaksi',
    style: { fontSize: '14px', color: '#94a3b8' }
  }
}));
</script>

<style scoped>
.chart-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 250px;
}
</style>
