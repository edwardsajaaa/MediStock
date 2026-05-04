<template>
  <header class="header">
    <button class="icon-btn toggle-btn" :aria-label="isSidebarOpen ? 'Tutup menu' : 'Buka menu'" @click="toggleSidebar">
      <PanelLeftClose v-if="isSidebarOpen" :size="18" />
      <PanelLeftOpen v-else :size="18" />
    </button>

    <div class="search-bar">
      <input 
        type="text" 
        placeholder="Cari data..."
        class="search-input"
      />
    </div>
    
    <div class="header-actions">
      <button class="icon-btn" aria-label="Unduh">
        <Download :size="20" />
      </button>
      <button class="icon-btn" aria-label="Sinkronisasi">
        <Rocket :size="20" />
      </button>
      <button class="icon-btn" aria-label="Pengaturan">
        <Settings :size="20" />
      </button>
      
      <div class="user-profile" style="display: flex; align-items: center; gap: 0.75rem;">
        <div style="text-align: right; line-height: 1.2;">
          <div style="font-size: 0.78rem; font-weight: 600; color: var(--text-main);">{{ userEmail }}</div>
          <div style="font-size: 0.68rem; color: var(--text-muted);">{{ role }}</div>
        </div>
        <div class="avatar">
          <img :src="avatarUrl" alt="User Avatar" />
        </div>
        <button class="icon-btn logout-btn" @click="handleLogout" title="Keluar">
          <LogOut :size="18" />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { Download, Rocket, Settings, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-vue-next';
import { useAuthRole } from '@/composables/useAuthRole';
import { useSidebar } from '@/composables/useSidebar';

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();
const { role } = useAuthRole();
const { isSidebarOpen, toggleSidebar } = useSidebar();

const userEmail = computed(() => user.value?.email || '');
const avatarUrl = computed(() => {
  const name = encodeURIComponent(userEmail.value.split('@')[0] || 'User');
  return `https://ui-avatars.com/api/?name=${name}&background=0f172a&color=fff`;
});

async function handleLogout() {
  await supabase.auth.signOut()
  await router.push('/login')
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0.78rem 1rem;
  background-color: transparent;
  border-bottom: 1px solid rgba(226, 232, 240, 0.45);
  height: 60px;
  gap: 0.55rem;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: var(--bg-color);
  border-radius: var(--radius-md);
  padding: 0.35rem 0.8rem;
  width: 260px;
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
}

.search-bar:focus-within {
  border-color: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
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
  gap: 0.55rem;
  margin-left: auto;
}

.toggle-btn {
  border: 1px solid rgba(226, 232, 240, 0.9);
  background: rgba(255, 255, 255, 0.9);
}

.icon-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  width: 32px;
  height: 32px;
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

.logout-btn:hover {
  background-color: #fef2f2 !important;
  color: #dc2626 !important;
}

.user-profile {
  margin-left: 0.25rem;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid white;
  box-shadow: var(--shadow-sm);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
