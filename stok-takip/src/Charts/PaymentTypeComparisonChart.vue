<template>
  <div class="p-2">
    <h3 class="text-lg font-bold text-gray-700 mb-4">
      Gelen/Giden Ödeme Türleri
    </h3>
    <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
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
import { fetchCustomerPayments } from "@/stores/customerPayments";
import { fetchCompanyPayments } from "@/stores/companyPayments";

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
    legend: { position: "top" },
    title: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => `${value}₺`,
      },
    },
  },
};

onMounted(async () => {
  const customerPayments = await fetchCustomerPayments(); // Gelen
  const companyPayments = await fetchCompanyPayments(); // Giden

  const types = ["Nakit", "Havale", "Çek"];

  const incomeData = types.map((type) =>
    customerPayments
      .filter((p) => p.type === type)
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
  );

  const expenseData = types.map((type) =>
    companyPayments
      .filter((p) => p.type === type)
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
  );

  chartData.value = {
    labels: types,
    datasets: [
      {
        label: "Gelen (Müşteri)",
        data: incomeData,
        backgroundColor: "rgba(59, 130, 246, 0.6)", // Mavi
      },
      {
        label: "Giden (Firma)",
        data: expenseData,
        backgroundColor: "rgba(239, 68, 68, 0.6)", // Kırmızı
      },
    ],
  };
});
</script>
