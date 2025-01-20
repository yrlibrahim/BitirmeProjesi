<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Yeni Ürün Ekle</h1>

    <!-- Fatura Bilgileri -->
    <form @submit.prevent="addNewProduct">
      <!-- Ürünler -->
      <div>
        <h2 class="text-lg font-bold mb-4">Ürünler</h2>

        <div
          v-for="(product, index) in newProduct.products"
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
          <div class="w-1/2">
            <div class="flex justify-between px-2">
              <label class="block mb-2">Araç</label>
              <span class="cursor-pointer" @click="openPopup">+</span>
            </div>
            <select
              v-model="product.brand"
              @change="fetchModels(product, index)"
              class="border p-2 w-full"
              required
            >
              <option
                v-for="brand in stockData"
                :key="brand.id"
                :value="brand.id"
              >
                {{ brand.id }}
              </option>
            </select>
          </div>
          <div class="w-1/2">
            <div class="flex justify-between px-2">
              <label class="block mb-2">Model</label>
              <span class="cursor-pointer" @click="openModelPopup">+</span>
            </div>
            <select
              v-model="product.model"
              @change="fetchCategories(product, index)"
              class="border p-2 w-full"
              :disabled="!product.brand"
              required
            >
              <option
                v-for="model in product.models"
                :key="model.id"
                :value="model.id"
              >
                {{ model.id }}
              </option>
            </select>
          </div>
          <div class="w-1/2">
            <label class="block mb-2">Kategori</label>
            <select
              v-model="product.category"
              @change="fetchSubCategories(product, index)"
              class="border p-2 w-full"
              :disabled="!product.model"
              required
            >
              <option
                v-for="category in product.categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.id }}
              </option>
            </select>
          </div>
          <div class="w-1/2">
            <label class="block mb-2">Alt Kategori</label>
            <select
              v-model="product.subCategory"
              @change="fetchProducts(product, index)"
              class="border p-2 w-full"
              :disabled="!product.category"
              required
            >
              <option
                v-for="subCategory in product.subCategories"
                :key="subCategory.id"
                :value="subCategory.id"
              >
                {{ subCategory.id }}
              </option>
            </select>
          </div>
          <div class="w-1/2">
            <label class="block mb-2">Ürün</label>
            <select
              v-model="product.product"
              class="border p-2 w-full"
              :disabled="!product.subCategory"
              required
            >
              <option
                v-for="prod in product.products"
                :key="prod.id"
                :value="prod.id"
              >
                {{ prod.name }}
              </option>
            </select>
          </div>
          <div class="w-1/2">
            <label class="block mb-2">Ürün Adedi</label>
            <input
              v-model="product.count"
              type="number"
              class="border p-2 w-full"
              :disabled="!product.product"
              required
            />
          </div>
          <div class="w-1/2">
            <label class="block mb-2">Ürün Fiyatı</label>
            <input
              v-model="product.price"
              type="number"
              class="border p-2 w-full"
              :disabled="!product.product"
              required
            />
          </div>
        </div>

        <!-- Satırları Sil Butonu -->
        <button
          type="button"
          @click="removeSelectedProducts"
          class="bg-red-500 text-white p-2 rounded me-2"
        >
          Satırları Sil
        </button>

        <!-- Satır Ekle Butonu -->
        <button
          type="button"
          @click="addProductRow"
          class="bg-gray-500 text-white p-2 rounded"
        >
          Yeni Satır Ekle
        </button>
      </div>

      <!-- Kaydet ve İptal -->
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

  <!-- Popup for Brand -->
  <div
    v-if="isPopupVisible"
    class="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white p-6 rounded-lg w-1/3">
      <h3 class="text-xl font-bold mb-4">Yeni Araç Markası Ekle</h3>
      <div>
        <label for="newBrand" class="block mb-2">Araç Markası</label>
        <input
          v-model="newBrand"
          id="newBrand"
          type="text"
          class="border p-2 w-full mb-4"
          placeholder="Yeni araç markası girin"
        />
        <button
          @click="addNewBrand"
          class="bg-green-500 text-white p-2 rounded mr-2"
        >
          Ekle
        </button>
        <button @click="closePopup" class="bg-red-500 text-white p-2 rounded">
          Kapat
        </button>
      </div>
    </div>
  </div>
  <!--Popup for Models-->
  <div
    v-if="isModelPopupVisible"
    class="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white p-6 rounded-lg w-1/3">
      <h3 class="text-xl font-bold mb-4">Yeni Araç Modeli Ekle</h3>
      <div>
        <label for="newModel" class="block mb-2">Araç Modeli</label>
        <input
          v-model="newModel"
          id="newModel"
          type="text"
          class="border p-2 w-full mb-4"
          placeholder="Yeni araç modeli girin"
        />
        <button
          @click="addNewModel"
          class="bg-green-500 text-white p-2 rounded mr-2"
        >
          Ekle
        </button>
        <button
          @click="closeModelPopup"
          class="bg-red-500 text-white p-2 rounded"
        >
          Kapat
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, watch, onMounted } from "vue";
import { db } from "@/utils/firebase";
import {
  collection,
  getDocs,
  addDoc,
  setDoc,
  doc,
  getDoc,
} from "firebase/firestore";

const route = useRoute();
const router = useRouter();
const companyId = route.params.id;

// Stock data for brands
const stockData = ref([]);

// New inCmnginvoice model
const newProduct = ref({
  id: "",
  date: "",
  products: [],
});

const selectedProducts = ref([]);

// Popup state and new brand model
const isPopupVisible = ref(false);
const newBrand = ref("");

// Function to fetch stock brands from Firestore
const fetchBrands = async () => {
  const brandsCollection = collection(db, "Stok");
  const snapshot = await getDocs(brandsCollection);
  stockData.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Function to fetch models for selected brand
const fetchModels = async (product, index) => {
  product.model = "";
  product.category = "";
  product.subCategory = "";
  product.product = "";
  product.count = null;
  product.price = null;

  const modelsCollection = collection(db, "Stok", product.brand, "Modeller");
  const snapshot = await getDocs(modelsCollection);
  product.models = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Yeni Araç Ekleme
const addNewBrand = async () => {
  if (newBrand.value.trim()) {
    try {
      const brandId = newBrand.value.trim();

      const brandsCollection = collection(db, "Stok");
      await setDoc(doc(brandsCollection, brandId), {});

      isPopupVisible.value = false;
      fetchBrands();
      newBrand.value = "";
    } catch (error) {
      console.error("Yeni marka eklenirken hata oluştu:", error);
    }
  } else {
    alert("Lütfen geçerli bir marka adı girin.");
  }
};

const openPopup = () => {
  isPopupVisible.value = true;
};

const closePopup = () => {
  isPopupVisible.value = false;
  newBrand.value = "";
};

//Yeni Model Ekleme
const isModelPopupVisible = ref(false); // Model popup'ı için state tanımlayın
const addNewModel = async (product) => {
  if (newModel.value.trim()) {
    try {
    } catch (error) {}
  } else {
    alert("Lütfen geçerli bir model adı girin.");
  }
};

const openModelPopup = () => {
  isModelPopupVisible.value = true;
};

const closeModelPopup = () => {
  isModelPopupVisible.value = false;
  newBrand.value = "";
};
// Add product row
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

// Remove selected products
const removeSelectedProducts = () => {
  selectedProducts.value.forEach((index) => {
    newProduct.value.products.splice(index, 1);
  });
  selectedProducts.value = [];
};

const addNewProduct = async () => {
  try {
    for (const product of newProduct.value.products) {
      const productRef = doc(
        db,
        "Stok",
        product.brand,
        "Modeller",
        product.model,
        "Kategoriler",
        product.category,
        "Alt Kategoriler",
        product.subCategory,
        "Ürünler",
        product.product
      );
      const productSnapshot = await getDoc(productRef);
      if (productSnapshot.exists()) {
        const currentStock = productSnapshot.data().count;
        const currentPrice = productSnapshot.data().price;

        await setDoc(
          productRef,
          {
            count: currentStock + product.count,
            price: product.price,
          },
          { merge: true }
        );
      }
    }

    router.push({ name: "product" });
  } catch (error) {
    console.error("Ürün eklenirken hata oluştu:", error);
  }
};

onMounted(() => {
  fetchBrands();
});
</script>
