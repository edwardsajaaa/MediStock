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

    <!-- Receipt / Struk Modal -->
    <Teleport to="body">
      <div v-if="showReceipt" class="modal-backdrop" @click="closeReceipt">
        <div class="modal-content receipt-modal" @click.stop>
          <div class="receipt-header">
            <h2 class="text-xl font-bold text-center mb-1">MediStock</h2>
            <p class="text-center text-sm text-muted mb-4">Bukti Transaksi Barang</p>
            
            <div class="receipt-meta">
              <div class="flex justify-between mb-1">
                <span class="text-xs text-muted">ID Transaksi</span>
                <span class="text-xs font-semibold">#TRX-{{ receiptData?.transaction_id }}</span>
              </div>
              <div class="flex justify-between mb-1">
                <span class="text-xs text-muted">Tanggal</span>
                <span class="text-xs font-semibold">{{ receiptData?.date }}</span>
              </div>
              <div class="flex justify-between mb-1">
                <span class="text-xs text-muted">Jenis</span>
                <span class="text-xs font-bold" :class="receiptData?.type === 'IN' ? 'text-primary' : 'text-danger'">
                  {{ receiptData?.type === 'IN' ? 'BARANG MASUK' : 'BARANG KELUAR' }}
                </span>
              </div>
            </div>
          </div>

          <div class="receipt-body my-4">
            <div class="receipt-divider"></div>
            <table class="receipt-table w-full text-sm">
              <thead>
                <tr>
                  <th class="text-left pb-2 text-xs text-muted">Item</th>
                  <th class="text-center pb-2 text-xs text-muted">Qty</th>
                  <th class="text-right pb-2 text-xs text-muted">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in receiptData?.items" :key="idx">
                  <td class="py-2">
                    <div class="font-medium">{{ item.name }}</div>
                    <div class="text-xs text-muted">Rp {{ item.price.toLocaleString() }}</div>
                  </td>
                  <td class="text-center py-2">{{ item.qty }}</td>
                  <td class="text-right py-2">Rp {{ (item.qty * item.price).toLocaleString() }}</td>
                </tr>
              </tbody>
            </table>
            <div class="receipt-divider"></div>
            
            <div class="flex justify-between items-center mt-3 mb-2">
              <span class="font-semibold">Total Nilai</span>
              <span class="text-lg font-bold">Rp {{ receiptData?.total?.toLocaleString() }}</span>
            </div>
            
            <div v-if="receiptData?.notes" class="mt-4 p-3 bg-gray-50 rounded-lg text-xs">
              <strong>Catatan:</strong> {{ receiptData?.notes }}
            </div>
          </div>

          <div class="receipt-actions flex gap-3 mt-6">
            <button class="btn btn-outline flex-1" @click="closeReceipt">Tutup</button>
            <button class="btn btn-primary flex-1 flex items-center justify-center gap-2" @click="printReceipt">
              <Printer size="16" /> Cetak
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { fetchItems, createTransaction } from '@/utils/api';
import { ArrowDownRight, ArrowUpRight, Plus, Trash2, Printer } from 'lucide-vue-next';

definePageMeta({
  middleware: 'auth',
  layout: 'default'
});

const items = ref([]);
const type = ref('OUT');
const notes = ref('');
const cart = ref([]);

const showReceipt = ref(false);
const receiptData = ref(null);

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
    const res = await createTransaction({
      type: type.value,
      total_amount: totalAmount,
      notes: notes.value,
      items: cart.value,
    });
    
    // Siapkan data untuk struk
    receiptData.value = {
      transaction_id: res.transaction_id || Math.floor(Math.random() * 10000),
      type: type.value,
      date: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
      items: [...cart.value],
      total: totalAmount,
      notes: notes.value
    };
    
    showReceipt.value = true; // Munculkan popup
    
    // Bersihkan form
    cart.value = [];
    notes.value = '';
    
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

const printReceipt = () => {
  window.print();
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

/* ── Modal & Receipt Styles ── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: fadeIn 0.2s ease;
}

.modal-content {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.receipt-modal {
  position: relative;
}

.receipt-divider {
  height: 1px;
  background: var(--border-color);
  margin: 1rem 0;
  border-top: 1px dashed #cbd5e1;
}

.receipt-table th {
  border-bottom: 1px solid var(--border-color);
}

.receipt-table td {
  vertical-align: top;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleUp {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@media print {
  body * {
    visibility: hidden;
  }
  .receipt-modal, .receipt-modal * {
    visibility: visible;
  }
  .receipt-modal {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    max-width: 100%;
    padding: 0;
    box-shadow: none;
  }
  .receipt-actions {
    display: none !important;
  }
}
</style>
