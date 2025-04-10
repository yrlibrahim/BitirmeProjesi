<template>
  <div>
    <h1>Şirketler</h1>
    <div v-if="!userStore.user.isAdmin">
      <button
        @click="showModal = true"
        class="bg-blue-500 text-white p-2 rounded"
      >
        Yeni Şirket Ekle
      </button>
    </div>

    <!-- Modal Popup -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
    >
      <div class="bg-white p-6 rounded-md w-1/3">
        <h2 class="text-lg font-bold mb-4">Yeni Şirket Ekle</h2>
        <form @submit.prevent="addcompany">
          <div class="mb-4">
            <label for="name" class="block mb-2">Şirket Adı</label>
            <input
              v-model="newcompany.name"
              type="text"
              id="name"
              class="border p-2 w-full"
              required
            />
          </div>
          <div class="mb-4">
            <label for="email" class="block mb-2">E-posta</label>
            <input
              v-model="newcompany.email"
              type="email"
              id="email"
              class="border p-2 w-full"
              required
            />
          </div>
          <div class="flex justify-between">
            <button type="submit" class="bg-green-500 text-white p-2 rounded">
              Ekle
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

    <!-- Şirket Listesi -->
    <ul class="mt-6">
      <li
        v-for="company in companys"
        :key="company.id"
        @click="goTocompanyDetails(company.id)"
        class="cursor-pointer"
      >
        {{ company.name }} - {{ company.email }}
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
const companys = ref([]);
const showModal = ref(false); // Modal görünürlüğü için ref
const newcompany = ref({ name: "", email: "" }); // Yeni müşteri form verileri

const router = useRouter(); // Router'ı kullanabilmek için

// Firestore'dan müşteri verilerini çekme
const fetchcompanys = async () => {
  companys.value = [];
  const querySnapshot = await getDocs(collection(db, "Firmalar"));
  querySnapshot.forEach((doc) => {
    companys.value.push({ id: doc.id, ...doc.data() });
  });
};

// Yeni müşteri ekleme
const addcompany = async () => {
  try {
    if (!newcompany.value.name.trim()) {
      console.error("Müşteri adı boş olamaz!");
      return;
    }

    const companyRef = collection(db, "Firmalar");
    await addDoc(companyRef, {
      name: newcompany.value.name,
      email: newcompany.value.email,
    });

    companys.value.push({
      name: newcompany.value.name,
      email: newcompany.value.email,
    });

    newcompany.value.name = "";
    newcompany.value.email = "";
    showModal.value = false;
  } catch (error) {
    console.error("Müşteri eklenirken hata oluştu: ", error);
  }
};

// Modal kapatma
const closeModal = () => {
  newcompany.value.name = "";
  newcompany.value.email = "";
  showModal.value = false;
};

// Sayfa yüklendiğinde verileri al
onMounted(() => {
  fetchcompanys();
});

// Müşteri detay sayfasına yönlendirme
const goTocompanyDetails = (companyId) => {
  router.push({ name: "companyDetail", params: { id: companyId } });
};
// Admin degeri sorgulama
const userStore = useUserStore();
</script>
