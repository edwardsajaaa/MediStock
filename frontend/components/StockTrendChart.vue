<template>
  <div class="h-full w-full" style="min-height: 300px;">
    <div class="flex gap-4 mb-4 text-sm font-medium">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-[#256e5f]"></div>
        <span class="text-muted">Stok Masuk (Nilai)</span>
        <span class="font-bold text-main">$18,500.00 • 58%</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-[#f59e0b]"></div>
        <span class="text-muted">Stok Keluar (Nilai)</span>
        <span class="font-bold text-main">$13,200.00 • 42%</span>
      </div>
    </div>
    <ClientOnly>
      <apexchart type="line" height="250" :options="chartOptions" :series="series"></apexchart>
    </ClientOnly>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const series = ref([
  { name: 'Stok Masuk', data: [12000, 8000, 10000, 13000, 9000, 14000, 16000, 18500] },
  { name: 'Stok Keluar', data: [8000, 6000, 11000, 9000, 12000, 10000, 13000, 13200] }
]);

const chartOptions = ref({
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
    categories: ['Mar 2023', 'Jun 2023', 'Sep 2023', 'Dec 2023', 'Mar 2024', 'Jun 2024', 'Sep 2024', 'Dec 2024'],
    labels: { style: { colors: '#94a3b8', fontSize: '12px' } },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    labels: { 
      style: { colors: '#94a3b8', fontSize: '12px' },
      formatter: (value) => `$${value/1000}K`
    }
  },
  tooltip: {
    y: { formatter: (value) => `$${value}` }
  },
  legend: { show: false }
});
</script>
