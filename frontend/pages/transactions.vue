<template>
  <div class="flex-col gap-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">Transaksi</h1>
        <p class="text-muted">Input penerimaan gudang atau pengeluaran / penjualan</p>
      </div>
      <div class="bg-white rounded-lg p-1 border shadow-sm" style="display: flex; gap: 4px; border-color: var(--border-color);">
        <button 
          class="px-4 py-2 font-semibold text-sm rounded" 
          :class="type === 'IN' ? 'bg-primary text-white' : 'bg-transparent text-muted hover:bg-gray-50'"
          :style="{backgroundColor: type === 'IN' ? 'var(--primary-color)' : '', color: type === 'IN' ? 'white' : 'var(--text-muted)'}"
          @click="type = 'IN'; cart = [];">
          Barang Masuk (Inbound)
        </button>
        <button 
          class="px-4 py-2 font-semibold text-sm rounded"
          :class="type === 'OUT' ? 'bg-danger text-white' : 'bg-transparent text-muted hover:bg-gray-50'"
          :style="{backgroundColor: type === 'OUT' ? '#ef4444' : '', color: type === 'OUT' ? 'white' : 'var(--text-muted)'}"
          @click="type = 'OUT'; cart = [];">
          Barang Keluar (Outbound)
        </button>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-6">
      <!-- Form Add -->
      <div class="card col-span-1">
        <h2 class="text-lg font-semibold mb-4 border-b pb-2 flex items-center gap-2" style="border-color: var(--border-color);">
          <ArrowDownRight v-if="type === 'IN'" class="text-primary"/>
          <ArrowUpRight v-else style="color: #ef4444;" />
          {{ type === 'IN' ? 'Form Penerimaan (IN)' : 'Form Pengeluaran (OUT)' }}
        </h2>
        
        <div class="flex-col gap-4">
          <div>
            <label class="text-sm font-medium mb-1 block">Pilih Barang</label>
            <select class="input" v-model="selectedItem">
              <option value="">-- Pilih --</option>
              <option v-for="item in items" :key="item.id" :value="item.id">
                {{ item.name }} - {{ item.sku }} {{ type === 'OUT' ? `(Stok: ${item.total_stock})` : '' }}
              </option>
            </select>
          </div>
          
          <div class="mt-4">
            <label class="text-sm font-medium mb-1 block">Jumlah (Qty)</label>
            <input type="number" class="input" v-model="qty" />
          </div>

          <template v-if="type === 'IN'">
            <div class="mt-4">
              <label class="text-sm font-medium mb-1 block">Nomor Batch Baru</label>
              <input type="text" class="input" placeholder="Wajib untuk barang masuk" v-model="batchNum" />
            </div>
            <div class="mt-4">
              <label class="text-sm font-medium mb-1 block">Tanggal Kadaluarsa</label>
              <input type="date" class="input" placeholder="YYYY-MM-DD" v-model="expiry" />
            </div>
          </template>

          <button class="btn btn-outline w-full mt-4 flex items-center justify-center gap-2" @click="addToCart">
            <Plus size="16"/> Tambahkan ke Daftar
          </button>
        </div>
      </div>

      <!-- Cart -->
      <div class="card col-span-2 flex flex-col justify-between">
        <div>
          <h2 class="text-lg font-semibold mb-4 border-b pb-2" style="border-color: var(--border-color);">
            Daftar Barang {{ type === 'OUT' ? '(Keranjang Keluar)' : '(Daftar Masuk)' }}
          </h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem;">
            <thead style="border-bottom: 1px solid var(--border-color); text-align: left;">
              <tr>
                <th class="py-2 text-sm text-muted">Item</th>
                <th class="py-2 text-sm text-muted">Qty</th>
                <th v-if="type === 'IN'" class="py-2 text-sm text-muted">Batch & Expiry</th>
                <th class="py-2 text-sm text-muted text-right">Harga</th>
                <th class="py-2 text-sm text-muted text-right">Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(c, idx) in cart" :key="idx" style="border-bottom: 1px solid var(--border-color);">
                <td class="py-3 font-medium">{{ c.name }}</td>
                <td class="py-3 font-medium bg-gray-50 text-center rounded">{{ c.qty }}</td>
                <td v-if="type === 'IN'" class="py-3 text-sm text-muted">
                  <div>{{ c.batch_number }}</div>
                  <div style="font-size: 0.7rem;">{{ c.expiry_date }}</div>
                </td>
                <td class="py-3 text-right">Rp {{ c.price.toLocaleString() }}</td>
                <td class="py-3 text-right font-medium text-primary">Rp {{ (c.qty * c.price).toLocaleString() }}</td>
                <td class="py-3 text-right">
                  <button @click="removeFromCart(idx)" style="color: #ef4444; background: none; border: none; cursor: pointer;">
                    <Trash2 size="16"/>
                  </button>
                </td>
              </tr>
              <tr v-if="cart.length === 0">
                <td :colspan="type === 'IN' ? 6 : 5" class="py-8 text-center text-muted">
                  Belum ada barang di daftar
                </td>
              </tr>
            </tbody>
          </table>

          <div class="mt-4">
            <label class="text-sm font-medium mb-1 block">Catatan Transaksi</label>
            <input type="text" class="input" placeholder="Cth: Resep dr. Andi, atau PO Ke Supplier PT Phapros" v-model="notes" />
          </div>
        </div>

        <div class="mt-6 pt-4 border-t flex justify-between items-center" style="border-color: var(--border-color);">
          <div>
            <p class="text-sm text-muted mb-1">Total Nilai Transaksi</p>
            <h3 class="text-2xl font-bold" :style="{color: type === 'IN' ? 'var(--text-main)' : '#047857'}">
              Rp {{ totalCart.toLocaleString() }}
            </h3>
          </div>
          <button class="btn px-6 py-3 font-bold text-white rounded" 
                  :style="{backgroundColor: cart.length > 0 ? (type === 'IN' ? 'var(--primary-color)' : '#10b981') : 'var(--text-muted)'}" 
                  @click="handleSubmit" 
                  :disabled="cart.length === 0">
            Proses Transaksi {{ type }}
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
  items.value = data || [];
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
