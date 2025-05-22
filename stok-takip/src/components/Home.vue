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
import {
  CalendarDaysIcon,
  ExclamationTriangleIcon,
  CubeIcon,
  UsersIcon,
  UserGroupIcon,
} from "@heroicons/vue/24/outline";
import { ref, onMounted } from "vue";
import FinancialSummary from "@/Charts/FinancialSummary.vue";
import PaymentTypeComparisonChart from "@/Charts/PaymentTypeComparisonChart.vue";
import { useStockData } from "@/stores/stock";
import { getTopSellingProducts } from "@/stores/salesInvoice";
import { fetchCounts } from "@/components/Helpers/useDashboardStats";

const stock = useStockData();
const lowStock = ref([]);

onMounted(async () => {
  lowStock.value = await stock.getLowStockProducts(5);
});

const topSelling = ref([]);

onMounted(async () => {
  topSelling.value = await getTopSellingProducts(5);
});

const stats = ref({
  totalCustomers: 0,
  totalCompanies: 0,
});

onMounted(async () => {
  stats.value = await fetchCounts();
});

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
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Aylık Gelen ve Giden Ödemeler",
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        display: true,
        borderDash: [2, 1],
        color: "#cbd5e1",
      },
      ticks: {
        color: "#333",
      },
    },
  },
};

onMounted(async () => {
  chartData.value = await getMonthlyPaymentsChartData();
});

const today = new Date();
const formattedDate = ref(
  today.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
);
</script>

<template>
  <!-- Başlık ve Tarih -->
  <div class="flex items-center justify-between">
    <h1 class="text-[28px] text-[#212b36] font-bold">Hoşgeldiniz</h1>
    <span class="text-sm text-gray-600 flex items-center gap-1">
      <CalendarDaysIcon class="w-4 h-4" />
      {{ formattedDate }}
    </span>
  </div>

  <!-- Finansal Kartlar -->
  <div class="mt-4">
    <FinancialSummary />
  </div>

  <!-- Üst Satır: Grafik + İstatistik Kartları -->
  <div class="mt-6 flex flex-col md:flex-row gap-4">
    <!--  En çok satanlar -->
    <div
      class="w-full lg:w-1/2 xl:w-1/3 bg-white rounded-xl border shadow-md p-4"
    >
      <div class="flex items-center gap-2 text-lg font-bold border-b pb-2 mb-2">
        <span class="border bg-[#ffdbec] p-2 rounded-md">
          <CubeIcon class="w-6 text-[#FD3995]" />
        </span>
        En Çok Satanlar
      </div>
      <ul v-if="topSelling.length" class="space-y-2">
        <li
          v-for="urun in topSelling"
          :key="urun.sku"
          class="flex justify-between text-sm text-gray-600 border-b pb-1"
        >
          <div>
            <p class="font-semibold text-[#000] text-[14px]">
              Ürün: <span class="font-normal">{{ urun.name }}</span>
            </p>
            <p class="text-[#646b72] text-[13px]">
              SKU: <span>{{ urun.sku }}</span>
            </p>
          </div>
          <div class="text-right text-[#3EB780] font-bold">
            {{ urun.totalSold }}
          </div>
        </li>
      </ul>
      <p v-else class="text-sm text-gray-400 italic">
        Henüz satış yapılmamış 😔
      </p>
    </div>
    <!-- Düşük Stoklar -->
    <div
      class="w-full lg:w-1/2 xl:w-1/3 bg-white rounded-xl border shadow-md p-4"
    >
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2 text-lg font-bold">
          <span class="border bg-[#ffede9] p-2 rounded-md">
            <ExclamationTriangleIcon class="w-6 text-[#FF0000]" />
          </span>
          Düşük Stoklar
        </div>
        <router-link
          to="/low-stock"
          class="text-sm text-blue-600 hover:underline"
        >
          Hepsini Göster
        </router-link>
      </div>
      <ul v-if="lowStock.length > 0" class="space-y-2 border-t pt-2">
        <li
          v-for="urun in lowStock"
          :key="urun.id"
          class="flex justify-between text-sm border-b pb-1"
        >
          <div>
            <p class="font-semibold text-[#000] text-[14px]">
              Ürün: <span class="font-normal">{{ urun.name }}</span>
            </p>
            <p class="text-[#646b72] text-[13px]">
              SKU: <span>{{ urun.sku }}</span>
            </p>
          </div>
          <div class="text-right">
            <p class="text-[#646b72] text-[13px]">Stokta</p>
            <p class="text-red-500 font-bold text-[13px]">{{ urun.count }}</p>
          </div>
        </li>
      </ul>
      <p v-else class="text-sm text-gray-400 italic">
        Tüm ürünlerin stoğu yeterli 🎉
      </p>
    </div>
    <div
      class="w-full md:w-1/3 flex flex-col justify-between gap-2 p-4 border bg-white"
    >
      <div class="flex gap-4 justify-between">
        <!-- Müşteri -->
        <div
          class="bg-[#F9FAFB] border rounded-lg p-4 flex-1 flex flex-col items-center"
        >
          <UsersIcon class="w-6 text-[#155EEF]" />
          <p class="text-sm text-gray-500">Toplam Müşteri</p>
          <p class="text-3xl font-bold text-[#092C4C]">
            {{ stats.totalCustomers }}
          </p>
        </div>
        <!-- Şirket -->
        <div
          class="bg-[#F9FAFB] border rounded-lg p-4 flex-1 flex flex-col items-center"
        >
          <UserGroupIcon class="w-6 text-[#E04F16]" />
          <p class="text-sm text-gray-500">Toplam Şirket</p>
          <p class="text-3xl font-bold text-[#092C4C]">
            {{ stats.totalCompanies }}
          </p>
        </div>
      </div>

      <!-- Ödeme Tipi Karşılaştırma -->
      <PaymentTypeComparisonChart />
    </div>
  </div>
</template>
