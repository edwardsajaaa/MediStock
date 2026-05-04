<template>
  <div class="transactions-page">
    <div class="transactions-header">
      <div>
        <h1 class="page-title">Transaksi</h1>
        <p class="text-sm text-muted">Pencatatan barang masuk dan keluar</p>
      </div>
      <div class="type-toggle">
        <button
          class="btn"
          :class="type === 'IN' ? 'btn-primary' : 'btn-outline'"
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

    <div class="transactions-grid">
      <!-- Form Panel -->
      <section class="card panel">
        <div class="panel-header">
          <h2 class="panel-title">
            <ArrowDownRight v-if="type === 'IN'" class="text-primary"/>
            <ArrowUpRight v-else class="text-danger" />
            {{ type === 'IN' ? 'Form Barang Masuk' : 'Form Barang Keluar' }}
          </h2>
          <p class="panel-subtitle">Isi data barang sebelum ditambahkan ke daftar transaksi.</p>
        </div>

        <div class="form-grid">
          <div class="form-field">
            <label class="text-sm font-medium mb-1 block">Pilih Barang</label>
            <select aria-label="Pilih Barang" class="input" v-model="selectedItem">
              <option value="">-- Pilih Barang --</option>
              <option v-for="item in items" :key="item.id" :value="item.id">
                {{ item.name }} - {{ item.sku }} {{ type === 'OUT' ? `(Stok: ${item.total_stock})` : '' }}
              </option>
            </select>
          </div>

          <div class="form-field">
            <label class="text-sm font-medium mb-1 block">Jumlah</label>
            <input type="number" class="input" v-model="qty" />
          </div>

          <template v-if="type === 'IN'">
            <div class="form-field">
              <label class="text-sm font-medium mb-1 block">Nomor Batch</label>
              <input type="text" class="input" placeholder="Wajib diisi" v-model="batchNum" />
            </div>
            <div class="form-field">
              <label class="text-sm font-medium mb-1 block">Tanggal Kedaluwarsa</label>
              <input type="date" class="input" placeholder="YYYY-MM-DD" v-model="expiry" />
            </div>
          </template>

          <button class="btn btn-outline w-full flex items-center justify-center gap-2" @click="addToCart">
            <Plus size="16"/> Tambahkan
          </button>
        </div>
      </section>

      <!-- Cart Panel -->
      <section class="card panel panel-wide">
        <div class="panel-header">
          <h2 class="panel-title">Daftar Transaksi {{ type === 'OUT' ? '(Keluar)' : '(Masuk)' }}</h2>
          <p class="panel-subtitle">Periksa detail item, batch, dan subtotal sebelum menyimpan.</p>
        </div>

        <div class="table-wrap">
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
                  <button class="delete-btn" @click="removeFromCart(idx)" aria-label="Hapus item" title="Hapus">
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
        </div>

        <div class="form-field">
          <label class="text-sm font-medium mb-1 block">Catatan</label>
          <input type="text" class="input" placeholder="Contoh: resep, pembelian supplier, atau permintaan unit" v-model="notes" />
        </div>

        <div class="total-bar">
          <div>
            <p class="text-sm text-muted mb-1">Total Nilai</p>
            <h3 class="text-2xl font-bold" :style="{color: type === 'IN' ? 'var(--text-main)' : '#047857'}">
              Rp {{ totalCart.toLocaleString() }}
            </h3>
          </div>
          <button class="submit-btn" 
                  @click="handleSubmit" 
                  :disabled="cart.length === 0">
            Simpan Transaksi
          </button>
        </div>
      </section>
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

<style scoped>
.transactions-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.transactions-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.type-toggle {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.type-toggle .btn {
  padding: 0.6rem 1.5rem;
  border-radius: 0.65rem;
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid var(--border-color);
  background: white;
  color: var(--text-main);
  cursor: pointer;
  transition: all 0.2s ease;
}

.type-toggle .btn-primary {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.type-toggle .btn-primary:hover {
  background: #1f5149;
}

.type-toggle .btn-outline:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.transactions-grid {
  display: grid;
  grid-template-columns: minmax(260px, 1fr) minmax(0, 2fr);
  gap: 1.5rem;
}

.panel {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
  border-radius: 1rem;
}

.panel-wide {
  min-height: 100%;
}

.panel-header {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-main);
}

.panel-subtitle {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.form-grid {
  display: grid;
  gap: 1rem;
}

.form-field {
  display: flex;
  flex-direction: column;
}

.form-field .input,
.form-field select.input {
  background: #fff;
  border-radius: 0.85rem;
}

.table-wrap {
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  overflow: hidden;
  background: #fff;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table thead {
  background: #f9fafb;
  border-bottom: 2px solid var(--border-color);
}

.table thead th {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-light);
  font-weight: 600;
  padding: 0.875rem 1rem;
  text-align: left;
}

.table tbody tr {
  border-bottom: 1px solid rgba(226, 232, 240, 0.7);
  transition: background-color 0.2s ease;
}

.table tbody tr:hover {
  background-color: #f9fafb;
}

.table tbody tr:last-child {
  border-bottom: none;
}

.table tbody td {
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: var(--text-main);
}

.delete-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 0.6rem;
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.delete-btn:hover {
  background: #fee2e2;
  border-color: #fca5a5;
  color: #dc2626;
}

.submit-btn {
  padding: 0.75rem 1.75rem;
  border: none;
  border-radius: 0.75rem;
  background: var(--primary-color);
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  background: #1f5149;
  box-shadow: 0 4px 12px rgba(37, 110, 95, 0.3);
}

.submit-btn:disabled {
  background: #cbd5e1;
  color: #64748b;
  cursor: not-allowed;
  opacity: 0.6;
}

.total-bar {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

@media (max-width: 1100px) {
  .transactions-grid {
    grid-template-columns: 1fr;
  }

  .panel-wide {
    order: 2;
  }
}

@media (max-width: 720px) {
  .transactions-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .type-toggle {
    width: 100%;
    justify-content: space-between;
  }

  .total-bar {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
