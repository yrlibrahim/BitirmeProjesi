<template>
  <div v-if="isLoading">
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

    <ul>
      <li v-for="brand in stockData" :key="brand.id">
        {{ brand.id }}
        <ul>
          <li v-for="model in brand.models" :key="model.id">
            {{ model.id }}
            <ul>
              <li v-for="category in model.categories" :key="category.id">
                {{ category.id }}
                <ul>
                  <li
                    v-for="subCategory in category.subCategories"
                    :key="subCategory.id"
                  >
                    {{ subCategory.name }}
                    <ul>
                      <li
                        v-for="product in subCategory.products"
                        :key="product.id"
                      >
                        {{ product.name }} - {{ product.price }} TL
                        {{ product.count }}adet
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
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
