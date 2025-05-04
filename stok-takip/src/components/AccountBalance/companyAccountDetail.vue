<template>
  <div class="p-6 space-y-6">
    <h2 class="text-2xl font-bold mb-4">
      Firma Cari Detayı: {{ companyName }}
    </h2>

    <div class="space-y-4">
      <div
        v-for="entry in timeline"
        :key="entry.id"
        class="border-l-4 pl-4 py-3 relative"
        :class="
          entry.type === 'payment' ? 'border-green-500' : 'border-red-500'
        "
      >
        <div class="text-sm text-gray-500">
          {{ entry.date }}
        </div>
        <div class="flex justify-between items-center">
          <div class="text-base font-semibold">
            {{ entry.type === "payment" ? "Ödeme" : "Fatura" }}
          </div>
          <div
            class="text-base font-semibold"
            :class="
              entry.type === 'payment' ? 'text-green-600' : 'text-red-600'
            "
          >
            {{ entry.amount.toLocaleString("tr-TR") }} ₺
          </div>
        </div>
        <div class="text-sm text-gray-700 mt-1">
          {{ entry.description || "Açıklama belirtilmemiş." }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { fetchCompanyPayments } from "@/stores/companyPayments";
import { fetchPurchaseInvoices } from "@/stores/invoice";

const route = useRoute();
const companyId = route.params.id;
const companyName = ref("");

const timeline = ref([]);

onMounted(async () => {
  const [invoices, payments] = await Promise.all([
    fetchPurchaseInvoices(),
    fetchCompanyPayments(),
  ]);

  // Faturaları filtrele ve düzenle
  const filteredInvoices = invoices
    .filter((f) => f.companyId === companyId)
    .map((f) => ({
      id: f.id,
      date: f.date || "Tarih Yok",
      amount: f.totalAmount || 0,
      description: f.note || "Fatura notu yok.",
      type: "invoice",
      companyName: f.companyName,
    }));

  // Ödemeleri filtrele ve düzenle
  const filteredPayments = payments
    .filter((p) => p.companyId === companyId)
    .map((p) => ({
      id: p.id,
      date: p.date || "Tarih Yok",
      amount: p.amount || 0,
      description: p.description || "Ödeme açıklaması yok.",
      type: "payment",
      companyName: p.companyName,
    }));

  if (filteredPayments.length > 0) {
    companyName.value = filteredPayments[0].companyName;
  } else if (filteredInvoices.length > 0) {
    companyName.value = filteredInvoices[0].companyName;
  }

  // Zaman sırasına göre birleşmiş liste
  timeline.value = [...filteredInvoices, ...filteredPayments].sort((a, b) =>
    a.date > b.date ? -1 : 1
  );
});
</script>
