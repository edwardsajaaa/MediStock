<template>
  <div class="flex-col gap-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="page-title">Transaksi</h1>
        <p class="text-sm text-muted">Pencatatan barang masuk dan keluar</p>
      </div>
      <div class="flex gap-2 items-center">
        <button
          class="btn"
          :class="type === 'IN' ? 'btn-primary' : 'btn-outline'
          "
          @click="type = 'IN'; cart = [];">
          Barang Masuk
        </button>
        <button
          class="btn"
          :class="type === 'OUT' ? 'btn-primary' : 'btn-outline'"
          @click="type = 'OUT'; cart = [];">
          Barang Keluar
        </button>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-6">
      <!-- Form Add -->
      <div class="card col-span-1">
        <h2 class="text-base font-semibold mb-4 flex items-center gap-2">
          <ArrowDownRight v-if="type === 'IN'" class="text-primary"/>
          <ArrowUpRight v-else class="text-danger" />
          {{ type === 'IN' ? 'Form Barang Masuk' : 'Form Barang Keluar' }}
        </h2>
        
        <div class="flex-col gap-4">
          <div>
            <label class="text-sm font-medium mb-1 block">Pilih Barang</label>
            <select aria-label="Pilih Barang" class="input" v-model="selectedItem">
              <option value="">-- Pilih Barang --</option>
              <option v-for="item in items" :key="item.id" :value="item.id">
                {{ item.name }} - {{ item.sku }} {{ type === 'OUT' ? `(Stok: ${item.total_stock})` : '' }}
              </option>
            </select>
          </div>
          
          <div class="mt-4">
            <label class="text-sm font-medium mb-1 block">Jumlah</label>
            <input type="number" class="input" v-model="qty" />
          </div>

          <template v-if="type === 'IN'">
            <div class="mt-4">
              <label class="text-sm font-medium mb-1 block">Nomor Batch</label>
              <input type="text" class="input" placeholder="Wajib diisi" v-model="batchNum" />
            </div>
            <div class="mt-4">
              <label class="text-sm font-medium mb-1 block">Tanggal Kedaluwarsa</label>
              <input type="date" class="input" placeholder="YYYY-MM-DD" v-model="expiry" />
            </div>
          </template>

          <button class="btn btn-outline w-full mt-4 flex items-center justify-center gap-2" @click="addToCart">
            <Plus size="16"/> Tambahkan
          </button>
        </div>
      </div>

      <!-- Cart -->
      <div class="card col-span-2 flex flex-col justify-between">
        <div>
          <h2 class="text-base font-semibold mb-4">Daftar Transaksi {{ type === 'OUT' ? '(Keluar)' : '(Masuk)' }}</h2>
          
          <table class="table" role="table" aria-label="Daftar transaksi">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th v-if="type === 'IN'">Batch & Kedaluwarsa</th>
                <th class="text-right">Harga</th>
                <th class="text-right">Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(c, idx) in cart" :key="idx">
                <td class="font-medium">{{ c.name }}</td>
                <td class="text-center">{{ c.qty }}</td>
                <td v-if="type === 'IN'" class="text-sm text-muted">
                  <div>{{ c.batch_number }}</div>
                  <div class="text-xs">{{ c.expiry_date }}</div>
                </td>
                <td class="text-right">Rp {{ c.price.toLocaleString() }}</td>
                <td class="text-right font-medium text-primary">Rp {{ (c.qty * c.price).toLocaleString() }}</td>
                <td class="text-right">
                  <button class="btn btn-outline" @click="removeFromCart(idx)" aria-label="Hapus item">
                    <Trash2 size="16"/>
                  </button>
                </td>
              </tr>
              <tr v-if="cart.length === 0">
                <td :colspan="type === 'IN' ? 6 : 5" class="py-8 text-center text-muted">
                  Belum ada item di daftar
                </td>
              </tr>
            </tbody>
          </table>

          <div class="mt-4">
            <label class="text-sm font-medium mb-1 block">Catatan</label>
            <input type="text" class="input" placeholder="Contoh: resep, pembelian supplier, atau permintaan unit" v-model="notes" />
          </div>
        </div>

        <div class="mt-6 pt-4 border-t flex justify-between items-center" style="border-color: var(--border-color);">
          <div>
            <p class="text-sm text-muted mb-1">Total Nilai</p>
            <h3 class="text-2xl font-bold" :style="{color: type === 'IN' ? 'var(--text-main)' : '#047857'}">
              Rp {{ totalCart.toLocaleString() }}
            </h3>
          </div>
          <button class="btn px-6 py-3 font-bold text-white rounded" 
                  :style="{backgroundColor: cart.length > 0 ? (type === 'IN' ? 'var(--primary-color)' : '#10b981') : 'var(--text-muted)'}" 
                  @click="handleSubmit" 
                  :disabled="cart.length === 0">
            Simpan Transaksi
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { fetchItems, createTransaction } from '@/utils/api';
import { ArrowDownRight, ArrowUpRight, Plus, Trash2 } from 'lucide-vue-next';

definePageMeta({
  middleware: 'auth',
  layout: 'default'
});

const items = ref([]);
const type = ref('OUT');
const notes = ref('');
const cart = ref([]);

const selectedItem = ref('');
const qty = ref('');
const batchNum = ref('');
const expiry = ref('');

onMounted(async () => {
  const data = await fetchItems();
  items.value = data?.data || data || [];
});

const addToCart = () => {
  if (!selectedItem.value || !qty.value) return;
  const item = items.value.find(i => i.id === parseInt(selectedItem.value));
  
  const price = type.value === 'OUT' ? item.sell_price : item.base_price;
  
  cart.value.push({
    item_id: item.id,
    name: item.name,
    qty: parseInt(qty.value),
    price: price,
    batch_number: batchNum.value,
    expiry_date: expiry.value
  });
  
  selectedItem.value = '';
  qty.value = '';
  batchNum.value = '';
  expiry.value = '';
};

const removeFromCart = (index) => {
  cart.value.splice(index, 1);
};

const totalCart = computed(() => {
  return cart.value.reduce((acc, curr) => acc + (curr.qty * curr.price), 0);
});

const handleSubmit = async () => {
  if (cart.value.length === 0) return;
  
  let totalAmount = 0;
  cart.value.forEach(c => totalAmount += (c.qty * c.price));

  try {
    await createTransaction({
      type: type.value,
      total_amount: totalAmount,
      notes: notes.value,
      items: cart.value,
    });
    alert('Transaksi berhasil disimpan!');
    cart.value = [];
    notes.value = '';
  } catch (e) {
    alert(e.message);
  }
};
</script>
