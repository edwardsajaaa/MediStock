<template>
  <div class="app-container">
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
// Component automatically imported in Nuxt if inside components/
</script>
