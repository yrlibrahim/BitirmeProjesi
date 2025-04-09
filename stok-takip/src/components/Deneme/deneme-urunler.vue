<template>
  <div class="">burasi deneme urunler sayfasi</div>
  <div>
    <ul>
      <li v-for="urun in urunler" :key="urun.id" class="p-2 border-b">
        {{ urun.name }} {{ urun.brand }} - {{ urun.model }} -
        {{ urun.category }} - {{ urun.price }}₺
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/utils/firebase";

const urunler = ref([]); // Ürünleri saklayacak dizi

const fetchData = async () => {
  const querySnapshot = await getDocs(collection(db, "deneme")); // "deneme" koleksiyonunu getir

  urunler.value = querySnapshot.docs.map((doc) => ({
    id: doc.id, // Auto ID
    ...doc.data().urun, // "urun" adlı map içeriğini al
  }));
};

onMounted(fetchData); // Bileşen yüklendiğinde veriyi çek
</script>
