<script setup>
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { ref, onMounted } from "vue";
import { getMonthlyPaymentsChartData } from "@/Charts/MonthlyPaymentsChart";
import MonthlyStockChart from "@/Charts/MonthlyStockChart.vue";
import CategoryStockChart from "@/Charts/CategoryStockChart.vue";
import FinancialSummary from "@/Charts/FinancialSummary.vue";
import MonthlyInvoiceVsPayment from "@/Charts/MonthlyInvoiceVsPayment.vue";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const chartData = ref(null);
const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Aylık Gelen ve Giden Ödemeler",
    },
  },
};

onMounted(async () => {
  chartData.value = await getMonthlyPaymentsChartData();
});
</script>

<template>
  <h1 class="text-[28px] text-[#212b36] font-bold">Hosgeldiniz</h1>
  <div class="p-6 space-y-8">
    <!-- Finansal Kartlar -->
    <FinancialSummary />
  </div>
  <div class="p-6 space-y-6 w-1/2">
    <div v-if="chartData">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
    <div v-else class="text-gray-500">Yükleniyor...</div>
  </div>
  <div class="p-6 space-y-6">
    <div class="bg-white rounded-lg shadow p-4">
      <MonthlyStockChart />
    </div>
  </div>
  <div class="p-6 space-y-6">
    <!-- Diğer grafikler -->
    <h2 class="text-2xl font-bold text-gray-800">
      Kategori Bazlı Ürün Stokları
    </h2>
    <div class="bg-white rounded-lg shadow p-4">
      <CategoryStockChart />
    </div>
  </div>
  <div class="p-6 space-y-8">
    <h1 class="text-2xl font-bold">Anasayfa</h1>

    <MonthlyInvoiceVsPayment />
  </div>
</template>
