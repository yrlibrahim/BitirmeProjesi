<template>
  <div class="p-6 space-y-6">
    <h2 class="text-2xl font-bold mb-4">
      Müşteri Cari Detayı: {{ customerName }}
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
        <div class="text-sm text-gray-500">{{ entry.date }}</div>
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
import { fetchSalesInvoices } from "@/stores/salesInvoice";
import { fetchCustomerPayments } from "@/stores/customerPayments";

const route = useRoute();
const customerId = route.params.id;
const customerName = ref("");

const timeline = ref([]);

onMounted(async () => {
  const [invoices, payments] = await Promise.all([
    fetchSalesInvoices(),
    fetchCustomerPayments(),
  ]);

  const filteredInvoices = invoices
    .filter((f) => f.customerId === customerId)
    .map((f) => ({
      id: f.id,
      date:
        f.createdAt?.toDate?.().toISOString().split("T")[0] ||
        f.date ||
        "Tarih Yok",
      amount: f.totalAmount || 0,
      description: f.note || "Fatura notu yok.",
      type: "invoice",
      customerName: f.customerName,
    }));

  const filteredPayments = payments
    .filter((p) => p.customerId === customerId)
    .map((p) => ({
      id: p.id,
      date: p.date || "Tarih Yok",
      amount: p.amount || 0,
      description: p.description || "Ödeme açıklaması yok.",
      type: "payment",
      customerName: p.customerName,
    }));

  if (filteredPayments.length > 0) {
    customerName.value = filteredPayments[0].customerName;
  } else if (filteredInvoices.length > 0) {
    customerName.value = filteredInvoices[0].customerName;
  }

  timeline.value = [...filteredInvoices, ...filteredPayments].sort((a, b) =>
    a.date > b.date ? -1 : 1
  );
});
</script>
