<template>
  <!-- LOADING EKRANI -->
  <div v-if="isLoading" class="flex justify-center items-center h-screen">
    <svg
      class="animate-spin h-16 w-16 mr-3 text-[#fe9f43]"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8z"
      ></path>
    </svg>
  </div>

  <div v-else>
    <!-- Ürün Ekle Butonu -->
    <div v-if="!userStore.user.isAdmin">
      <button
        @click="router.push('/create-new-product')"
        class="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Yeni Ürün Ekle
      </button>
    </div>

    <!-- Ürün Listesi -->
    <div class="overflow-x-auto rounded-lg shadow mt-6">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th
              v-for="header in headers"
              :key="header.key"
              @click="sortBy(header.key)"
              class="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:text-indigo-500 select-none"
            >
              {{ header.label }}
              <span v-if="sortKey === header.key">
                {{ sortOrder === "asc" ? "▲" : "▼" }}
              </span>
            </th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">
              İşlemler
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="item in stockData.adminStock"
            :key="item.id"
            class="hover:bg-gray-50"
          >
            <td class="px-4 py-2">{{ item.name }}</td>
            <td class="px-4 py-2">{{ item.brand }}</td>
            <td class="px-4 py-2">{{ item.model }}</td>
            <td class="px-4 py-2">{{ item.category }}</td>
            <td class="px-4 py-2">{{ item.subCategory }}</td>
            <td class="px-4 py-2">{{ item.count }}</td>
            <td class="px-4 py-2">{{ item.price }} ₺</td>
            <td class="px-4 py-2 flex items-center gap-2">
              <button class="p-2 rounded hover:bg-gray-100">
                <font-awesome-icon icon="eye" />
              </button>
              <button class="p-2 rounded hover:bg-gray-100">
                <font-awesome-icon icon="pen-to-square" />
              </button>
              <button class="p-2 rounded hover:bg-gray-100 text-red-500">
                <font-awesome-icon icon="trash" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { useStockData } from "@/stores/stock";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faEye,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

// Font Awesome ikonlarını ekle
library.add(faEye, faPenToSquare, faTrash);

// FontAwesome bileşenini register et
defineProps();
defineEmits();
defineExpose();
const stockData = useStockData();
const userStore = useUserStore();
const isLoading = ref(false);

// Sıralama için değişkenler
const sortKey = ref("");
const sortOrder = ref("asc");

const headers = [
  { key: "name", label: "Ürün" },
  { key: "brand", label: "Araç" },
  { key: "model", label: "Model" },
  { key: "category", label: "Kategori" },
  { key: "subCategory", label: "Alt Kategori" },
  { key: "count", label: "Adet" },
  { key: "price", label: "Fiyat" },
];

// Sayfa yüklendiğinde veriyi çek
onMounted(() => {
  isLoading.value = true;
  stockData.adminGetStock(20).then(() => {
    isLoading.value = false;
  });
});

// Sıralama fonksiyonu
function sortBy(key) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortOrder.value = "asc";
  }

  stockData.adminStock.sort((a, b) => {
    const aVal = a[key]?.toString().toLowerCase() || "";
    const bVal = b[key]?.toString().toLowerCase() || "";

    if (aVal < bVal) return sortOrder.value === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder.value === "asc" ? 1 : -1;
    return 0;
  });
}
</script>
