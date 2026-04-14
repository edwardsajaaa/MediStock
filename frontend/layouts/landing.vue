<template>
  <div class="landing-layout min-h-screen bg-[#f8f9fa] text-[#1f2937] font-sans">
    <!-- Navbar (Optional, for navigation back to app) -->
    <header class="w-full bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center shadow-sm sticky top-0 z-50">
      <div class="flex items-center gap-2">
        <!-- ShieldPlus SVG (inline or Lucide) -->
        <img src="/img/Medistock.png" alt="MediStock Logo" height="36" style="object-fit: contain;" />
      </div>
    </header>
    
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup>
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  font-family: 'Poppins', system-ui, -apple-system, sans-serif;
}
.landing-layout {
  min-height: 100vh;
}
</style>
