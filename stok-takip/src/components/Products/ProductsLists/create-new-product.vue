<template>
  <div class="p-4">
    <h1 class="text-xl font-bold mb-4">Yeni Ürün Ekle</h1>

    <form @submit.prevent="addProduct">
      <!-- Marka Seçimi -->
      <div class="mb-4">
        <label for="brand" class="block text-sm font-medium text-gray-700">
          Araç Markası
        </label>
        <select
          id="brand"
          v-model="selectedBrand"
          @change="fetchModels"
          class="mt-1 p-2 border border-gray-300 rounded"
          required
        >
          <option v-for="brand in brands" :key="brand.id" :value="brand.id">
            {{ brand.id }}
          </option>
        </select>
        <button
          @click="openNewBrandModal"
          type="button"
          class="mt-2 text-blue-500"
        >
          Yeni Araç Ekle
        </button>
      </div>

      <!-- Model Seçimi -->
      <div class="mb-4" v-if="models.length">
        <label for="model" class="block text-sm font-medium text-gray-700">
          Model
        </label>
        <select
          id="model"
          v-model="selectedModel"
          @change="fetchCategories"
          class="mt-1 p-2 border border-gray-300 rounded"
          required
        >
          <option v-for="model in models" :key="model.id" :value="model.id">
            {{ model.id }}
          </option>
        </select>
      </div>

      <!-- Kategori Seçimi -->
      <div class="mb-4" v-if="categories.length">
        <label for="category" class="block text-sm font-medium text-gray-700">
          Kategori
        </label>
        <select
          id="category"
          v-model="selectedCategory"
          @change="fetchSubCategories"
          class="mt-1 p-2 border border-gray-300 rounded"
          required
        >
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.id }}
          </option>
        </select>
      </div>

      <!-- Alt Kategori Seçimi -->
      <div class="mb-4" v-if="subCategories.length">
        <label
          for="subCategory"
          class="block text-sm font-medium text-gray-700"
        >
          Alt Kategori
        </label>
        <select
          id="subCategory"
          v-model="selectedSubCategory"
          class="mt-1 p-2 border border-gray-300 rounded"
          required
        >
          <option
            v-for="subCategory in subCategories"
            :key="subCategory.id"
            :value="subCategory.id"
          >
            {{ subCategory.name }}
          </option>
        </select>
      </div>

      <!-- Ürün Adı -->
      <div class="mb-4">
        <label
          for="productName"
          class="block text-sm font-medium text-gray-700"
        >
          Ürün Adı
        </label>
        <input
          type="text"
          id="productName"
          v-model="product.name"
          class="mt-1 p-2 border border-gray-300 rounded"
          placeholder="Ürün adını girin"
          required
        />
      </div>

      <!-- Ürün Fiyatı -->
      <div class="mb-4">
        <label
          for="productPrice"
          class="block text-sm font-medium text-gray-700"
        >
          Fiyat
        </label>
        <input
          type="number"
          id="productPrice"
          v-model="product.price"
          class="mt-1 p-2 border border-gray-300 rounded"
          placeholder="Fiyatı girin"
          required
        />
      </div>

      <!-- Ürün Adeti -->
      <div class="mb-4">
        <label
          for="productCount"
          class="block text-sm font-medium text-gray-700"
        >
          Adet
        </label>
        <input
          type="number"
          id="productCount"
          v-model="product.count"
          class="mt-1 p-2 border border-gray-300 rounded"
          placeholder="Adeti girin"
          required
        />
      </div>

      <button type="submit" class="bg-green-500 text-white py-2 px-4 rounded">
        Ürünü Ekle
      </button>
    </form>

    <!-- Başarı / Hata mesajı -->
    <div
      v-if="message"
      :class="message.success ? 'text-green-500' : 'text-red-500'"
      class="mt-4"
    >
      {{ message.text }}
    </div>

    <!-- Yeni Araç Markası Ekleme Modalı -->
    <div
      v-if="showBrandModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10"
    >
      <div class="bg-white p-6 rounded-lg shadow-md w-1/3">
        <h2 class="text-xl font-bold mb-4">Yeni Araç Markası Ekle</h2>

        <!-- Araç Markası -->
        <div class="mb-4">
          <label for="newBrand" class="block text-sm font-medium text-gray-700">
            Araç Markası
          </label>
          <input
            type="text"
            id="newBrand"
            v-model="newBrand"
            class="mt-1 p-2 border border-gray-300 rounded"
            placeholder="Araç markasını girin"
            required
          />
        </div>

        <!-- Model, Kategori ve Alt Kategori -->
        <div class="mb-4">
          <label for="newModel" class="block text-sm font-medium text-gray-700">
            Model
          </label>
          <input
            type="text"
            id="newModel"
            v-model="newModel"
            class="mt-1 p-2 border border-gray-300 rounded"
            placeholder="Model adı girin"
            required
          />
        </div>

        <div class="mb-4">
          <label
            for="newCategory"
            class="block text-sm font-medium text-gray-700"
          >
            Kategori
          </label>
          <input
            type="text"
            id="newCategory"
            v-model="newCategory"
            class="mt-1 p-2 border border-gray-300 rounded"
            placeholder="Kategori adı girin"
            required
          />
        </div>

        <div class="mb-4">
          <label
            for="newSubCategory"
            class="block text-sm font-medium text-gray-700"
          >
            Alt Kategori
          </label>
          <input
            type="text"
            id="newSubCategory"
            v-model="newSubCategory"
            class="mt-1 p-2 border border-gray-300 rounded"
            placeholder="Alt kategori adı girin"
            required
          />
        </div>

        <!-- Modal Butonları -->
        <div class="flex justify-between">
          <button
            @click="addNewBrand"
            class="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Ekle
          </button>
          <button
            @click="closeBrandModal"
            class="bg-gray-300 text-gray-800 py-2 px-4 rounded"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { db } from "@/utils/firebase"; // Firestore bağlantınız
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import * as yup from "yup";

// State'ler
const brands = ref([]);
const models = ref([]);
const categories = ref([]);
const subCategories = ref([]);
const selectedBrand = ref(null);
const selectedModel = ref(null);
const selectedCategory = ref(null);
const selectedSubCategory = ref(null);
const product = ref({
  name: "",
  price: "",
  count: "",
});
const message = ref(null);

// Yeni Araç Markası Modalı için State
const showBrandModal = ref(false);
const newBrand = ref("");
const newModel = ref("");
const newCategory = ref("");
const newSubCategory = ref("");

// Validation Schema
const validationSchema = yup.object({
  name: yup.string().required("Ürün adı gerekli"),
  price: yup
    .number()
    .required("Fiyat gerekli")
    .positive("Fiyat pozitif olmalı"),
  count: yup.number().required("Adet gerekli").min(1, "Adet en az 1 olmalı"),
});

const fetchBrands = async () => {
  const brandsCollection = collection(db, "Stok");
  const snapshot = await getDocs(brandsCollection);
  brands.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

const fetchModels = async () => {
  const modelsCollection = collection(
    db,
    "Stok",
    selectedBrand.value,
    "Modeller"
  );
  const snapshot = await getDocs(modelsCollection);
  models.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

const fetchCategories = async () => {
  const categoriesCollection = collection(
    db,
    "Stok",
    selectedBrand.value,
    "Modeller",
    selectedModel.value,
    "Kategoriler"
  );
  const snapshot = await getDocs(categoriesCollection);
  categories.value = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

const fetchSubCategories = async () => {
  const subCategoriesCollection = collection(
    db,
    "Stok",
    selectedBrand.value,
    "Modeller",
    selectedModel.value,
    "Kategoriler",
    selectedCategory.value,
    "Alt Kategoriler"
  );
  const snapshot = await getDocs(subCategoriesCollection);
  subCategories.value = snapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
  }));
};

const addProduct = async () => {
  try {
    await validationSchema.validate(product.value);
    const productRef = doc(
      db,
      "Stok",
      selectedBrand.value,
      "Modeller",
      selectedModel.value,
      "Kategoriler",
      selectedCategory.value,
      "Alt Kategoriler",
      selectedSubCategory.value,
      "Ürünler",
      product.value.name
    );
    await setDoc(productRef, {
      name: product.value.name,
      price: product.value.price,
      count: product.value.count,
    });
    message.value = { success: true, text: "Ürün başarıyla eklendi!" };
    resetForm();
  } catch (error) {
    message.value = { success: false, text: error.message };
  }
};

const openNewBrandModal = () => {
  showBrandModal.value = true;
};

const closeBrandModal = () => {
  showBrandModal.value = false;
};

const addNewBrand = async () => {
  if (
    newBrand.value &&
    newModel.value &&
    newCategory.value &&
    newSubCategory.value
  ) {
    const brandRef = doc(db, "Stok", newBrand.value);
    await setDoc(brandRef, {}); // Marka verisini ekle
    const modelRef = doc(brandRef, "Modeller", newModel.value);
    await setDoc(modelRef, {}); // Model verisini ekle
    const categoryRef = doc(modelRef, "Kategoriler", newCategory.value);
    await setDoc(categoryRef, {}); // Kategori verisini ekle
    const subCategoryRef = doc(
      categoryRef,
      "Alt Kategoriler",
      newSubCategory.value
    );
    await setDoc(subCategoryRef, { name: newSubCategory.value }); // Alt kategori verisini ekle
    message.value = { success: true, text: "Yeni marka ve model eklendi!" };
    closeBrandModal();
    fetchBrands(); // Yeni markayı listeye ekle
  }
};

const resetForm = () => {
  product.value = { name: "", price: "", count: "" };
  selectedBrand.value = null;
  selectedModel.value = null;
  selectedCategory.value = null;
  selectedSubCategory.value = null;
};

onMounted(fetchBrands);
</script>
