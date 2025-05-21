<template>
  <div class="p-6 space-y-4">
    <h2 class="text-xl font-bold">Firma Yükleme</h2>

    <input type="file" @change="handleFileUpload" accept=".csv" />

    <button
      v-if="companies.length > 0"
      class="bg-[#FE9F43] text-white px-4 py-2 rounded hover:bg-[#e98a30] transition"
      @click="uploadToFirestore"
    >
      Firmaları Yükle ({{ companies.length }})
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { uploadCompaniesBulk } from "@/stores/uploadCompanies";

const companies = ref([]);

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

    companies.value = data;
  };

  reader.readAsText(file, "utf-8");
}

async function uploadToFirestore() {
  await uploadCompaniesBulk(companies.value);
  alert("Tüm firmalar Firestore'a yüklendi!");
  companies.value = [];
}
</script>
