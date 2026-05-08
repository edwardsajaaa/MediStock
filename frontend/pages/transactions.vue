<template>
  <div class="transactions-page">
    <div class="transactions-header">
      <div>
        <h1 class="page-title">Transaksi Kasir</h1>
        <p class="text-sm text-muted">Pencatatan penjualan dan barang keluar</p>
      </div>
    </div>

    <div class="transactions-grid">
      <!-- Form Panel -->
      <section class="card panel">
        <div class="panel-header">
          <h2 class="panel-title">
            <ArrowUpRight class="text-danger" />
            Form Barang Keluar
          </h2>
          <p class="panel-subtitle">Isi data barang sebelum ditambahkan ke daftar transaksi.</p>
        </div>

        <div class="form-grid">
          <div class="form-field">
            <label class="text-sm font-medium mb-1 block">Pilih Barang</label>
            <select aria-label="Pilih Barang" class="input" v-model="selectedItem">
              <option value="">-- Pilih Barang --</option>
              <option v-for="item in items" :key="item.id" :value="item.id">
                {{ item.name }} - {{ item.sku }} (Stok: {{ item.total_stock }})
              </option>
            </select>
          </div>

          <div class="form-field">
            <label class="text-sm font-medium mb-1 block">Jumlah</label>
            <input type="number" class="input" v-model="qty" />
          </div>


          <button class="btn btn-outline w-full flex items-center justify-center gap-2" @click="addToCart">
            <Plus size="16"/> Tambahkan
          </button>
        </div>
      </section>

      <!-- Cart Panel -->
      <section class="card panel panel-wide">
        <div class="panel-header">
          <h2 class="panel-title">Daftar Transaksi (Keluar)</h2>
          <p class="panel-subtitle">Periksa detail item, qty, dan subtotal sebelum menyimpan.</p>
        </div>

        <div class="table-wrap">
          <table class="table" role="table" aria-label="Daftar transaksi">
            <thead>
              <tr>
                <th>Item</th>
                <th class="text-center">Qty</th>
                <th class="text-right">Harga</th>
                <th class="text-right">Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(c, idx) in cart" :key="idx">
                <td class="font-medium">{{ c.name }}</td>
                <td class="text-center">{{ c.qty }}</td>
                <td class="text-right">Rp {{ c.price.toLocaleString() }}</td>
                <td class="text-right font-medium text-primary">Rp {{ (c.qty * c.price).toLocaleString() }}</td>
                <td class="text-right">
                  <button class="delete-btn" @click="removeFromCart(idx)" aria-label="Hapus item" title="Hapus">
                    <Trash2 size="16"/>
                  </button>
                </td>
              </tr>
              <tr v-if="cart.length === 0">
                <td colspan="5" class="py-8 text-center text-muted">
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

        <div v-if="cart.length > 0" class="cashier-section mt-6 p-5 rounded-xl border border-gray-200" style="background-color: #f8fafc;">
          <h3 class="font-bold text-gray-700 mb-4 pb-2 border-b border-gray-200">Pembayaran Kasir</h3>
          
          <div class="flex justify-between items-center mb-4">
            <label for="cash-input" class="font-medium text-gray-600 text-sm">Uang Pembeli (Rp)</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">Rp</span>
              <input 
                id="cash-input"
                type="number" 
                class="input text-right font-bold text-lg" 
                style="width: 200px; padding-left: 2.5rem; height: 44px;" 
                placeholder="0" 
                v-model.number="cashReceived" 
                aria-label="Uang Pembeli" 
              />
            </div>
          </div>
          
          <div class="flex justify-between items-center pt-2">
            <span class="font-medium text-gray-600 text-sm">Kembalian</span>
            <span v-if="!cashReceived" class="text-sm italic text-gray-400">
              Menunggu input nominal...
            </span>
            <span v-else-if="changeAmount < 0" class="text-sm font-medium text-danger bg-red-50 px-2 py-1 rounded">
              Uang belum cukup
            </span>
            <span v-else class="text-xl font-bold text-success">
              Rp {{ changeAmount.toLocaleString() }}
            </span>
          </div>
        </div>

        <div class="total-bar mt-6">
          <div>
            <p class="text-sm text-muted mb-1">Total Tagihan</p>
            <h3 class="text-3xl font-bold" style="color: #047857">
              Rp {{ totalCart.toLocaleString() }}
            </h3>
          </div>
          <button class="submit-btn" 
                  style="font-size: 1rem; padding: 0.75rem 2rem; min-height: 50px;"
                  @click="handleSubmit" 
                  :disabled="cart.length === 0 || changeAmount < 0 || !cashReceived">
            Simpan Transaksi
          </button>
        </div>
      </section>
    </div>

    <!-- Receipt / Struk Modal -->
    <ReceiptModal 
      :show="showReceipt" 
      :data="receiptData" 
      @close="closeReceipt" 
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { fetchItems, createTransaction } from '@/utils/api';
import { ArrowUpRight, Plus, Trash2 } from 'lucide-vue-next';
import ReceiptModal from '@/components/ReceiptModal.vue';

definePageMeta({
  middleware: 'auth',
  layout: 'default'
});

const items = ref([]);
const notes = ref('');
const cart = ref([]);

const showReceipt = ref(false);
const receiptData = ref(null);

const selectedItem = ref('');
const qty = ref('');

const cashReceived = ref('');

const changeAmount = computed(() => {
  const cash = parseFloat(cashReceived.value) || 0;
  return cash - totalCart.value;
});

onMounted(async () => {
  const data = await fetchItems();
  items.value = data?.data || data || [];
});

const addToCart = () => {
  if (!selectedItem.value || !qty.value) return;
  const item = items.value.find(i => i.id === parseInt(selectedItem.value));
  
  cart.value.push({
    item_id: item.id,
    name: item.name,
    qty: parseInt(qty.value),
    price: item.sell_price
  });
  
  selectedItem.value = '';
  qty.value = '';
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
    const res = await createTransaction({
      type: 'OUT',
      total_amount: totalAmount,
      notes: notes.value,
      items: cart.value,
    });
    
    // Siapkan data untuk struk
    receiptData.value = {
      transaction_id: res.transaction_id || Math.floor(Math.random() * 10000),
      type: 'OUT',
      date: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
      items: [...cart.value],
      total: totalAmount,
      cash: parseFloat(cashReceived.value) || 0,
      change: changeAmount.value,
      notes: notes.value
    };
    
    showReceipt.value = true; // Munculkan popup
    
    // Bersihkan form
    cart.value = [];
    notes.value = '';
    cashReceived.value = '';
    
    // PENTING: Refresh data master agar stok terbaru langsung tampil!
    const data = await fetchItems();
    items.value = data?.data || data || [];
    
  } catch (e) {
    alert(e.message);
  }
};

const closeReceipt = () => {
  showReceipt.value = false;
  receiptData.value = null;
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
  box-shadow: 0 2px 4px rgba(15, 23, 42, 0.04);
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
  font-size: 0.8125rem;
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
  border-radius: 0.625rem;
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

@media (max-width: 768px) {
  .transactions-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .type-toggle {
    width: 100%;
  }

  .type-toggle .btn {
    flex: 1;
    padding: 0.5rem 0.75rem;
    font-size: 0.85rem;
  }

  .total-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .submit-btn {
    width: 100%;
    text-align: center;
  }

  .panel {
    padding: 1rem;
  }

  .table-wrap {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .table thead th,
  .table tbody td {
    padding: 0.5rem 0.6rem;
    font-size: 0.8rem;
    white-space: nowrap;
  }
}

</style>
