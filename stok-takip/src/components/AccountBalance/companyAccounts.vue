<template>
  <div class="p-6 space-y-6">
    <h2 class="text-2xl font-bold">Firma Cari Durumları</h2>

    <div class="overflow-auto rounded border">
      <table class="min-w-full divide-y divide-gray-200 text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-2 text-left">Firma</th>
            <th class="px-4 py-2 text-left">Toplam Borç (₺)</th>
            <th class="px-4 py-2 text-left">Toplam Ödeme (₺)</th>
            <th class="px-4 py-2 text-left">Kalan Borç (₺)</th>
            <th class="px-4 py-2 text-left">İşlem</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="entry in summary"
            :key="entry.companyId"
            class="border-t hover:bg-gray-50"
          >
            <td class="px-4 py-2">{{ entry.companyName }}</td>
            <td class="px-4 py-2">
              {{ entry.totalInvoices.toLocaleString("tr-TR") }} ₺
            </td>
            <td class="px-4 py-2">
              {{ entry.totalPayments.toLocaleString("tr-TR") }} ₺
            </td>
            <td class="px-4 py-2 font-semibold">
              {{ entry.remainingDebt.toLocaleString("tr-TR") }} ₺
            </td>
            <td class="px-4 py-2">
              <router-link
                :to="`/company-accounts/${entry.companyId}`"
                class="text-blue-500 hover:underline"
              >
                Detay
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getCompanySummary } from "@/stores/companyAccount";

const summary = ref([]);

onMounted(async () => {
  summary.value = await getCompanySummary();
});
</script>
