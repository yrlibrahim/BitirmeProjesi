<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Yeni Ürün Ekle</h1>

    <!-- Ürün Ekleme Formu -->
    <form @submit.prevent="addNewProduct">
      <div>
        <h2 class="text-lg font-bold mb-4">Ürünler</h2>

        <div
          v-for="(urun, index) in newProduct.products"
          :key="index"
          class="flex item-center justify-center gap-4 mb-4"
        >
          <div class="w-1 flex items-center justify-center">
            <input
              type="checkbox"
              v-model="selectedProducts"
              :value="index"
              class="mr-2"
            />
          </div>

          <!-- Marka -->
          <div class="w-1/2">
            <label class="block mb-2">Araç</label>
            <input
              v-model="urun.brand"
              list="brandList"
              class="border p-2 w-full"
              required
            />
            <datalist id="brandList">
              <option
                v-for="brand in uniqueBrands"
                :key="brand"
                :value="brand"
              />
            </datalist>
          </div>

          <!-- Model -->
          <div class="w-1/2">
            <label class="block mb-2">Model</label>
            <input
              v-model="urun.model"
              :list="`modelList-${index}`"
              class="border p-2 w-full"
              :disabled="!urun.brand"
              required
            />
            <datalist :id="`modelList-${index}`">
              <option
                v-for="model in filteredModels(index)"
                :key="model"
                :value="model"
              />
            </datalist>
          </div>

          <!-- Kategori -->
          <div class="w-1/2">
            <label class="block mb-2">Kategori</label>
            <input
              v-model="urun.category"
              :list="`categoryList-${index}`"
              class="border p-2 w-full"
              :disabled="!urun.model"
              required
            />
            <datalist :id="`categoryList-${index}`">
              <option
                v-for="category in filteredCategories(index)"
                :key="category"
                :value="category"
              />
            </datalist>
          </div>

          <!-- Alt Kategori -->
          <div class="w-1/2">
            <label class="block mb-2">Alt Kategori</label>
            <input
              v-model="urun.subCategory"
              :list="`subCategoryList-${index}`"
              class="border p-2 w-full"
              :disabled="!urun.category"
              required
            />
            <datalist :id="`subCategoryList-${index}`">
              <option
                v-for="subCategory in filteredSubCategories(index)"
                :key="subCategory"
                :value="subCategory"
              />
            </datalist>
          </div>

          <!-- Ürün -->
          <div class="w-1/2">
            <label class="block mb-2">Ürün</label>
            <input
              v-model="urun.product"
              :list="`productList-${index}`"
              class="border p-2 w-full"
              :disabled="!urun.subCategory"
              required
            />
            <datalist :id="`productList-${index}`">
              <option
                v-for="product in filteredProducts(index)"
                :key="product.id"
                :value="product.name"
              />
            </datalist>
          </div>

          <!-- Adet -->
          <div class="w-1/2">
            <label class="block mb-2">Ürün Adedi</label>
            <input
              v-model="urun.count"
              type="number"
              class="border p-2 w-full"
              :disabled="!urun.product"
              required
            />
          </div>

          <!-- Fiyat -->
          <div class="w-1/2">
            <label class="block mb-2">Ürün Fiyatı</label>
            <input
              v-model="urun.price"
              type="number"
              class="border p-2 w-full"
              :disabled="!urun.product"
              required
            />
          </div>
        </div>

        <!-- Satır Sil -->
        <button
          type="button"
          @click="removeSelectedProducts"
          class="bg-red-500 text-white p-2 rounded me-2"
        >
          Satırları Sil
        </button>

        <!-- Yeni Satır -->
        <button
          type="button"
          @click="addProductRow"
          class="bg-gray-500 text-white p-2 rounded"
        >
          Yeni Satır Ekle
        </button>
      </div>

      <!-- Kaydet / İptal -->
      <div class="flex justify-between mt-6">
        <button type="submit" class="bg-green-500 text-white p-2 rounded">
          Ürünü Ekle
        </button>
        <router-link
          :to="{ name: 'product' }"
          class="bg-red-500 text-white p-2 rounded"
        >
          İptal
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useStockData } from "@/stores/useStockData";

const router = useRouter();
const { urunler, fetchStockData, addProduct } = useStockData();
const isLoading = ref(true);

const newProduct = ref({
  products: [],
});
const selectedProducts = ref([]);

const getUniqueValues = (key) => {
  return computed(() => {
    const uniqueSet = new Set(urunler.value.map((urun) => urun[key]));
    return [...uniqueSet].filter((item) => item);
  });
};

const uniqueBrands = getUniqueValues("brand");

const filteredModels = (index) => {
  const brand = newProduct.value.products[index].brand;
  return urunler.value
    .filter((urun) => urun.brand === brand)
    .map((urun) => urun.model)
    .filter((v, i, a) => a.indexOf(v) === i);
};

const filteredCategories = (index) => {
  const { brand, model } = newProduct.value.products[index];
  return urunler.value
    .filter((urun) => urun.brand === brand && urun.model === model)
    .map((urun) => urun.category)
    .filter((v, i, a) => a.indexOf(v) === i);
};

const filteredSubCategories = (index) => {
  const { brand, model, category } = newProduct.value.products[index];
  return urunler.value
    .filter(
      (urun) =>
        urun.brand === brand &&
        urun.model === model &&
        urun.category === category
    )
    .map((urun) => urun.subCategory)
    .filter((v, i, a) => a.indexOf(v) === i);
};

const filteredProducts = (index) => {
  const { brand, model, category, subCategory } =
    newProduct.value.products[index];
  return urunler.value.filter(
    (urun) =>
      urun.brand === brand &&
      urun.model === model &&
      urun.category === category &&
      urun.subCategory === subCategory
  );
};

const addNewProduct = async () => {
  try {
    console.log("Eklenen ürünler:", newProduct.value.products);
    for (const urun of newProduct.value.products) {
      const newUrun = {
        brand: urun.brand,
        model: urun.model,
        category: urun.category,
        subCategory: urun.subCategory,
        name: urun.product, // Sadece ürün adı olarak string
        price: Number(urun.price),
        count: Number(urun.count),
      };
      await addProduct(newUrun);
    }
    await fetchStockData();
    router.push({ name: "product" });
  } catch (error) {
    console.error("Ürün eklenirken hata oluştu:", error);
  }
};

const addProductRow = () => {
  newProduct.value.products.push({
    brand: "",
    model: "",
    category: "",
    subCategory: "",
    product: "",
    count: null,
    price: null,
  });
};

const removeSelectedProducts = () => {
  newProduct.value.products = newProduct.value.products.filter(
    (_, index) => !selectedProducts.value.includes(index)
  );
  selectedProducts.value = [];
};

onMounted(async () => {
  await fetchStockData();
  isLoading.value = false;
});
</script>
