<template>
  <div class="page-wrapper">
    <div class="content">
      <!-- Başlık ve Buton -->
      <div class="page-header d-flex justify-between align-items-center">
        <div class="page-title">
          <h4 class="fw-bold">Ürün Listesi</h4>
          <h6>Ürünlerinizi yönetin</h6>
        </div>
        <button @click="goToCreateProduct" class="btn btn-primary">
          <i class="ti ti-circle-plus me-1"></i>Ürün Ekle
        </button>
      </div>

      <!-- Kartlı Yapı -->
      <!-- Yeni Ürün Tablosu -->
      <div class="bg-white border shadow-md rounded-md overflow-hidden mt-6">
        <div class="p-4 flex flex-wrap justify-between items-center gap-2">
          <div class="relative border rounded-md w-full max-w-xs">
            <input
              type="text"
              v-model="searchTerm"
              class="pl-10 pr-4 py-2 w-full rounded-md focus:outline-none focus:ring-0 border-none"
              placeholder="Ürünlerde Ara..."
            />
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
            </div>
          </div>
          <div class="flex gap-2">
            <!-- Category Dropdown -->
            <div class="relative w-48" ref="dropdownRef">
              <button
                @click="openCategory = !openCategory"
                class="w-full border px-4 py-2 rounded-md text-gray-700 hover:bg-[#FE9F43] hover:text-white hover:border-[#FE9F43] transition"
              >
                <span class="flex items-center justify-between">
                  {{ selectedCategory || "Tüm Kategoriler" }}
                  <ChevronDownIcon class="w-4 h-4 ml-2"
                /></span>
              </button>

              <div
                v-if="openCategory"
                class="fixed w-48 mt-1 bg-white border rounded-md shadow-lg"
              >
                <div
                  class="px-4 py-2 hover:bg-[#FE9F431A] hover:text-[#FE9F43] cursor-pointer"
                  @click="selectCategory('')"
                >
                  Tüm Kategoriler
                </div>
                <div
                  v-for="cat in categories"
                  :key="cat"
                  class="px-4 py-2 hover:bg-[#FE9F431A] hover:text-[#FE9F43] cursor-pointer"
                  @click="selectCategory(cat)"
                >
                  {{ cat }}
                </div>
              </div>
            </div>

            <!-- Marka -->

            <!-- Brand Dropdown -->
            <div class="relative w-48" ref="brandDropdownRef">
              <button
                @click="openBrand = !openBrand"
                class="w-full border px-4 py-2 rounded-md text-gray-700 hover:bg-[#FE9F43] hover:text-white hover:border-[#FE9F43] transition"
              >
                <span class="flex items-center justify-between"
                  >{{ selectedBrand || "Tüm Markalar" }}
                  <ChevronDownIcon class="w-4 h-4 ml-2"
                /></span>
              </button>

              <div
                v-if="openBrand"
                class="fixed w-48 mt-1 bg-white border rounded-md shadow-lg"
              >
                <div
                  class="px-4 py-2 hover:bg-[#FE9F431A] hover:text-[#FE9F43] cursor-pointer"
                  @click="selectBrand('')"
                >
                  Tüm Markalar
                </div>
                <div
                  v-for="brand in brands"
                  :key="brand"
                  class="px-4 py-2 hover:bg-[#FE9F431A] hover:text-[#FE9F43] cursor-pointer"
                  @click="selectBrand(brand)"
                >
                  {{ brand }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full text-sm text-left">
            <thead class="bg-gray-100 text-gray-600 uppercase">
              <tr>
                <th class="p-3">SKU</th>
                <th class="p-3">Satici</th>
                <th class="p-3">Ürün Adı</th>
                <th class="p-3">Marka</th>
                <th class="p-3">Model</th>
                <th class="p-3">Kategori</th>
                <th class="p-3">Alt Kategori</th>
                <th class="p-3">Price</th>
                <th class="p-3">Adet</th>
                <th class="p-3">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y">
              <tr
                v-for="item in filteredProducts"
                :key="item.id"
                class="hover:bg-gray-50 transition"
              >
                <td class="p-3 font-medium text-gray-800">
                  {{ item.sku || "N/A" }}
                </td>
                <td class="p-3">{{ item.seller }}</td>
                <td class="p-3">
                  {{ item.name }}
                </td>
                <td class="p-3">{{ item.brand }}</td>
                <td class="p-3">{{ item.model }}</td>
                <td class="p-3">{{ item.category }}</td>
                <td class="p-3">{{ item.subCategory }}</td>
                <td class="p-3">{{ item.price }} ₺</td>
                <td class="p-3">{{ item.count }}</td>

                <td class="p-3">
                  <div class="flex gap-2">
                    <router-link
                      :to="{ name: 'productInfo', params: { id: item.id } }"
                      class="p-2 border border-[#E6EAED] hover:bg-gray-200 rounded-md"
                    >
                      <EyeIcon class="w-5 h-5 text-gray-600" />
                    </router-link>

                    <router-link
                      :to="{ name: 'setProduct', params: { id: item.id } }"
                      class="p-2 border border-[#E6EAED] hover:bg-gray-200 rounded-md"
                    >
                      <PencilSquareIcon class="w-5 h-5" />
                    </router-link>

                    <button
                      @click="removeProduct(item.id)"
                      class="p-2 border border-[#E6EAED] hover:bg-gray-200 rounded-md"
                    >
                      <TrashIcon class="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStockData } from "@/stores/stock";
import router from "@/router";
import Swal from "sweetalert2";
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  ChevronDownIcon,
} from "@heroicons/vue/24/outline";

const stockData = useStockData();
const searchTerm = ref("");
const selectedCategory = ref("");
const selectedBrand = ref("");
const categories = ref([]);
const brands = ref([]);
const openCategory = ref(false);
const openBrand = ref(false);
const brandDropdownRef = ref(null);

const selectCategory = (cat) => {
  selectedCategory.value = cat;
  openCategory.value = false;
};
const selectBrand = (brand) => {
  selectedBrand.value = brand;
  openBrand.value = false;
};

const filteredProducts = computed(() => {
  const list = Array.isArray(stockData.adminStock) ? stockData.adminStock : [];

  return list.filter((p) => {
    const matchSearch = p.name
      ?.toLowerCase()
      .includes(searchTerm.value.toLowerCase());
    const matchCategory = selectedCategory.value
      ? p.category === selectedCategory.value
      : true;
    const matchBrand = selectedBrand.value
      ? p.brand === selectedBrand.value
      : true;
    return matchSearch && matchCategory && matchBrand;
  });
});

const goToCreateProduct = () => {
  router.push("/create-new-product");
};

const goToInfo = (id) => {
  router.push({ name: "productInfo", params: { id } });
};

const goToEdit = (id) => {
  router.push({ name: "setProduct", params: { id } });
};

const removeProduct = (id) => {
  Swal.fire({
    title: "Emin misiniz?",
    text: "Bu işlem geri alınamaz!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#fe9f43",
    cancelButtonColor: "#d33",
    confirmButtonText: "Evet, sil",
  }).then((result) => {
    if (result.isConfirmed) {
      stockData.removeByID(id).then(() => {
        Swal.fire("Silindi!", "Ürün başarıyla silindi.", "success");
      });
    }
  });
};

onMounted(async () => {
  await stockData.adminGetStock();
  // Benzersiz kategori ve marka listesi oluştur
  categories.value = [
    ...new Set(stockData.adminStock.map((item) => item.category)),
  ];
  brands.value = [...new Set(stockData.adminStock.map((item) => item.brand))];
});
</script>

<style scoped>
.page-wrapper {
  padding: 20px;
}
</style>
