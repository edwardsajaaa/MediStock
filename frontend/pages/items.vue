<template>
  <div class="flex-col gap-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">Master Data</h1>
        <p class="text-muted">Kelola data obat dan alat kesehatan</p>
      </div>
      <button class="btn btn-primary gap-2" @click="showForm = !showForm">
        <Plus size="18" />
        {{ showForm ? 'Batal Tambah' : 'Tambah Baru' }}
      </button>
    </div>

    <div v-if="showForm" class="card mb-6" style="animation: fadeIn 0.2s ease-in">
      <h2 class="text-lg font-semibold mb-4">Tambah Data Baru</h2>
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
          <label class="text-sm font-medium mb-1 block">SKU / Kode unik</label>
          <input required type="text" class="input" v-model="formData.sku" />
        </div>
        <div>
          <label class="text-sm font-medium mb-1 block">Min Stock (Alert)</label>
          <input type="number" class="input" v-model="formData.min_stock" />
        </div>
        <div>
          <label class="text-sm font-medium mb-1 block">Harga Beli Dasar</label>
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
        <div class="relative">
          <Search class="absolute left-3 top-1/2" style="transform: translateY(-50%); color: var(--text-light)" size="18" />
          <input type="text" placeholder="Cari item..." class="input" style="padding-left: 2.5rem; width: 300px" />
        </div>
      </div>
      
      <table style="width: 100%; border-collapse: collapse">
        <thead style="border-bottom: 1px solid var(--border-color); text-align: left">
          <tr>
            <th class="py-2 text-sm text-muted font-semibold">SKU</th>
            <th class="py-2 text-sm text-muted font-semibold">Nama Item</th>
            <th class="py-2 text-sm text-muted font-semibold">Kategori</th>
            <th class="py-2 text-sm text-muted font-semibold text-right">Stok Aktif</th>
            <th class="py-2 text-sm text-muted font-semibold text-right">Harga Jual</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id" style="border-bottom: 1px solid var(--border-color)">
            <td class="py-3 font-medium">{{ item.sku }}</td>
            <td class="py-3">
              <div class="flex items-center gap-2">
                <div style="background: var(--bg-color); padding: 0.5rem; border-radius: 0.25rem">
                  <Archive size="16" class="text-primary" />
                </div>
                <span class="font-semibold">{{ item.name }}</span>
              </div>
            </td>
            <td class="py-3">
              <span 
                class="badge" 
                :class="item.category === 'Alkes' ? 'badge-primary' : (item.category === 'Obat Resep' ? 'badge-danger' : 'badge-success')"
                :style="{
                  backgroundColor: item.category === 'Obat Resep' ? '#fee2e2' : item.category === 'Alkes' ? '#e0f2fe' : '', 
                  color: item.category === 'Obat Resep' ? '#991b1b' : item.category === 'Alkes' ? '#0369a1' : ''
                }"
              >
                {{ item.category }}
              </span>
            </td>
            <td class="py-3 text-right">
              <span class="font-semibold" :class="item.total_stock <= item.min_stock && item.total_stock > 0 ? 'text-primary' : item.total_stock === 0 ? 'text-danger' : ''" :style="{color: item.total_stock === 0 ? 'red': ''}">
                {{ item.total_stock }}
              </span>
            </td>
            <td class="py-3 text-right font-medium text-primary">Rp {{ item.sell_price.toLocaleString() }}</td>
          </tr>
          <tr v-if="items.length === 0">
            <td colspan="5" class="text-center py-6 text-muted">Belum ada data barang</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { Plus, Search, Archive } from 'lucide-vue-next';
import { fetchItems, createItem } from '@/utils/api';

const items = ref([]);
const showForm = ref(false);
const formData = reactive({
  name: '', category: 'Obat Bebas', sku: '', min_stock: 0, base_price: 0, sell_price: 0
});

const loadItems = async () => {
  try {
    const data = await fetchItems();
    items.value = data || [];
  } catch (e) {
    console.error(e);
  }
};

onMounted(() => { loadItems(); });

const handleSubmit = async () => {
  try {
    const data = {
      ...formData,
      min_stock: parseInt(formData.min_stock),
      base_price: parseFloat(formData.base_price),
      sell_price: parseFloat(formData.sell_price),
    };
    await createItem(data);
    showForm.value = false;
    loadItems();
  } catch (e) {
    alert(e.message);
  }
};
</script>
