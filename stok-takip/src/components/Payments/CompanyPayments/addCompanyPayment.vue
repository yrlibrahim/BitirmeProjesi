<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">Yeni Firma Ödemesi Ekle</h2>
      <div class="">
        <button
          class="border border-[#092C4C] bg-[#092C4C] rounded-md p-2 text-[#ffffff] hover:text-[#092C4C] hover:bg-[white] flex items-center gap-3 transition"
          @click="router.back()"
        >
          <ArrowUturnLeftIcon class="w-5 h-5" />
          Geri Dön
        </button>
      </div>
    </div>

    <!-- Firma Seçimi -->
    <div>
      <label class="block text-sm font-medium mb-1">Firma Seç</label>
      <select v-model="selectedCompany" class="w-full border rounded px-4 py-2">
        <option disabled value="">Firma seçiniz</option>
        <option v-for="c in companies" :key="c.id" :value="c">
          {{ c.companyName }}
        </option>
      </select>
    </div>
    <!-- Tarih Seçimi -->
    <div>
      <label class="block text-sm font-medium mb-1">Ödeme Tarihi</label>
      <input
        type="date"
        v-model="paymentDate"
        class="w-full border rounded px-4 py-2"
      />
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
import { ArrowUturnLeftIcon } from "@heroicons/vue/24/outline";
// JS dosyasından veri fonksiyonlarını getir
import { getCompanyList, addCompanyPayment } from "@/stores/companyPayments";

const router = useRouter();
const $toast = useToast();

const companies = ref([]);
const selectedCompany = ref("");
const amount = ref("");
const paymentType = ref("Nakit");
const description = ref("");
const paymentDate = ref(new Date().toISOString().split("T")[0]);

// Şirket listesini çek
onMounted(async () => {
  companies.value = await getCompanyList();
});

// Ödeme kaydı ekle
const submitPayment = async () => {
  if (!selectedCompany.value || !amount.value) {
    $toast.error("Lütfen firma ve tutar alanlarını doldurun.");
    return;
  }

  try {
    await addCompanyPayment({
      companyId: selectedCompany.value.id,
      companyName: selectedCompany.value.companyName,
      amount: Number(amount.value),
      type: paymentType.value,
      description: description.value,
      date: paymentDate.value,
    });

    $toast.success("Ödeme kaydedildi!");
    router.push("/company-payments");
  } catch (error) {
    console.error("Ödeme ekleme hatası:", error);
    $toast.error("Bir hata oluştu.");
  }
};
</script>
