<template>
  <div class="flex-col gap-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="page-title">Data Master</h1>
        <p class="text-sm text-muted">Kelola data obat dan alat kesehatan</p>
      </div>
      <button v-if="isAdmin" class="btn btn-primary gap-2" @click="showForm = !showForm">
        <Plus size="18" />
        {{ showForm ? 'Tutup Form' : 'Tambah Data' }}
      </button>
    </div>

    <div v-if="showForm && isAdmin" class="card mb-6">
      <h2 class="text-base font-semibold mb-4">Tambah Data Baru</h2>
      <form @submit.prevent="handleSubmit" class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-sm font-medium mb-1 block">Nama Item</label>
          <input required type="text" class="input" v-model="formData.name" />
        </div>
        <div>
          <label class="text-sm font-medium mb-1 block">Kategori</label>
          <select class="input" v-model="formData.category">
            <option value="Obat Bebas">Obat Bebas</option>
            <option value="Obat Resep">Obat Resep</option>
            <option value="Alkes">Alat Kesehatan</option>
          </select>
        </div>
        <div>
          <label class="text-sm font-medium mb-1 block">SKU / Kode Unik</label>
          <input required type="text" class="input" v-model="formData.sku" />
        </div>
        <div>
          <label class="text-sm font-medium mb-1 block">Stok Minimum</label>
          <input type="number" class="input" v-model="formData.min_stock" />
        </div>
        <div>
          <label class="text-sm font-medium mb-1 block">Harga Beli</label>
          <input type="number" class="input" v-model="formData.base_price" />
        </div>
        <div>
          <label class="text-sm font-medium mb-1 block">Harga Jual</label>
          <input type="number" class="input" v-model="formData.sell_price" />
        </div>
        <div class="col-span-2 flex justify-end mt-4">
          <button type="submit" class="btn btn-primary">Simpan Item</button>
        </div>
      </form>
    </div>

    <div class="card">
      <div class="flex justify-between items-center mb-4">
        <div class="search-wrap">
          <Search class="icon" size="18" />
          <input aria-label="Cari data" type="text" placeholder="Cari data..." class="input search-input" />
        </div>
      </div>

      <div v-if="!isAdmin" class="mb-4 rounded-lg border px-4 py-3 text-sm" style="border-color: #dbeafe; background: #eff6ff; color: #1e3a8a;">
        Mode staf: data master hanya bisa dilihat. Penambahan dan ubah data hanya untuk Admin.
      </div>
      
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
            <td class="text-right font-medium text-primary">Rp {{ item.sell_price.toLocaleString() }}</td>
          </tr>
          <tr v-if="items.length === 0">
            <td colspan="5" class="text-center py-6 text-muted">Belum ada data barang</td>
          </tr>
        </tbody>
      </table>

      <div class="flex items-center justify-between mt-4 pt-4" style="border-top: 1px solid var(--border-color)">
        <button class="btn btn-outline" :disabled="currentPage === 1" @click="loadItems(currentPage - 1)">Sebelumnya</button>
        <span class="text-sm text-muted">Halaman {{ currentPage }}</span>
        <button class="btn btn-outline" :disabled="items.length < pageSize" @click="loadItems(currentPage + 1)">Berikutnya</button>
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
