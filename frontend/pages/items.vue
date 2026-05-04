<template>
  <div class="items-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Data Master</h1>
        <p class="text-sm text-muted">Kelola data obat dan alat kesehatan</p>
      </div>
      <button v-if="isAdmin" class="btn-add" @click="showForm = !showForm">
        <Plus size="18" />
        {{ showForm ? 'Tutup Form' : 'Tambah Data' }}
      </button>
    </div>

    <div v-if="showForm && isAdmin" class="card form-panel">
      <div class="form-header">
        <h2 class="form-title">Tambah Data Baru</h2>
        <p class="form-subtitle">Isi data lengkap untuk menambah item ke master data.</p>
      </div>
      <form @submit.prevent="handleSubmit" class="form-grid">
        <div class="form-field">
          <label class="text-sm font-medium mb-1 block">Nama Item</label>
          <input required type="text" class="input" v-model="formData.name" />
        </div>
        <div class="form-field">
          <label class="text-sm font-medium mb-1 block">Kategori</label>
          <select class="input" v-model="formData.category">
            <option value="Obat Bebas">Obat Bebas</option>
            <option value="Obat Resep">Obat Resep</option>
            <option value="Alkes">Alat Kesehatan</option>
          </select>
        </div>
        <div class="form-field">
          <label class="text-sm font-medium mb-1 block">SKU / Kode Unik</label>
          <input required type="text" class="input" v-model="formData.sku" />
        </div>
        <div class="form-field">
          <label class="text-sm font-medium mb-1 block">Stok Minimum</label>
          <input type="number" class="input" v-model="formData.min_stock" />
        </div>
        <div class="form-field">
          <label class="text-sm font-medium mb-1 block">Harga Beli</label>
          <input type="number" class="input" v-model="formData.base_price" />
        </div>
        <div class="form-field">
          <label class="text-sm font-medium mb-1 block">Harga Jual</label>
          <input type="number" class="input" v-model="formData.sell_price" />
        </div>
        <div class="form-field form-actions">
          <button type="submit" class="btn-submit">Simpan Item</button>
        </div>
      </form>
    </div>

    <div class="card table-panel">
      <div class="table-header">
        <div class="search-wrap">
          <input aria-label="Cari data" type="text" placeholder="Cari data..." class="input search-input" />
        </div>
      </div>

      <div v-if="!isAdmin" class="info-banner">
        Mode staf: data master hanya bisa dilihat. Penambahan dan ubah data hanya untuk Admin.
      </div>
      
      <div class="table-wrap">
        <table class="table" role="table" aria-label="Daftar barang">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Nama</th>
              <th>Kategori</th>
              <th class="text-right">Stok</th>
              <th class="text-right">Harga Jual</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td class="font-medium">{{ item.sku }}</td>
              <td>
                <div class="flex items-center gap-2">
                  <div class="icon-badge">
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
              <td class="text-right font-medium text-primary">Rp {{ item.sell_price.toLocaleString() }}</td>
            </tr>
            <tr v-if="items.length === 0">
              <td colspan="5" class="text-center py-6 text-muted">Belum ada data barang</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <button class="btn-nav" :disabled="currentPage === 1" @click="loadItems(currentPage - 1)">← Sebelumnya</button>
        <span class="text-sm text-muted">Halaman {{ currentPage }}</span>
        <button class="btn-nav" :disabled="items.length < pageSize" @click="loadItems(currentPage + 1)">Berikutnya →</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, watchEffect } from 'vue';
import { Plus, Search, Archive } from 'lucide-vue-next';
import { fetchItems, createItem } from '@/utils/api';
import { useAuthRole } from '@/composables/useAuthRole';

definePageMeta({
  middleware: 'auth',
  layout: 'default'
});

const items = ref([]);
const currentPage = ref(1);
const pageSize = 20;
const showForm = ref(false);
const { isAdmin } = useAuthRole();
const formData = reactive({
  name: '', category: 'Obat Bebas', sku: '', min_stock: 0, base_price: 0, sell_price: 0
});

watchEffect(() => {
  if (!isAdmin.value) {
    showForm.value = false;
  }
});

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
  if (!isAdmin.value) return;

  try {
    const data = {
      ...formData,
      min_stock: parseInt(formData.min_stock),
      base_price: parseFloat(formData.base_price),
      sell_price: parseFloat(formData.sell_price),
    };
    await createItem(data);
    showForm.value = false;
    loadItems(currentPage.value);
  } catch (e) {
    alert(e.message);
  }
};
</script>

<style scoped>
.items-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: #1f2937;
}

.btn-add {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 0.625rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-add:hover {
  background-color: #059669;
}

.card {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.875rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.form-panel {
  background-color: #f9fafb;
}

.form-header {
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.form-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: #1f2937;
}

.form-subtitle {
  margin: 0;
  color: #6b7280;
  font-size: 0.8125rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-field label {
  color: #374151;
  font-weight: 500;
  font-size: 0.8125rem;
}

.input {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.625rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background-color: white;
}

.input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
}

.form-actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
}

.btn-submit {
  padding: 0.5rem 1.25rem;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 0.625rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-submit:hover {
  background-color: #059669;
}

.btn-submit:disabled {
  background-color: #cbd5e1;
  cursor: not-allowed;
  opacity: 0.6;
}

.table-panel {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.table-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 1rem;
  gap: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.search-wrap {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 0.5rem 0.875rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.625rem;
  width: 260px;
  transition: all 0.2s ease;
}

.search-wrap:focus-within {
  border-color: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
}

.search-input {
  flex: 1;
  border: none;
  padding: 0;
  background-color: transparent;
  font-size: 0.875rem;
  height: 28px;
  line-height: 28px;
  color: #1f2937;
  width: 100%;
}

.search-input::placeholder {
  color: #d1d5db;
}

.search-input:focus {
  outline: none;
  caret-color: #10b981;
}

.info-banner {
  margin-bottom: 1rem;
  padding: 0.75rem 0.875rem;
  border-radius: 0.5rem;
  border-left: 3px solid #3b82f6;
  background-color: #eff6ff;
  color: #1e3a8a;
  font-size: 0.8125rem;
  line-height: 1.4;
}

.table-wrap {
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
  background: white;
  margin-bottom: 1rem;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.table thead {
  background: linear-gradient(to bottom, #fafbfc, #f3f4f6);
  border-bottom: 1px solid #e5e7eb;
}

.table thead th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #374151;
}

.table thead th.text-right {
  text-align: right;
}

.table tbody tr {
  border-bottom: 1px solid #f0f1f3;
  transition: all 0.2s ease;
}

.table tbody tr:hover {
  background-color: #f9fafb;
}

.table tbody tr:last-child {
  border-bottom: none;
}

.table tbody td {
  padding: 0.75rem 1rem;
  color: #374151;
  vertical-align: middle;
}

.table tbody td.text-right {
  text-align: right;
}

.table tbody td.font-medium {
  font-weight: 500;
  color: #1f2937;
}

.table tbody td.font-semibold {
  font-weight: 600;
}

.table tbody td.text-primary {
  color: #10b981;
  font-weight: 600;
}

.table tbody td.text-danger {
  color: #ef4444;
  font-weight: 600;
}

.icon-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-radius: 0.5rem;
  flex-shrink: 0;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.02em;
}

.badge-primary {
  background-color: #dbeafe;
  color: #1e40af;
}

.badge-danger {
  background-color: #fee2e2;
  color: #991b1b;
}

.badge-success {
  background-color: #dcfce7;
  color: #166534;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding-top: 1rem;
  margin-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
}

.btn-nav {
  padding: 0.5rem 0.875rem;
  background-color: white;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 0.625rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-nav:hover:not(:disabled) {
  background-color: #f3f4f6;
  border-color: #9ca3af;
  color: #1f2937;
}

.btn-nav:disabled {
  color: #d1d5db;
  cursor: not-allowed;
  background-color: #fafbfc;
}

.text-muted {
  color: #9ca3af;
}

.text-right {
  text-align: right;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.gap-2 {
  gap: 0.5rem;
}
</style>
