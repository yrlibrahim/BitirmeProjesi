<template>
  <div class="p-6 space-y-4 max-w-xl mx-auto">
    <h2 class="text-xl font-bold">Firma Ödeme CSV Yükleme</h2>

    <!-- Firma Seçimi -->
    <label class="block font-medium">Firma Seç</label>
    <select v-model="selectedCompanyId" class="w-full border p-2 rounded">
      <option value="" disabled>Firma Seçiniz</option>
      <option v-for="firma in companyList" :key="firma.id" :value="firma.id">
        {{ firma.companyName }}
      </option>
    </select>

    <!-- CSV Dosyası -->
    <input type="file" @change="handleFile" accept=".csv" class="mt-2" />

    <!-- Yükleme Butonu -->
    <button
      @click="uploadToFirestore"
      class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mt-4"
    >
      Yükle
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { uploadCompanyPayments } from "@/stores/uploadCompanyPayments";
import { useCompanyStore } from "@/stores/company";

const selectedCompanyId = ref(null);
const companyList = ref([]);
const parsedRows = ref([]);
const companyStore = useCompanyStore();

async function fetchCompanies() {
  await companyStore.fetchCompanies();
  companyList.value = companyStore.companys.sort((a, b) =>
    a.companyName.localeCompare(b.companyName, "tr", { sensitivity: "base" })
  );
}

function handleFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const lines = e.target.result.split(/\r?\n/);
    parsedRows.value = lines
      .map((line) => {
        const parts = line
          .split(";")
          .slice(0, 4)
          .map((p) => p?.trim());
        if (parts.length < 4 || parts.some((p) => !p)) return null;

        const [tarih, tur, aciklama, tutar] = parts;
        if (!tur || tur.toLocaleLowerCase("tr-TR") !== "ödeme") return null;

        try {
          const [g, a, y] = tarih.split(".");
          const formattedDate = `${y}-${a.padStart(2, "0")}-${g.padStart(
            2,
            "0"
          )}`;
          const amount = parseFloat(tutar.replace(/\./g, "").replace(",", "."));
          if (isNaN(amount)) throw new Error("Tutar hatalı");

          return {
            date: formattedDate,
            description: aciklama,
            amount,
          };
        } catch (err) {
          console.warn("Satır atlandı:", line, err.message);
          return null;
        }
      })
      .filter((item) => item !== null);

    console.log("Ödeme Satırları:", parsedRows.value);
  };

  reader.readAsText(file, "windows-1254");
}

async function uploadToFirestore() {
  if (!selectedCompanyId.value || parsedRows.value.length === 0) {
    alert("Lütfen firma seçin ve geçerli dosya yükleyin!");
    return;
  }

  try {
    await uploadCompanyPayments(selectedCompanyId.value, parsedRows.value);
    alert("Ödemeler başarıyla yüklendi!");
  } catch (err) {
    console.error("Yükleme hatası:", err);
    alert("Yükleme sırasında hata oluştu.");
  }
}

onMounted(() => {
  fetchCompanies();
});
</script>
