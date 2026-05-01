<template>
  <div class="flex-col gap-6">
    <div class="mb-6">
      <h1 class="page-title">Kartu Stok</h1>
      <p class="text-sm text-muted">Riwayat mutasi barang masuk dan keluar</p>
    </div>

    <div class="card">
      <table class="table" role="table" aria-label="Riwayat kartu stok">
        <thead>
          <tr>
            <th>Arah</th>
            <th>Waktu</th>
            <th>Detail Barang</th>
            <th class="text-right">Nilai</th>
            <th>Catatan</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="trx in transactions" :key="trx.id">
            <td class="py-4">
              <div class="flex items-center gap-2">
                <div :class="trx.type === 'IN' ? 'ledger-pill-in' : 'ledger-pill-out'">
                  <ArrowDownRight v-if="trx.type === 'IN'" size="18" class="text-primary" />
                  <ArrowUpRight v-else size="18" class="text-danger" />
                </div>
                <span class="font-semibold" :class="trx.type === 'IN' ? 'text-primary' : 'text-danger'">{{ trx.type }}</span>
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
                <div v-for="(item, idxx) in trx.items" :key="idxx" class="ledger-item-row" :class="{ 'ledger-item-row-last': idxx === trx.items.length - 1 }">
                  <span class="font-semibold">{{ item.qty }}x</span> {{ item.item?.name }}
                  <span class="text-xs text-muted ml-2">(Batch: {{ item.batch?.batch_number }})</span>
                </div>
              </div>
            </td>
            <td class="py-4 text-right font-medium text-primary">Rp {{ trx.total_amount.toLocaleString() }}</td>
            <td class="py-4 text-sm text-muted">{{ trx.notes || '-' }}</td>
          </tr>
          <tr v-if="transactions.length === 0">
            <td colspan="5" class="text-center py-6 text-muted">Belum ada riwayat mutasi.</td>
          </tr>
        </tbody>
      </table>

      <div class="flex items-center justify-between mt-4 pt-4" style="border-top: 1px solid var(--border-color)">
        <button class="btn btn-outline" :disabled="currentPage === 1" @click="loadLedger(currentPage - 1)">Sebelumnya</button>
        <span class="text-sm text-muted">Halaman {{ currentPage }}</span>
        <button class="btn btn-outline" :disabled="transactions.length < pageSize" @click="loadLedger(currentPage + 1)">Berikutnya</button>
      </div>
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
const currentPage = ref(1);
const pageSize = 20;

const loadLedger = async (page = 1) => {
  const data = await fetchLedger({ page, limit: pageSize });
  currentPage.value = page;
  transactions.value = data?.data || [];
};

onMounted(async () => {
  await loadLedger();
});
</script>
