<template>
  <div class="p-6 space-y-4 max-w-xl mx-auto">
    <h2 class="text-xl font-bold">Toplu Ürün Yükleme</h2>

    <input type="file" accept=".csv" @change="handleFileUpload" />

    <div v-if="loading" class="text-blue-600">Yükleniyor...</div>
    <div v-if="success" class="text-green-600">Yükleme tamamlandı!</div>
    <div v-if="error" class="text-red-600">Hata: {{ error }}</div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { uploadCSVProducts } from "@/stores/bulkUploader";

const loading = ref(false);
const success = ref(false);
const error = ref(null);

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  loading.value = true;
  success.value = false;
  error.value = null;

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const text = e.target.result;
      const lines = text.split("\n").filter((line) => line.trim() !== "");
      const headers = lines[0]
        .split(",")
        .map((h) => h.trim().replaceAll('"', ""));
      const products = lines.slice(1).map((line) => {
        const values = line.split(",").map((v) => v.trim().replaceAll('"', ""));
        return Object.fromEntries(headers.map((key, i) => [key, values[i]]));
      });

      for (const [index, item] of products.entries()) {
        await uploadCSVProducts([item]);
        console.log(`✔️ ${index + 1}. ürün eklendi:`, item.name);
      }

      success.value = true;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };
  reader.onerror = () => {
    error.value = "Dosya okunamadı.";
    loading.value = false;
  };

  reader.readAsText(file, "UTF-8");
}
</script>

<style scoped>
input {
  border: 1px solid #ccc;
  padding: 0.5rem;
  width: 100%;
}
</style>
