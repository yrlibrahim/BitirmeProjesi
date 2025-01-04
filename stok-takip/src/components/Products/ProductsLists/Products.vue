<template>
  <div class="h-screen">
    <!-- Yükleniyor Göstergesi -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
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
    <!-- Liste -->

    <div v-else>
      <!-- Yeni Ürün Ekle Butonu -->
      <div class="flex justify-end w-4/5 mb-4">
        <button
          @click="goToCreateNewProduct"
          class="bg-[#fe9f43] text-white px-4 py-2 rounded hover:bg-[#e88d3a] transition"
        >
          Yeni Ürün Ekle
        </button>
      </div>
      <!-- Liste Başlık -->
      <div class="grid grid-cols-6 gap-4 w-4/5 font-bold mb-4">
        <span>Ürün</span>
        <span>Araç</span>
        <span>Model</span>
        <span>Kategori</span>
        <span>Adet</span>
        <span>Fiyat</span>
      </div>

      <!-- Liste İçerik -->
      <div>
        <div
          class="grid grid-cols-6 gap-4 w-4/5 mb-2"
          v-for="doc in documents"
          :key="doc.id"
        >
          <span>{{ doc.name }}</span>
          <span>{{ doc.vehicle }}</span>
          <span>{{ doc.model }}</span>
          <span>{{ doc.subCollection }}</span>
          <span>{{ doc.count }}</span>
          <span>{{ doc.price }}₺</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { db } from "@/utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "vue-router"; // Router kullanımı için

// Belgeleri tutmak için state tanımla
const documents = ref([]);
const isLoading = ref(true); // Yüklenme durumu için state

// Router tanımla
const router = useRouter();

// Yeni Ürün Sayfasına Yönlendirme
const goToCreateNewProduct = () => {
  router.push("/create-new-product");
};

// Araç ve Model bilgileri
const vehicles = ["Mercedes"];
const models = ["4140", "4142"]; // Her iki model (4140 ve 4142) dahil edildi

// Alt koleksiyonların adları
const subCollections = ["Arka", "Ön 1.Dingil", "Ön 2.Dingil"];

// Tüm belgeleri çekmek için fonksiyon
const fetchAllDocuments = async () => {
  try {
    const allData = [];

    // Araçlar ve modeller için döngü
    for (const vehicleName of vehicles) {
      for (const modelName of models) {
        // Tüm alt koleksiyonlar için döngü
        for (const subCollectionName of subCollections) {
          // Firestore koleksiyon referansını al
          const collectionRef = collection(
            db,
            `Stok/${vehicleName}/${modelName}/Makas/${subCollectionName}`
          );

          // Koleksiyon içindeki belgeleri getir
          const querySnapshot = await getDocs(collectionRef);

          // Gelen belgeleri allData'ya ekle
          querySnapshot.docs.forEach((doc) => {
            allData.push({
              vehicle: vehicleName, // Araç bilgisi
              model: modelName, // Model bilgisi
              subCollection: subCollectionName, // Kategori
              id: doc.id,
              ...doc.data(),
            });
          });
        }
      }
    }

    // State'i güncelle
    documents.value = allData;
  } catch (error) {
    console.error("Veri çekme hatası:", error);
  } finally {
    // Yüklenme durumunu false yap
    isLoading.value = false;
  }
};

// Bileşen yüklendiğinde veriyi çek
onMounted(() => {
  fetchAllDocuments();
});
</script>

<style scoped>
/* Header ve içerik için grid yapısı */
.grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr); /* 6 kolon olacak */
  gap: 16px; /* Kolonlar arasındaki boşluk */
}

/* Her hücreyi ortalamak için hizalama */
.grid span {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

/* Başlık satırının kalın yazı olması */
.grid-cols-6 > span {
  font-weight: bold;
}

/* Satır aralarındaki boşluk */
.mb-2 {
  margin-bottom: 8px;
}

/* Yeni Ürün Ekle Butonu */
button {
  cursor: pointer;
}
</style>
