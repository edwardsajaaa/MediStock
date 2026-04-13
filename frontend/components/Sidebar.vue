<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <ShieldPlus class="logo-icon" :size="24" />
      <h2>MediStock</h2>
      <div class="menu-trigger">≡</div>
    </div>
    
    <div class="sidebar-scroll">
      <div class="menu-group">
        <div class="menu-label">MAIN MENU</div>
        <NuxtLink to="/" class="menu-item" active-class="active">
          <LayoutDashboard :size="20" />
          <span>Dashboard</span>
        </NuxtLink>
        
        <NuxtLink to="/items" class="menu-item" active-class="active">
          <Database :size="20" />
          <span>Master Data</span>
        </NuxtLink>
        
        <NuxtLink to="/transactions" class="menu-item" active-class="active">
          <Receipt :size="20" />
          <span>Transaksi</span>
        </NuxtLink>
        
        <NuxtLink to="/ledger" class="menu-item" active-class="active">
          <ScrollText :size="20" />
          <span>Kartu Stok Digital</span>
        </NuxtLink>
        
        <div class="menu-item has-submenu">
          <div class="submenu-title">
            <Bell :size="20" />
            <span>Smart Alerts</span>
          </div>
          <ChevronRight :size="16" class="chevron" />
        </div>
        
        <div class="menu-item has-submenu">
          <div class="submenu-title">
            <BarChart3 :size="20" />
            <span>Reporting</span>
          </div>
          <ChevronRight :size="16" class="chevron" />
        </div>
      </div>
      
      <div class="divider"></div>
      
      <div class="menu-group">
        <div class="menu-item toggle-item">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <PlaySquare :size="20" color="var(--text-muted)" />
            <span>Training Mode</span>
          </div>
          <div class="toggle-switch active"></div>
        </div>
        <a href="#" class="menu-item">
          <MessageSquare :size="20" />
          <span>Feedback</span>
        </a>
        <a href="#" class="menu-item">
          <Info :size="20" />
          <span>Aktivitas Log</span>
        </a>
      </div>
    </div>
    
    <div class="premium-banner">
      <div class="banner-icon-bg">
        <ScrollText :size="16" color="var(--primary-color)" />
      </div>
      <p>Aktifkan pelacakan real-time untuk validasi stok yang lebih akurat dan pelaporan yang lebih baik.</p>
      <button class="btn-upgrade">Tingkatkan Sekarang</button>
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
  ChevronRight,
  ShieldPlus
} from 'lucide-vue-next';
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--sidebar-bg);
  border-right: 1px solid var(--border-color);
  width: 250px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  gap: 0.75rem;
}

.logo-icon {
  color: var(--primary-color);
}

.sidebar-header h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-main);
  flex: 1;
}

.menu-trigger {
  color: var(--text-muted);
  font-size: 1.25rem;
  cursor: pointer;
}

.sidebar-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 0 1rem;
}

.menu-group {
  margin-bottom: 1rem;
}

.menu-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-light);
  margin-bottom: 0.5rem;
  padding-left: 0.75rem;
  letter-spacing: 0.05em;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
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
  padding-left: 3.25rem;
  margin-bottom: 0.5rem;
  border-left: 1px solid var(--border-color);
  margin-left: 1.5rem;
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
  margin: 1rem;
  padding: 1.25rem;
  background-color: #1d6b5e;
  border-radius: var(--radius-md);
  color: white;
  position: relative;
  overflow: hidden;
}

/* Background overlay decoration for banner */
.premium-banner::before {
  content: '';
  position: absolute;
  top: -20px;
  right: -20px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
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
  opacity: 0.9;
}

.btn-upgrade {
  background-color: white;
  color: var(--text-main);
  border: none;
  border-radius: var(--radius-md);
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
}
</style>
