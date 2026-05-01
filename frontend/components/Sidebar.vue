<template>
  <aside class="sidebar" :class="{ collapsed: !isSidebarOpen }">
    <div class="sidebar-header">
      <img v-if="isSidebarOpen" src="/img/Medistock.png" alt="MediStock Logo" height="32" class="logo-icon logo-full" style="object-fit: contain;" />
      <img v-else src="/img/Medistock2.png" alt="MediStock" height="28" class="logo-icon logo-compact" style="object-fit: contain;" />
    </div>
    
    <div class="sidebar-scroll">
      <div class="menu-group">
        <div v-if="isSidebarOpen" class="menu-label">MENU UTAMA</div>
        <NuxtLink to="/dashboard" class="menu-item" active-class="active" title="Dasbor" @click="handleNavClick">
          <LayoutDashboard :size="20" />
          <span v-if="isSidebarOpen">Dasbor</span>
        </NuxtLink>
        
        <NuxtLink to="/items" class="menu-item" active-class="active" title="Data Master" @click="handleNavClick">
          <Database :size="20" />
          <span v-if="isSidebarOpen">Data Master</span>
        </NuxtLink>
        
        <NuxtLink to="/transactions" class="menu-item" active-class="active" title="Transaksi" @click="handleNavClick">
          <Receipt :size="20" />
          <span v-if="isSidebarOpen">Transaksi</span>
        </NuxtLink>
        
        <NuxtLink to="/ledger" class="menu-item" active-class="active" title="Kartu Stok" @click="handleNavClick">
          <ScrollText :size="20" />
          <span v-if="isSidebarOpen">Kartu Stok</span>
        </NuxtLink>
        
        <div v-if="isAdmin" class="menu-item has-submenu" title="Peringatan Cerdas">
          <div class="submenu-title">
            <Bell :size="20" />
            <span v-if="isSidebarOpen">Peringatan Cerdas</span>
          </div>
          <ChevronRight v-if="isSidebarOpen" :size="16" class="chevron" />
        </div>
        
        <div v-if="isAdmin" class="menu-item has-submenu" title="Laporan">
          <div class="submenu-title">
            <BarChart3 :size="20" />
            <span v-if="isSidebarOpen">Laporan</span>
          </div>
          <ChevronRight v-if="isSidebarOpen" :size="16" class="chevron" />
        </div>
      </div>
      
      <div v-if="isSidebarOpen" class="divider"></div>
      
      <div class="menu-group">
        <div class="menu-item toggle-item">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <PlaySquare :size="20" color="var(--text-muted)" />
            <span v-if="isSidebarOpen">Mode Pelatihan</span>
          </div>
          <div v-if="isSidebarOpen" class="toggle-switch active"></div>
        </div>
        <a href="#" class="menu-item">
          <MessageSquare :size="20" />
          <span v-if="isSidebarOpen">Masukan</span>
        </a>
        <a href="#" class="menu-item">
          <Info :size="20" />
          <span v-if="isSidebarOpen">Riwayat Aktivitas</span>
        </a>
      </div>
    </div>
    
    <div v-if="isAdmin && isSidebarOpen" class="premium-banner">
      <div class="banner-icon-bg">
        <ScrollText :size="16" color="var(--primary-color)" />
      </div>
      <p>Aktifkan pemantauan real-time untuk stok dan laporan yang lebih rapi.</p>
      <button class="btn-upgrade">Aktifkan</button>
    </div>
  </aside>
</template>

<script setup>
import { 
  LayoutDashboard, 
  Database, 
  Receipt, 
  ScrollText, 
  Bell, 
  BarChart3, 
  PlaySquare, 
  MessageSquare, 
  Info,
  ChevronRight
} from 'lucide-vue-next';

import { useAuthRole } from '@/composables/useAuthRole';
import { useSidebar } from '@/composables/useSidebar';

const { isAdmin } = useAuthRole();
const { isSidebarOpen, closeSidebar } = useSidebar();

const handleNavClick = () => {
  if (typeof window !== 'undefined' && window.innerWidth <= 900) {
    closeSidebar();
  }
};
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--sidebar-bg);
  border-right: 1px solid var(--border-color);
  width: 224px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 0.9rem 0.85rem;
  min-height: 60px;
}

.logo-icon {
  color: var(--primary-color);
}

.logo-full {
  width: 100%;
}

.logo-compact {
  margin: 0 auto;
}

.sidebar-header h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-main);
  flex: 1;
}

.sidebar.collapsed .menu-group {
  margin-bottom: 0.7rem;
}

.sidebar.collapsed .sidebar-header {
  padding: 0.9rem 0.4rem;
}

.sidebar.collapsed .menu-item {
  justify-content: center;
  padding: 0.62rem;
}

.sidebar-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 0 0.8rem;
}

.menu-group {
  margin-bottom: 1rem;
}

.menu-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-light);
  margin-bottom: 0.5rem;
  padding-left: 0.65rem;
  letter-spacing: 0.05em;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 0.85rem;
  color: var(--text-main);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: var(--radius-md);
  margin-bottom: 0.25rem;
  transition: all 0.2s ease;
}

.menu-item > span, .submenu-title > span {
  flex: 1;
  margin-left: 0.75rem;
}

.sidebar.collapsed .submenu-title {
  justify-content: center;
}

.menu-item:hover {
  background-color: var(--bg-color);
}

.menu-item.active {
  background-color: var(--primary-color);
  color: white;
}

.menu-item.active svg {
  color: white;
}

.menu-item svg {
  color: var(--text-muted);
  flex-shrink: 0;
}

.has-submenu {
  cursor: pointer;
}

.submenu-title {
  display: flex;
  align-items: center;
  flex: 1;
}

.submenu-items {
  display: flex;
  flex-direction: column;
  padding-left: 3rem;
  margin-bottom: 0.5rem;
  border-left: 1px solid var(--border-color);
  margin-left: 1.35rem;
}

.submenu-items a {
  padding: 0.4rem 0;
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.2s;
}

.submenu-items a:hover {
  color: var(--text-main);
}

.toggle-item {
  cursor: pointer;
}

@media (max-width: 900px) {
  .sidebar {
    width: 224px;
  }
}

.toggle-switch {
  width: 36px;
  height: 20px;
  background-color: var(--border-color);
  border-radius: 20px;
  position: relative;
  transition: background-color 0.3s;
}

.toggle-switch::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.3s;
}

.toggle-switch.active {
  background-color: var(--primary-color);
}

.toggle-switch.active::after {
  transform: translateX(16px);
}

.divider {
  height: 1px;
  background-color: var(--border-color);
  margin: 1rem 0;
}

.premium-banner {
  margin: 0.85rem;
  padding: 1rem;
  background: linear-gradient(180deg, #ecfdf5 0%, #f8fafc 100%);
  border: 1px solid #d1fae5;
  border-radius: 14px;
  color: white;
  position: relative;
  overflow: hidden;
}

.premium-banner::before {
  content: '';
  position: absolute;
  top: -20px;
  right: -20px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: rgba(37, 110, 95, 0.08);
}

.banner-icon-bg {
  width: 32px;
  height: 32px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.premium-banner p {
  font-size: 0.75rem;
  line-height: 1.4;
  margin-bottom: 1rem;
  color: var(--text-muted);
}

.btn-upgrade {
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
}
</style>
