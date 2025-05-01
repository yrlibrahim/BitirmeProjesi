<template>
  <div class="p-6 m-6 bg-white rounded-lg border border-gray-200 shadow-md">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-2xl font-bold mb-4">Müşteri Detayları</h2>
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

    <div class="overflow-x-auto w-full">
      <table
        class="min-w-[700px] w-full text-sm text-left text-gray-700 border border-gray-300"
      >
        <tbody>
          <tr
            v-for="(value, label) in customerFields"
            :key="label"
            class="border-b"
          >
            <th class="px-4 py-2 w-1/3 font-medium bg-gray-50">
              {{ label }}
            </th>
            <td
              class="px-4 py-2 whitespace-normal break-words md:max-w-[400px]"
            >
              {{ value }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { doc, getDoc } from "firebase/firestore";
import { DB } from "@/utils/firebase";
import { useToast } from "vue-toast-notification";
import { ArrowUturnLeftIcon } from "@heroicons/vue/24/outline";

const $toast = useToast();
const router = useRouter();
const route = useRoute();
const customerId = route.params.id;

const customerData = ref({});
const customerFields = ref({});

onMounted(async () => {
  try {
    const docRef = doc(DB, "Customers", customerId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      customerData.value = data;

      customerFields.value = {
        "Firma Adı": data.companyName || "-",
        "Mail Adresi": data.email || "-",
        "Vergi Numarası": data.taxNumber || "-",
        "Vergi Dairesi": data.taxOffice || "-",
        "Fatura Başlığı": data.invoiceTitle || "-",
        "Fatura Adresi": data.invoiceAddress || "-",
        "Telefon Numarası": data.phone || "-",
        Açıklama: data.description || "-",
      };
    } else {
      $toast.error("Müşteri bulunamadı.");
      router.back();
    }
  } catch (err) {
    console.error("Müşteri verisi alınamadı:", err);
    $toast.error("Veri alınırken bir hata oluştu.");
    router.back();
  }
});
</script>
