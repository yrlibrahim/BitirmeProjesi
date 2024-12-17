<template>
  <div class="h-screen">
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
</template>

<script setup>
import { ref, onMounted } from "vue";
import { db } from "@/utils/firebase";
import { collection, getDocs } from "firebase/firestore";

// Belgeleri tutmak için state tanımla
const documents = ref([]);

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

          // Eğer koleksiyon boşsa, konsola log yazdır
          if (querySnapshot.empty) {
            console.log(
              `Veri bulunamadı: ${vehicleName} ${modelName} ${subCollectionName}`
            );
          }

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
</style>
