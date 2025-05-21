<template>
  <div class="p-6 space-y-4">
    <h2 class="text-xl font-bold">CSV Ödeme Yükleme</h2>

    <!-- Müşteri Seçimi -->
    <label class="block font-medium">Müşteri Seç</label>
    <select v-model="selectedCustomerId" class="border p-2 rounded w-full">
      <option value="" disabled selected>Müşteri Seçiniz</option>
      <option
        v-for="customer in customers"
        :key="customer.id"
        :value="customer.id"
      >
        {{ customer.companyName }}
      </option>
    </select>

    <!-- CSV Dosyası Yükleme -->
    <input type="file" @change="handleFileUpload" accept=".csv" class="mt-2" />

    <!-- Yükle Butonu -->
    <button
      @click="uploadPayments"
      class="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
    >
      Yükle
    </button>

    <!-- Durum Mesajları -->
    <div v-if="loading" class="mt-4 text-green-600">Yükleme yapılıyor...</div>
    <div v-if="message" class="mt-4">{{ message }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { saveCustomerPayments } from "@/components/Helpers/paymentHelpers";
import { useCustomerStore } from "@/stores/customer";

const loading = ref(false);
const message = ref("");
const selectedCustomerId = ref(null);
const customers = ref([]);
const paymentData = ref([]);

const customerStore = useCustomerStore();

// Müşteri verilerini çekme
async function fetchCustomers() {
  await customerStore.fetchCustomers();
  customers.value = customerStore.customerList.sort((a, b) =>
    a.companyName.localeCompare(b.companyName, "tr", { sensitivity: "base" })
  );

  if (customers.value.length === 0) {
    message.value = "Hiç müşteri bulunamadı.";
    console.warn("Müşteri listesi boş.");
  } else {
    console.log("Müşteriler başarıyla yüklendi:", customers.value);
  }
}

onMounted(() => {
  fetchCustomers();
});

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const csvContent = e.target.result;

    // Satırları doğru şekilde bölmek için dinamik ayraç tespiti
    const delimiter = csvContent.includes(";") ? ";" : ",";
    const lines = csvContent.split("\n");

    // Yalnızca "Gelen Hesap" türündeki satırları işleme al
    paymentData.value = lines
      .map((line) => {
        const parts = line.split(delimiter);

        const [tarih, tur, aciklama, tutar, odemeTipi] = parts;

        // Yalnızca "Gelen Hesap" türünde olanları işle
        if (tur && tur.trim().toLowerCase() !== "gelen hesap") return null;

        try {
          // Tarih formatını düzelt
          let formattedDate = tarih.trim();
          if (formattedDate.includes(".")) {
            const dateParts = formattedDate.split(".");
            if (dateParts.length === 3) {
              formattedDate = `${dateParts[2]}-${dateParts[1].padStart(
                2,
                "0"
              )}-${dateParts[0].padStart(2, "0")}`;
            }
          }

          // Tarih geçerliliğini kontrol et
          const validDate = new Date(formattedDate);
          if (isNaN(validDate.getTime()))
            throw new Error("Geçersiz tarih formatı");

          // Tutar verisini güvenle dönüştür
          let cleanedTutar = tutar.trim();
          cleanedTutar = cleanedTutar.replace(/\s+$/, "");

          // Noktalı formatı düzeltme: 1.000,50 -> 1000.50
          cleanedTutar = cleanedTutar.replace(/\./g, "").replace(",", ".");

          const formattedTutar = parseFloat(cleanedTutar);
          if (isNaN(formattedTutar)) throw new Error("Geçersiz tutar");

          // Ödeme Tipini Tür'e Göre Ayarla
          const paymentType = (() => {
            const lowerType = (odemeTipi || "").trim().toLowerCase();
            if (lowerType.includes("nakit")) return "Nakit";
            if (lowerType.includes("havale")) return "Havale";
            if (lowerType.includes("çek")) return "Çek";
            if (lowerType.includes("eft")) return "EFT";
            if (lowerType.includes("kredi")) return "Kredi Kartı";
            return "Diğer"; // Tanınmayan tür
          })();

          return {
            date: validDate.toISOString().split("T")[0],
            amount: formattedTutar,
            type: paymentType,
            description: aciklama ? aciklama.trim() : "Açıklama Yok",
          };
        } catch (error) {
          console.warn("Hatalı veri atlandı:", line, error.message);
          return null;
        }
      })
      .filter((item) => item !== null);

    console.log("Yüklenmeye hazır ödeme sayısı:", paymentData.value.length);
    console.table(paymentData.value);
  };
  reader.readAsText(file, "windows-1254");
}

async function uploadPayments() {
  if (!selectedCustomerId.value) {
    alert("Lütfen önce müşteri seçin!");
    return;
  }

  loading.value = true;
  try {
    const selectedCustomer = customers.value.find(
      (cust) => cust.id === selectedCustomerId.value
    );

    if (!selectedCustomer) {
      throw new Error("Seçilen müşteri bulunamadı.");
    }

    if (paymentData.value.length === 0) {
      throw new Error("Yüklenecek ödeme bulunamadı.");
    }

    console.log("Toplu ödeme yükleme başlıyor:", selectedCustomer);

    let successCount = 0;
    let failCount = 0;

    for (const payment of paymentData.value) {
      try {
        await saveCustomerPayments(selectedCustomer, [payment]);
        successCount++;
      } catch (error) {
        console.error("Ödeme kaydetme hatası:", error);
        failCount++;
      }
    }

    message.value = `Başarıyla eklenen: ${successCount} | Hatalı: ${failCount}`;
    console.log("Toplu yükleme tamamlandı.");
  } catch (error) {
    message.value = "Toplu yükleme sırasında hata oluştu.";
    console.error("Toplu ödeme yükleme hatası:", error);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
input[type="file"] {
  margin: 10px 0;
}
button:hover {
  cursor: pointer;
}
</style>
