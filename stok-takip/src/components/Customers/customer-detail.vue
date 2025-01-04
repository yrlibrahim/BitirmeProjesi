<template>
  <div>
    <h1>Müşteri Detayları</h1>
    <p><strong>Adı:</strong> {{ customer?.name }}</p>
    <p><strong>Email:</strong> {{ customer?.email }}</p>

    <!-- Yeni Fatura Ekle Butonu -->
    <button
      @click="showModal = true"
      class="bg-blue-500 text-white p-2 rounded top-4 right-4"
    >
      Yeni Fatura Ekle
    </button>

    <!-- Modal Popup -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
    >
      <div class="bg-white p-6 rounded-md w-[80%] h-[80%] overflow-auto">
        <h2 class="text-lg font-bold mb-4">Yeni Fatura Ekle</h2>
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

          <!-- Ürün Ekleme Satırı -->
          <div class="grid grid-cols-3 gap-4 items-center mb-4">
            <div>
              <label for="productName" class="block mb-2">Ürün Adı</label>
              <input
                v-model="newProduct.name"
                type="text"
                id="productName"
                class="border p-2 w-full"
              />
            </div>
            <div>
              <label for="productCount" class="block mb-2">Ürün Adedi</label>
              <input
                v-model="newProduct.count"
                type="number"
                id="productCount"
                class="border p-2 w-full"
              />
            </div>
            <div>
              <label for="productPrice" class="block mb-2">Ürün Fiyatı</label>
              <input
                v-model="newProduct.price"
                type="number"
                id="productPrice"
                class="border p-2 w-full"
              />
            </div>
          </div>

          <button
            type="button"
            @click="addProduct"
            class="bg-gray-500 text-white p-2 rounded mb-4"
          >
            Ürün Ekle
          </button>

          <!-- Eklenen Ürünler Listesi -->
          <div>
            <h3 class="text-lg font-bold mb-2">Eklenen Ürünler</h3>
            <ul>
              <li v-for="(product, index) in newInvoice.products" :key="index">
                {{ product.name }} | {{ product.count }} |
                {{ product.price }} TL
              </li>
            </ul>
          </div>

          <div class="flex justify-between mt-4">
            <button type="submit" class="bg-green-500 text-white p-2 rounded">
              Fatura Ekle
            </button>
            <button
              type="button"
              @click="closeModal"
              class="bg-red-500 text-white p-2 rounded"
            >
              Kapat
            </button>
          </div>
        </form>
      </div>
    </div>

    <h2 class="mt-6">Faturalar</h2>
    <ul>
      <li v-for="invoice in invoices" :key="invoice.id">
        <h3>Fatura ID: {{ invoice.id }}</h3>
        <p><strong>Fatura Tarihi:</strong> {{ invoice.date }}</p>
        <ul>
          <li v-for="(product, index) in invoice.products" :key="index">
            <p>
              <strong>Ürün:</strong> {{ product.name }} |
              <strong>Miktar:</strong> {{ product.count }} |
              <strong>Fiyat:</strong> {{ product.price }} TL
            </p>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { db } from "@/utils/firebase";
import { doc, getDoc, collection, getDocs, addDoc } from "firebase/firestore";

const route = useRoute();
const customerId = route.params.id;

const customer = ref(null);
const invoices = ref([]);
const showModal = ref(false);

const newInvoice = ref({
  id: "",
  date: "",
  products: [],
});

const newProduct = ref({
  name: "",
  count: "",
  price: "",
});

// Müşteri verilerini çekme
const fetchCustomer = async () => {
  const docRef = doc(db, "Musteri", customerId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    customer.value = { id: docSnap.id, ...docSnap.data() };
  } else {
    console.error("Müşteri bulunamadı!");
  }
};

// Faturaları çekme
const fetchInvoices = async () => {
  const querySnapshot = await getDocs(
    collection(db, "Musteri", customerId, "Faturalar")
  );
  querySnapshot.forEach((doc) => {
    invoices.value.push({ id: doc.id, ...doc.data() });
  });
};

// Yeni ürün ekleme
const addProduct = () => {
  if (
    newProduct.value.name.trim() &&
    newProduct.value.count &&
    newProduct.value.price
  ) {
    newInvoice.value.products.push({ ...newProduct.value });
    newProduct.value = { name: "", count: "", price: "" };
  }
};

// Yeni fatura ekleme
const addInvoice = async () => {
  try {
    const invoiceRef = collection(db, "Musteri", customerId, "Faturalar");
    await addDoc(invoiceRef, { ...newInvoice.value });

    invoices.value.push({ ...newInvoice.value });

    newInvoice.value = { id: "", date: "", products: [] };
    showModal.value = false;
  } catch (error) {
    console.error("Fatura eklenirken hata oluştu: ", error);
  }
};

// Modal kapatma
const closeModal = () => {
  newInvoice.value = { id: "", date: "", products: [] };
  newProduct.value = { name: "", count: "", price: "" };
  showModal.value = false;
};

// Sayfa yüklendiğinde müşteri ve faturaları getir
onMounted(() => {
  fetchCustomer();
  fetchInvoices();
});
</script>
