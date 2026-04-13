<template>
  <div class="h-full w-full flex flex-col items-center justify-center pt-6 pb-2" style="min-height: 250px;">
    
    <!-- Custom CSS Gauge Implementation -->
    <div class="relative flex items-end justify-center" style="width: 200px; height: 100px; overflow: hidden;">
      <!-- Background Arc -->
      <div class="absolute top-0 w-full h-[200px] rounded-full border-[15px] border-slate-100" style="box-sizing: border-box;"></div>
      
      <!-- Foreground Arc (Green) -->
      <div class="absolute top-0 w-full h-[200px] rounded-full border-[15px] border-[#256e5f]" style="clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%); transform: rotate(0deg); box-sizing: border-box;"></div>
      
      <!-- Center content -->
      <div class="absolute bottom-4 flex flex-col items-center">
         <div class="bg-slate-50 p-2 rounded-full mb-1">
           <AlertTriangle :size="18" color="#94a3b8" />
         </div>
         <span class="text-3xl font-bold text-main">210</span>
         <span class="text-xs text-muted">Total Peringatan</span>
      </div>
    </div>
    
    <div class="w-full flex justify-between mt-8 px-4 text-center">
      <div>
        <div class="text-xl font-bold">109</div>
        <div class="text-xs text-muted">Peringatan Stok Rendah</div>
      </div>
      <div>
        <div class="text-xl font-bold">101</div>
        <div class="text-xs text-muted">Hampir Kadaluarsa</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { AlertTriangle } from 'lucide-vue-next';
</script>
