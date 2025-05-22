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
          class="border rounded p-2 me-2"
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

    <!-- Gerçekleşmiş Kartlar -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      <div class="bg-[#FE9F43] p-4 rounded shadow flex items-center gap-2">
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

      <div class="bg-[#092C4C] p-4 rounded shadow flex items-center gap-2">
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

      <div class="bg-[#0E9384] p-4 rounded shadow flex items-center gap-2">
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

    <!-- Potansiyel Kartlar -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      <div class="bg-[#fff6ee] p-4 rounded shadow flex items-center gap-2">
        <div class="bg-white text-[#FE9F43] p-2 rounded-md">
          <CloudArrowUpIcon class="w-10 h-10" />
        </div>
        <div>
          <h3 class="text-[14px] font-medium text-[#FE9F43]">
            Potansiyel Kazanç
          </h3>
          <p class="text-2xl font-bold text-[#FE9F43]">
            {{ formatCurrency(potentialIncome) }}
          </p>
        </div>
      </div>

      <div class="bg-[#3FB6D9] p-4 rounded shadow flex items-center gap-2">
        <div class="bg-white text-[#092C4C] p-2 rounded-md">
          <CloudArrowDownIcon class="w-10 h-10" />
        </div>
        <div>
          <h3 class="text-[14px] font-medium text-white">Potansiyel Ödeme</h3>
          <p class="text-2xl font-bold text-white">
            {{ formatCurrency(potentialExpense) }}
          </p>
        </div>
      </div>

      <div class="bg-[#3EB780] p-4 rounded shadow flex items-center gap-2">
        <div class="bg-white text-[#3EB780] p-2 rounded-md">
          <CloudIcon class="w-10 h-10" />
        </div>
        <div>
          <h3 class="text-[14px] font-medium text-white">Potansiyel Kar</h3>
          <p class="text-2xl font-bold text-white">
            {{ formatCurrency(potentialNet) }}
          </p>
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
  CloudArrowDownIcon,
  CloudArrowUpIcon,
  CloudIcon,
} from "@heroicons/vue/24/outline";
import { fetchCustomerPayments } from "@/stores/customerPayments";
import { fetchCompanyPayments } from "@/stores/companyPayments";
import { getCariSummary } from "@/stores/cariAccount";
import { getCompanySummary } from "@/stores/companyAccount";

// Zaman filtreleri
const currentYear = new Date().getFullYear();
const minYear = 2022;
const availableYears = Array.from(
  { length: currentYear - minYear + 1 },
  (_, i) => currentYear - i
);

const selectedYear = ref(currentYear);
const selected = ref("month");
const options = [
  { label: "1M", value: "month" },
  { label: "3M", value: "3months" },
  { label: "6M", value: "6months" },
  { label: "1Y", value: "year" },
  { label: "All", value: "all" },
];

// Gerçekleşmiş değerler
const income = ref(0);
const expense = ref(0);
const net = computed(() => income.value - expense.value);

// Potansiyel değerler
const potentialIncome = ref(0);
const potentialExpense = ref(0);
const potentialNet = computed(
  () => potentialIncome.value - potentialExpense.value
);

// Animasyonlu sayı güncelleme
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

// Tarih filtreleme
const isInRange = (dateStr, filter) => {
  const itemDate = new Date(dateStr);
  const itemYear = itemDate.getFullYear();
  const selectedY = selectedYear.value;

  if (filter === "all") return true;
  if (itemYear !== selectedY) return false;

  let referenceDate =
    selectedY === currentYear ? new Date() : new Date(selectedY, 11, 31);

  const diffMonths =
    referenceDate.getFullYear() * 12 +
    referenceDate.getMonth() -
    (itemDate.getFullYear() * 12 + itemDate.getMonth());

  switch (filter) {
    case "month":
      return diffMonths === 0;
    case "3months":
      return diffMonths >= 0 && diffMonths <= 2;
    case "6months":
      return diffMonths >= 0 && diffMonths <= 5;
    case "year":
      return true;
    default:
      return false;
  }
};

// Gerçekleşmiş verileri yükle
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

// Potansiyel verileri yükle
const loadPotentialData = async () => {
  const customers = await getCariSummary();
  const companies = await getCompanySummary();

  const totalUnpaidFromCustomers = customers.reduce(
    (acc, c) => acc + parseFloat(c.remainingDebt || 0),
    0
  );

  const totalUnpaidToCompanies = companies.reduce(
    (acc, c) => acc + parseFloat(c.remainingDebt || 0),
    0
  );

  animateValue(potentialIncome, totalUnpaidFromCustomers);
  animateValue(potentialExpense, totalUnpaidToCompanies);
};

onMounted(() => {
  loadData();
  loadPotentialData();
});

watch([selected, selectedYear], loadData);
watch(selectedYear, () => {
  selected.value = "month";
});

const formatCurrency = (val) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(Number(val) || 0);
</script>
