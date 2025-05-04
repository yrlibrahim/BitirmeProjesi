<template>
  <div class="">
    <!-- Filtre Butonları -->
    <div class="flex justify-between border border-b- gap-2 p-4 bg-white">
      <div class="flex items-center gap-2">
        <span class="border rounded-md p-2 text-[#FE9F43] bg-[#fff6ee]"
          ><CircleStackIcon class="w-6"
        /></span>

        <p class="text-[18px] font-semibold text-[#212b36]">
          Genel Finans Özeti
        </p>
      </div>
      <div class="flex gap-2">
        <button
          v-for="option in options"
          :key="option.value"
          @click="selected = option.value"
          :class="[
            'px-4 py-2 rounded border transition ',
            selected === option.value
              ? 'bg-[#FE9F43] text-white border-[#FE9F43]'
              : 'bg-[#f9fafb] text-gray-700 border-gray-300 ',
          ]"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <!-- Kartlar -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      <div
        class="bg-[#FE9F43] p-4 rounded shadow flex items-center justify-center gap-2 text-center"
      >
        <div
          class="bg-white border border-[#FE9F43] text-[#FE9F43] rounded-md p-2"
        >
          <ArrowTrendingUpIcon class="w-10 h-10" />
        </div>
        <div class="">
          <h3 class="text-[14px] font-medium text-white text-left">
            Toplam Kazanç
          </h3>
          <p class="text-2xl font-bold text-white">
            {{ formatCurrency(income) }}
          </p>
        </div>
      </div>
      <div
        class="bg-[#092C4C] p-4 rounded shadow flex items-center justify-center gap-2 text-center"
      >
        <div
          class="bg-white border border-[#092C4C] text-[#092C4C] rounded-md p-2"
        >
          <ArrowTrendingDownIcon class="w-10 h-10" />
        </div>
        <div class="justify-start">
          <h3 class="text-[14px] font-medium text-white text-left">
            Toplam Ödeme
          </h3>
          <p class="text-2xl font-bold text-white">
            {{ formatCurrency(expense) }}
          </p>
        </div>
      </div>
      <div
        class="bg-[#0E9384] p-4 rounded shadow flex items-center justify-center gap-2 text-center"
      >
        <div
          class="bg-white border border-[#0E9384] text-[#0E9384] rounded-md p-2"
        >
          <CircleStackIcon class="w-10 h-10" />
        </div>
        <div>
          <h3 class="text-[14px] font-medium text-white text-left">
            Toplam Kar
          </h3>
          <p
            class="text-2xl font-bold"
            :class="net >= 0 ? 'text-white' : 'text-white'"
          >
            {{ formatCurrency(net) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { fetchCustomerPayments } from "@/stores/customerPayments";
import { fetchCompanyPayments } from "@/stores/companyPayments";
import {
  CircleStackIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/vue/24/outline";

const options = [
  { label: "Aylık", value: "month" },
  { label: "3 Aylık", value: "3months" },
  { label: "6 Aylık", value: "6months" },
  { label: "Yıllık", value: "year" },
];

const selected = ref("month");
const income = ref(0);
const expense = ref(0);
const net = computed(() => income.value - expense.value);

// Yardımcı tarih karşılaştırması
const isInRange = (dateStr, filter) => {
  const today = new Date();
  const itemDate = new Date(dateStr);
  const diffMonths =
    today.getFullYear() * 12 +
    today.getMonth() -
    (itemDate.getFullYear() * 12 + itemDate.getMonth());

  switch (filter) {
    case "month":
      return diffMonths === 0;
    case "3months":
      return diffMonths <= 2;
    case "6months":
      return diffMonths <= 5;
    case "year":
      return today.getFullYear() === itemDate.getFullYear();
  }
};

// Verileri çek ve filtrele
const loadData = async () => {
  const incoming = await fetchCustomerPayments();
  const outgoing = await fetchCompanyPayments();

  income.value = incoming
    .filter((p) => isInRange(p.date, selected.value))
    .reduce((acc, cur) => acc + Number(cur.amount || 0), 0);

  expense.value = outgoing
    .filter((p) => isInRange(p.date, selected.value))
    .reduce((acc, cur) => acc + Number(cur.amount || 0), 0);
};

onMounted(loadData);
watch(selected, loadData);

const formatCurrency = (val) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(Number(val) || 0);
</script>
