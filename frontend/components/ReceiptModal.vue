<template>
  <Teleport to="body">
    <div v-if="show" class="modal-backdrop" @click="$emit('close')">
      <!-- Actions inside modal backdrop but outside receipt to hide on print -->
      <div class="receipt-actions-top hidden-print" @click.stop>
        <button class="btn btn-outline bg-white" @click="$emit('close')">Tutup</button>
        <button class="btn btn-primary flex items-center justify-center gap-2" @click="printReceipt">
          <Printer size="16" /> Cetak Struk
        </button>
      </div>

      <div class="modal-content receipt-modal" @click.stop>
        <!-- Zigzag top -->
        <div class="zigzag-top"></div>

        <div class="receipt-inner">
          <div class="receipt-header text-center">
            <h2 class="text-xl font-bold mb-1">MediStock Apotek</h2>
            <p class="text-sm">Jl. Kesehatan No. 123, Jakarta</p>
            <p class="text-sm">No Telp 081234567890</p>
          </div>

          <div class="receipt-divider my-3"></div>

          <div class="receipt-meta flex justify-between text-sm">
            <div>
              <div>{{ data.date }}</div>
              <div>No. TRX-{{ data.transaction_id }}</div>
            </div>
            <div class="text-right">
              <div>Kasir</div>
              <div>Admin</div>
            </div>
          </div>

          <div class="receipt-divider my-3"></div>

          <div class="receipt-items text-sm">
            <div v-for="(item, idx) in data.items" :key="idx" class="mb-2">
              <div class="font-bold">{{ item.name }}</div>
              <div class="flex justify-between">
                <span>{{ item.qty }} x Rp {{ item.price.toLocaleString() }}</span>
                <span>Rp {{ (item.qty * item.price).toLocaleString() }}</span>
              </div>
            </div>
          </div>

          <div class="receipt-divider my-3"></div>

          <div class="receipt-summary text-sm">
            <div class="flex justify-between mb-1">
              <span>Total QTY : {{ totalQty }}</span>
            </div>
            <div class="flex justify-between font-bold text-base mt-2 mb-1">
              <span>Total</span>
              <span>Rp {{ data.total?.toLocaleString() }}</span>
            </div>
            
            <template v-if="data.type === 'OUT'">
              <div class="flex justify-between mb-1">
                <span>Bayar (Cash)</span>
                <span>Rp {{ data.cash?.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between mb-1">
                <span>Kembali</span>
                <span>Rp {{ data.change?.toLocaleString() }}</span>
              </div>
            </template>
            <template v-else>
              <div class="flex justify-between mb-1 text-primary font-bold">
                <span>JENIS</span>
                <span>BARANG MASUK</span>
              </div>
            </template>
          </div>

          <div class="receipt-divider my-3"></div>

          <div class="receipt-footer text-center text-sm">
            <p v-if="data.notes" class="mb-2 italic">Catatan: {{ data.notes }}</p>
            <p>Terima kasih atas kunjungannya</p>
            <p>Semoga lekas sembuh</p>
          </div>
        </div>

        <!-- Zigzag bottom -->
        <div class="zigzag-bottom"></div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue';
import { Printer } from 'lucide-vue-next';

const props = defineProps({
  show: Boolean,
  data: Object
});

defineEmits(['close']);

const totalQty = computed(() => {
  if (!props.data || !props.data.items) return 0;
  return props.data.items.reduce((acc, item) => acc + item.qty, 0);
});

const printReceipt = () => {
  window.print();
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: fadeIn 0.2s ease;
  overflow-y: auto;
}

.receipt-actions-top {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  z-index: 10000;
}

.receipt-modal {
  position: relative;
  background: #fff;
  width: 100%;
  max-width: 320px;
  color: #000;
  font-family: 'Courier New', Courier, monospace;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  margin-bottom: 2rem;
}

.receipt-inner {
  padding: 2rem 1.5rem;
}

.receipt-divider {
  height: 0;
  border-bottom: 1px dashed #000;
}

.zigzag-top, .zigzag-bottom {
  position: absolute;
  left: 0;
  width: 100%;
  height: 10px;
  background: linear-gradient(135deg, transparent 5px, #fff 0) -5px 0,
              linear-gradient(-135deg, transparent 5px, #fff 0) -5px 0;
  background-color: transparent;
  background-size: 10px 10px;
}

.zigzag-top {
  top: -10px;
  transform: rotate(180deg);
}

.zigzag-bottom {
  bottom: -10px;
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
  @page {
    size: 80mm auto;
    margin: 0;
  }
  
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
    transform: none;
    width: 100%;
    max-width: 100%;
    box-shadow: none;
    margin: 0;
    padding: 10px; /* Safe area untuk printer margin */
  }
  .hidden-print {
    display: none !important;
  }
  .zigzag-top, .zigzag-bottom {
    display: none;
  }
}
</style>
