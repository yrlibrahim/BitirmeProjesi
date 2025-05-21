<template>
  <div class="p-6 space-y-4">
    <h2 class="text-xl font-bold">CSV Fatura Yükleme</h2>

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

    <!-- Yükle Butonu (Her zaman aktif) -->
    <button
      @click="uploadInvoices"
      class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
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
import { savePastSalesInvoices } from "@/components/Helpers/invoiceHelpers";
import { useCustomerStore } from "@/stores/customer";

const loading = ref(false);
const message = ref("");
const selectedCustomerId = ref(null);
const customers = ref([]);
const fileSelected = ref(false);
const invoiceData = ref([]);

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
    const lines = csvContent.split("\n");

    // Yalnızca "Kesilen Fatura" türündeki satırları işleme al
    invoiceData.value = lines
      .map((line) => {
        const parts = line.split(";").map((p) => p?.trim());

        // 4 parçadan azsa veya herhangi biri boşsa geçersiz say
        if (parts.length < 4 || parts.some((p) => !p)) return null;

        const [tarih, tur, aciklama, tutar] = parts;

        // Sadece "Kesilen Fatura" olanları al (büyük-küçük harf duyarsız)
        if (tur.toLowerCase() !== "kesilen fatura") return null;

        try {
          // Tarih biçimini gün.ay.yıl'dan yyyy-mm-dd formatına çevir
          let formattedDate = tarih;
          if (formattedDate.includes(".")) {
            const [gun, ay, yil] = formattedDate.split(".");
            formattedDate = `${yil}-${ay.padStart(2, "0")}-${gun.padStart(
              2,
              "0"
            )}`;
          }

          const validDate = new Date(formattedDate);
          if (isNaN(validDate.getTime())) throw new Error("Geçersiz tarih");

          const formattedTutar = parseFloat(
            tutar.replace(/\./g, "").replace(",", ".")
          );
          if (isNaN(formattedTutar)) throw new Error("Geçersiz tutar");

          return {
            date: validDate.toISOString().split("T")[0],
            invoiceNo: aciklama || "Geçmiş Fatura",
            note: "Geçmiş faturalar yüklendi.",
            products: [
              {
                sku: "EFSK",
                name: "Geçmiş Fatura",
                brand: "-",
                model: "-",
                category: "Geçmiş",
                subCategory: "Eski Kayıt",
                quantity: 1,
                price: formattedTutar,
                tax: 0,
                discount: 0,
                total: formattedTutar,
              },
            ],
            totalAmount: formattedTutar,
            totalTax: 0,
          };
        } catch (err) {
          console.warn("Satır atlandı:", line, err.message);
          return null;
        }
      })
      .filter((item) => item !== null); // Geçersiz satırları filtrele

    fileSelected.value = true;
    console.log("Yüklenmeye hazır fatura sayısı:", invoiceData.value.length);
  };
  reader.readAsText(file, "windows-1254");
}

async function uploadInvoices() {
  if (!selectedCustomerId.value) {
    alert("Lütfen önce müşteri seçin!");
    return;
  }

  loading.value = true;
  try {
    // Müşteri bilgisini ID üzerinden al
    const selectedCustomer = customers.value.find(
      (cust) => cust.id === selectedCustomerId.value
    );

    if (!selectedCustomer) {
      throw new Error("Seçilen müşteri bulunamadı.");
    }

    console.log("Yükleme başlıyor:", selectedCustomer);

    await savePastSalesInvoices(selectedCustomer, invoiceData.value);
    message.value = "Faturalar başarıyla yüklendi!";
  } catch (error) {
    message.value = "Yükleme sırasında hata oluştu.";
    console.error(error);
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
