<template>
  <!--Loading Iconu-->
  <div v-if="loading" class="flex items-center justify-center min-h-screen">
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
  <!--Loading Iconu-->

  <div v-else class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl">Ürün Oluştur</h1>
      <p class="text-lg">Yeni ürün ekle</p>
    </div>
    <div class="">
      <button
        class="bg-[#092c4c] rounded-md p-2 text-[#ffffff]"
        @click="router.back()"
      >
        <font-awesome-icon icon="fa-solid fa-arrow-left" />
        Geri Dön
      </button>
    </div>
  </div>
  <div class="bg-[#ffffff] mt-4 px-4 p-2 rounded-lg border border-[#c1c7cc]">
    <h1 class="text-2xl border-b mb-4 p-2">Urun Bilgileri</h1>
    <div>
      <Form @submit="onSubmit">
        <div>
          <div class="flex items-center justify-start gap-4 mb-3">
            <div class="mb-10 w-1/2">
              <Field name="seller" v-slot="{ field, errors }">
                <p>Satıcı Firma</p>
                <input
                  type="text"
                  list="companyList"
                  v-bind="field"
                  v-model="seller"
                  placeholder="Satıcı firma adı seçin"
                  class="w-full h-10 rounded-md border border-grey-2 px-4 py-1 focus:outline-none"
                />
                <datalist id="companyList">
                  <option
                    v-for="company in companyOptions"
                    :key="company.id"
                    :value="company.companyName"
                  />
                </datalist>
                <div v-if="errors.length" class="text-red-500 mt-1">
                  {{ errors[0] }}
                </div>
              </Field>
            </div>
          </div>

          <div class="flex items-center justify-start gap-4">
            <div class="mb-10 w-1/2">
              <Field name="sku" v-slot="{ field, errors }">
                <p>Stok Kodu</p>
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
                <p>Urun</p>
                <input
                  type="text"
                  class="w-full h-10 rounded-md border border-grey-2 mt-1 px-4 py-1 focus:outline-none"
                  v-bind="field"
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
              <Field name="brand" v-slot="{ field, errors }">
                <p>Araç</p>
                <input
                  type="text"
                  list="brandList"
                  v-bind="field"
                  v-model="brand"
                  placeholder="Araç adı yaz veya seç"
                  class="w-full h-10 rounded-md border border-grey-2 px-4 py-1 focus:outline-none"
                />
                <datalist id="brandList">
                  <option v-for="b in brandOptions" :key="b" :value="b" />
                </datalist>
                <div v-if="errors.length" class="text-red-500 mt-1">
                  {{ errors[0] }}
                </div>
              </Field>
            </div>

            <div class="mb-10 w-1/2">
              <Field name="model" v-slot="{ field, errors }">
                <p>Model</p>
                <input
                  type="text"
                  list="modelList"
                  v-bind="field"
                  v-model="model"
                  :disabled="!brand"
                  placeholder="Model gir veya seç"
                  class="w-full h-10 rounded-md border border-grey-2 px-4 py-1 focus:outline-none"
                />
                <datalist id="modelList">
                  <option v-for="m in modelOptions" :key="m" :value="m" />
                </datalist>
                <div v-if="errors.length" class="text-red-500 mt-1">
                  {{ errors[0] }}
                </div>
              </Field>
            </div>
          </div>
          <div class="flex items-center justify-center gap-4 mb-3">
            <div class="mb-10 w-1/2">
              <Field name="category" v-slot="{ field, errors }">
                <p>Kategori</p>
                <input
                  type="text"
                  list="categoryList"
                  v-bind="field"
                  v-model="category"
                  :disabled="!model"
                  placeholder="Kategori yaz veya seç"
                  class="w-full h-10 rounded-md border border-grey-2 px-4 py-1 focus:outline-none"
                />
                <datalist id="categoryList">
                  <option v-for="c in categoryOptions" :key="c" :value="c" />
                </datalist>
                <div v-if="errors.length" class="text-red-500 mt-1">
                  {{ errors[0] }}
                </div>
              </Field>
            </div>

            <div class="mb-10 w-1/2">
              <Field name="subCategory" v-slot="{ field, errors }">
                <p>Alt Kategori</p>
                <input
                  type="text"
                  list="subCategoryList"
                  v-bind="field"
                  v-model="subCategory"
                  :disabled="!category"
                  placeholder="Alt kategori yaz veya seç"
                  class="w-full h-10 rounded-md border border-grey-2 px-4 py-1 focus:outline-none"
                />
                <datalist id="subCategoryList">
                  <option v-for="s in subCategoryOptions" :key="s" :value="s" />
                </datalist>
                <div v-if="errors.length" class="text-red-500 mt-1">
                  {{ errors[0] }}
                </div>
              </Field>
            </div>
          </div>
          <div class="flex items-center justify-center gap-4 mb-3">
            <div class="mb-10 w-1/2">
              <Field name="count" v-slot="{ field, errors }">
                <p>Adet</p>
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
                <p>Fiyat</p>
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
        <div class="text-center mt-6">
          <button
            type="submit"
            class="w-full bg-[#fe9f43] text-white py-3 rounded-lg relative overflow-hidden group border border-[#fe9f43] hover:bg-white hover:text-[#fe9f43]"
          >
            <span
              class="absolute inset-0 bg-white scale-y-0 group-hover:scale-y-100 transform transition-transform duration-300 origin-top"
            ></span>
            <span
              class="relative group-hover:text-[#fe9f43] transition-colors duration-300"
            >
              Urun Ekle
            </span>
          </button>
        </div>
      </Form>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { Field, Form } from "vee-validate";
import { onMounted } from "vue";
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
import { watch } from "vue";
import { isSkuExists } from "@/components/Helpers/useProductHelpers";
import { useCompanyStore } from "@/stores/company"; // Pinia store'un

const companyStore = useCompanyStore();
const companyOptions = ref([]);
const seller = ref("");

const brand = ref("");
const model = ref("");
const category = ref("");
const subCategory = ref("");

const router = useRouter();
const $toast = useToast();

// --- Seçilen değerler ve dropdownlar

const brandOptions = ref([]);
const modelOptions = ref([]);
const categoryOptions = ref([]);
const subCategoryOptions = ref([]);

// Sayfa yüklendiğinde brand'leri getir
onMounted(async () => {
  brandOptions.value = await fetchBrands();
  await companyStore.fetchCompanies(); // şirketleri çek
  companyOptions.value = companyStore.companyList; // firma listesi ata
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
  if (skuError.value) {
    $toast.error("Lütfen benzersiz bir stok kodu girin!");
    return;
  }
  loading.value = true;
  stockData
    .getStockData(values)
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
</script>
