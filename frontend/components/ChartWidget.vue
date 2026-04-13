<template>
  <div class="chart-widget card">
    <div class="chart-header flex justify-between items-center mb-4">
      <div>
        <h3 class="chart-title text-base font-semibold">{{ title }}</h3>
        <p v-if="subtitle" class="chart-subtitle text-xs text-muted mt-1">{{ subtitle }}</p>
      </div>
      <div v-if="showActions" class="chart-actions flex gap-2">
        <button class="icon-btn-small"><Download :size="16" /></button>
        <button class="icon-btn-small"><MoreHorizontal :size="16" /></button>
      </div>
    </div>
    <div class="chart-body">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { MoreHorizontal, Download } from 'lucide-vue-next';

defineProps({
  title: String,
  showActions: {
    type: Boolean,
    default: true
  },
  subtitle: String
});
</script>

<style scoped>
.chart-widget {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-body {
  flex: 1;
  min-height: 250px;
  width: 100%;
}

.icon-btn-small {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.icon-btn-small:hover {
  background-color: var(--bg-color);
  color: var(--text-main);
}
</style>
