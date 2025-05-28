<script setup>
import {
  CalendarDaysIcon,
  ExclamationTriangleIcon,
  CubeIcon,
  UsersIcon,
  UserGroupIcon,
} from "@heroicons/vue/24/outline";
import { ref, computed, onMounted } from "vue";
import FinancialSummary from "@/Charts/FinancialSummary.vue";
import { useDashboardStore } from "@/stores/dashboard";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const user = userStore.getUserData;

const dashboard = useDashboardStore();

onMounted(() => {
  if (!dashboard.fetched) {
    dashboard.fetchDashboardData();
  }
});

const stats = ref({ totalCustomers: 0, totalCompanies: 0 });
const lowStock = computed(() => dashboard.lowStock);
const topSelling = computed(() => dashboard.topSelling);

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
    <h1 class="text-[28px] text-[#212b36] font-bold">
      Hoşgeldiniz {{ user.firstname }} {{ user.lastname }}
    </h1>
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
    <div class="w-full lg:w-1/2 xl:w-1/3 bg-white rounded-md border p-4">
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
    <div class="w-full lg:w-1/2 xl:w-1/3 bg-white rounded-md border p-4">
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

    <!-- İstatistik Kartları -->
    <div
      class="w-full md:w-1/3 flex flex-col gap-2 p-4 rounded-md border bg-white"
    >
      <div class="flex gap-4 justify-between">
        <div
          class="bg-[#F9FAFB] border rounded-lg p-4 flex-1 flex flex-col items-center"
        >
          <UsersIcon class="w-6 text-[#155EEF]" />
          <p class="text-sm text-gray-500">Toplam Müşteri</p>
          <p class="text-3xl font-bold text-[#092C4C]">
            {{ stats.totalCustomers }}
          </p>
        </div>
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
    </div>
  </div>
</template>
