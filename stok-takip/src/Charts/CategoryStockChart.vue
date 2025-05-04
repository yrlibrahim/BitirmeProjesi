<script setup>
import { Doughnut } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { ref, onMounted } from "vue";
import { getCategoryStockChartData } from "./CategoryStockChart";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const chartData = ref(null);
const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Kategorilere Göre Stok Dağılımı",
    },
  },
};

onMounted(async () => {
  chartData.value = await getCategoryStockChartData();
});
</script>

<template>
  <div class="w-full max-w-md mx-auto">
    <Doughnut v-if="chartData" :data="chartData" :options="chartOptions" />
    <p v-else class="text-gray-500">Yükleniyor...</p>
  </div>
</template>
