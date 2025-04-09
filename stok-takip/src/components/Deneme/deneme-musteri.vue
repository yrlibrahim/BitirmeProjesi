<template>
  <div class="max-w-md mx-auto p-4 border rounded-lg shadow">
    <h2 class="text-xl font-bold mb-4">Yeni Ürün Ekle</h2>

    <div class="mb-2">
      <label class="block text-sm">Marka</label>
      <input v-model="brand" type="text" class="w-full p-2 border rounded" />
    </div>

    <div class="mb-2">
      <label class="block text-sm">Model</label>
      <input v-model="model" type="text" class="w-full p-2 border rounded" />
    </div>

    <div class="mb-2">
      <label class="block text-sm">Kategori</label>
      <input v-model="category" type="text" class="w-full p-2 border rounded" />
    </div>

    <div class="mb-2">
      <label class="block text-sm">Alt Kategori</label>
      <input
        v-model="subCategory"
        type="text"
        class="w-full p-2 border rounded"
      />
    </div>

    <div class="mb-2">
      <label class="block text-sm">Ürün Adı</label>
      <input v-model="name" type="text" class="w-full p-2 border rounded" />
    </div>

    <div class="mb-2">
      <label class="block text-sm">Fiyat (₺)</label>
      <input v-model="price" type="number" class="w-full p-2 border rounded" />
    </div>

    <div class="mb-2">
      <label class="block text-sm">Adet</label>
      <input v-model="count" type="number" class="w-full p-2 border rounded" />
    </div>

    <button
      @click="addProduct"
      class="w-full bg-blue-500 text-white p-2 rounded mt-4"
    >
      Ürünü Ekle
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "@/utils/firebase";

// Kullanıcının girdiği ürün bilgilerini saklayan değişkenler
const brand = ref("");
const model = ref("");
const category = ref("");
const subCategory = ref("");
const name = ref("");
const price = ref("");
const count = ref("");

// Ürün ekleme fonksiyonu (var olan ürünü kontrol eden)
const addProduct = async () => {
  if (
    !brand.value ||
    !model.value ||
    !category.value ||
    !subCategory.value ||
    !name.value ||
    !price.value ||
    !count.value
  ) {
    alert("Lütfen tüm alanları doldurun!");
    return;
  }

  try {
    // Firestore'da aynı ürün olup olmadığını kontrol et
    const q = query(
      collection(db, "deneme"),
      where("urun.name", "==", name.value),
      where("urun.brand", "==", brand.value),
      where("urun.model", "==", model.value),
      where("urun.category", "==", category.value),
      where("urun.subCategory", "==", subCategory.value)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      alert("Bu ürün zaten mevcut! Yeni ekleme yapılamaz.");
      return;
    }

    // Ürün Firestore'da yoksa eklemeye devam et
    await addDoc(collection(db, "deneme"), {
      urun: {
        brand: brand.value,
        model: model.value,
        category: category.value,
        subCategory: subCategory.value,
        name: name.value,
        price: Number(price.value), // Fiyatı sayı olarak sakla
        count: Number(count.value), // Adeti sayı olarak sakla
      },
    });

    alert("Ürün başarıyla eklendi!");

    // Formu temizle
    brand.value = "";
    model.value = "";
    category.value = "";
    subCategory.value = "";
    name.value = "";
    price.value = "";
    count.value = "";
  } catch (error) {
    console.error("Ürün eklenirken hata oluştu:", error);
    alert("Ürün eklenirken bir hata oluştu!");
  }
};
</script>
