<template>
  <div class="bg-white p-4 rounded shadow">
    <h3 class="text-lg font-bold text-gray-700 mb-4">Aylık Fatura vs Ödeme</h3>
    <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
    <p v-else>Yükleniyor...</p>
  </div>
</template>

<script setup>
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { ref, onMounted } from "vue";
import { getMonthlyInvoiceVsPaymentData } from "@/Charts/MonthlyInvoiceVsPayment";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const chartData = ref(null);

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: false,
    },
  },
};

onMounted(async () => {
  chartData.value = await getMonthlyInvoiceVsPaymentData();
});
</script>
