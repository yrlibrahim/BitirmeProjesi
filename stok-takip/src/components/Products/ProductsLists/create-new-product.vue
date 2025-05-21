<template>
  <!--Loading Iconu-->
  <div v-if="loading">
    <div class="flex items-center justify-center min-h-screen">
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
  </div>
  <!--Loading Iconu-->

  <div v-else class="flex items-center justify-between">
    <div>
      <h1 class="text-[22px] text-[#646B72] font-semibold">Ürün Oluştur</h1>
      <p class="text-[18px] text-[#646B72] pt-4">Yeni ürün ekle</p>
    </div>
    <div class="">
      <button
        class="border border-[#092C4C] bg-[#092C4C] rounded-md p-2 text-[#ffffff] hover:text-[#092C4C] hover:bg-[white] flex items-center gap-3 transition"
        @click="router.back()"
      >
        <ArrowUturnLeftIcon class="w-5 h-5" />
        Geri Dön
      </button>
    </div>
  </div>
  <div class="bg-[#ffffff] mt-4 px-4 p-2 rounded-lg border border-[#c1c7cc]">
    <h1 class="text-[#646B72] text-[18px] font-semibold border-b mb-4 p-2">
      Ürün Bilgileri
    </h1>
    <div>
      <Form @submit="onSubmit">
        <div>
          <div class="flex items-center justify-start gap-4 mb-3">
            <div class="mb-10 w-1/2">
              <Field name="seller" v-slot="{ errors }">
                <p class="mb-1 text-[#646B72]">Satıcı Firma</p>
                <div class="relative w-full" ref="companyWrapper">
                  <!-- Seçilen firma gösterilir -->
                  <div
                    @click="dropdownOpen = !dropdownOpen"
                    class="border px-4 py-2 rounded-md bg-white shadow-sm cursor-pointer flex justify-between items-center"
                  >
                    <span>{{ seller || "Satıcı firma seçin" }}</span>
                    <svg
                      class="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>

                  <!-- Firma listesi -->
                  <div
                    v-if="dropdownOpen"
                    class="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-auto"
                  >
                    <div
                      v-for="company in companyOptions"
                      :key="company.id"
                      @click="selectCompany(company.companyName)"
                      class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {{ company.companyName }}
                    </div>
                  </div>
                </div>

                <div v-if="errors.length" class="text-red-500 mt-1">
                  {{ errors[0] }}
                </div>
              </Field>
            </div>
            <div class="mb-10 w-1/2">
              <Field name="minCount" v-slot="{ field, errors }">
                <p class="text-[#646B72]">Minimum Stok</p>
                <input
                  type="number"
                  class="w-full h-10 rounded-md border border-grey-2 mt-1 px-4 py-1 focus:outline-none"
                  v-bind="field"
                  placeholder="En az kaç adet olmalı?"
                />
                <div v-if="errors.length" class="">{{ errors[0] }}</div>
              </Field>
            </div>
          </div>

          <div class="flex items-center justify-start gap-4">
            <div class="mb-10 w-1/2">
              <Field name="sku" v-slot="{ field, errors }">
                <p class="text-[#646B72]">Stok Kodu</p>
                <input
                  type="text"
                  v-bind="field"
                  v-model="sku"
                  placeholder="Benzersiz bir stok kodu girin"
                  class="w-full h-10 rounded-md border border-grey-2 px-4 py-1 focus:outline-none"
                />
                <div v-if="errors.length" class="text-red-500">
                  {{ errors[0] }}
                </div>
                <div class="mt-1 h-3 text-red-500">
                  {{ skuError || "" }}
                </div>
              </Field>
            </div>
            <div class="mb-10 w-1/2">
              <Field name="name" v-slot="{ field, errors }">
                <p class="text-[#646B72]">Ürün</p>
                <input
                  type="text"
                  class="w-full h-10 rounded-md border border-grey-2 mt-1 px-4 py-1 focus:outline-none"
                  v-bind="field"
                  placeholder="Ürün adı girin"
                />
                <div v-if="errors.length" class="">{{ errors[0] }}</div>
                <div class="mt-1 h-3 text-red-500">
                  {{ "" }}
                </div>
              </Field>
            </div>
          </div>

          <div class="flex items-center justify-center gap-4 mb-3">
            <div class="mb-10 w-1/2">
              <Field name="brand" v-slot="{ errors }">
                <p class="mb-1 text-[#646B72]">Araç</p>
                <div class="relative w-full" ref="brandWrapper">
                  <!-- Input alanı -->
                  <input
                    type="text"
                    v-model="brand"
                    @focus="brandDropdownOpen = true"
                    @input="brandDropdownOpen = true"
                    placeholder="Araç adı yaz veya seç"
                    class="w-full px-4 py-2 border rounded bg-white shadow-sm focus:outline-none"
                  />
                  <!-- Dropdown (filtreli) -->
                  <div
                    v-if="brandDropdownOpen && filteredBrandOptions.length"
                    class="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-auto"
                  >
                    <div
                      v-for="b in filteredBrandOptions"
                      :key="b"
                      @click="selectBrand(b)"
                      class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {{ b }}
                    </div>
                  </div>
                </div>

                <div v-if="errors.length" class="text-red-500 mt-1">
                  {{ errors[0] }}
                </div>
              </Field>
            </div>

            <div class="mb-10 w-1/2">
              <Field name="model" v-slot="{ errors }">
                <p class="mb-1 text-[#646B72]">Model</p>
                <div class="relative w-full" ref="modelWrapper">
                  <!-- Input alanı -->
                  <input
                    type="text"
                    v-model="model"
                    @focus="modelDropdownOpen = true"
                    @input="modelDropdownOpen = true"
                    :disabled="!brand"
                    placeholder="Model yaz veya seç"
                    class="w-full px-4 py-2 border rounded bg-white shadow-sm focus:outline-none"
                  />

                  <!-- Dropdown -->
                  <div
                    v-if="modelDropdownOpen && filteredModelOptions.length"
                    class="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-auto"
                  >
                    <div
                      v-for="m in filteredModelOptions"
                      :key="m"
                      @click="selectModel(m)"
                      class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {{ m }}
                    </div>
                  </div>
                </div>

                <div v-if="errors.length" class="text-red-500 mt-1">
                  {{ errors[0] }}
                </div>
              </Field>
            </div>
          </div>
          <div class="flex items-center justify-center gap-4 mb-3">
            <div class="mb-10 w-1/2">
              <Field name="category" v-slot="{ errors }">
                <p class="mb-1 text-[#646B72]">Kategori</p>
                <div class="relative w-full" ref="categoryWrapper">
                  <!-- Input -->
                  <input
                    type="text"
                    v-model="category"
                    @focus="categoryDropdownOpen = true"
                    @input="categoryDropdownOpen = true"
                    :disabled="!model"
                    placeholder="Kategori yaz veya seç"
                    class="w-full px-4 py-2 border rounded bg-white shadow-sm focus:outline-none"
                  />

                  <!-- Dropdown -->
                  <div
                    v-if="
                      categoryDropdownOpen && filteredCategoryOptions.length
                    "
                    class="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-auto"
                  >
                    <div
                      v-for="c in filteredCategoryOptions"
                      :key="c"
                      @click="selectCategory(c)"
                      class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {{ c }}
                    </div>
                  </div>
                </div>

                <div v-if="errors.length" class="text-red-500 mt-1">
                  {{ errors[0] }}
                </div>
              </Field>
            </div>

            <div class="mb-10 w-1/2">
              <Field name="subCategory" v-slot="{ errors }">
                <p class="mb-1 text-[#646B72]">Alt Kategori</p>
                <div class="relative w-full" ref="subCategoryWrapper">
                  <!-- Input -->
                  <input
                    type="text"
                    v-model="subCategory"
                    @focus="subCategoryDropdownOpen = true"
                    @input="subCategoryDropdownOpen = true"
                    :disabled="!category"
                    placeholder="Alt kategori yaz veya seç"
                    class="w-full px-4 py-2 border rounded bg-white shadow-sm focus:outline-none"
                  />

                  <!-- Dropdown -->
                  <div
                    v-if="
                      subCategoryDropdownOpen &&
                      filteredSubCategoryOptions.length
                    "
                    class="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-auto"
                  >
                    <div
                      v-for="s in filteredSubCategoryOptions"
                      :key="s"
                      @click="selectSubCategory(s)"
                      class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {{ s }}
                    </div>
                  </div>
                </div>

                <div v-if="errors.length" class="text-red-500 mt-1">
                  {{ errors[0] }}
                </div>
              </Field>
            </div>
          </div>
          <div class="flex items-center justify-center gap-4 mb-3">
            <div class="mb-10 w-1/2">
              <Field name="count" v-slot="{ field, errors }">
                <p class="text-[#646B72]">Adet</p>
                <input
                  type="number"
                  class="w-full h-10 rounded-md border border-grey-2 mt-1 px-4 py-1 focus:outline-none"
                  v-bind="field"
                />
                <div v-if="errors.length" class="">{{ errors[0] }}</div>
              </Field>
            </div>
            <div class="mb-10 w-1/2">
              <Field name="price" v-slot="{ field, errors }">
                <p class="text-[#646B72]">Fiyat ₺</p>
                <input
                  type="number"
                  class="w-full h-10 rounded-md border border-grey-2 mt-1 px-4 py-1 focus:outline-none"
                  v-bind="field"
                />
                <div v-if="errors.length" class="">{{ errors[0] }}</div>
              </Field>
            </div>
          </div>
        </div>
        <div class="text-left mt-6 mb-4">
          <button
            type="submit"
            class="px-4 bg-[#fe9f43] text-white py-3 rounded-md border border-[#fe9f43] hover:bg-white hover:text-[#fe9f43] transition"
          >
            <span> Ürün Ekle </span>
          </button>
        </div>
      </Form>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { Field, Form } from "vee-validate";
import * as yup from "yup";
import { useStockData } from "@/stores/stock";
import { useToast } from "vue-toast-notification";
import { errorMessages } from "vue/compiler-sfc";
import { useRouter } from "vue-router";
import {
  fetchBrands,
  fetchModels,
  fetchCategories,
  fetchSubCategories,
} from "@/components/Helpers/useProductHelpers";
import { isSkuExists } from "@/components/Helpers/useProductHelpers";
import { useCompanyStore } from "@/stores/company"; // Pinia store'un
import { ArrowUturnLeftIcon } from "@heroicons/vue/24/outline";
import { useClickOutside } from "@/components/Helpers/useClickOutside";

const companyStore = useCompanyStore();
const companyOptions = ref([]);
const seller = ref("");

const brand = ref("");
const model = ref("");
const category = ref("");
const subCategory = ref("");
const router = useRouter();
const $toast = useToast();

// Dropmenuler
const dropdownOpen = ref(false);
const brandDropdownOpen = ref(false);
const companyWrapper = ref(null);
const brandWrapper = ref(null);
const modelDropdownOpen = ref(false);
const modelWrapper = ref(null);
const categoryDropdownOpen = ref(false);
const categoryWrapper = ref(null);
const subCategoryDropdownOpen = ref(false);
const subCategoryWrapper = ref(null);

function selectCompany(name) {
  seller.value = name;
  dropdownOpen.value = false;
}
//Brand Menu
const selectBrand = (value) => {
  brand.value = value;
  brandDropdownOpen.value = false;
};
const filteredBrandOptions = computed(() =>
  brandOptions.value.filter((b) =>
    b.toLowerCase().includes(brand.value.toLowerCase())
  )
);
//Model Menu
const filteredModelOptions = computed(() =>
  modelOptions.value.filter((m) =>
    m.toLowerCase().includes(model.value.toLowerCase())
  )
);
function selectModel(value) {
  model.value = value;
  modelDropdownOpen.value = false;
}
// Category Menu
const filteredCategoryOptions = computed(() =>
  categoryOptions.value.filter((c) =>
    c.toLowerCase().includes(category.value.toLowerCase())
  )
);
function selectCategory(value) {
  category.value = value;
  categoryDropdownOpen.value = false;
}
//Sub Category Menu
const filteredSubCategoryOptions = computed(() =>
  subCategoryOptions.value.filter((s) =>
    s.toLowerCase().includes(subCategory.value.toLowerCase())
  )
);

function selectSubCategory(value) {
  subCategory.value = value;
  subCategoryDropdownOpen.value = false;
}

// --- Seçilen değerler ve dropdownlar
const brandOptions = ref([]);
const modelOptions = ref([]);
const categoryOptions = ref([]);
const subCategoryOptions = ref([]);

// Sayfa yüklendiğinde brand'leri getir
onMounted(async () => {
  brandOptions.value = await fetchBrands();
  await companyStore.fetchCompanies(); // şirketleri çek
  companyOptions.value = [...companyStore.companys];
});

watch(brand, async (newVal) => {
  model.value = "";
  category.value = "";
  subCategory.value = "";
  modelOptions.value = newVal ? await fetchModels(newVal) : [];
});

watch(model, async (newVal) => {
  category.value = "";
  subCategory.value = "";
  categoryOptions.value = newVal
    ? await fetchCategories(brand.value, newVal)
    : [];
});

watch(category, async (newVal) => {
  subCategory.value = "";
  subCategoryOptions.value = newVal
    ? await fetchSubCategories(brand.value, model.value, newVal)
    : [];
});

//urun eklenirken loading ikonu gosterilmesi
const loading = ref(false);
// Urunleri database ekleme
const stockData = useStockData();

function onSubmit(values, { resetForm }) {
  if (!seller.value) {
    $toast.error("Lütfen satıcı firma seçin!");
    return;
  }
  if (!brand.value) {
    $toast.error("Lütfen araç bilgisini girin!");
    return;
  }

  if (skuError.value) {
    $toast.error("Lütfen benzersiz bir stok kodu girin!");
    return;
  }

  loading.value = true;

  stockData
    .getStockData({
      ...values,
      seller: seller.value,
      brand: brand.value,
      model: model.value,
      category: category.value,
      subCategory: subCategory.value,
    })
    .then(() => {
      $toast.success("Ürün başarı ile eklendi !");
    })
    .catch((error) => {
      $toast.error("Ürün eklenirken hata oluştu !");
      $toast.error(error.message);
    })
    .finally(() => {
      loading.value = false;
    });
}

watch(brand, async (newVal) => {
  if (newVal) {
    modelOptions.value = await fetchModels(newVal);
  } else {
    modelOptions.value = [];
  }
});

// var olan sku sorgulama
const sku = ref("");
const skuError = ref("");

watch(sku, async (newVal) => {
  if (newVal && newVal.trim().length > 0) {
    const exists = await isSkuExists(newVal.trim());
    skuError.value = exists ? "Bu stok kodu zaten var!" : "";
  } else {
    skuError.value = "";
  }
});
// click dışında tıklanırsa menüyü kapat
useClickOutside(companyWrapper, () => {
  dropdownOpen.value = false;
});

useClickOutside(brandWrapper, () => {
  brandDropdownOpen.value = false;
});

useClickOutside(modelWrapper, () => {
  modelDropdownOpen.value = false;
});
useClickOutside(categoryWrapper, () => {
  categoryDropdownOpen.value = false;
});
useClickOutside(subCategoryWrapper, () => {
  subCategoryDropdownOpen.value = false;
});
</script>
