<template>
  <div class="h-full w-full flex flex-col items-center justify-center relative" style="min-height: 250px;">
    <template v-if="hasData">
      <ClientOnly>
        <apexchart type="donut" height="250" :options="chartOptions" :series="series"></apexchart>
      </ClientOnly>
      <div class="supplier-legend mt-3">
        <div v-for="(item, idx) in legendItems" :key="idx" class="legend-item">
          <span class="legend-dot" :style="{ backgroundColor: chartColors[idx] || '#e2e8f0' }"></span>
          <span class="text-xs text-muted">{{ item.label }}</span>
          <span class="text-xs font-semibold">{{ formatRupiah(item.value) }}</span>
        </div>
      </div>
    </template>
    <p v-else class="text-sm text-muted italic">Belum ada data supplier masuk.</p>
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

const chartColors = ['#256e5f', '#f59e0b', '#6366f1', '#ec4899', '#94a3b8'];

const hasData = computed(() => props.chartData && props.chartData.length > 0);

const series = computed(() => props.chartData.map(d => d.total_value || 0));

const legendItems = computed(() => props.chartData.map(d => ({
  label: d.notes || 'Tidak diketahui',
  value: d.total_value || 0,
})));

const formatRupiah = (val) => {
  if (!val && val !== 0) return 'Rp 0';
  return 'Rp ' + Math.round(val).toLocaleString('id-ID');
};

const chartOptions = computed(() => ({
  chart: { type: 'donut' },
  labels: props.chartData.map(d => d.notes || 'Tidak diketahui'),
  colors: chartColors.slice(0, props.chartData.length),
  dataLabels: { enabled: false },
  legend: { show: false },
  stroke: { width: 2 },
  tooltip: {
    y: { formatter: (val) => formatRupiah(val) }
  },
  noData: {
    text: 'Belum ada data',
    style: { fontSize: '14px', color: '#94a3b8' }
  }
}));
</script>

<style scoped>
.supplier-legend {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  width: 100%;
  padding: 0 0.5rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
</style>
