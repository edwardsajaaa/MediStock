<template>
  <div class="app-container" :class="isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'">
    <button
      v-if="isSidebarOpen"
      class="sidebar-backdrop"
      aria-label="Tutup panel samping"
      @click="closeSidebar"
    ></button>
    <Sidebar />
    <div class="main-content">
      <Header />
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useSidebar } from '@/composables/useSidebar';

const { isSidebarOpen, closeSidebar } = useSidebar();
</script>

<style scoped>
.sidebar-backdrop {
  position: fixed;
  inset: 0;
  border: none;
  background: rgba(15, 23, 42, 0.25);
  backdrop-filter: blur(1px);
  z-index: 18;
}

@media (min-width: 901px) {
  .sidebar-backdrop {
    display: none;
  }
}
</style>
