<template>
  <div class="metric-card" :class="{ 'danger-border': type === 'danger' }">
    <div class="metric-title">{{ title }}</div>
    <div class="metric-value">{{ value }}</div>
    <div class="metric-footer">
      <span class="metric-change" :class="isPositive ? 'positive' : 'negative'">
        <ArrowUpRight v-if="isPositive" :size="14" />
        <ArrowDownRight v-else :size="14" />
        {{ change }}
      </span>
      <span class="metric-comparison">{{ comparisonText }}</span>
    </div>
  </div>
</template>

<script setup>
import { ArrowUpRight, ArrowDownRight } from 'lucide-vue-next';

defineProps({
  title: String,
  value: [String, Number],
  change: String,
  isPositive: Boolean,
  comparisonText: String,
  type: String
});
</script>

<style scoped>
.metric-card {
  background-color: var(--card-bg);
  border-radius: 14px;
  padding: 1.15rem 1.2rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
}

.metric-card.danger-border {
  border-left: 4px solid var(--danger-text);
  padding-left: 1.25rem; /* adjust padding for border */
}

.metric-title {
  font-size: 0.875rem;
  color: var(--text-muted);
  font-weight: 500;
  margin-bottom: 0.75rem;
}

.metric-value {
  font-size: 1.55rem;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 1rem;
}

.metric-footer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.metric-change {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.375rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
}

.metric-change.positive {
  background-color: var(--success-bg);
  color: var(--success-text);
}

.metric-change.negative {
  background-color: var(--danger-bg);
  color: var(--danger-text);
}

.metric-comparison {
  font-size: 0.75rem;
  color: var(--text-light);
}
</style>
