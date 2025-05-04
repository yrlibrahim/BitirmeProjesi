<script setup>
import { ref, onMounted } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { getMonthlyStockChartData } from "./MonthlyStockChart";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

const chartData = ref(null);
const options = {
  responsive: true,
  plugins: {
    legend: { position: "top" },
    title: {
      display: true,
      text: "Aylık Ürün Alım, Satım ve İşçilik Trendleri",
    },
  },
};

onMounted(async () => {
  chartData.value = await getMonthlyStockChartData();
});
</script>

<template>
  <div v-if="chartData" class="w-1/2">
    <Line :data="chartData" :options="options" />
  </div>
  <div v-else class="text-gray-500">Yükleniyor...</div>
</template>
