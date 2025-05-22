<template>
  <div class="">
    <div class="flex items-center justify-between mb-4">
      <div class="space-y-4">
        <h2 class="text-2xl text-[#646B72]">{{ companyName }}</h2>
        <p class="text-[18px] text-[#646B72]">Firma Cari Detayları</p>
      </div>
      <div class="flex gap-3">
        <button
          class="border border-[#092C4C] bg-[#092C4C] text-white hover:text-[#092C4C] hover:bg-white rounded-md px-4 py-2 flex items-center gap-2 transition"
          @click="router.back()"
        >
          <ArrowUturnLeftIcon class="w-5 h-5" />
          Geri Dön
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
      <svg
        class="animate-spin h-16 w-16 mr-3 text-[#fe9f43]"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8z"
        />
      </svg>
    </div>

    <div v-else class="overflow-auto rounded border">
      <div
        class="flex justify-end items-center gap-2 p-2 rounded-t-md bg-white border overflow-hidden"
      >
        <button
          @click="openDatePicker"
          class="border px-4 py-2 rounded-md text-gray-700 hover:bg-[#FE9F43] hover:text-white hover:border-[#FE9F43] transition"
        >
          <CalendarDateRangeIcon class="w-5 h-5" />
        </button>
        <button
          @click="resetFilters"
          class="border px-4 py-2 rounded-md text-gray-700 hover:bg-[#FE9F43] hover:text-white hover:border-[#FE9F43] transition"
        >
          Filtreyi Sıfırla
        </button>
      </div>
      <table class="min-w-full divide-y divide-gray-200 text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-2 text-left">Tarih</th>
            <th class="px-4 py-2 text-left">Tür</th>
            <th class="px-4 py-2 text-left">Açıklama</th>
            <th class="px-4 py-2 text-left">Tutar (₺)</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="entry in filteredTimeline"
            :key="entry.id"
            class="border-t hover:bg-gray-50"
          >
            <td class="px-4 py-2">{{ formatDate(entry.date) }}</td>
            <td class="px-4 py-2 font-semibold">
              {{ entry.type === "payment" ? "Ödeme" : "Fatura" }}
            </td>
            <td class="px-4 py-2">
              {{ entry.description || "Açıklama belirtilmemiş." }}
            </td>
            <td
              class="px-4 py-2 font-semibold"
              :class="
                entry.type === 'payment' ? 'text-green-600' : 'text-red-600'
              "
            >
              {{ entry.amount.toLocaleString("tr-TR") }} ₺
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { fetchCompanyPayments } from "@/stores/companyPayments";
import { fetchPurchaseInvoices } from "@/stores/invoice";
import Swal from "sweetalert2";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import {
  ArrowUturnLeftIcon,
  CalendarDateRangeIcon,
} from "@heroicons/vue/24/outline";

const route = useRoute();
const router = useRouter();
const companyId = route.params.id;
const companyName = ref("");
const timeline = ref([]);
const selectedDateRange = ref({ start: null, end: null });

// 📅 Tarih formatlayıcı
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

// 📤 Tarih aralığı açıcı
const openDatePicker = async () => {
  const { value: dateRange } = await Swal.fire({
    title: "Tarih Aralığı Seç",
    html: `<input type="text" id="date-range-picker" class="swal2-input" placeholder="Tarih aralığı seçin" />`,
    willOpen: () => {
      flatpickr(document.getElementById("date-range-picker"), {
        mode: "range",
        dateFormat: "Y-m-d",
      });
    },
    preConfirm: () => {
      const value = document.getElementById("date-range-picker").value;
      const [start, end] = value.split(" to ");
      if (!start || !end) return null;
      return { start: new Date(start), end: new Date(end) };
    },
    confirmButtonText: "Filtrele",
    cancelButtonText: "İptal",
    showCancelButton: true,
  });

  if (dateRange) {
    selectedDateRange.value = dateRange;
  }
};

// 🔄 Filtre sıfırlayıcı
const resetFilters = () => {
  selectedDateRange.value = { start: null, end: null };
};

// 🧮 Tarih aralığına göre filtrelenmiş timeline
const filteredTimeline = computed(() => {
  if (!selectedDateRange.value.start || !selectedDateRange.value.end) {
    return timeline.value;
  }
  return timeline.value.filter((entry) => {
    const entryDate = new Date(entry.date);
    return (
      entryDate >= selectedDateRange.value.start &&
      entryDate <= selectedDateRange.value.end
    );
  });
});

// 🚀 Veriyi çek
onMounted(async () => {
  const [invoices, payments] = await Promise.all([
    fetchPurchaseInvoices(),
    fetchCompanyPayments(),
  ]);

  const filteredInvoices = invoices
    .filter((f) => f.companyId === companyId)
    .map((f) => {
      const rawDate = f.date ? new Date(f.date) : new Date("1970-01-01");
      return {
        id: f.id,
        date: rawDate.toISOString().split("T")[0],
        amount: f.totalAmount || 0,
        description: f.note || "Fatura notu yok.",
        type: "invoice",
        companyName: f.companyName,
      };
    });

  const filteredPayments = payments
    .filter((p) => p.companyId === companyId)
    .map((p) => {
      const rawDate = p.date ? new Date(p.date) : new Date("1970-01-01");
      return {
        id: p.id,
        date: rawDate.toISOString().split("T")[0],
        amount: p.amount || 0,
        description: p.description || "Ödeme açıklaması yok.",
        type: "payment",
        companyName: p.companyName,
      };
    });

  companyName.value =
    filteredPayments[0]?.companyName || filteredInvoices[0]?.companyName || "";

  timeline.value = [...filteredInvoices, ...filteredPayments].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
});
</script>
