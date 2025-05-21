<template>
  <div>
    <!-- Başlık ve Filtre -->
    <div class="flex justify-between border border-b- gap-2 p-4 bg-white">
      <div class="flex items-center gap-2">
        <span class="border rounded-md p-2 text-[#FE9F43] bg-[#fff6ee]">
          <CircleStackIcon class="w-6" />
        </span>
        <p class="text-[18px] font-semibold text-[#212b36]">
          Genel Finans Özeti
        </p>
      </div>
      <div class="flex items-center">
        <!-- Yıl Seçimi -->
        <select
          v-model="selectedYear"
          @change="loadData"
          class="border rounded p-2"
        >
          <option v-for="year in availableYears" :key="year" :value="year">
            {{ year }}
          </option>
        </select>

        <!-- Zaman Aralığı Seçimi -->
        <button
          v-for="(option, index) in options"
          :key="option.value"
          @click="selected = option.value"
          :class="[
            'px-3 py-2 border transition text-sm',
            selected === option.value
              ? 'bg-[#FE9F43] text-white border-[#FE9F43]'
              : 'bg-[#f9fafb] text-gray-700 border-gray-300',
            index === 0 ? 'rounded-l-md' : '',
            index === options.length - 1 ? 'rounded-r-md' : '',
          ]"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <!-- Kartlar -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      <div
        class="bg-[#FE9F43] p-4 rounded shadow flex items-center justify-start gap-2"
      >
        <div
          class="bg-white border border-[#FE9F43] text-[#FE9F43] rounded-md p-2"
        >
          <ArrowTrendingUpIcon class="w-10 h-10" />
        </div>
        <div>
          <h3 class="text-[14px] font-medium text-white">Toplam Kazanç</h3>
          <p class="text-2xl font-bold text-white">
            {{ formatCurrency(income) }}
          </p>
        </div>
      </div>

      <div
        class="bg-[#092C4C] p-4 rounded shadow flex items-center justify-start gap-2"
      >
        <div
          class="bg-white border border-[#092C4C] text-[#092C4C] rounded-md p-2"
        >
          <ArrowTrendingDownIcon class="w-10 h-10" />
        </div>
        <div>
          <h3 class="text-[14px] font-medium text-white">Toplam Ödeme</h3>
          <p class="text-2xl font-bold text-white">
            {{ formatCurrency(expense) }}
          </p>
        </div>
      </div>

      <div
        class="bg-[#0E9384] p-4 rounded shadow flex items-center justify-start gap-2"
      >
        <div
          class="bg-white border border-[#0E9384] text-[#0E9384] rounded-md p-2"
        >
          <CircleStackIcon class="w-10 h-10" />
        </div>
        <div>
          <h3 class="text-[14px] font-medium text-white">Toplam Kar</h3>
          <p class="text-2xl font-bold text-white">{{ formatCurrency(net) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, watch } from "vue";
import {
  CircleStackIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/vue/24/outline";
import { fetchCustomerPayments } from "@/stores/customerPayments";
import { fetchCompanyPayments } from "@/stores/companyPayments";

const currentYear = new Date().getFullYear();
const selectedYear = ref(currentYear);
const availableYears = Array.from({ length: 10 }, (_, i) => currentYear - i);

const options = [
  { label: "1M", value: "month" },
  { label: "3M", value: "3months" },
  { label: "6M", value: "6months" },
  { label: "1Y", value: "year" },
  { label: "All", value: "all" },
];

const selected = ref("month");
const income = ref(0);
const expense = ref(0);
const net = computed(() => income.value - expense.value);

function animateValue(refVar, to, duration = 1000) {
  const start = 0;
  const range = to - start;
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    refVar.value = Math.floor(progress * range);
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      refVar.value = to;
    }
  }

  requestAnimationFrame(step);
}

// Tarih aralığı kontrolü
const isInRange = (dateStr, filter) => {
  const today = new Date();
  const itemDate = new Date(dateStr);

  if (filter === "all") return true;
  if (itemDate.getFullYear() !== selectedYear.value) return false;

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
    default:
      return true;
  }
};

// Veri yükleme
const loadData = async () => {
  const incoming = await fetchCustomerPayments();
  const outgoing = await fetchCompanyPayments();

  const totalIncome = incoming
    .filter((p) => isInRange(p.date, selected.value))
    .reduce((acc, cur) => acc + parseFloat(cur.amount || 0), 0);

  const totalExpense = outgoing
    .filter((p) => isInRange(p.date, selected.value))
    .reduce((acc, cur) => acc + parseFloat(cur.amount || 0), 0);

  animateValue(income, totalIncome);
  animateValue(expense, totalExpense);
};

onMounted(loadData);
watch([selected, selectedYear], loadData);

const formatCurrency = (val) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(Number(val) || 0);
</script>
