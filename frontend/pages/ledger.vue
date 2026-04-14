<template>
  <div class="flex-col gap-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Kartu Stok (Ledger)</h1>
      <p class="text-muted">Riwayat mutasi keluar masuk barang</p>
    </div>

    <div class="card">
      <table style="width: 100%; border-collapse: collapse">
        <thead style="border-bottom: 1px solid var(--border-color); text-align: left">
          <tr>
            <th class="py-2 text-sm text-muted">Arah</th>
            <th class="py-2 text-sm text-muted">Waktu</th>
            <th class="py-2 text-sm text-muted">Detail Barang Mutasi</th>
            <th class="py-2 text-sm text-muted text-right">Nilai Mutasi</th>
            <th class="py-2 text-sm text-muted">Catatan</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="trx in transactions" :key="trx.id" style="border-bottom: 1px solid var(--border-color)">
            <td class="py-4">
              <div class="flex items-center gap-2">
                <div :style="{background: trx.type === 'IN' ? '#ecfdf5' : '#fef2f2', padding: '0.5rem', borderRadius: '0.25rem'}">
                  <ArrowDownRight v-if="trx.type === 'IN'" size="18" color="#10b981" />
                  <ArrowUpRight v-else size="18" color="#ef4444" />
                </div>
                <span class="font-bold" :style="{color: trx.type === 'IN' ? '#10b981' : '#ef4444'}">{{ trx.type }}</span>
              </div>
            </td>
            <td class="py-4">
              <div class="flex items-center gap-1 text-sm">
                <Clock size="14" class="text-muted" />
                <span>{{ new Date(trx.date).toLocaleString() }}</span>
              </div>
            </td>
            <td class="py-4">
              <div class="text-sm">
                <div v-for="(item, idxx) in trx.items" :key="idxx" :style="{borderBottom: idxx < trx.items.length - 1 ? '1px dashed #e2e8f0' : 'none', padding: '2px 0'}">
                  <span class="font-semibold">{{ item.qty }}x</span> {{ item.item?.name }} 
                  <span class="text-muted text-xs ml-2">(Batch: {{ item.batch?.batch_number }})</span>
                </div>
              </div>
            </td>
            <td class="py-4 text-right font-medium text-main">Rp {{ trx.total_amount.toLocaleString() }}</td>
            <td class="py-4 text-sm text-muted italic">{{ trx.notes || '-' }}</td>
          </tr>
          <tr v-if="transactions.length === 0">
            <td colspan="5" class="text-center py-6 text-muted">Belum ada riwayat mutasi.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchLedger } from '@/utils/api';
import { Clock, ArrowDownRight, ArrowUpRight } from 'lucide-vue-next';

definePageMeta({
  middleware: 'auth',
  layout: 'default'
});

const transactions = ref([]);

onMounted(async () => {
  const data = await fetchLedger();
  transactions.value = data || [];
});
</script>
