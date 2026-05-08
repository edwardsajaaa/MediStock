<template>
  <div class="h-full w-full flex items-center justify-center p-2" style="min-height: 250px;">
    <template v-if="hasData">
      <ClientOnly>
        <apexchart type="radar" height="250" width="300" :options="chartOptions" :series="series"></apexchart>
      </ClientOnly>
    </template>
    <p v-else class="text-sm text-muted italic">Belum ada data stok per kategori.</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  chartData: {
    type: Array,
    default: () => []
  }
});

const hasData = computed(() => props.chartData && props.chartData.length > 0);

const series = computed(() => [{
  name: 'Total Stok',
  data: props.chartData.map(d => d.total_stock || 0)
}]);

const chartOptions = computed(() => ({
  chart: {
    type: 'radar',
    toolbar: { show: false }
  },
  labels: props.chartData.map(d => d.category || 'Lainnya'),
  colors: ['#256e5f'],
  fill: { opacity: 0.2 },
  stroke: { width: 2, colors: ['#256e5f'] },
  markers: { size: 0 },
  xaxis: {
    labels: { style: { colors: '#64748b', fontSize: '11px', fontFamily: 'inherit' } }
  },
  yaxis: { show: false },
  tooltip: {
    y: { formatter: (val) => `${val.toLocaleString('id-ID')} unit` }
  },
  noData: {
    text: 'Belum ada data',
    style: { fontSize: '14px', color: '#94a3b8' }
  }
}));
</script>
