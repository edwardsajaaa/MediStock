<template>
  <div class="h-full w-full flex items-center justify-center p-2" style="min-height: 250px;">
    <ClientOnly>
      <apexchart type="radar" height="250" width="300" :options="chartOptions" :series="series"></apexchart>
    </ClientOnly>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const series = ref([{
  name: 'Kategori',
  data: [2728, 2409, 3028, 800, 1833, 1833]
}]);

const chartOptions = ref({
  chart: {
    type: 'radar',
    toolbar: { show: false }
  },
  labels: ['Obat Resep', 'Obat Bebas', 'Alat Kesehatan', 'Kosmetik Medik', 'Suplemen', 'Vaksin'],
  colors: ['#256e5f'],
  fill: { opacity: 0.2 },
  stroke: { width: 2, colors: ['#256e5f'] },
  markers: { size: 0 },
  xaxis: {
    labels: { style: { colors: '#64748b', fontSize: '11px', fontFamily: 'inherit' } }
  },
  yaxis: { show: false }
});
</script>
