<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Yeni Fatura Oluştur</h1>

    <!-- Fatura Bilgileri -->
    <form @submit.prevent="addInvoice">
      <div class="mb-4">
        <label for="invoiceId" class="block mb-2">Fatura ID</label>
        <input
          v-model="newInvoice.id"
          type="text"
          id="invoiceId"
          class="border p-2 w-full"
          required
        />
      </div>
      <div class="mb-4">
        <label for="invoiceDate" class="block mb-2">Fatura Tarihi</label>
        <input
          v-model="newInvoice.date"
          type="date"
          id="invoiceDate"
          class="border p-2 w-full"
          required
        />
      </div>

      <!-- Ürünler -->
      <div>
        <h2 class="text-lg font-bold mb-4">Ürünler</h2>
        <div
          v-for="(product, index) in newInvoice.products"
          :key="index"
          class="grid grid-cols-7 gap-4 mb-4"
        >
          <div>
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
          <div>
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
          <div>
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
          <div>
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
          <div>
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
          <div>
            <label class="block mb-2">Ürün Adedi</label>
            <input
              v-model="product.count"
              type="number"
              class="border p-2 w-full"
            />
          </div>
          <div>
            <label class="block mb-2">Ürün Fiyatı</label>
            <input
              v-model="product.price"
              type="number"
              class="border p-2 w-full"
            />
          </div>
        </div>

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
          :to="{ name: 'customerDetail', params: { id: customerId } }"
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
const customerId = route.params.id;

// Stock data for brands
const stockData = ref([]);

// New invoice model
const newInvoice = ref({
  id: "",
  date: "",
  products: [],
});

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

const addProductRow = () => {
  newInvoice.value.products.push({
    brand: "",
    model: "",
    category: "",
    subCategory: "",
    product: "",
    count: 1,
    price: 0,
  });
};

// Add invoice to Firestore and update stock
const addInvoice = async () => {
  try {
    // Faturayı Firestore'a ekleyin
    const invoiceRef = collection(db, "Musteri", customerId, "Faturalar");
    await addDoc(invoiceRef, { ...newInvoice.value });

    // Ürünlerin adetlerini stoktan düşür
    for (const product of newInvoice.value.products) {
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

        // Yalnızca adet değerini güncelle
        await setDoc(
          productRef,
          {
            count: currentStock - product.count,
          },
          { merge: true } // Sadece count alanını güncelle, diğer alanlar bozulmasın
        );
      }
    }

    // Fatura başarıyla eklendikten sonra, müşteri detaylarına yönlendirme
    router.push({ name: "customerDetail", params: { id: customerId } });
  } catch (error) {
    console.error("Fatura eklenirken hata oluştu: ", error);
  }
};

// On mounted, fetch brands
onMounted(fetchBrands);
</script>
