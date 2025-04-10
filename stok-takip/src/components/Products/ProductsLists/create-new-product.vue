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
  <div v-else>
    <Form @submit="onSubmit">
      <div
        class="flex items-center justify-center gap-4 mb-4"
        v-for="(urun, index) in newProduct.products"
        :key="index"
      >
        <input type="checkbox" v-model="urun.selected" class="w-4 h-4" />
        <div class="mb-10">
          <Field name="brand" v-slot="{ field, errors }">
            <p>Araç</p>
            <input
              type="text"
              class="w-full h-10 rounded-md border border-grey-2 mt-1 px-4 py-1 focus:outline-none"
              v-bind="field"
            />
            <div v-if="errors.length">{{ errors[0] }}</div>
          </Field>
        </div>

        <div class="mb-10">
          <Field name="model" v-slot="{ field, errors }">
            <p>Model</p>
            <input
              type="text"
              class="w-full h-10 rounded-md border border-grey-2 mt-1 px-4 py-1 focus:outline-none"
              v-bind="field"
            />
            <div v-if="errors.length" class="">{{ errors[0] }}</div>
          </Field>
        </div>
        <div class="mb-10">
          <Field name="category" v-slot="{ field, errors }">
            <p>Kategori</p>
            <input
              type="text"
              class="w-full h-10 rounded-md border border-grey-2 mt-1 px-4 py-1 focus:outline-none"
              v-bind="field"
            />
            <div v-if="errors.length" class="">{{ errors[0] }}</div>
          </Field>
        </div>
        <div class="mb-10">
          <Field name="subCategory" v-slot="{ field, errors }">
            <p>Alt Kategori</p>
            <input
              type="text"
              class="w-full h-10 rounded-md border border-grey-2 mt-1 px-4 py-1 focus:outline-none"
              v-bind="field"
            />
            <div v-if="errors.length" class="">{{ errors[0] }}</div>
          </Field>
        </div>
        <div class="mb-10">
          <Field name="name" v-slot="{ field, errors }">
            <p>Urun</p>
            <input
              type="text"
              class="w-full h-10 rounded-md border border-grey-2 mt-1 px-4 py-1 focus:outline-none"
              v-bind="field"
            />
            <div v-if="errors.length" class="">{{ errors[0] }}</div>
          </Field>
        </div>
        <div class="mb-10">
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
        <div class="mb-10">
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
      <div>
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
      <!-- Satır Sil -->

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
</template>
<script setup>
import { ref } from "vue";
import { Field, Form } from "vee-validate";
import * as yup from "yup";
import { useStockData } from "@/stores/stock";
import { useToast } from "vue-toast-notification";
import { errorMessages } from "vue/compiler-sfc";

const $toast = useToast();

const newProduct = ref({
  products: [
    {
      brand: "",
      model: "",
      category: "",
      subCategory: "",
      name: "",
      count: null,
      price: null,
      selected: false,
    },
  ],
});
// urun satiri ekleme islemi
const addProductRow = () => {
  newProduct.value.products.push({
    brand: "",
    model: "",
    category: "",
    subCategory: "",
    name: "",
    count: null,
    price: null,
    selected: false,
  });
};
// secilen satiri silme islemi
const removeSelectedProducts = () => {
  newProduct.value.products = newProduct.value.products.filter(
    (product) => !product.selected
  );
};
//urun eklenirken loading ikonu gosterilmesi
const loading = ref(false);
// Urunleri database ekleme
const stockData = useStockData();

function onSubmit(values, { resetForm }) {
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
</script>
