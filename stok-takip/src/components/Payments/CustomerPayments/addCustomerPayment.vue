<template>
  <div class="p-6 space-y-6">
    <h2 class="text-2xl font-bold">Yeni Ödeme Ekle</h2>

    <!-- Müşteri Seçimi -->
    <div>
      <label class="block text-sm font-medium mb-1">Müşteri Seç</label>
      <select
        v-model="selectedCustomer"
        class="w-full border rounded px-4 py-2"
      >
        <option disabled value="">Müşteri seçiniz</option>
        <option v-for="m in customers" :key="m.id" :value="m">
          {{ m.companyName }}
        </option>
      </select>
    </div>

    <!-- Tutar -->
    <div>
      <label class="block text-sm font-medium mb-1">Tutar (₺)</label>
      <input
        type="number"
        v-model="amount"
        class="w-full border rounded px-4 py-2"
        placeholder="Ödeme tutarı"
      />
    </div>

    <!-- Ödeme Türü -->
    <div>
      <label class="block text-sm font-medium mb-1">Ödeme Türü</label>
      <select v-model="paymentType" class="w-full border rounded px-4 py-2">
        <option value="Nakit">Nakit</option>
        <option value="Havale">Havale</option>
        <option value="Çek">Çek</option>
      </select>
    </div>

    <!-- Açıklama -->
    <div>
      <label class="block text-sm font-medium mb-1">Açıklama</label>
      <textarea
        v-model="description"
        rows="3"
        class="w-full border rounded px-4 py-2"
        placeholder="Açıklama girin..."
      ></textarea>
    </div>

    <!-- Kaydet Butonu -->
    <button
      @click="submitPayment"
      class="bg-[#FE9F43] hover:bg-orange-500 text-white px-4 py-2 rounded transition"
    >
      Ödeme Kaydet
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";

// 👉 Tüm veri işlemleri JS dosyasından
import { getCustomerList, addCustomerPayment } from "@/stores/customerPayments";

const router = useRouter();
const $toast = useToast();

const customers = ref([]);
const selectedCustomer = ref("");
const amount = ref("");
const paymentType = ref("Nakit");
const description = ref("");

// Müşteri listesini çek
onMounted(async () => {
  customers.value = await getCustomerList(); // ✅ Store fonksiyonu
});

// Ödeme kaydı ekle
const submitPayment = async () => {
  if (!selectedCustomer.value || !amount.value) {
    $toast.error("Lütfen müşteri ve tutar alanlarını doldurun.");
    return;
  }

  try {
    await addCustomerPayment({
      customerId: selectedCustomer.value.id,
      companyName: selectedCustomer.value.companyName,
      amount: Number(amount.value),
      type: paymentType.value,
      description: description.value,
    });

    $toast.success("Ödeme kaydedildi!");
    router.push("/customer-payments");
  } catch (error) {
    console.error("Ödeme ekleme hatası:", error);
    $toast.error("Bir hata oluştu.");
  }
};
</script>
