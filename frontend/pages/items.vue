<template>
  <div class="flex-col gap-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="page-title">Data Master</h1>
        <p class="text-sm text-muted">Kelola data obat dan alat kesehatan</p>
      </div>
      <button class="btn btn-primary gap-2 btn-add-item" @click="openPanel">
        <Plus size="18" />
        Tambah Data
      </button>
    </div>

    <div class="card">
      <div class="flex justify-between items-center mb-4">
        <div class="search-wrap">
          <Search class="icon" size="18" />
          <input aria-label="Cari data" type="text" placeholder="Cari data..." class="input search-input" v-model="searchQuery" />
        </div>
      </div>

      <table class="table" role="table" aria-label="Daftar barang">
        <thead>
          <tr>
            <th>SKU</th>
            <th>Nama</th>
            <th>Kategori</th>
            <th class="text-right">Stok</th>
            <th class="text-right">Harga Jual</th>
            <th class="text-center" style="width: 60px">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredItems" :key="item.id">
            <td class="font-medium">{{ item.sku }}</td>
            <td>
              <div class="flex items-center gap-2">
                <div style="background: var(--bg-color); padding: 0.35rem; border-radius: 6px">
                  <Archive size="16" class="text-primary" />
                </div>
                <span class="font-semibold">{{ item.name }}</span>
              </div>
            </td>
            <td>
              <span
                class="badge"
                :class="item.category === 'Alkes' ? 'badge-primary' : (item.category === 'Obat Resep' ? 'badge-danger' : 'badge-success')"
              >
                {{ item.category }}
              </span>
            </td>
            <td class="text-right">
              <span class="font-semibold" :class="item.total_stock === 0 ? 'text-danger' : ''">{{ item.total_stock }}</span>
            </td>
            <td class="text-right font-medium text-primary">Rp {{ item.sell_price?.toLocaleString() }}</td>
            <td class="text-center">
              <button
                class="btn-edit"
                @click="openEditPanel(item)"
                :title="'Edit ' + item.name"
                aria-label="Edit item"
              >
                <Pencil size="15" />
              </button>
            </td>
          </tr>
          <tr v-if="filteredItems.length === 0">
            <td colspan="6" class="text-center py-6 text-muted">Belum ada data barang</td>
          </tr>
        </tbody>
      </table>

      <div class="flex items-center justify-between mt-4 pt-4" style="border-top: 1px solid var(--border-color)">
        <button class="btn btn-outline" :disabled="currentPage === 1" @click="loadItems(currentPage - 1)">Sebelumnya</button>
        <span class="text-sm text-muted">Halaman {{ currentPage }}</span>
        <button class="btn btn-outline" :disabled="items.length < pageSize" @click="loadItems(currentPage + 1)">Berikutnya</button>
      </div>
    </div>

    <!-- Backdrop overlay -->
    <Transition name="fade">
      <div v-if="showPanel" class="panel-backdrop" @click="closePanel"></div>
    </Transition>

    <!-- Slide-in Side Panel -->
    <Transition name="slide-panel">
      <div v-if="showPanel" class="side-panel">
        <div class="side-panel-header">
          <div>
            <h2 class="side-panel-title">{{ isEditMode ? 'Edit Data Item' : 'Tambah Data Baru' }}</h2>
            <p class="text-sm text-muted">{{ isEditMode ? 'Perbarui informasi item yang ada' : 'Isi form berikut untuk menambah item' }}</p>
          </div>
          <button class="panel-close-btn" @click="closePanel" aria-label="Tutup panel">
            <X size="20" />
          </button>
        </div>

        <div class="side-panel-body">
          <div v-if="formError" class="alert alert-error">
            <AlertCircle size="16" />
            <span>{{ formError }}</span>
          </div>

          <div v-if="formSuccess" class="alert alert-success">
            <CheckCircle size="16" />
            <span>{{ isEditMode ? 'Data berhasil diperbarui!' : 'Data berhasil ditambahkan!' }}</span>
          </div>

          <form @submit.prevent="handleSubmit" class="panel-form">
            <div class="form-group">
              <label class="form-label">SKU / Kode Unik <span class="text-danger">*</span></label>
              <input
                required
                type="text"
                class="input"
                v-model="formData.sku"
                :disabled="isSubmitting"
                placeholder="Contoh: SKU-001"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Nama Item <span class="text-danger">*</span></label>
              <input
                required
                type="text"
                class="input"
                v-model="formData.name"
                :disabled="isSubmitting"
                placeholder="Contoh: Paracetamol 500mg"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Kategori <span class="text-danger">*</span></label>
              <select class="input" v-model="formData.category" :disabled="isSubmitting">
                <option value="Obat Bebas">Obat Bebas</option>
                <option value="Obat Resep">Obat Resep</option>
                <option value="Alkes">Alat Kesehatan</option>
              </select>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Stok Minimum</label>
                <input
                  type="number"
                  class="input"
                  v-model="formData.min_stock"
                  :disabled="isSubmitting"
                  min="0"
                  placeholder="0"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Harga Beli <span class="text-danger">*</span></label>
                <div class="input-prefix-wrap">
                  <span class="input-prefix">Rp</span>
                  <input
                    required
                    type="number"
                    class="input input-with-prefix"
                    v-model="formData.base_price"
                    :disabled="isSubmitting"
                    min="0"
                    step="0.01"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Harga Jual <span class="text-danger">*</span></label>
              <div class="input-prefix-wrap">
                <span class="input-prefix">Rp</span>
                <input
                  required
                  type="number"
                  class="input input-with-prefix"
                  v-model="formData.sell_price"
                  :disabled="isSubmitting"
                  min="0"
                  step="0.01"
                  placeholder="0"
                />
              </div>
            </div>

            <div class="panel-form-actions">
              <button
                type="button"
                class="btn btn-outline"
                @click="resetForm"
                :disabled="isSubmitting"
              >
                Bersihkan
              </button>
              <button
                type="submit"
                class="btn btn-primary btn-submit"
                :disabled="isSubmitting"
              >
                <Loader2 v-if="isSubmitting" size="16" class="spin-icon" />
                {{ isSubmitting ? 'Menyimpan...' : (isEditMode ? 'Perbarui Item' : 'Simpan Item') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import { Plus, Search, Archive, X, AlertCircle, CheckCircle, Loader2, Pencil } from 'lucide-vue-next';
import { fetchItems, createItem, updateItem } from '@/utils/api';

definePageMeta({
  middleware: 'auth',
  layout: 'default'
});

const items = ref([]);
const currentPage = ref(1);
const pageSize = 20;
const showPanel = ref(false);
const isSubmitting = ref(false);
const formError = ref('');
const formSuccess = ref('');
const searchQuery = ref('');
const isEditMode = ref(false);
const editingItemId = ref(null);

const formData = reactive({
  name: '', category: 'Obat Bebas', sku: '', min_stock: 0, base_price: 0, sell_price: 0
});

const filteredItems = computed(() => {
  if (!searchQuery.value.trim()) return items.value;
  const q = searchQuery.value.toLowerCase();
  return items.value.filter(item =>
    item.sku?.toLowerCase().includes(q) ||
    item.name?.toLowerCase().includes(q) ||
    item.category?.toLowerCase().includes(q)
  );
});

const openPanel = () => {
  isEditMode.value = false;
  editingItemId.value = null;
  resetForm();
  showPanel.value = true;
  document.body.style.overflow = 'hidden';
};

const openEditPanel = (item) => {
  isEditMode.value = true;
  editingItemId.value = item.id;
  formData.name = item.name;
  formData.category = item.category;
  formData.sku = item.sku;
  formData.min_stock = item.min_stock || 0;
  formData.base_price = item.base_price || 0;
  formData.sell_price = item.sell_price || 0;
  formError.value = '';
  formSuccess.value = '';
  showPanel.value = true;
  document.body.style.overflow = 'hidden';
};

const closePanel = () => {
  showPanel.value = false;
  document.body.style.overflow = '';
};

const resetForm = () => {
  formData.name = '';
  formData.category = 'Obat Bebas';
  formData.sku = '';
  formData.min_stock = 0;
  formData.base_price = 0;
  formData.sell_price = 0;
  formError.value = '';
  formSuccess.value = '';
};

const validateForm = () => {
  if (!formData.name.trim()) {
    formError.value = 'Nama item tidak boleh kosong';
    return false;
  }
  if (!formData.sku.trim()) {
    formError.value = 'SKU tidak boleh kosong';
    return false;
  }
  if (formData.base_price <= 0) {
    formError.value = 'Harga beli harus lebih dari 0';
    return false;
  }
  if (formData.sell_price <= 0) {
    formError.value = 'Harga jual harus lebih dari 0';
    return false;
  }
  if (formData.sell_price < formData.base_price) {
    formError.value = 'Harga jual harus lebih besar atau sama dengan harga beli';
    return false;
  }
  return true;
};

const loadItems = async (page = 1) => {
  try {
    currentPage.value = page;
    const data = await fetchItems({ page, limit: pageSize });
    items.value = data?.data || [];
  } catch (e) {
    console.error(e);
  }
};

onMounted(() => { loadItems(); });

const handleSubmit = async () => {
  formError.value = '';
  formSuccess.value = '';

  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;
  try {
    const data = {
      name: formData.name.trim(),
      category: formData.category,
      sku: formData.sku.trim(),
      min_stock: parseInt(formData.min_stock) || 0,
      base_price: parseFloat(formData.base_price) || 0,
      sell_price: parseFloat(formData.sell_price) || 0,
    };

    if (isEditMode.value && editingItemId.value) {
      await updateItem(editingItemId.value, data);
    } else {
      await createItem(data);
    }

    formSuccess.value = true;

    // Auto-close panel setelah 1.5 detik
    setTimeout(() => {
      closePanel();
      formSuccess.value = '';
    }, 1500);

    loadItems(currentPage.value);
  } catch (e) {
    formError.value = e.message || 'Terjadi kesalahan saat menyimpan data';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* ── Add Item Button ── */
.btn-add-item {
  padding: 0.5rem 1.1rem;
  font-weight: 600;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(37, 110, 95, 0.18);
  transition: all 0.2s ease;
}

.btn-add-item:hover {
  box-shadow: 0 4px 16px rgba(37, 110, 95, 0.28);
  transform: translateY(-1px);
}

/* ── Edit Button ── */
.btn-edit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.18s ease;
}

.btn-edit:hover {
  background: rgba(37, 110, 95, 0.08);
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: scale(1.08);
}

/* ── Text helpers ── */
.text-danger { color: #ef4444; }
.text-right { text-align: right; }
.text-center { text-align: center; }
.py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }

/* ── Backdrop ── */
.panel-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  backdrop-filter: blur(4px);
  z-index: 40;
}

/* ── Side Panel ── */
.side-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 420px;
  max-width: 92vw;
  height: 100vh;
  background: var(--card-bg);
  z-index: 50;
  display: flex;
  flex-direction: column;
  box-shadow: -8px 0 32px rgba(0, 0, 0, 0.08), -2px 0 8px rgba(0, 0, 0, 0.04);
  border-left: 1px solid var(--border-color);
}

.side-panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  background: linear-gradient(135deg, rgba(37, 110, 95, 0.04) 0%, transparent 100%);
}

.side-panel-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 2px;
}

.panel-close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: white;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.panel-close-btn:hover {
  background: var(--bg-color);
  color: var(--text-main);
  border-color: var(--text-light);
}

/* ── Panel Body ── */
.side-panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

/* ── Form Styles ── */
.panel-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-main);
  letter-spacing: 0.01em;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
}

/* ── Input prefix (Rp) ── */
.input-prefix-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.input-prefix {
  position: absolute;
  left: 0.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-muted);
  pointer-events: none;
  z-index: 1;
}

.input-with-prefix {
  padding-left: 2.2rem;
}

/* ── Alerts ── */
.alert {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 0.85rem;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  border: 1px solid;
}

.alert-error {
  background: #fef2f2;
  color: #991b1b;
  border-color: #fecaca;
}

.alert-success {
  background: #f0fdf4;
  color: #15803d;
  border-color: #bbf7d0;
}

/* ── Form Actions ── */
.panel-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.65rem;
  margin-top: 0.75rem;
  padding-top: 1.1rem;
  border-top: 1px solid var(--border-color);
}

.btn-submit {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-width: 130px;
  justify-content: center;
}

/* ── Spinner ── */
.spin-icon {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ── Slide Panel Transition ── */
.slide-panel-enter-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-panel-leave-active {
  transition: transform 0.25s cubic-bezier(0.4, 0, 1, 1);
}

.slide-panel-enter-from,
.slide-panel-leave-to {
  transform: translateX(100%);
}

/* ── Fade Transition (backdrop) ── */
.fade-enter-active {
  transition: opacity 0.25s ease;
}

.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ── Responsive ── */
@media (max-width: 500px) {
  .side-panel {
    width: 100vw;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
