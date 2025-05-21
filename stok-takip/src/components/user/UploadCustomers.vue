<template>
  <div class="p-6 space-y-4 max-w-2xl mx-auto">
    <h2 class="text-xl font-bold">Müşteri Yükleme</h2>

    <input type="file" @change="handleFileUpload" accept=".csv" class="mb-4" />

    <button
      v-if="customers.length"
      @click="uploadToFirestore"
      class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Müşterileri Yükle ({{ customers.length }})
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { uploadCustomersBulk } from "@/stores/uploadCustomersBulk";

const customers = ref([]);

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;
    const lines = text.split("\n").filter(Boolean);
    const headers = lines[0].replace("\r", "").split(",");

    const data = lines.slice(1).map((line) => {
      const values = line.replace("\r", "").split(",");
      const entry = {};
      headers.forEach((h, i) => {
        entry[h.trim()] = values[i]?.trim();
      });
      return entry;
    });

    customers.value = data;
  };

  reader.readAsText(file, "utf-8");
}

async function uploadToFirestore() {
  await uploadCustomersBulk(customers.value);
  alert("Tüm müşteriler Firestore'a yüklendi!");
  customers.value = [];
}
</script>
