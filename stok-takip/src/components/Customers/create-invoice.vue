<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Yeni Fatura Oluştur</h1>

    <!-- Fatura Bilgileri -->
    <form @submit.prevent="addinCmngInvoice">
      <div class="mb-4">
        <label for="inCmnginvoiceId" class="block mb-2">Fatura ID</label>
        <input
          v-model="newinCmngInvoice.id"
          type="text"
          id="inCmnginvoiceId"
          class="border p-2 w-full"
          required
        />
      </div>
      <div class="mb-4">
        <label for="inCmnginvoiceDate" class="block mb-2">Fatura Tarihi</label>
        <input
          v-model="newinCmngInvoice.date"
          type="date"
          id="inCmnginvoiceDate"
          class="border p-2 w-full"
          required
        />
      </div>

      <!-- Ürünler -->
      <div>
        <h2 class="text-lg font-bold mb-4">Ürünler</h2>

        <div
          v-for="(product, index) in newinCmngInvoice.products"
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
            <label class="block mb-2">Araç Markası</label>
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
            <label class="block mb-2">Model</label>
            <select
              v-model="product.model"
              @change="fetchCategories(product, index)"
              class="border p-2 w-full"
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
              required
            />
          </div>
          <div class="w-1/2">
            <label class="block mb-2">Ürün Fiyatı</label>
            <input
              v-model="product.price"
              type="number"
              class="border p-2 w-full"
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
          Fatura Kaydet
        </button>
        <router-link
          :to="{ name: 'companyDetail', params: { id: companyId } }"
          class="bg-red-500 text-white p-2 rounded"
        >
          İptal
        </router-link>
      </div>
    </form>
  </div>
</template>
<script setup>
import { useRoute, useRouter } from "vue-router";
import { useStockData } from "@/stores/useStockData";
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
const newinCmngInvoice = ref({
  id: "",
  date: "",
  products: [],
});

// Array of selected products (indices of selected rows)
const selectedProducts = ref([]);

// Function to fetch stock brands from Firestore
const fetchBrands = async () => {
  const brandsCollection = collection(db, "Stok");
  const snapshot = await getDocs(brandsCollection);
  stockData.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Function to fetch models for selected brand
const fetchModels = async (product, index) => {
  const modelsCollection = collection(db, "Stok", product.brand, "Modeller");
  const snapshot = await getDocs(modelsCollection);
  product.models = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Function to fetch categories for selected model
const fetchCategories = async (product, index) => {
  const categoriesCollection = collection(
    db,
    "Stok",
    product.brand,
    "Modeller",
    product.model,
    "Kategoriler"
  );
  const snapshot = await getDocs(categoriesCollection);
  product.categories = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Function to fetch subcategories for selected category
const fetchSubCategories = async (product, index) => {
  const subCategoriesCollection = collection(
    db,
    "Stok",
    product.brand,
    "Modeller",
    product.model,
    "Kategoriler",
    product.category,
    "Alt Kategoriler"
  );
  const snapshot = await getDocs(subCategoriesCollection);
  product.subCategories = snapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
  }));
};

// Function to fetch products for selected subcategory
const fetchProducts = async (product, index) => {
  const productsCollection = collection(
    db,
    "Stok",
    product.brand,
    "Modeller",
    product.model,
    "Kategoriler",
    product.category,
    "Alt Kategoriler",
    product.subCategory,
    "Ürünler"
  );
  const snapshot = await getDocs(productsCollection);
  product.products = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Add product row to the inCmnginvoice
const addProductRow = () => {
  newinCmngInvoice.value.products.push({
    brand: "",
    model: "",
    category: "",
    subCategory: "",
    product: "",
    count: null,
    price: null,
  });
};

// Remove selected products from invoice
const removeSelectedProducts = () => {
  selectedProducts.value.forEach((index) => {
    newinCmngInvoice.value.products.splice(index, 1);
  });
  selectedProducts.value = []; // Clear selected products
};

// Add inCmnginvoice to Firestore and update stock
const addinCmngInvoice = async () => {
  try {
    if (!companyId) {
      throw new Error("Company ID is missing!");
    }

    // Fatura bilgilerini Firestore'a ekleyin
    const inCmnginvoiceRef = collection(db, "Firmalar", companyId, "Faturalar");
    await addDoc(inCmnginvoiceRef, { ...newinCmngInvoice.value });

    // Ürünlerin adetlerini stoğa ekleyin ve fiyatını güncelleyin
    for (const product of newinCmngInvoice.value.products) {
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
      } else {
        console.log("Ürün bulunamadı:", productRef.id);
      }
    }

    router.push({ name: "product" });
  } catch (error) {
    console.error("Fatura eklenirken hata oluştu:", error);
  }
};

onMounted(() => {
  fetchBrands();
});
</script>
