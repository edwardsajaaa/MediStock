<template>
  <header class="header">
    <div class="search-bar">
      <Search :size="18" class="search-icon" />
      <input 
        type="text" 
        placeholder="Search anything here..." 
        class="search-input"
      />
    </div>
    
    <div class="header-actions">
      <button class="icon-btn">
        <Download :size="20" />
      </button>
      <button class="icon-btn">
        <Rocket :size="20" />
      </button>
      <button class="icon-btn">
        <Settings :size="20" />
      </button>
      
      <div class="user-profile">
        <div class="avatar">
          <img src="https://ui-avatars.com/api/?name=User&background=f97316&color=fff" alt="User Avatar" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { Search, Download, Rocket, Settings } from 'lucide-vue-next';
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background-color: var(--sidebar-bg);
  border-bottom: 1px solid var(--border-color);
  height: 70px;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: var(--bg-color);
  border-radius: var(--radius-md);
  padding: 0.5rem 1rem;
  width: 350px;
  border: 1px solid var(--border-color);
}

.search-icon {
  color: var(--text-muted);
  margin-right: 0.5rem;
}

.search-input {
  border: none;
  background: transparent;
  outline: none;
  flex: 1;
  font-size: 0.875rem;
  color: var(--text-main);
}

.search-input::placeholder {
  color: var(--text-light);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.icon-btn:hover {
  background-color: var(--bg-color);
  color: var(--text-main);
}

.user-profile {
  margin-left: 0.5rem;
  cursor: pointer;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid white;
  box-shadow: var(--shadow-sm);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
