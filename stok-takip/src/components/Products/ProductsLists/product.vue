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
        d="M4 12a8 8 0 018-8v8h8a8 8 8 01-8 8z"
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
    <div class="border rounded-md p-5 shadow-sm mt-4">
      <h1 class="text-2xl font-bold mb-3">Urun Listesi</h1>
      <div>
        <ul>
          <li class="flex item-center justify-center text-lg border-b py-2">
            <span class="w-1/4">Ürün</span>
            <span class="w-1/4">Araç</span>
            <span class="w-1/4">Model</span>
            <span class="w-1/4">Kategori</span>
            <span class="w-1/4">Alt Kategori</span>
            <span class="w-1/4">Fiyat</span>
            <span class="w-1/4">Adet</span>
          </li>
          <li
            v-for="urun in urunler"
            :key="urun.id"
            class="flex items-center justify-center text-base border-b mt-2 py-2"
          >
            <span class="w-1/4">{{ urun.name }}</span>
            <span class="w-1/4">{{ urun.brand }}</span>
            <span class="w-1/4">{{ urun.model }}</span>
            <span class="w-1/4">{{ urun.category }}</span>
            <span class="w-1/4">{{ urun.subCategory }}</span>
            <span class="w-1/4">{{ urun.price }}</span>
            <span class="w-1/4">{{ urun.count }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useStockData } from "@/stores/useStockData";
import router from "@/router";
import { useUserStore } from "@/stores/user";

// useStockData fonksiyonunu çağır
const {
  brand,
  model,
  category,
  subCategory,
  name,
  price,
  count,
  urunler,
  fetchStockData,
  addProduct,
} = useStockData();

const isLoading = ref(true); // Yüklenme durumu

// Sayfa yüklendiğinde verileri çek
onMounted(async () => {
  await fetchStockData();
  isLoading.value = false;
});

// Ürün ekleme fonksiyonu
const addProductAndClose = async () => {
  await addProduct(); // Firestore'a ekleme işlemi
  await fetchStockData(); // Listeyi güncelle
  showModal.value = false; // Modalı kapat
};

// Admin degeri sorgulama
const userStore = useUserStore();
</script>
