<template>
  <div class="p-6">
    <!-- Müşteri Bilgileri -->
    <h1 class="text-2xl font-bold mb-4">{{ company?.name }} - Detaylar</h1>
    <div class="mb-6">
      <p><strong>Email:</strong> {{ company?.email }}</p>
    </div>

    <!-- Faturalar Listesi -->
    <h2 class="text-xl font-bold mb-4">Faturalar</h2>
    <table class="table-auto w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-200">
          <th class="border border-gray-300 p-2">Fatura ID</th>
          <th class="border border-gray-300 p-2">Tarih</th>
          <th class="border border-gray-300 p-2">Toplam</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(invoice, index) in invoices"
          :key="index"
          class="text-center cursor-pointer"
          @click="goToInvoicesDetails(invoice.id)"
        >
          <td class="border border-gray-300 p-2">{{ invoice.id }}</td>
          <td class="border border-gray-300 p-2">{{ invoice.date }}</td>
          <td class="border border-gray-300 p-2">
            {{ calculateTotal(invoice.products) }} ₺
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Yeni Fatura Ekle Butonu -->
    <div class="mt-6">
      <router-link
        :to="{ name: 'CreateIncMngInvoice', params: { id: companyId } }"
        class="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Yeni Fatura Ekle
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { db } from "@/utils/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

// Route parametresini al
const route = useRoute();
const router = useRouter(); // useRouter eklenmiş
const companyId = route.params.id;

// Müşteri ve fatura bilgilerini saklama
const company = ref(null);
const invoices = ref([]);

// Firebase'den müşteri bilgilerini çek
const fetchcompany = async () => {
  try {
    const companyRef = doc(db, "Firmalar", companyId);
    const companySnap = await getDoc(companyRef);
    if (companySnap.exists()) {
      company.value = companySnap.data();
    }
  } catch (error) {
    console.error("Müşteri bilgileri alınırken hata oluştu: ", error);
  }
};

// Firebase'den faturaları çek
const fetchInvoices = async () => {
  try {
    const invoicesRef = collection(db, "Firmalar", companyId, "Faturalar");
    const invoicesSnap = await getDocs(invoicesRef);
    invoices.value = invoicesSnap.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Faturalar alınırken hata oluştu: ", error);
  }
};

// Toplam fiyat hesaplama
const calculateTotal = (products) => {
  if (!products || products.length === 0) return 0;
  return products.reduce((total, product) => {
    return total + (product.count * product.price || 0);
  }, 0);
};

const goToInvoicesDetails = (invoiceId) => {
  router.push({
    name: "InvoicesDetail",
    params: { id: companyId, invoiceId },
  });
};

// Sayfa yüklendiğinde müşteri ve faturaları getir
onMounted(() => {
  fetchcompany();
  fetchInvoices();
});
</script>
