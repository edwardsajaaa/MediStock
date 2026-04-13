<template>
  <div class="flex flex-col h-full" style="min-height: 300px;">
    <p class="text-xs text-muted mb-4">Showing Data for Top Session</p>
    <div class="flex-1 flex flex-col justify-center">
      <div v-for="item in roles" :key="item.label" class="mb-4">
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
            class="h-2 rounded-full" 
            :style="{ width: item.percentage + '%', backgroundColor: item.color }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { User, Users, Package as PackageIcon, UserCircle } from 'lucide-vue-next';

const roles = [
  { label: 'Apoteker', percentage: 80, count: '634', icon: User, color: '#256e5f' },
  { label: 'Asisten Apoteker', percentage: 45, count: '599', icon: Users, color: '#256e5f' },
  { label: 'Petugas Gudang', percentage: 35, count: '582', icon: PackageIcon, color: '#256e5f' },
  { label: 'Admin', percentage: 20, count: '453', icon: UserCircle, color: '#256e5f' }
];
</script>
