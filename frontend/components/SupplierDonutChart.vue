<template>
  <div class="h-full w-full flex items-center justify-center relative" style="min-height: 250px;">
    <ClientOnly>
      <apexchart type="donut" height="250" :options="chartOptions" :series="series"></apexchart>
    </ClientOnly>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const series = ref([45, 25, 15, 15]);

const chartOptions = ref({
  chart: { type: 'donut' },
  labels: ['Supplier A', 'Supplier B', 'Supplier C', 'Supplier D'],
  colors: ['#256e5f', '#f59e0b', '#94a3b8', '#e2e8f0'],
  dataLabels: { enabled: false },
  legend: { show: false },
  stroke: { width: 2 },
  tooltip: {
    y: { formatter: (val) => `${val}%` }
  }
});
</script>
