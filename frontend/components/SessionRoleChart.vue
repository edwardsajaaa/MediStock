<template>
  <div class="flex flex-col h-full" style="min-height: 300px;">
    <p class="text-xs text-muted mb-4">Menampilkan data distribusi kategori barang</p>
    <div class="flex-1 flex flex-col justify-center">
      <template v-if="categories.length > 0">
        <div v-for="item in categories" :key="item.label" class="mb-4">
          <div class="flex justify-between items-center mb-2">
            <div class="flex items-center gap-2">
              <div 
                class="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100" 
                :style="{ color: item.color }"
              >
                <component :is="item.icon" :size="16" />
              </div>
              <span class="text-sm font-medium text-main">{{ item.label }}</span>
            </div>
            <div class="text-sm font-semibold">
              {{ item.count }} <span class="text-muted font-normal">• {{ item.percentage }}%</span>
            </div>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-2">
            <div 
              class="h-2 rounded-full transition-all duration-500" 
              :style="{ width: item.percentage + '%', backgroundColor: item.color }"
            ></div>
          </div>
        </div>
      </template>
      <p v-else class="text-sm text-muted italic text-center py-8">Belum ada data kategori.</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Pill, Stethoscope, HeartPulse, Package as PackageIcon } from 'lucide-vue-next';

const props = defineProps({
  chartData: {
    type: Array,
    default: () => []
  }
});

const iconMap = {
  'Obat Bebas': Pill,
  'Obat Resep': Stethoscope,
  'Alkes': HeartPulse,
};

const colorMap = {
  'Obat Bebas': '#256e5f',
  'Obat Resep': '#f59e0b',
  'Alkes': '#6366f1',
};

const categories = computed(() => {
  const data = props.chartData || [];
  const totalCount = data.reduce((acc, d) => acc + (d.count || 0), 0);
  
  return data.map((d) => ({
    label: d.category || 'Lainnya',
    count: d.count || 0,
    percentage: totalCount > 0 ? Math.round(((d.count || 0) / totalCount) * 100) : 0,
    icon: iconMap[d.category] || PackageIcon,
    color: colorMap[d.category] || '#94a3b8',
  }));
});
</script>
