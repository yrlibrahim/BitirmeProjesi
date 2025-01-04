<template>
  <div class="p-5">
    <h1 class="mb-5">Ürün Detayları</h1>
    <hr />
  </div>
  <div class="flex items-center justify-normal gap-5 p-5">
    <!-- Araç Seçimi -->
    <div class="w-64">
      <div class="flex items-center justify-between">
        <label for="store" class="text-sm font-medium text-gray-700 mb-2"
          >Araç</label
        >
      </div>
      <select
        id="store"
        v-model="selectedStore"
        class="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm sm:text-sm"
      >
        <option v-for="store in stores" :key="store" :value="store">
          {{ store }}
        </option>
      </select>
    </div>

    <!-- Model Seçimi -->
    <div class="w-64">
      <div class="flex items-center justify-between">
        <label for="model" class="text-sm font-medium text-gray-700 mb-2"
          >Model</label
        >
      </div>
      <select
        id="model"
        v-model="selectedModel"
        class="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm sm:text-sm"
        :disabled="!selectedStore"
      >
        <option v-for="model in models" :key="model" :value="model">
          {{ model }}
        </option>
      </select>
    </div>

    <!-- Kategori Seçimi -->
    <div class="w-64">
      <div class="flex items-center justify-between">
        <label for="category" class="text-sm font-medium text-gray-700 mb-2"
          >Kategori</label
        >
      </div>
      <select
        id="category"
        v-model="selectedCategory"
        class="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm sm:text-sm"
        :disabled="!selectedModel"
      >
        <option
          v-for="category in categories"
          :key="category"
          :value="category"
        >
          {{ category }}
        </option>
      </select>
    </div>

    <!-- Alt Kategori Seçimi -->
    <div class="w-64">
      <div class="flex items-center justify-between">
        <label for="subcategory" class="text-sm font-medium text-gray-700 mb-2"
          >Alt Kategori</label
        >
      </div>
      <select
        id="subcategory"
        v-model="selectedSubcategory"
        class="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm sm:text-sm"
        :disabled="!selectedCategory"
      >
        <option
          v-for="subcategory in subcategories"
          :key="subcategory"
          :value="subcategory"
        >
          {{ subcategory }}
        </option>
      </select>
    </div>
  </div>

  <Form
    @submit="handleSubmit(addProduct)"
    class="flex items-center justify-normal gap-5 p-5"
  >
    <!-- Ürün Adı -->
    <div>
      <label for="productName" class="block text-sm font-medium text-gray-700"
        >Ürün Adı</label
      >
      <Field
        name="productName"
        id="productName"
        type="text"
        placeholder="Ürün adı giriniz"
        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#fe9f43] focus:border-[#fe9f43] sm:text-sm"
      />
      <ErrorMessage name="productName" class="text-red-500 text-sm mt-1" />
    </div>

    <!-- Ürün Adeti -->
    <div>
      <label for="productCount" class="block text-sm font-medium text-gray-700"
        >Ürün Adeti</label
      >
      <Field
        name="productCount"
        id="productCount"
        type="number"
        placeholder="Ürün adeti giriniz"
        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#fe9f43] focus:border-[#fe9f43] sm:text-sm"
      />
      <ErrorMessage name="productCount" class="text-red-500 text-sm mt-1" />
    </div>

    <!-- Ürün Fiyatı -->
    <div>
      <label for="productPrice" class="block text-sm font-medium text-gray-700"
        >Ürün Fiyatı (₺)</label
      >
      <Field
        name="productPrice"
        id="productPrice"
        type="number"
        placeholder="Ürün fiyatı giriniz"
        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#fe9f43] focus:border-[#fe9f43] sm:text-sm"
      />
      <ErrorMessage name="productPrice" class="text-red-500 text-sm mt-1" />
    </div>

    <!-- Gönder Butonu -->
    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md">
      Ürün Ekle
    </button>
  </Form>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { db } from "@/utils/firebase";
import { Field, Form } from "vee-validate";

// Dropdown menülerinin seçenekleri
const stores = ref([]); // Araçlar
const models = ref([]); // Modeller
const categories = ref([]); // Kategoriler
const subcategories = ref([]); // Alt kategoriler
// Seçili değerler
const selectedStore = ref("");
const selectedModel = ref("");
const selectedCategory = ref("");
const selectedSubcategory = ref("");

// Firestore'dan araçları al
const getStores = async () => {
  try {
    const storesSnapshot = await getDocs(collection(db, "Stok"));
    stores.value = storesSnapshot.docs.map((doc) => doc.id); // Araç isimlerini al
  } catch (error) {
    console.error("Veriler alınırken hata oluştu: ", error);
  }
};

// Modelleri al (Seçilen araçla ilişkili)
const getModels = async () => {
  if (!selectedStore.value) return;
  const modelsSnapshot = await db
    .collection("Stok")
    .doc(selectedStore.value)
    .collection("Model")
    .get();
  models.value = modelsSnapshot.docs.map((doc) => doc.id); // Model isimlerini al
};

// Kategorileri al (Seçilen modelle ilişkili)
const getCategories = async () => {
  if (!selectedModel.value) return;
  const categoriesSnapshot = await db
    .collection("Stok")
    .doc(selectedStore.value)
    .collection("Model")
    .doc(selectedModel.value)
    .collection("Kategori")
    .get();
  categories.value = categoriesSnapshot.docs.map((doc) => doc.id); // Kategori isimlerini al
};

// Alt kategorileri al (Seçilen kategoriyle ilişkili)
const getSubcategories = async () => {
  if (!selectedCategory.value) return;
  const subcategoriesSnapshot = await db
    .collection("Stok")
    .doc(selectedStore.value)
    .collection("Model")
    .doc(selectedModel.value)
    .collection("Kategori")
    .doc(selectedCategory.value)
    .collection("Subcategory")
    .get();
  subcategories.value = subcategoriesSnapshot.docs.map((doc) => doc.id); // Alt kategori isimlerini al
};

// Ürün ekleme
const addProduct = async (values) => {
  if (!selectedSubcategory.value) return;

  const productData = {
    name: values.productName,
    price: values.productPrice,
    count: values.productCount,
  };

  await db
    .collection("Stok")
    .doc(selectedStore.value)
    .collection("Model")
    .doc(selectedModel.value)
    .collection("Kategori")
    .doc(selectedCategory.value)
    .collection("Subcategory")
    .doc(selectedSubcategory.value)
    .collection("Products")
    .add(productData);

  alert("Ürün başarıyla eklendi!");
};

// Firestore'dan verileri yükle
onMounted(() => {
  getStores(); // Araçları yükle
});

// Seçilen araç değiştiğinde modelleri çek
watch(selectedStore, (newStore) => {
  if (newStore) {
    getModels();
    models.value = []; // Modelleri temizle
    selectedModel.value = ""; // Modeli sıfırla
    selectedCategory.value = ""; // Kategoriyi sıfırla
    selectedSubcategory.value = ""; // Alt kategoriyi sıfırla
  }
});

// Seçilen model değiştiğinde kategorileri çek
watch(selectedModel, (newModel) => {
  if (newModel) {
    getCategories();
    categories.value = []; // Kategorileri temizle
    selectedCategory.value = ""; // Kategoriyi sıfırla
    selectedSubcategory.value = ""; // Alt kategoriyi sıfırla
  }
});

// Seçilen kategori değiştiğinde alt kategorileri çek
watch(selectedCategory, (newCategory) => {
  if (newCategory) {
    getSubcategories();
    subcategories.value = []; // Alt kategorileri temizle
    selectedSubcategory.value = ""; // Alt kategoriyi sıfırla
  }
});
</script>
