<template>
  <div class="landing-layout min-h-screen bg-[#f8f9fa] text-[#1f2937] font-sans">
    <!-- Navbar (Optional, for navigation back to app) -->
    <header class="landing-header">
      <div class="landing-header-inner">
        <div class="flex items-center gap-2">
          <img src="/img/Medistock.png" alt="MediStock Logo" class="landing-logo" />
        </div>
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
:global(body) {
  margin: 0;
}

html, body {
  margin: 0;
  padding: 0;
  font-family: 'Poppins', system-ui, -apple-system, sans-serif;
}
.landing-layout {
  min-height: 100vh;
}

.landing-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.94);
  border-bottom: 1px solid rgba(226, 232, 240, 0.9);
  backdrop-filter: blur(14px);
}

.landing-header-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 9%;
  display: flex;
  align-items: center;
}

.landing-logo {
  height: 36px;
  width: auto;
  object-fit: contain;
  display: block;
}
</style>
