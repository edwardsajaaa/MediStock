<template>
  <div class="flex-col gap-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="page-title">Kelola Pengguna</h1>
        <p class="text-sm text-muted">Manajemen akun dan hak akses pengguna sistem</p>
      </div>
      <button class="btn btn-outline gap-2" @click="loadUsers">
        <RefreshCw :size="14" />
        Perbarui
      </button>
    </div>

    <!-- Stats -->
    <div class="user-stats-grid mb-6">
      <div class="summary-card">
        <div class="summary-icon-wrap primary">
          <Users :size="20" />
        </div>
        <div>
          <div class="summary-value">{{ users.length }}</div>
          <div class="summary-label">Total Pengguna</div>
        </div>
      </div>
      <div class="summary-card">
        <div class="summary-icon-wrap admin">
          <Shield :size="20" />
        </div>
        <div>
          <div class="summary-value">{{ adminCount }}</div>
          <div class="summary-label">Admin</div>
        </div>
      </div>
      <div class="summary-card">
        <div class="summary-icon-wrap staff">
          <UserCheck :size="20" />
        </div>
        <div>
          <div class="summary-value">{{ staffCount }}</div>
          <div class="summary-label">Staf Farmasi</div>
        </div>
      </div>
    </div>

    <!-- User Table -->
    <div class="card">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-base font-semibold">Daftar Pengguna</h2>
      </div>

      <div v-if="errorMsg" class="error-banner mb-4">
        <AlertCircle :size="16" />
        <span>{{ errorMsg }}</span>
      </div>

      <table class="table" role="table" aria-label="Daftar pengguna">
        <thead>
          <tr>
            <th>Pengguna</th>
            <th>Role</th>
            <th>Terdaftar</th>
            <th>Login Terakhir</th>
            <th v-if="isAdmin" class="text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.id">
            <td>
              <div class="user-cell">
                <div class="user-avatar">
                  {{ getInitials(u.full_name || u.email) }}
                </div>
                <div>
                  <div class="font-semibold">{{ u.full_name || '-' }}</div>
                  <div class="text-xs text-muted">{{ u.email }}</div>
                </div>
              </div>
            </td>
            <td>
              <span class="role-badge" :class="normalizeRoleClass(u.role)">
                {{ normalizeRoleLabel(u.role) }}
              </span>
            </td>
            <td class="text-sm text-muted">{{ formatDate(u.created_at) }}</td>
            <td class="text-sm text-muted">{{ u.last_sign_in_at ? formatDate(u.last_sign_in_at) : 'Belum pernah' }}</td>
            <td v-if="isAdmin" class="text-right">
              <div class="role-action">
                <select
                  class="input role-select"
                  :value="normalizeRoleValue(u.role)"
                  @change="handleRoleChange(u.id, $event.target.value)"
                  :disabled="updatingId === u.id"
                >
                  <option value="admin">Admin</option>
                  <option value="staf">Staf Farmasi</option>
                </select>
                <span v-if="updatingId === u.id" class="role-updating">
                  <RefreshCw :size="14" class="spin-icon" />
                </span>
              </div>
            </td>
          </tr>
          <tr v-if="users.length === 0 && !loading">
            <td :colspan="isAdmin ? 5 : 4" class="text-center py-6 text-muted">Belum ada pengguna terdaftar.</td>
          </tr>
          <tr v-if="loading">
            <td :colspan="isAdmin ? 5 : 4" class="text-center py-6 text-muted">Memuat data pengguna...</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Users, Shield, UserCheck, RefreshCw, AlertCircle } from 'lucide-vue-next';
import { fetchUsers, updateUserRole } from '@/utils/api';
import { useAuthRole } from '@/composables/useAuthRole';

definePageMeta({
  middleware: 'auth',
  layout: 'default'
});

const { isAdmin } = useAuthRole();
const users = ref([]);
const loading = ref(false);
const errorMsg = ref('');
const updatingId = ref(null);

const adminCount = computed(() => users.value.filter(u => {
  const r = (u.role || '').toLowerCase();
  return ['admin', 'administrator', 'superadmin'].includes(r);
}).length);

const staffCount = computed(() => users.value.length - adminCount.value);

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(/[@.\s]/).filter(Boolean).slice(0, 2).map(s => s[0].toUpperCase()).join('');
};

const normalizeRoleLabel = (role) => {
  const r = (role || '').toLowerCase();
  if (['admin', 'administrator', 'superadmin'].includes(r)) return 'Admin';
  return 'Staf Farmasi';
};

const normalizeRoleClass = (role) => {
  const r = (role || '').toLowerCase();
  if (['admin', 'administrator', 'superadmin'].includes(r)) return 'role-admin';
  return 'role-staff';
};

const normalizeRoleValue = (role) => {
  const r = (role || '').toLowerCase();
  if (['admin', 'administrator', 'superadmin'].includes(r)) return 'admin';
  return 'staf';
};

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

const loadUsers = async () => {
  loading.value = true;
  errorMsg.value = '';
  try {
    const data = await fetchUsers();
    users.value = data?.users || [];
  } catch (e) {
    errorMsg.value = 'Gagal memuat data pengguna. Pastikan SUPABASE_SERVICE_ROLE_KEY sudah diatur di backend.';
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const handleRoleChange = async (userId, newRole) => {
  updatingId.value = userId;
  try {
    await updateUserRole(userId, newRole);
    await loadUsers();
  } catch (e) {
    alert('Gagal mengubah role: ' + e.message);
  } finally {
    updatingId.value = null;
  }
};

onMounted(() => { loadUsers(); });
</script>

<style scoped>
.user-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 10px;
  background: var(--card-bg);
  border: 1px solid rgba(226, 232, 240, 0.6);
  box-shadow: 0 6px 18px rgba(16, 24, 40, 0.03);
}

.summary-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.summary-icon-wrap.primary {
  background: #ecfdf5;
  color: var(--primary-color);
}

.summary-icon-wrap.admin {
  background: #eff6ff;
  color: #3b82f6;
}

.summary-icon-wrap.staff {
  background: #f0fdf4;
  color: #22c55e;
}

.summary-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.2;
}

.summary-label {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 0.15rem;
}

/* User cell */
.user-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--primary-color), #34d399);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
}

/* Role badge */
.role-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.role-admin {
  background: #eff6ff;
  color: #1d4ed8;
}

.role-staff {
  background: #ecfdf5;
  color: #065f46;
}

/* Role action */
.role-action {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: flex-end;
}

.role-select {
  width: auto;
  min-width: 130px;
  padding: 0.35rem 0.6rem;
  font-size: 0.8rem;
}

.spin-icon {
  animation: spin 1s linear infinite;
  color: var(--primary-color);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.role-updating {
  display: flex;
  align-items: center;
}

/* Error banner */
.error-banner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 0.7rem 0.9rem;
  color: #dc2626;
  font-size: 0.8rem;
}

.text-right {
  text-align: right;
}

.py-6 {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}
</style>
