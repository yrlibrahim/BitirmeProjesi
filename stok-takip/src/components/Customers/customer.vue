<template>
  <div>
    <h1>Müşteriler</h1>
    <div v-if="!userStore.user.isAdmin">
      <button class="bg-blue-500 text-white p-2 rounded">
        <router-link to="/add-customer">Musteri Ekle</router-link>
      </button>
    </div>

    <!-- Müşteri Listesi -->
    <ul class="mt-6">
      <li
        v-for="customer in customers"
        :key="customer.id"
        @click="goToCustomerDetails(customer.id)"
        class="cursor-pointer"
      >
        {{ customer.name }} - {{ customer.email }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router"; // Vue Router'ı import et
import { db } from "@/utils/firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { useUserStore } from "@/stores/user";

// Müşteri verilerini tutmak için reactive bir değişken
const customers = ref([]);
const showModal = ref(false); // Modal görünürlüğü için ref
const newCustomer = ref({ name: "", email: "" }); // Yeni müşteri form verileri

const router = useRouter(); // Router'ı kullanabilmek için

// Firestore'dan müşteri verilerini çekme
const fetchCustomers = async () => {
  customers.value = [];
  const querySnapshot = await getDocs(collection(db, "Musteri"));
  querySnapshot.forEach((doc) => {
    customers.value.push({ id: doc.id, ...doc.data() });
  });
};

// Yeni müşteri ekleme
const addCustomer = async () => {
  try {
    if (!newCustomer.value.name.trim()) {
      console.error("Müşteri adı boş olamaz!");
      return;
    }

    const customerRef = collection(db, "Musteri");
    await addDoc(customerRef, {
      name: newCustomer.value.name,
      email: newCustomer.value.email,
    });

    customers.value.push({
      name: newCustomer.value.name,
      email: newCustomer.value.email,
    });

    newCustomer.value.name = "";
    newCustomer.value.email = "";
    showModal.value = false;
  } catch (error) {
    console.error("Müşteri eklenirken hata oluştu: ", error);
  }
};

// Modal kapatma
const closeModal = () => {
  newCustomer.value.name = "";
  newCustomer.value.email = "";
  showModal.value = false;
};

// Sayfa yüklendiğinde verileri al
onMounted(() => {
  fetchCustomers();
});

// Müşteri detay sayfasına yönlendirme
const goToCustomerDetails = (customerId) => {
  router.push({ name: "customerDetail", params: { id: customerId } });
};

// Admin degeri sorgulama
const userStore = useUserStore();
</script>
