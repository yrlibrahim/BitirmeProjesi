<template>
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
    <button
      @click="navigateToAddProduct"
      class="bg-blue-500 text-white py-2 px-4 rounded"
    >
      Yeni Ürün Ekle
    </button>

    <div v-for="brand in stockData" :key="brand.id" class="mb-4">
      <h2 class="text-xl font-semibold">{{ brand.id }}</h2>
      <div v-for="model in brand.models" :key="model.id" class="mt-2">
        <h3 class="text-lg">{{ model.id }}</h3>
        <div
          v-for="category in model.categories"
          :key="category.id"
          class="mt-2"
        >
          <h4 class="text-md">{{ category.id }}</h4>
          <div
            v-for="subCategory in category.subCategories"
            :key="subCategory.id"
            class="mt-2"
          >
            <h5 class="text-sm font-medium">{{ subCategory.name }}</h5>
            <ul class="list-none">
              <li
                v-for="product in subCategory.products"
                :key="product.id"
                class="flex"
              >
                <span>{{ product.name }} - {{ product.price }} TL</span>
                ----
                <span>{{ product.count }} adet</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useStockData } from "@/stores/useStockData";
import { useRouter } from "vue-router";

const { stockData, fetchStockData } = useStockData();
const router = useRouter();
const isLoading = ref(false);

onMounted(async () => {
  isLoading.value = true;
  await fetchStockData();
  isLoading.value = false;
});

const navigateToAddProduct = () => {
  router.push("/create-new-product");
};
</script>
